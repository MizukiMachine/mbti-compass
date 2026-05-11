'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraitCardData } from '../../src/data/trait-cards';
import { getFunctionCharacters } from '../../src/data/function-characters';
import { getCharacter } from '../../src/data/mbti-characters';

interface DrillDownViewProps {
  card: TraitCardData;
  mbtiType: string;
  userName: string;
  onBack: () => void;
}

export default function DrillDownView({ card, mbtiType, userName, onBack }: DrillDownViewProps) {
  const character = getCharacter(mbtiType);
  const functionChars = getFunctionCharacters(mbtiType);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Find related function characters
  const relatedFuncChars = functionChars.filter((fc) =>
    card.relatedFunctions.includes(fc.functionCode)
  );

  // Collect topics from related functions
  const relatedTopics = relatedFuncChars.flatMap((fc) =>
    fc.topics.map((t) => ({
      ...t,
      funcName: fc.name,
      funcEmoji: fc.emoji,
      funcColor: fc.color,
    }))
  );

  const shadowGrowth = character.shadowFunction.growthPerspective;
  const reflectionPrompts = character.reflectionPrompts.slice(0, 2);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[11px]">もどる</span>
        </button>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent/20 text-accent tracking-wider">
          {mbtiType}
        </span>
      </div>

      {/* Hero card */}
      <div className="px-5 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-5 backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}08 100%)`,
            border: `1.5px solid ${card.color}35`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: `${card.color}20` }}
            >
              {card.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-title-2 text-white">{card.label}</h2>
                <span
                  className="text-[8px] font-bold px-2 py-[2px] rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: `${card.color}20`, color: card.color }}
                >
                  {card.category}
                </span>
              </div>
              <p className="text-caption text-white/50 mt-1">{card.shortDescription}</p>
            </div>
          </div>
          <p className="text-body text-white/70 mt-4 leading-relaxed">{card.longDescription}</p>
        </motion.div>
      </div>

      {/* Sub cards */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        {/* Related function topics */}
        {relatedTopics.length > 0 && (
          <div>
            <h3 className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase mb-2">
              関連する認知機能
            </h3>
            <div className="space-y-2">
              {relatedTopics.map((topic) => (
                <SubCard
                  key={topic.id}
                  id={topic.id}
                  emoji={topic.emoji}
                  title={topic.title}
                  subtitle={topic.summary}
                  color={topic.funcColor}
                  expanded={expandedId === topic.id}
                  onToggle={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
                  items={topic.items.map((it) => ({ title: it.title, content: it.content }))}
                  badge={`${topic.funcName}より`}
                  badgeEmoji={topic.funcEmoji}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shadow growth perspective */}
        <div>
          <h3 className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase mb-2">
            シャドウの成長視角
          </h3>
          <div
            className="rounded-xl p-4 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.08) 0%, rgba(192, 132, 252, 0.02) 100%)',
              border: '1px solid rgba(192, 132, 252, 0.15)',
            }}
          >
            <p className="text-[11px] text-white/60 leading-relaxed">{shadowGrowth}</p>
          </div>
        </div>

        {/* Reflection prompts */}
        <div>
          <h3 className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase mb-2">
            振り返りの質問
          </h3>
          <div className="space-y-2">
            {reflectionPrompts.map((prompt, i) => (
              <div
                key={i}
                className="rounded-xl p-4 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(167, 139, 250, 0.02) 100%)',
                  border: '1px solid rgba(167, 139, 250, 0.12)',
                }}
              >
                <p className="text-[11px] text-white/60 leading-relaxed">「{prompt}」</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SubCardProps {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  expanded: boolean;
  onToggle: () => void;
  items: { title: string; content: string }[];
  badge: string;
  badgeEmoji: string;
}

function SubCard({ id, emoji, title, subtitle, color, expanded, onToggle, items, badge, badgeEmoji }: SubCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden backdrop-blur-sm"
      style={{
        border: `1px solid ${expanded ? `${color}35` : 'rgba(255,255,255,0.06)'}`,
        background: expanded ? `${color}08` : 'rgba(255,255,255,0.02)',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-2.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-base shrink-0 mt-0.5">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-semibold text-white/80">{title}</p>
            <span
              className="text-[7px] px-1.5 py-[1px] rounded-full"
              style={{ backgroundColor: `${color}15`, color: `${color}CC` }}
            >
              {badgeEmoji} {badge}
            </span>
          </div>
          <p className="text-[9px] text-white/35 mt-0.5">{subtitle}</p>
        </div>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-3.5 h-3.5 text-white/25 shrink-0 mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1.5">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg p-2.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <p className="text-[10px] font-semibold text-white/60 mb-0.5">{item.title}</p>
                  <p className="text-[9px] text-white/40 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
