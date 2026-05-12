'use client';

import { motion } from 'framer-motion';
import { DynamicCard } from '../../src/types/explore';

type CardSize = 'strength' | 'tendency' | 'shadow' | 'growth' | 'insight' | 'trend';

const sizeMap: Record<CardSize, { w: number; h: number }> = {
  strength: { w: 140, h: 100 },
  tendency: { w: 120, h: 85 },
  shadow: { w: 100, h: 70 },
  growth: { w: 100, h: 70 },
  insight: { w: 120, h: 85 },
  trend: { w: 130, h: 90 },
};

interface FloatingCardProps {
  card: DynamicCard;
  style: React.CSSProperties;
  index: number;
  onClick: () => void;
}

export default function FloatingCard({ card, style, index, onClick }: FloatingCardProps) {
  const size = sizeMap[card.category] || sizeMap.insight;
  const duration = 3 + (index % 5) * 0.4;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: size.w,
        height: size.h,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.3, delay: index * 0.05 },
        scale: { duration: 0.3, delay: index * 0.05 },
        y: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.2,
        },
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 24px ${card.color}40`,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div
        className="w-full h-full rounded-xl p-2.5 flex flex-col justify-between backdrop-blur-sm relative"
        style={{
          background: card.sourceType === 'llm'
            ? `linear-gradient(135deg, ${card.color}22 0%, ${card.color}0A 50%, ${card.color}15 100%)`
            : `linear-gradient(135deg, ${card.color}18 0%, ${card.color}08 100%)`,
          border: `1px solid ${card.sourceType === 'llm' ? `${card.color}40` : `${card.color}25`}`,
        }}
      >
        <div className="flex items-start justify-between">
          <span className="text-lg leading-none">{card.emoji}</span>
          <span
            className="text-[7px] font-bold px-1.5 py-[2px] rounded-full uppercase tracking-wider"
            style={{ backgroundColor: `${card.color}20`, color: card.color }}
          >
            {card.category}
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-[11px] font-semibold text-white/90 leading-tight truncate">{card.label}</p>
          <p className="text-[8px] text-white/40 leading-tight mt-0.5 line-clamp-2">{card.shortDescription}</p>
        </div>
      </div>
    </motion.div>
  );
}
