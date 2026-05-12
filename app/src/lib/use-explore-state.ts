import { useState, useEffect, useMemo, useCallback } from 'react';
import { getTraitCardsForType } from '../data/trait-cards';
import { DynamicCard, SelectionEntry } from '../types/explore';
import { loadHistory, saveHistory } from './explore-history';

export function useExploreState(mbtiType: string) {
  const [phase, setPhase] = useState(1);
  const [selectionHistory, setSelectionHistory] = useState<SelectionEntry[]>([]);
  const [dynamicCards, setDynamicCards] = useState<DynamicCard[] | null>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phase1Cards: DynamicCard[] = useMemo(
    () => getTraitCardsForType(mbtiType).map(c => ({ ...c, sourceType: 'static' as const })),
    [mbtiType]
  );

  const cards = dynamicCards || phase1Cards;

  useEffect(() => {
    const history = loadHistory(mbtiType);
    if (history.length > 0) {
      setSelectionHistory(history);
    }
  }, [mbtiType]);

  const selectCard = useCallback((card: DynamicCard) => {
    const entry: SelectionEntry = {
      cardId: card.id,
      label: card.label,
      category: card.category,
      shortDescription: card.shortDescription,
      phase,
    };
    setSelectionHistory(prev => {
      const next = [...prev, entry];
      saveHistory(mbtiType, next);
      return next;
    });
  }, [mbtiType, phase]);

  const fetchNextPhase = useCallback(async () => {
    setIsLoadingNext(true);
    setError(null);
    try {
      const res = await fetch('/api/explore/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mbtiType,
          phase: phase + 1,
          selectionHistory,
        }),
      });
      if (!res.ok) {
        throw new Error('生成に失敗しました');
      }
      const data = await res.json();
      setDynamicCards(data.cards);
      setPhase(p => p + 1);
    } catch {
      setError('カードの生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoadingNext(false);
    }
  }, [mbtiType, phase, selectionHistory]);

  return {
    phase, selectionHistory, dynamicCards, isLoadingNext, error,
    cards, selectCard, fetchNextPhase,
  };
}
