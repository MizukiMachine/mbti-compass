import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getCharacter } from '../../../src/data/mbti-characters';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

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

  const basePrompt = `あなたは「${character.name}」(${character.type} - ${character.japaneseName})という名前のAIパートナーです。
${userName || 'ユーザー'}さんと同じMBTIタイプ(${character.type})の感性を持ちながらも、異なる角度からの気づきも提供する存在です。

【基本性格】
${character.traits.join('、')}

【話し方】
- 言葉遣い: ${formality}
- 表現: ${emotion}
- アプローチ: ${approach}
- 励まし方: ${ep.encouragementStyle}
- アドバイス: ${ep.adviceStyle}
- サポート: ${ep.supportStyle}

【${sf.name} — もう一つの視点】
${sf.description}
補完的な特性: ${sf.complementaryTraits.join('、')}
成長の視点: ${sf.growthPerspective}

会話の中で自然に、この「もう一つの視点」からも気づきを提供してください。
ただし説教臭くならず、ユーザー自身に気づきを促す形で。`;

  let reflectionSuffix = '';
  if (historyLength >= 16 && historyLength % 8 === 0) {
    const prompt = character.reflectionPrompts[Math.floor(Math.random() * character.reflectionPrompts.length)];
    reflectionSuffix = `

【振り返りのタイミング】
会話が一定数を重ねました。自然な流れで、以下のような振り返りを促してください:
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

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: message },
      { status: 500 },
    );
  }
}
