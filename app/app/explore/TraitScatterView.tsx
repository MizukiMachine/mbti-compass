'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import FloatingCard from './FloatingCard';
import { DynamicCard } from '../../src/types/explore';
import { getCharacter } from '../../src/data/mbti-characters';

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface TraitScatterViewProps {
  mbtiType: string;
  userName: string;
  cards: DynamicCard[];
  onSelect: (card: DynamicCard) => void;
  isMobile: boolean;
  phase: number;
  isLoadingNext: boolean;
  onExploreDeeper: () => void;
  selectionCount: number;
  error: string | null;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="absolute rounded-xl backdrop-blur-sm"
      style={{
        width: 110,
        height: 75,
        left: `${15 + (index % 4) * 20}%`,
        top: `${20 + Math.floor(index / 4) * 22}%`,
        background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.06) 0%, rgba(192, 132, 252, 0.02) 100%)',
        border: '1px solid rgba(192, 132, 252, 0.1)',
        animation: `shimmer 1.5s ease-in-out ${index * 0.15}s infinite alternate, float ${3 + index * 0.3}s ease-in-out infinite`,
      }}
    />
  );
}

export default function TraitScatterView({
  mbtiType, userName, cards, onSelect, isMobile,
  phase, isLoadingNext, onExploreDeeper, selectionCount, error,
}: TraitScatterViewProps) {
  const character = getCharacter(mbtiType);

  const positions = useMemo(() => {
    const rand = seededRandom(hashStr(mbtiType + phase));

    if (isMobile) {
      return cards.map((card, i) => ({
        card,
        index: i,
        style: {} as React.CSSProperties,
      }));
    }

    const cols = 4;
    const rows = 3;
    const cellW = 100 / cols;
    const cellH = 100 / rows;

    return cards.map((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const offsetX = rand() * 4 - 2;
      const offsetY = rand() * 4 - 2;
      const left = col * cellW + rand() * (cellW * 0.3) + offsetX;
      const top = row * cellH + rand() * (cellH * 0.2) + offsetY + 2;

      return {
        card,
        index: i,
        style: {
          left: `${left}%`,
          top: `${top}%`,
        } as React.CSSProperties,
      };
    });
  }, [mbtiType, cards, isMobile, phase]);

  const particles = useMemo(() => {
    const rand = seededRandom(hashStr(mbtiType + 'particles'));
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${rand() * 90 + 5}%`,
      top: `${rand() * 85 + 5}%`,
      size: rand() * 3 + 1,
      delay: rand() * 5,
      duration: rand() * 3 + 3,
    }));
  }, [mbtiType]);

  const showExploreButton = phase === 1 && selectionCount >= 2;

  const errorToast = error && (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-sm"
      style={{
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      }}
    >
      <p className="text-[11px] text-red-300">{error}</p>
      <button
        onClick={onExploreDeeper}
        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
      >
        再試行
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-y-auto">
        <div className="pt-8 pb-4 px-5 text-center">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-accent/20 text-accent tracking-wider">
            {mbtiType}
          </span>
          <h1 className="text-title-1 text-white mt-2">
            {character.emoji} {character.japaneseName}
          </h1>
          {userName && <p className="text-caption text-white/40 mt-1">{userName}の特性マップ</p>}
        </div>

        <div className="px-4 pb-8 grid grid-cols-2 gap-3">
          {isLoadingNext
            ? Array.from({ length: 6 }, (_, i) => (
                <div key={`skel-${i}`} className="rounded-xl p-3" style={{
                  background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.06) 0%, rgba(192, 132, 252, 0.02) 100%)',
                  border: '1px solid rgba(192, 132, 252, 0.1)',
                  minHeight: 100,
                  animation: 'shimmer 1.5s ease-in-out infinite alternate',
                }} />
              ))
            : cards.map((card, i) => (
                <button
                  key={card.id}
                  onClick={() => onSelect(card)}
                  className="rounded-xl p-3 flex flex-col justify-between text-left backdrop-blur-sm active:scale-95 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}18 0%, ${card.color}08 100%)`,
                    border: `1px solid ${card.color}25`,
                    minHeight: 100,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xl leading-none">{card.emoji}</span>
                    <span
                      className="text-[7px] font-bold px-1.5 py-[2px] rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: `${card.color}20`, color: card.color }}
                    >
                      {card.category}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-[12px] font-semibold text-white/90 leading-tight">{card.label}</p>
                    <p className="text-[9px] text-white/40 leading-tight mt-0.5">{card.shortDescription}</p>
                  </div>
                </button>
              ))
          }
        </div>

        {(showExploreButton || phase >= 2) && !isLoadingNext && (
          <div className="px-4 pb-6">
            <button
              onClick={onExploreDeeper}
              className="w-full py-3 rounded-xl text-[12px] font-bold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              もっと深く探る
            </button>
          </div>
        )}

        {errorToast}

        <style jsx>{`
          @keyframes shimmer {
            0% { opacity: 0.4; }
            100% { opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background relative overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(192, 132, 252, 0.3)',
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      <div className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none">
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-accent/20 text-accent tracking-wider">
          {mbtiType}
        </span>
        <h1 className="text-title-1 text-white mt-2">
          {character.emoji} {character.japaneseName}
        </h1>
        {userName && <p className="text-caption text-white/40 mt-1">{userName}の特性をタップして探索</p>}
      </div>

      {isLoadingNext
        ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={`skel-${i}`} index={i} />)
        : positions.map(({ card, index, style }) => (
            <FloatingCard
              key={card.id}
              card={card}
              style={style}
              index={index}
              onClick={() => onSelect(card)}
            />
          ))
      }

      {(showExploreButton || phase >= 2) && !isLoadingNext && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onExploreDeeper}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full text-[12px] font-bold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors z-20"
        >
          もっと深く探る
        </motion.button>
      )}

      {errorToast}

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.15; }
          100% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { opacity: 0.4; }
          100% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
