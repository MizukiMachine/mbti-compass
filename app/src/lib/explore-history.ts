import { SelectionEntry } from '../types/explore';

const STORAGE_KEY_PREFIX = 'mbti-explore-history-';
const MAX_HISTORY = 10;

function getKey(mbtiType: string): string {
  return `${STORAGE_KEY_PREFIX}${mbtiType}`;
}

export function saveHistory(mbtiType: string, history: SelectionEntry[]): void {
  if (typeof window === 'undefined') return;
  const trimmed = history.slice(-MAX_HISTORY);
  try {
    localStorage.setItem(getKey(mbtiType), JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable - silently ignore
  }
}

export function loadHistory(mbtiType: string): SelectionEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getKey(mbtiType));
    if (!raw) return [];
    return JSON.parse(raw) as SelectionEntry[];
  } catch {
    return [];
  }
}

export function clearHistory(mbtiType: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getKey(mbtiType));
  } catch {
    // silently ignore
  }
}
