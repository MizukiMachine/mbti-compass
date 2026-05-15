'use client';

import { ExploreNode } from '../../src/types/explore';
import ExploreCard from './ExploreCard';

interface NodeGridProps {
  nodes: ExploreNode[];
  onSelect: (nodeId: string) => void;
  isLoading: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 bg-white/5 border border-white/10 animate-pulse min-h-[100px]">
      <div className="h-3 w-12 bg-white/10 rounded-full mb-3" />
      <div className="h-5 w-20 bg-white/10 rounded" />
    </div>
  );
}

export default function NodeGrid({ nodes, onSelect, isLoading }: NodeGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
      ) : (
        nodes.map(node => (
          <ExploreCard
            key={node.id}
            node={node}
            onClick={() => onSelect(node.id)}
          />
        ))
      )}
    </div>
  );
}
