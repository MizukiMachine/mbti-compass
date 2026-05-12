'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { DynamicCard } from '../../src/types/explore';
import { useExploreState } from '../../src/lib/use-explore-state';
import TraitScatterView from './TraitScatterView';
import DrillDownView from './DrillDownView';

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mbtiType = searchParams.get('mbti') || '';
  const userName = searchParams.get('name') || '';
  const [selectedTrait, setSelectedTrait] = useState<DynamicCard | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    phase, selectionHistory, isLoadingNext, error,
    cards, selectCard, fetchNextPhase,
  } = useExploreState(mbtiType);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!mbtiType) {
      const stored = localStorage.getItem('mbti-result');
      if (stored) {
        try {
          const { type, name } = JSON.parse(stored);
          const params = new URLSearchParams();
          if (type) params.set('mbti', type);
          if (name) params.set('name', name);
          router.replace(`/explore?${params.toString()}`);
          return;
        } catch {}
      }
      router.replace('/');
    }
  }, [mbtiType, router]);

  if (!mbtiType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSelect = (card: DynamicCard) => {
    selectCard(card);
    setSelectedTrait(card);
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedTrait ? (
        <motion.div
          key="scatter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TraitScatterView
            mbtiType={mbtiType}
            userName={userName}
            cards={cards}
            onSelect={handleSelect}
            isMobile={isMobile}
            phase={phase}
            isLoadingNext={isLoadingNext}
            onExploreDeeper={fetchNextPhase}
            selectionCount={selectionHistory.length}
            error={error}
          />
        </motion.div>
      ) : (
        <motion.div
          key="drilldown"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DrillDownView
            card={selectedTrait}
            mbtiType={mbtiType}
            userName={userName}
            onBack={() => setSelectedTrait(null)}
            phase={phase}
            onNextExploration={fetchNextPhase}
            isLoadingNext={isLoadingNext}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
