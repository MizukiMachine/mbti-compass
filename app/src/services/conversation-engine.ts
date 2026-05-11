/**
 * Conversation Engine
 * Client-side engine that communicates with server-side AI via /api/chat (SSE streaming)
 */

export interface EmotionalState {
  primary: 'happy' | 'sad' | 'excited' | 'anxious' | 'calm' | 'loving' | 'playful';
  intensity: number;
  timestamp: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MessageChunk {
  type: 'text' | 'emotion' | 'action' | 'thinking';
  content: string;
  timestamp: string;
}

export interface StreamConfig {
  enableTypingIndicators: boolean;
  enableEmotionUpdates: boolean;
  chunkDelay?: number;
  maxChunkSize?: number;
}

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
      const fullText = await this.callAIService(context, callbacks);

      if (this.streamConfig.enableEmotionUpdates) {
        const emotion = this.analyzeEmotion(fullText);
        callbacks.onEmotion(emotion);
      }

      const completeMessage: Message = {
        id: messageId,
        conversationId: context.conversationId,
        role: 'assistant',
        content: fullText,
        timestamp: new Date().toISOString(),
      };

      callbacks.onComplete(completeMessage);
    } catch (error) {
      callbacks.onError(error as Error);
    }
  }

  private async callAIService(
    context: ConversationContext,
    callbacks: StreamCallbacks
  ): Promise<string> {
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
        userName: context.userProfile?.name || context.userId,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Chat API error: ${res.status} - ${err}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            fullText += parsed.text;
            callbacks.onChunk({
              type: 'text',
              content: parsed.text,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (e) {
          if (e instanceof Error && !e.message.includes('Unexpected')) {
            throw e;
          }
        }
      }
    }

    return fullText;
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
