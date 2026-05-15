const STORAGE_KEY_PREFIX = 'mbti-tree-history-';

interface TreeHistory {
  path: string[];
  nodeTexts: Record<string, string>;
}

function getKey(mbtiType: string): string {
  return `${STORAGE_KEY_PREFIX}${mbtiType}`;
}

export function saveTreeHistory(mbtiType: string, path: string[], nodeTexts: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    const data: TreeHistory = { path, nodeTexts };
    localStorage.setItem(getKey(mbtiType), JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadTreeHistory(mbtiType: string): TreeHistory {
  if (typeof window === 'undefined') return { path: [], nodeTexts: {} };
  try {
    const raw = localStorage.getItem(getKey(mbtiType));
    if (!raw) return { path: [], nodeTexts: {} };
    return JSON.parse(raw) as TreeHistory;
  } catch {
    return { path: [], nodeTexts: {} };
  }
}

export function clearTreeHistory(mbtiType: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getKey(mbtiType));
  } catch {
    // silently ignore
  }
}
