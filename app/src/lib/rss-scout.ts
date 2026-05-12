import Parser from 'rss-parser';

export interface TrendContext {
  keywords: string[];
  articles: { title: string; link: string; source: string }[];
}

const mbtiKeywords = [
  'mbti', '16personalities', 'stress', 'communication', 'personality', 'growth', 'psychology',
  'empathy', 'introvert', 'extrovert', 'cognitive', 'mindfulness',
  'mental health', 'self-awareness', 'motivation', 'resilience',
  'well-being', 'self-care', 'introversion', 'extraversion',
  'ストレス', 'コミュニケーション', '性格', '心理', '自己理解', '成長', '性格診断', 'セルフケア',
];

const RSS_SOURCES = [
  { url: 'https://www.psychologytoday.com/intl/feed', name: 'Psychology Today' },
  { url: 'https://www.verywellmind.com/rss', name: 'Verywell Mind' },
  { url: 'https://www.mindful.org/feed/', name: 'Mindful' },
  { url: 'https://greatergood.berkeley.edu/article_feeds.rss', name: 'Greater Good Mag' },
  { url: 'https://www.lifehacker.jp/feed/index.xml', name: 'ライフハッカー' },
  { url: 'https://gigazine.net/index.php?rss_news', name: 'GIGAZINE' },
  { url: 'https://b.hatena.ne.jp/hotentry/life.rss', name: 'はてなブックマーク(ライフ)' },
  { url: 'https://b.hatena.ne.jp/hotentry/learning.rss', name: 'はてなブックマーク(学び)' },
];

const CACHE_TTL = 5 * 60 * 1000;

let cachedResult: TrendContext | null = null;
let cachedAt = 0;

const parser = new Parser({ timeout: 8000 });

function matchesMbtiKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return mbtiKeywords.some(kw => lower.includes(kw));
}

async function fetchFeed(source: string | { url: string; name: string }): Promise<{ title: string; link: string; source: string }[]> {
  const url = typeof source === 'string' ? source : source.url;

  try {
    const feed = await parser.parseURL(url);
    const name = typeof source === 'string' ? new URL(url).hostname : source.name;
    return (feed.items || [])
      .filter(item => matchesMbtiKeyword(`${item.title || ''} ${item.contentSnippet || ''}`))
      .slice(0, 3)
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

  const feedResults = await Promise.all(RSS_SOURCES.map(fetchFeed));

  // Rotate across sources for diversity: 1st from source 0, 1st from source 1, ...
  const allArticles: { title: string; link: string; source: string }[] = [];
  const maxPerSource = Math.max(...feedResults.map(r => r.length));
  for (let i = 0; i < maxPerSource; i++) {
    for (const result of feedResults) {
      if (result[i]) allArticles.push(result[i]);
    }
  }

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
