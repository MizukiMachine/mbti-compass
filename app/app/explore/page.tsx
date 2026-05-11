'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  getFunctionCharacters,
  FunctionCharacter,
  Topic,
} from '../../src/data/function-characters';
import { getCharacter } from '../../src/data/mbti-characters';

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center"><p className="text-gray-400">読み込み中...</p></div>}>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const mbtiType = searchParams.get('mbti') || 'INTJ';
  const userName = searchParams.get('name') || '';

  const [characters, setCharacters] = useState<FunctionCharacter[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  useEffect(() => {
    setCharacters(getFunctionCharacters(mbtiType));
  }, [mbtiType]);

  const selected = characters[selectedIndex];

  const selectCharacter = (index: number) => {
    setSelectedIndex(index);
    setExpandedTopicId(null);
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % characters.length);
    setExpandedTopicId(null);
  };

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + characters.length) % characters.length);
    setExpandedTopicId(null);
  };

  if (!selected) return null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (userName) params.set('name', userName);
              if (mbtiType) params.set('mbti', mbtiType);
              window.location.href = `/${params.toString() ? '?' + params.toString() : ''}`;
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">MBTI Shadow Friend</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
            {mbtiType}
          </span>
          <span className="text-sm text-gray-500">{getCharacter(mbtiType).japaneseName}</span>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Character List */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xs font-bold text-teal-600 tracking-wider uppercase">
              機能キャラクター
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">SELECT CHARACTER</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {characters.map((char, index) => (
              <button
                key={char.id}
                onClick={() => selectCharacter(index)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all text-left ${
                  index === selectedIndex
                    ? 'bg-teal-50 ring-2 ring-teal-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                    index === selectedIndex
                      ? 'ring-2 ring-teal-400 ring-offset-2'
                      : ''
                  }`}
                  style={{ backgroundColor: char.colorLight }}
                >
                  {char.emoji}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      index === selectedIndex ? 'text-teal-700' : 'text-gray-800'
                    }`}
                  >
                    {char.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {char.functionCode} ・ {char.roleLabel}
                  </p>
                </div>
                {index === selectedIndex && (
                  <div className="ml-auto shrink-0">
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded">
                      選択中
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              FUNCTION ROSTER
              <span className="ml-2 font-mono">{characters.length}体</span>
            </p>
          </div>
        </div>

        {/* Center Panel - Character Display */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-teal-600 hover:shadow-lg transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-teal-600 hover:shadow-lg transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Character Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Speech Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 max-w-xs"
              >
                <div className="bg-white rounded-2xl rounded-bl-sm shadow-lg px-5 py-3 relative">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selected.speechBubble}
                  </p>
                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45 shadow-sm" />
                </div>
              </motion.div>

              {/* Glowing Platform + Character */}
              <div className="relative">
                {/* Concentric glow rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-56 h-56 rounded-full opacity-20"
                    style={{
                      background: `radial-gradient(circle, ${selected.color}40 0%, transparent 70%)`,
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-44 h-44 rounded-full opacity-30"
                    style={{
                      background: `radial-gradient(circle, ${selected.color}30 0%, transparent 70%)`,
                    }}
                  />
                </div>
                {/* Platform circle */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 rounded-[50%] bg-gradient-to-r from-gray-100 to-gray-200 opacity-80" />

                {/* Character emoji */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex items-center justify-center w-48 h-48"
                >
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${selected.colorLight} 0%, white 100%)`,
                      boxShadow: `0 20px 60px ${selected.color}30`,
                    }}
                  >
                    <span className="text-6xl">{selected.emoji}</span>
                  </div>
                </motion.div>
              </div>

              {/* Character Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mt-4"
              >
                <h2
                  className="text-2xl font-bold"
                  style={{ color: selected.color }}
                >
                  {selected.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selected.functionCode} ・ {selected.functionName}
                </p>
                <p className="text-xs text-teal-600 font-medium mt-1">
                  {selected.roleLabel}
                </p>
                <p className="text-sm text-gray-400 italic mt-1">
                  {selected.tagline}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Action */}
          <div className="absolute bottom-6 flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              className="px-8 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: selected.color }}
            >
              話題を見る
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Panel - Topics & Details */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden">
          {/* Character Mini Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ backgroundColor: selected.colorLight }}
              >
                {selected.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{selected.name}の話題</p>
                <p className="text-xs text-gray-400">{selected.functionName}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              ステータス
            </h3>
            <div className="space-y-2">
              {[
                { label: '活用度', value: selected.role === 'dominant' ? 90 : selected.role === 'auxiliary' ? 70 : selected.role === 'inferior' ? 30 : 50 },
                { label: '成長度', value: selected.role === 'dominant' ? 75 : selected.role === 'inferior' ? 20 : 45 },
                { label: '影響力', value: selected.role === 'dominant' ? 85 : selected.role === 'auxiliary' ? 65 : 35 },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{stat.label}</span>
                    <span className="text-gray-400 font-mono">{stat.value}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: selected.color }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xs pt-1">
                <span className="text-gray-500">位置</span>
                <span
                  className="font-semibold text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: selected.colorLight,
                    color: selected.color,
                  }}
                >
                  {selected.roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              トピック
            </h3>
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                {selected.topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    isExpanded={expandedTopicId === topic.id}
                    onToggle={() =>
                      setExpandedTopicId(
                        expandedTopicId === topic.id ? null : topic.id
                      )
                    }
                    characterColor={selected.color}
                    characterColorLight={selected.colorLight}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  isExpanded,
  onToggle,
  characterColor,
  characterColorLight,
}: {
  topic: Topic;
  isExpanded: boolean;
  onToggle: () => void;
  characterColor: string;
  characterColorLight: string;
}) {
  return (
    <motion.div
      layout
      className="rounded-xl border border-gray-100 overflow-hidden"
      style={{
        borderColor: isExpanded ? characterColor + '40' : undefined,
        backgroundColor: isExpanded ? characterColorLight + '40' : undefined,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg shrink-0 mt-0.5">{topic.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800">{topic.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{topic.summary}</p>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400 shrink-0 mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-2">
              {topic.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-3 border border-gray-50"
                >
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
