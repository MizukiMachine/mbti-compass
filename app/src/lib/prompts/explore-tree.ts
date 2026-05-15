import { TreeGenerateRequest, ExploreNode } from '../../types/explore';
import { TrendContext } from '../rss-scout';
import { mbtiCharacters } from '../../data/mbti-characters';

const systemBase = `あなたはMBTI認知機能心理学の専門家です。ユーザーのMBTIタイプに基づいて、探索ツリーのノードを生成します。

## 厳守ルール
1. emojiは一切使用禁止（テキストにも含めない）
2. textは日本語の2〜8文字の単語または短い名詞句（文章にしない）
3. descriptionは80〜150文字の日本語で、具体的で実用的な内容
4. nodeTypeは "related" | "contrast" | "deep" | "growth" | "shadow" から選択
5. idは "node-{depth}-{index}" 形式
6. features、strengths、cautions、relatedThemes、opposingThemesは各2〜3件の短い日本語配列
7. 厳密なJSONのみを出力（マークダウンコードブロック不要）`;

export function buildRootPrompt(mbtiType: string, trendContext?: TrendContext): { systemPrompt: string; userPrompt: string } {
  const char = mbtiCharacters[mbtiType];
  if (!char) throw new Error(`Unknown MBTI type: ${mbtiType}`);

  const systemPrompt = `${systemBase}

## Level 0（ルート）生成ルール
- MBTIタイプの長い説明文を、単語・短い名詞句へ細かく分解して24〜34個のノードにせよ
- 文章として読ませるのではなく、マインドマップ上で一目で拾える語彙にすること
- textは「理想主義」「内省」「感情感度」「完璧主義」のような短いラベルだけにすること
- 以下のnodeTypeをバランスよく含めよ:
  - "related": タイプの特徴的な側面
  - "deep": より深い心理的傾向
  - "growth": 成長の機会
  - "shadow": シャドウ機能に関連する側面
  - "contrast": そのタイプが苦手としがちな視点

## 出力形式
{"nodes":[{"id":"node-0-0","text":"...","description":"...","nodeType":"...","parentId":null,"features":["..."],"strengths":["..."],"cautions":["..."],"relatedThemes":["..."],"opposingThemes":["..."]}]}`;

  let userPrompt = `## ユーザーのMBTIタイプ
タイプ: ${mbtiType}（${char.japaneseName}）
特性: ${char.traits.join('、')}
シャドウ機能: ${char.shadowFunction.name} - ${char.shadowFunction.description}
成長視点: ${char.shadowFunction.growthPerspective}
会話スタイル: フォーマル${char.conversationStyle.formality}%, 感情${char.conversationStyle.emotionality}%, 論理${char.conversationStyle.logicFocus}%, 共感${char.conversationStyle.empathy}%

## 指示
上記のMBTIタイプについて、性格説明を文章ではなく短い語彙へ分解し、24〜34個の探索ノードを生成せよ。`;

  if (trendContext && trendContext.articles.length > 0) {
    const articleList = trendContext.articles.slice(0, 3).map(a => `- 「${a.title}」(${a.source})`).join('\n');
    userPrompt += `

## 最新トレンド記事（参考情報）
${articleList}`;
  }

  return { systemPrompt, userPrompt };
}

export function buildBranchPrompt(
  request: TreeGenerateRequest,
  trendContext?: TrendContext,
): { systemPrompt: string; userPrompt: string } {
  const char = mbtiCharacters[request.mbtiType];
  if (!char) throw new Error(`Unknown MBTI type: ${request.mbtiType}`);

  const systemPrompt = `${systemBase}

## Level ${request.depth}（枝分かれ）生成ルール
- 親ノード「${request.parentNode?.text ?? ''}」に関連する5〜6個のノードを生成せよ
- 内訳:
  - "related": 親ノードに関連する視点（3〜4個）
  - "contrast": 親ノードと相反する視点（1〜2個）
- これまでの探索経路（pathHistory）を踏まえ、重複を避け、新しい視点を提供せよ

## 出力形式
{"nodes":[{"id":"node-${request.depth}-0","text":"...","description":"...","nodeType":"...","parentId":"${request.parentNode?.id ?? ''}","features":["..."],"strengths":["..."],"cautions":["..."],"relatedThemes":["..."],"opposingThemes":["..."]}]}`;

  const pathStr = (request.pathHistory ?? []).join(' → ');

  let userPrompt = `## ユーザーのMBTIタイプ
タイプ: ${request.mbtiType}（${char.japaneseName}）

## 選択したノード（親）
「${request.parentNode?.text ?? ''}」: ${request.parentNode?.description ?? ''}

## これまでの探索経路
${pathStr || '（最初の分岐）'}

## 指示
親ノードに関連する視点と、あえて逆の角度から見る視点を含めて、5〜6個のノードを生成せよ。`;

  if (trendContext && trendContext.articles.length > 0) {
    const articleList = trendContext.articles.slice(0, 2).map(a => `- 「${a.title}」(${a.source})`).join('\n');
    userPrompt += `

## 最新トレンド記事（参考情報）
${articleList}`;
  }

  return { systemPrompt, userPrompt };
}
