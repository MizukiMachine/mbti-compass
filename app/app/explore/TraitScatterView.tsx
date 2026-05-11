'use client';

import { useMemo } from 'react';
import FloatingCard from './FloatingCard';
import { TraitCardData } from '../../src/data/trait-cards';
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
  cards: TraitCardData[];
  onSelect: (card: TraitCardData) => void;
  isMobile: boolean;
}

export default function TraitScatterView({ mbtiType, userName, cards, onSelect, isMobile }: TraitScatterViewProps) {
  const character = getCharacter(mbtiType);

  const positions = useMemo(() => {
    const rand = seededRandom(hashStr(mbtiType));

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
  }, [mbtiType, cards, isMobile]);

  // Particles
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

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="pt-8 pb-4 px-5 text-center">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-accent/20 text-accent tracking-wider">
            {mbtiType}
          </span>
          <h1 className="text-title-1 text-white mt-2">
            {character.emoji} {character.japaneseName}
          </h1>
          {userName && <p className="text-caption text-white/40 mt-1">{userName}の特性マップ</p>}
        </div>

        {/* Mobile grid */}
        <div className="px-4 pb-8 grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
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
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background relative overflow-hidden">
      {/* Particles */}
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

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none">
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-accent/20 text-accent tracking-wider">
          {mbtiType}
        </span>
        <h1 className="text-title-1 text-white mt-2">
          {character.emoji} {character.japaneseName}
        </h1>
        {userName && <p className="text-caption text-white/40 mt-1">{userName}の特性をタップして探索</p>}
      </div>

      {/* Floating cards */}
      {positions.map(({ card, index, style }) => (
        <FloatingCard
          key={card.id}
          card={card}
          style={style}
          index={index}
          onClick={() => onSelect(card)}
        />
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.15; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
