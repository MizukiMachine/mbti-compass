'use client';

import { motion } from 'framer-motion';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useEffect } from 'react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceInputButton({ onTranscript }: VoiceInputButtonProps) {
  const { isListening, transcript, error, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, onTranscript, resetTranscript]);

  if (!isSupported) return null;

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
          isListening
            ? 'bg-accent/20 text-accent border border-accent/40'
            : 'bg-black/40 text-white/40 hover:text-white/60 border border-white/10'
        }`}
        aria-label={isListening ? '音声入力を停止' : '音声入力を開始'}
      >
        {/* Microphone SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </motion.button>

      {/* Pulse animation when listening */}
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-accent"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Error indicator */}
      {error && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-red-400 whitespace-nowrap">
          {error === 'not-allowed' ? 'マイク許可が必要' : '認識エラー'}
        </div>
      )}
    </div>
  );
}
