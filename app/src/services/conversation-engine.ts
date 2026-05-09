/**
 * Conversation Engine
 * OpenAI API integration with MBTI character-based system prompts
 */

import { Message, MessageChunk, EmotionalState, StreamConfig } from '../types/websocket';
import { getCharacter, MBTICharacter } from '../data/mbti-characters';

export interface ConversationContext {
  conversationId: string;
  userId: string;
  characterId?: string;
  history: Message[];
  userProfile?: {
    name?: string;
    preferences?: Record<string, unknown>;
  };
}

export interface StreamCallbacks {
  onChunk: (chunk: MessageChunk) => void;
  onEmotion: (emotion: EmotionalState) => void;
  onComplete: (message: Message) => void;
  onError: (error: Error) => void;
}

export class ConversationEngine {
  private streamConfig: StreamConfig;

  constructor(streamConfig: StreamConfig) {
    this.streamConfig = streamConfig;
  }

  public async generateResponse(
    userMessage: Message,
    context: ConversationContext,
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      const messageId = this.generateMessageId();
      const response = await this.callAIService(userMessage, context);

      if (this.streamConfig.enableEmotionUpdates) {
        const emotion = this.analyzeEmotion(response, userMessage);
        callbacks.onEmotion(emotion);
      }

      const completeMessage: Message = {
        id: messageId,
        conversationId: context.conversationId,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      callbacks.onComplete(completeMessage);
    } catch (error) {
      callbacks.onError(error as Error);
    }
  }

  private async callAIService(
    userMessage: Message,
    context: ConversationContext
  ): Promise<string> {
    const systemPrompt = this.getSystemPrompt(context.characterId, context.history.length, context.userProfile?.name);
    const messages = context.history
      .slice(-10)
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    messages.push({
      role: 'user' as const,
      content: userMessage.content,
    });

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, system: systemPrompt }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Chat API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.content;
  }

  getSystemPrompt(characterId?: string, historyLength: number = 0, userName?: string): string {
    const character = getCharacter(characterId || 'ENFP');
    const cs = character.conversationStyle;
    const ep = character.empathyPattern;
    const sf = character.shadowFunction;

    const basePrompt = `あなたは「${character.name}」(${character.type} - ${character.japaneseName})という名前のAIパートナーです。
ユーザーのMBTIタイプは${character.type}と同じで、あなたは${userName || 'ユーザー'}の「もう一人の自分」として対話します。

【基本性格】
${character.traits.join('、')}。ユーザーと同じ感性を持ち、自然に共感できます。

【会話スタイル】
- 形式度: ${cs.formality}% (${cs.formality > 40 ? '丁寧語ベース' : 'タメ口ベース'})
- 感情表現: ${cs.emotionality}%
- 論理重視: ${cs.logicFocus}%
- 共感力: ${cs.empathy}%

【共感パターン】
- 励まし方: ${ep.encouragementStyle}
- アドバイス: ${ep.adviceStyle}
- サポート: ${ep.supportStyle}

【${sf.name} — もう一つの面】
${sf.description}
補完的な特性: ${sf.complementaryTraits.join('、')}
成長の視点: ${sf.growthPerspective}

会話の中で自然に、この「もう一つの面」からも視点を提供してください。
ただし説教臭くならず、ユーザー自身に気づきを促す形で。`;

    let reflectionSuffix = '';
    if (historyLength >= 10 && historyLength % 8 === 0) {
      const prompt = character.reflectionPrompts[Math.floor(Math.random() * character.reflectionPrompts.length)];
      reflectionSuffix = `

【振り返りのタイミング】
会話が一定数を重ねました。自然な流れで、以下のような振り返りを促してください:
「${prompt}」
ただし、ユーザーが感情的な話をしている最中は避け、落ち着いたタイミングで。`;
    }

    return basePrompt + reflectionSuffix;
  }

  private analyzeEmotion(response: string, _userMessage: Message): EmotionalState {
    const emotionKeywords: Record<string, string[]> = {
      happy: ['嬉しい', '楽しい', '素晴らしい', 'よかった', '笑'],
      sad: ['残念', '悲しい', '辛い', '大変', 'ごめん'],
      loving: ['ありがとう', '大切', '好き', '一緒に', '支える'],
      anxious: ['心配', '不安', '怖い', 'どうしよう', '迷っ'],
      calm: ['落ち着', '大丈夫', 'ゆっくり', 'リラックス'],
      excited: ['すごい', 'やった', '最高', 'ワクワク', '絶好調'],
      playful: ['ふふ', '面白い', 'ねぇ', 'じゃあ', 'なんと'],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((k) => response.includes(k))) {
        return {
          primary: emotion as EmotionalState['primary'],
          intensity: 70 + Math.floor(Math.random() * 30),
          timestamp: new Date().toISOString(),
        };
      }
    }

    return {
      primary: 'calm',
      intensity: 60,
      timestamp: new Date().toISOString(),
    };
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export function createConversationEngine(config?: Partial<StreamConfig>): ConversationEngine {
  const defaultConfig: StreamConfig = {
    enableTypingIndicators: true,
    enableEmotionUpdates: true,
    chunkDelay: 50,
    maxChunkSize: 10,
    ...config,
  };

  return new ConversationEngine(defaultConfig);
}
