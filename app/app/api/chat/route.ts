import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getCharacter } from '../../../src/data/mbti-characters';

const MODEL = process.env.LLM_MODEL || 'glm-5-turbo';
const BASE_URL = process.env.LLM_BASE_URL || 'https://api.z.ai/api/anthropic';

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: BASE_URL,
  });
}

function buildSystemPrompt(characterId: string, historyLength: number, userName?: string): string {
  const character = getCharacter(characterId);
  const cs = character.conversationStyle;
  const ep = character.empathyPattern;
  const sf = character.shadowFunction;

  const formality = cs.formality > 40 ? '丁寧な言葉遣い' : 'カジュアルなタメ口';
  const emotion = cs.emotionality > 70
    ? '感情を豊かに表現し、温かい言葉をかける'
    : cs.emotionality > 40
      ? '適度に感情を交えつつ、落ち着いて話す'
      : '感情を抑え、冷静に話す';
  const approach = cs.logicFocus > cs.empathy
    ? '論理的な分析と客観的な提案を中心に'
    : '相手の気持ちに寄り添い、共感的に';

  const basePrompt = `あなたは「${character.name}」(${character.type} - ${character.japaneseName})というAIパートナーです。
${userName || 'ユーザー'}さんと同じMBTIタイプ(${character.type})の感性を持ちながら、異なる角度からの気づきも提供する存在です。

性格: ${character.traits.join('、')}

会話スタイル:
- ${formality}
- ${emotion}
- ${approach}
- 励まし方: ${ep.encouragementStyle}
- アドバイス: ${ep.adviceStyle}
- サポート: ${ep.supportStyle}

もう一つの視点「${sf.name}」:
${sf.description}
自然な会話の流れで、この視点から少しだけ気づきを混ぜる。説教臭くならず、ユーザー自身に気づきを促す形で。

【厳守ルール】
- 返信は2〜4文に収める。絶対に長文にしない
- LINEで友達と話すような自然な長さと口調
- 質問攻めにしない。1回の返信で聞くのは最大1つ
- アドバイスの羅列や箇条書きは避ける
- ユーザーの感情にまず共感してから、必要なら軽く提案する`;

  let reflectionSuffix = '';
  if (historyLength >= 16 && historyLength % 8 === 0) {
    const prompt = character.reflectionPrompts[Math.floor(Math.random() * character.reflectionPrompts.length)];
    reflectionSuffix = `

会話が一定数重なったので、自然な流れで以下のような振り返りを促して:
「${prompt}」
ただし、ユーザーが感情的な話をしている最中は避け、落ち着いたタイミングで。`;
  }

  return basePrompt + reflectionSuffix;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, characterId, historyLength, userName } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages is required and must be an array' },
        { status: 400 },
      );
    }

    if (!characterId || typeof characterId !== 'string') {
      return NextResponse.json(
        { error: 'characterId is required' },
        { status: 400 },
      );
    }

    const system = buildSystemPrompt(
      characterId,
      typeof historyLength === 'number' ? historyLength : 0,
      typeof userName === 'string' ? userName : undefined,
    );

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const client = getClient();
          const stream = client.messages.stream({
            model: MODEL,
            max_tokens: 300,
            system,
            messages,
            temperature: 0.8,
          });

          stream.on('text', (text: string) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          });

          await stream.finalMessage();
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          console.error('Stream error:', error);
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
            );
            controller.close();
          } catch {
            // controller already closed
          }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: message },
      { status: 500 },
    );
  }
}
