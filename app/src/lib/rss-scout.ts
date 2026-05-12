import Parser from 'rss-parser';

export interface TrendContext {
  keywords: string[];
  articles: { title: string; link: string; source: string }[];
}

const mbtiKeywords = [
  'stress', 'communication', 'personality', 'growth', 'psychology',
  'empathy', 'introvert', 'extrovert', 'cognitive', 'mindfulness',
  'mental health', 'self-awareness', 'motivation', 'resilience',
  'ストレス', 'コミュニケーション', '性格', '心理', '自己理解', '成長',
];

const RSS_SOURCES = [
  { url: 'https://www.psychologytoday.com/intl/feed', name: 'Psychology Today' },
  'https://b.hatena.ne.jp/hotentry/life.rss',
];

const CACHE_TTL = 5 * 60 * 1000;

let cachedResult: TrendContext | null = null;
let cachedAt = 0;

const parser = new Parser({ timeout: 8000 });

function matchesMbitKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return mbtiKeywords.some(kw => lower.includes(kw));
}

async function fetchFeed(source: string | { url: string; name: string }): Promise<{ title: string; link: string; source: string }[]> {
  const url = typeof source === 'string' ? source : source.url;
  const name = typeof source === 'string' ? new URL(url).hostname : source.name;

  try {
    const feed = await parser.parseURL(url);
    return (feed.items || [])
      .filter(item => matchesMbitKeyword(`${item.title || ''} ${item.contentSnippet || ''}`))
      .slice(0, 5)
      .map(item => ({
        title: item.title || '',
        link: item.link || '',
        source: name,
      }));
  } catch {
    return [];
  }
}

export async function getTrendContext(): Promise<TrendContext> {
  const now = Date.now();
  if (cachedResult && now - cachedAt < CACHE_TTL) {
    return cachedResult;
  }

  const allArticles = (await Promise.all(RSS_SOURCES.map(fetchFeed))).flat();

  const keywordCount: Record<string, number> = {};
  for (const article of allArticles) {
    const lower = article.title.toLowerCase();
    for (const kw of mbtiKeywords) {
      if (lower.includes(kw)) {
        keywordCount[kw] = (keywordCount[kw] || 0) + 1;
      }
    }
  }

  const keywords = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kw]) => kw);

  const result: TrendContext = {
    keywords,
    articles: allArticles.slice(0, 5),
  };

  cachedResult = result;
  cachedAt = now;
  return result;
}
