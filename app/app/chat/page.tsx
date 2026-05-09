'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { createConversationEngine, ConversationContext, StreamCallbacks } from '../../src/services/conversation-engine';
import { Message } from '../../src/types/websocket';
import { getCharacter } from '../../src/data/mbti-characters';
import VoiceInputButton from '../../src/components/VoiceInputButton';
import { Suspense } from 'react';

const easeOut = [0.16, 1, 0.3, 1];

function ChatContent() {
  const searchParams = useSearchParams();
  const mbti = searchParams.get('mbti') || 'ENFP';
  const userName = searchParams.get('name') || 'あなた';

  const character = getCharacter(mbti);

  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const engine = useRef(createConversationEngine());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      conversationId: 'chat',
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Update ref synchronously to avoid stale closure in async callbacks
    messagesRef.current = [...messagesRef.current, userMessage];
    setMessages([...messagesRef.current]);
    setInputText('');
    setIsTyping(true);

    const context: ConversationContext = {
      conversationId: 'chat',
      userId: userName,
      characterId: mbti,
      history: messagesRef.current,
    };

    const callbacks: StreamCallbacks = {
      onChunk: () => {},
      onEmotion: () => {},
      onComplete: (message: Message) => {
        messagesRef.current = [...messagesRef.current, message];
        setMessages([...messagesRef.current]);
        setIsTyping(false);
      },
      onError: () => {
        const errorMsg: Message = {
          id: `msg_${Date.now()}_error`,
          conversationId: 'chat',
          role: 'assistant',
          content: 'ごめんなさい、ちょっと考えがまとまらないです…もう一度話しかけてもらえますか？',
          timestamp: new Date().toISOString(),
        };
        messagesRef.current = [...messagesRef.current, errorMsg];
        setMessages([...messagesRef.current]);
        setIsTyping(false);
      },
    };

    engine.current.generateResponse(userMessage, context, callbacks);
  }, [mbti, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleVoiceTranscript = useCallback((text: string) => {
    setInputText(text);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <a href="/" className="text-white/40 hover:text-white/60 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg">
            {character.emoji}
          </div>
          <div>
            <h1 className="text-title-2 text-white">{character.name} - {character.japaneseName}</h1>
            <p className="text-caption text-white/40">{mbti}</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-4xl mb-4">{character.emoji}</div>
              <h2 className="text-title-1 text-white mb-2">{character.name}です</h2>
              <p className="text-body text-white/60">
                こんにちは、{userName}さん。同じ感性を持つ{character.japaneseName}の私が、ちょっと違う角度からの気づきも交えながらお話ししますね。何でも話してください。
              </p>
              <p className="text-caption text-white/30 mt-4">
                マイクボタンで声でも入力できます
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-accent text-black rounded-br-md'
                      : 'bg-surface border border-white/5 text-white/90 rounded-bl-md'
                  }`}
                >
                  <p className="text-body leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-surface border border-white/5 rounded-2xl rounded-bl-md px-5 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-white/40"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-white/40"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-white/40"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="sticky bottom-0 z-10 bg-surface/80 backdrop-blur-xl border-t border-white/5 px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
            aria-label="メッセージ入力"
          />
          <VoiceInputButton onTranscript={handleVoiceTranscript} />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputText.trim()}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent text-black disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            aria-label="送信"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        </form>
      </footer>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/40 text-body">読み込み中...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
