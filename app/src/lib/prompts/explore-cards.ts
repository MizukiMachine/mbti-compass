import { GenerateRequest } from '../../types/explore';
import { mbtiCharacters } from '../../data/mbti-characters';

const functionColors: Record<string, string> = {
  Ni: '#7C3AED', Ne: '#F59E0B', Si: '#10B981', Se: '#EF4444',
  Ti: '#3B82F6', Te: '#0EA5E9', Fi: '#EC4899', Fe: '#F472B6',
};

export function buildExplorePrompt(request: GenerateRequest): { systemPrompt: string; userPrompt: string } {
  const char = mbtiCharacters[request.mbtiType];
  if (!char) {
    throw new Error(`Unknown MBTI type: ${request.mbtiType}`);
  }

  const systemPrompt = `あなたはMBTI認知機能心理学の専門家です。ユーザーのMBTIタイプと探索履歴に基づいて、個別化された特性カードを生成します。

## 認知機能カラー（colorマッピング）
Ni=#7C3AED, Ne=#F59E0B, Si=#10B981, Se=#EF4444,
Ti=#3B82F6, Te=#0EA5E9, Fi=#EC4899, Fe=#F472B6

## 出力ルール
1. 5〜7枚のカードをJSON配列で出力せよ
2. categoryは以下から3種類以上含め: "strength", "tendency", "shadow", "growth", "insight"
3. relatedFunctionsは必ず上記8コード（Ni, Ne, Si, Se, Ti, Te, Fi, Fe）から選べ
4. colorはrelatedFunctions[0]に対応する上記の色を使用せよ
5. labelは日本語の2〜4文字の形容詞・名詞にせよ
6. emojiは1文字の絵文字にせよ
7. shortDescriptionは20文字以内の日本語
8. longDescriptionは80〜150文字の日本語で、具体的で実用的な内容にせよ
9. これまで選択した内容の共通点・対比を見つけ、それに関連する新しい視点を提示せよ
10. 必ず厳密なJSON配列のみを出力せよ（マークダウンコードブロック不要）

## 出力形式
以下のJSON配列のみを出力（他のテキストは一切不要）:
{"cards":[{"id":"llm-{phase}-{index}","label":"...","emoji":"...","color":"#...","category":"...","shortDescription":"...","longDescription":"...","relatedFunctions":["..."]}]}

## few-shot example（INTJ Phase2の例）
{"cards":[{"id":"llm-2-0","label":"直感の信頼","emoji":"🎯","color":"#7C3AED","category":"insight","shortDescription":"直感を論理で裏付ける力","longDescription":"Niの直感をTeで検証する能力。ふと湧いたアイデアを論理的に分解し、実現可能性を評価することで、直感の精度を飛躍的に高めることができます。実践では、直感が示唆する方向を3つの論理的根拠で検証する習慣が効果的です。","relatedFunctions":["Ni","Te"]}]}`;

  const historySummary = request.selectionHistory.length > 0
    ? request.selectionHistory
        .map(h => `Phase ${h.phase}: ${h.label}（${h.category}）- ${h.shortDescription}`)
        .join('\n')
    : 'まだ選択履歴がありません';

  const userPrompt = `## ユーザーのMBTIタイプ
タイプ: ${request.mbtiType}（${char.japaneseName}）
特性: ${char.traits.join('、')}
シャドウ機能: ${char.shadowFunction.name} - ${char.shadowFunction.description}
成長視点: ${char.shadowFunction.growthPerspective}
会話スタイル: フォーマル${char.conversationStyle.formality}%, 感情${char.conversationStyle.emotionality}%, 論理${char.conversationStyle.logicFocus}%, 共感${char.conversationStyle.empathy}%

## 現在のフェーズ
Phase ${request.phase}（${request.phase === 2 ? '1回目の深掘り' : `${request.phase - 1}回目の深掘り`}）

## 選択履歴
${historySummary}

## 指示
上記のMBTIタイプと選択履歴を踏まえ、ユーザーに新しい気づきを与える5〜7枚の特性カードを生成せよ。
Phase ${request.phase}では${request.phase <= 2 ? 'シャドウ機能や未開拓の認知機能に関連する視点を積極的に含めること' : 'これまでの選択の傾向を分析し、より深い自己理解につながる視点を提供すること'}。`;

  return { systemPrompt, userPrompt };
}
