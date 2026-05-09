/**
 * Conversation Engine
 * Client-side engine that communicates with server-side AI via /api/chat
 */

import { Message, MessageChunk, EmotionalState, StreamConfig } from '../types/websocket';

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
    _userMessage: Message,
    context: ConversationContext,
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      const messageId = this.generateMessageId();
      const response = await this.callAIService(context);

      if (this.streamConfig.enableEmotionUpdates) {
        const emotion = this.analyzeEmotion(response);
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

  private async callAIService(context: ConversationContext): Promise<string> {
    // history already includes the latest user message — no need to push again
    const messages = context.history
      .slice(-10)
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        characterId: context.characterId || 'ENFP',
        historyLength: context.history.length,
        userName: context.userProfile?.name,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Chat API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.content;
  }

  private analyzeEmotion(response: string): EmotionalState {
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
