'use client';

import { motion } from 'framer-motion';
import { ExploreNode } from '../../src/types/explore';

const nodeTypeColors: Record<string, string> = {
  related: '#3B82F6',
  contrast: '#F59E0B',
  deep: '#7C3AED',
  growth: '#10B981',
  shadow: '#EF4444',
};

const nodeTypeLabels: Record<string, string> = {
  related: '関連',
  contrast: '対比',
  deep: '深層',
  growth: '成長',
  shadow: '影',
};

interface ExploreCardProps {
  node: ExploreNode;
  onClick: () => void;
}

export default function ExploreCard({ node, onClick }: ExploreCardProps) {
  const color = nodeTypeColors[node.nodeType] ?? '#6B7280';

  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center gap-2 rounded-xl p-4
        bg-white/5 border border-white/10 backdrop-blur-sm
        hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer
        min-h-[100px] text-center"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span
        className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
        style={{ backgroundColor: `${color}30`, color }}
      >
        {nodeTypeLabels[node.nodeType] ?? node.nodeType}
      </span>
      <span className="text-white text-base font-semibold leading-tight">
        {node.text}
      </span>
    </motion.button>
  );
}
