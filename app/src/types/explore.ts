export type CardCategory = 'strength' | 'tendency' | 'shadow' | 'growth' | 'insight' | 'trend';

export interface DynamicCard {
  id: string;
  label: string;
  emoji: string;
  color: string;
  category: CardCategory;
  shortDescription: string;
  longDescription: string;
  relatedFunctions: string[];
  sourceType: 'static' | 'llm';
  trendReference?: { articleTitle: string; source: string };
}

export interface SelectionEntry {
  cardId: string;
  label: string;
  category: CardCategory;
  shortDescription: string;
  phase: number;
}

export interface GenerateRequest {
  mbtiType: string;
  phase: number;
  selectionHistory: SelectionEntry[];
}

export interface GenerateResponse {
  cards: DynamicCard[];
}
