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
    <Suspense fallback={
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}

const easeOut = [0.16, 1, 0.3, 1] as const;

function ExploreContent() {
  const searchParams = useSearchParams();
  const mbtiType = searchParams.get('mbti') || 'INTJ';
  const userName = searchParams.get('name') || '';
  const character = getCharacter(mbtiType);

  const [characters, setCharacters] = useState<FunctionCharacter[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  useEffect(() => {
    setCharacters(getFunctionCharacters(mbtiType));
  }, [mbtiType]);

  const selected = characters[selectedIndex];

  const selectCharacter = (index: number) => {
    setSelectedIndex(index);
    setExpandedTopicId(null);
    setIsMobileMenuOpen(false);
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
    <div className="min-h-screen h-screen bg-[#F0F2F5] flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-12 bg-white border-b border-gray-200/60 flex items-center justify-between px-3 md:px-5 shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (userName) params.set('name', userName);
              if (mbtiType) params.set('mbti', mbtiType);
              window.location.href = `/${params.toString() ? '?' + params.toString() : ''}`;
            }}
            className="text-gray-300 hover:text-gray-500 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div>
            <span className="text-gray-700 font-bold text-[11px] tracking-[0.15em]">PIONEERS</span>
          </div>
        </div>

        {/* Center MBTI Badge */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-600">
            {mbtiType}
          </span>
          <span className="text-gray-400 text-[10px] hidden sm:inline">{character.japaneseName}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1 border border-gray-100">
            <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-[10px]">
              {character.emoji}
            </div>
            <span className="text-gray-600 text-[10px] hidden sm:inline">{userName}</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ===== LEFT PANEL ===== */}
        <div className={`
          absolute md:relative inset-y-0 left-0 z-40 w-64 md:w-56 lg:w-60
          bg-white border-r border-gray-200/60
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col shrink-0
        `}>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute top-2 right-2 text-gray-300 hover:text-gray-500 z-10 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-[9px] font-bold text-teal-600 tracking-[0.25em] uppercase">
              Pioneers
            </h2>
            <p className="text-[8px] text-gray-300 mt-0.5 tracking-wider">SELECT YOUR FUNCTION</p>
          </div>

          <div className="flex-1 overflow-y-auto py-1.5 px-1.5 space-y-0.5">
            {characters.map((char, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={char.id}
                  onClick={() => selectCharacter(index)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-200 text-left group ${
                    isSelected ? 'bg-white' : 'hover:bg-gray-50'
                  }`}
                  style={isSelected ? {
                    boxShadow: `inset 0 0 0 1.5px ${char.color}50`,
                    border: `1px solid ${char.color}30`,
                  } : { border: '1px solid transparent' }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-300 border-2 ${
                      isSelected ? '' : ''
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${char.color}12` : '#F5F5F5',
                      borderColor: isSelected ? char.color : 'transparent',
                      boxShadow: isSelected ? `0 0 12px ${char.color}20` : 'none',
                    }}
                  >
                    {char.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-[12px] font-semibold truncate ${
                        isSelected ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'
                      }`}>
                        {char.name}
                      </p>
                      {isSelected && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[7px] font-bold px-1.5 py-[1px] rounded-full shrink-0 text-white"
                          style={{ backgroundColor: char.color }}
                        >
                          ACTIVE
                        </motion.span>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-300 truncate mt-0.5">
                      {char.functionCode} / {char.roleLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-gray-300 tracking-[0.15em]">FUNCTION ROSTER</span>
              <span className="text-[9px] text-gray-400 font-mono">{characters.length}</span>
            </div>
          </div>
        </div>

        {/* ===== CENTER STAGE ===== */}
        <div className="flex-1 flex flex-col items-center relative min-w-0 bg-gradient-to-b from-[#F0F2F5] to-[#E8ECF0]">
          {/* Nav Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-1.5 md:left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200/60 shadow-sm flex items-center justify-center text-gray-300 hover:text-gray-500 hover:shadow-md transition-all z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200/60 shadow-sm flex items-center justify-center text-gray-300 hover:text-gray-500 hover:shadow-md transition-all z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Center Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: easeOut }}
                className="flex flex-col items-center w-full"
              >
                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: easeOut }}
                  className="mb-4 max-w-[280px] w-full"
                >
                  <div
                    className="relative rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm"
                    style={{
                      background: 'white',
                      border: `1.5px solid ${selected.color}30`,
                    }}
                  >
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {selected.speechBubble}
                    </p>
                    <div
                      className="absolute -bottom-[6px] left-7 w-3 h-3 bg-white transform rotate-45"
                      style={{ borderRight: `1.5px solid ${selected.color}30`, borderBottom: `1.5px solid ${selected.color}30` }}
                    />
                  </div>
                </motion.div>

                {/* Character Platform */}
                <div className="relative w-64 h-56 flex items-center justify-center my-1">
                  {/* Outer glow */}
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-52 h-52 rounded-full"
                      style={{ background: `radial-gradient(circle, ${selected.color}18 0%, transparent 65%)` }}
                    />
                  </motion.div>
                  {/* Inner glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-40 rounded-full"
                      style={{ background: `radial-gradient(circle, ${selected.color}10 0%, transparent 50%)` }}
                    />
                  </div>
                  {/* Spinning rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 rounded-full border-[1.5px] animate-[spin_25s_linear_infinite]"
                      style={{ borderColor: `${selected.color}15` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 rounded-full border animate-[spin_18s_linear_infinite_reverse]"
                      style={{ borderColor: `${selected.color}10` }}
                    />
                  </div>
                  {/* Dashed ring */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 rounded-full border border-dashed animate-[spin_40s_linear_infinite]"
                      style={{ borderColor: `${selected.color}08` }}
                    />
                  </div>
                  {/* Platform shadow */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="w-32 h-4 rounded-[50%]"
                      style={{ background: `radial-gradient(ellipse, ${selected.color}18 0%, transparent 70%)` }}
                    />
                  </div>

                  {/* Character */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-lg"
                      style={{
                        boxShadow: `0 12px 40px ${selected.color}20, 0 4px 12px rgba(0,0,0,0.06)`,
                      }}
                    >
                      <span className="text-[48px] leading-none">{selected.emoji}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Character Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-center mt-2"
                >
                  <h2 className="text-lg font-bold text-gray-800 tracking-tight">{selected.name}</h2>
                  <p className="text-[10px] text-gray-400 mt-0.5 tracking-wider">
                    {selected.functionCode} / {selected.functionName}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span
                      className="text-[9px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${selected.color}12`, color: selected.color }}
                    >
                      {selected.roleLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1.5 italic">{selected.tagline}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-center gap-2.5 pb-3 pt-1 shrink-0">
            <button className="w-8 h-8 rounded-full bg-white border border-gray-200/60 shadow-sm flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              className="px-5 py-2 rounded-full font-semibold text-[12px] text-white transition-all duration-200 hover:brightness-110 active:scale-95 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${selected.color} 0%, ${selected.color}CC 100%)`,
                boxShadow: `0 4px 14px ${selected.color}30`,
              }}
            >
              EXPLORE
            </button>
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200/60 shadow-sm flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className={`
          absolute lg:relative inset-y-0 right-0 z-40 w-72 lg:w-72
          bg-white border-l border-gray-200/60
          transform transition-transform duration-300 ease-out
          ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          flex flex-col shrink-0
        `}>
          <button
            onClick={() => setRightPanelOpen(false)}
            className="lg:hidden absolute top-2 left-2 text-gray-300 hover:text-gray-500 z-10 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Mini Header */}
          <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: `${selected.color}10` }}
            >
              {selected.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-semibold text-gray-700">{selected.name}</p>
                <span
                  className="text-[8px] font-bold px-1.5 py-[1px] rounded"
                  style={{ backgroundColor: `${selected.color}10`, color: selected.color }}
                >
                  {selected.functionCode}
                </span>
              </div>
              <p className="text-[8px] text-gray-300">{selected.functionName}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[8px] text-emerald-500 font-medium">READY</span>
            </div>
          </div>

          {/* Stats */}
          <div className="px-3 py-3 border-b border-gray-100">
            <h3 className="text-[8px] font-bold text-gray-400 tracking-[0.2em] mb-2.5">STATS</h3>
            <div className="space-y-2.5">
              <StatRow label="活用度" value={selected.role === 'dominant' ? 388 : selected.role === 'auxiliary' ? 275 : selected.role === 'tertiary' ? 180 : selected.role === 'inferior' ? 120 : 150} max={500} color={selected.color} />
              <StatRow label="成長度" value={selected.role === 'dominant' ? 720 : selected.role === 'auxiliary' ? 540 : selected.role === 'tertiary' ? 310 : selected.role === 'inferior' ? 200 : 260} max={800} color={selected.color} />
              <StatRow label="影響力" value={selected.role === 'dominant' ? 560 : selected.role === 'auxiliary' ? 430 : selected.role === 'tertiary' ? 280 : selected.role === 'inferior' ? 150 : 200} max={600} color={selected.color} />
              <StatRow label="親和性" value={selected.role === 'dominant' ? 870 : selected.role === 'auxiliary' ? 650 : selected.role === 'tertiary' ? 420 : selected.role === 'inferior' ? 300 : 350} max={1000} color={selected.color} />
            </div>
          </div>

          {/* Abilities */}
          <div className="px-3 py-3 border-b border-gray-100">
            <h3 className="text-[8px] font-bold text-gray-400 tracking-[0.2em] mb-2.5">ABILITIES</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {selected.topics.slice(0, 3).map((topic) => (
                <button
                  key={topic.id}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all group"
                >
                  <div className="relative">
                    <span className="text-base">{topic.emoji}</span>
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[7px] text-gray-400 text-center leading-tight group-hover:text-gray-600 transition-colors">{topic.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <h3 className="text-[8px] font-bold text-gray-400 tracking-[0.2em] mb-2.5">TOPICS</h3>
            <div className="space-y-1.5">
              <AnimatePresence mode="wait">
                {selected.topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    isExpanded={expandedTopicId === topic.id}
                    onToggle={() =>
                      setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)
                    }
                    characterColor={selected.color}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="px-3 py-2 border-t border-gray-100">
            <p className="text-[9px] text-gray-300 text-center italic">
              {selected.name}のアドバイスをタップして深掘り
            </p>
          </div>
        </div>

        {/* Mobile overlay */}
        {(isMobileMenuOpen || rightPanelOpen) && (
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-30"
            onClick={() => { setIsMobileMenuOpen(false); setRightPanelOpen(false); }}
          />
        )}
      </div>
    </div>
  );
}

function StatRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[9px] text-gray-400">{label}</span>
        <span className="text-[10px] font-mono font-semibold text-gray-600">{value}</span>
      </div>
      <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.15, ease: easeOut }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  isExpanded,
  onToggle,
  characterColor,
}: {
  topic: Topic;
  isExpanded: boolean;
  onToggle: () => void;
  characterColor: string;
}) {
  return (
    <motion.div
      layout
      className="rounded-lg overflow-hidden bg-white"
      style={{
        border: `1px solid ${isExpanded ? `${characterColor}30` : '#F0F0F0'}`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-2.5 py-2 flex items-start gap-2 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[13px] shrink-0 mt-0.5">{topic.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-gray-700">{topic.title}</p>
          <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed">{topic.summary}</p>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3 h-3 text-gray-300 shrink-0 mt-1"
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
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="px-2.5 pb-2 space-y-1">
              {topic.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-md p-2 bg-gray-50 border border-gray-100"
                >
                  <p className="text-[9px] font-semibold text-gray-600 mb-0.5">{item.title}</p>
                  <p className="text-[9px] text-gray-500 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
