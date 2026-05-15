import { workplaceActions, getWorkplaceAction } from '../data/workplace-presets';
import { mbtiCharacters } from '../data/mbti-characters';
import {
  AdviceActionId,
  WorkplaceAdviceRequest,
  WorkplaceAdviceResponse,
} from '../types/workplace';

const systemPrompt = `あなたは人間関係の摩擦に特化したコミュニケーション設計コーチです。

## 方針
- 相手のMBTIは断定せず、観察情報からの仮説として扱う
- 操作や支配ではなく、相互尊重、境界線、合意形成を重視する
- 医療、法務、ハラスメント認定、相手の人格診断の断定は避け、深刻な危険や違法性がある場合は専門窓口への相談を促す
- 日本語で、実際の会話やテキストに使える具体的な言い方に落とす

## 出力形式
厳密なJSONのみを返す。マークダウンコードブロックは不要。
{
  "title": "短いタイトル",
  "summary": "2〜3文の要約",
  "strategy": ["方針1", "方針2", "方針3"],
  "avoid": ["避けたい言い方1", "避けたい言い方2", "避けたい言い方3"],
  "messageDraft": "LINE、Slack、メール、または口頭で使える文面",
  "talkingPoints": ["切り出し1", "切り出し2", "切り出し3"],
  "nextStep": "次に取る具体行動",
  "psychologyNote": "心理学的な補足。ただし断定しない",
  "caveat": "MBTI推定は仮説であり、実際の反応を見て調整する注意書き"
}`;

function compactList(items: unknown, fallback: string[]): string[] {
  if (!Array.isArray(items)) return fallback;
  const normalized = items
    .map(item => typeof item === 'string' ? item.trim() : '')
    .filter(Boolean)
    .slice(0, 4);

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeAdvice(value: Partial<WorkplaceAdviceResponse>): WorkplaceAdviceResponse {
  return {
    title: value.title?.trim() || '次の会話方針',
    summary: value.summary?.trim() || '相手の傾向を仮説として扱い、結論と配慮の両方を入れて伝えるのが安全です。',
    strategy: compactList(value.strategy, ['結論を先に置く', '相手の重視点に合わせて根拠を添える', '最後に次の確認事項を明確にする']),
    avoid: compactList(value.avoid, ['人格評価に聞こえる言い方', '曖昧な依頼', '相手の事情を無視した催促']),
    messageDraft: value.messageDraft?.trim() || 'お疲れさまです。少し相談したいことがあります。結論から言うと、次の進め方について早めに確認したいです。',
    talkingPoints: compactList(value.talkingPoints, ['先に目的を伝える', '相手の都合を確認する', '相談したい判断を一つに絞る']),
    nextStep: value.nextStep?.trim() || '15分だけ相談時間を取り、合意事項をテキストで残してください。',
    psychologyNote: value.psychologyNote?.trim() || '人は自分が重視する価値を尊重された時に協力しやすくなります。',
    caveat: value.caveat?.trim() || 'この提案は観察情報からの仮説です。相手の反応を見ながら調整してください。',
  };
}

function buildUserPrompt(request: WorkplaceAdviceRequest): string {
  const action = getWorkplaceAction(request.actionId);
  const character = mbtiCharacters[request.selfMbti];
  const person = request.person;

  return `## 自分
名前: ${request.selfName || 'ユーザー'}
MBTI: ${request.selfMbti}${character ? `（${character.japaneseName}）` : ''}

## 相手
カテゴリ: ${person.preset.categoryLabel}
関係: ${person.relationLabel}
摩擦名: ${person.preset.frictionName}
人物像: ${person.name}
役割: ${person.roleLabel}
推定MBTI候補: ${person.preset.estimatedMbti.join(' / ')}
確信度: ${person.preset.confidence}
人物説明: ${person.preset.description}
隠れた欲求: ${person.preset.hiddenNeed}
特徴: ${person.preset.traits.join('、')}
重視するもの: ${person.preset.workValues.join('、')}
摩擦が起きやすい点: ${person.preset.frictionPoints.join('、')}
信頼のサイン: ${person.preset.trustSignals.join('、')}
地雷になりやすいこと: ${person.preset.riskTriggers.join('、')}
現在の信頼度: ${person.closeness}/100
現在の心理的負荷: ${person.stress}/100
関係メモ: ${person.notes || 'なし'}

## 相談アクション
${action.label}: ${action.description}
焦点: ${action.promptFocus}

## 具体的な相談内容
${request.userConcern?.trim() || 'まだ具体的な相談内容は未入力。この人物プリセットとの一般的な関わり方と次の一手を提案してほしい。'}`;
}

const actionDrafts: Record<AdviceActionId, string> = {
  build_trust:
    '最近の関わり方について、少し認識を合わせたいです。こちらで意識した方がよいことがあれば知っておきたいので、短く話せる時間をもらえますか。',
  request:
    'お願いしたいことがあります。目的は〇〇で、お願いしたい範囲は△△です。負担が大きければ、期限や範囲を調整したいので相談させてください。',
  decline:
    '声をかけてくれてありがとうございます。今の状況だと、そのまま引き受けるのは難しそうです。代わりに、〇〇までならできます。',
  feedback:
    '少し伝えたいことがあります。責めたいわけではなく、次からお互いに進めやすくするための確認です。事実として〇〇があり、次は△△にできると助かります。',
  repair:
    '先ほどの件で、こちらの伝え方が足りなかったかもしれません。一度意図を整理して伝え直したいです。誤解があれば解きたいので、少し時間をください。',
  distance:
    '今後のやり取りを無理なく続けるために、返せるタイミングや話せる範囲を少し整理したいです。急ぎのものは先に期限を添えてもらえると助かります。',
  smalltalk:
    '最近どうですか。差し支えない範囲で、今いちばん気になっていることを聞かせてもらえたらうれしいです。',
  one_on_one:
    '一度ちゃんと話したいです。責めたいわけではなく、今の認識、困っている点、これからどうしたいかを整理して話せると助かります。',
};

export function generateFallbackWorkplaceAdvice(request: WorkplaceAdviceRequest): WorkplaceAdviceResponse {
  const action = getWorkplaceAction(request.actionId);
  const person = request.person;
  const isHighStress = person.stress >= 65;
  const isLowTrust = person.closeness <= 40;

  return normalizeAdvice({
    title: `${person.preset.shortLabel}との「${action.label}」方針`,
    summary: `${person.name}は「${person.preset.workValues.slice(0, 2).join('・')}」を重視する仮説で見ると扱いやすい相手です。${isHighStress ? '心理的負荷が高めなので、最初は短く、記録に残る形で進めるのが安全です。' : '信頼を削らないよう、相手の重視点に合わせて話す順番を整えましょう。'}`,
    strategy: [
      `${person.preset.trustSignals[0]}を最初の一手にする`,
      isLowTrust ? 'いきなり本題を押し切らず、目的と相手の負荷を先に確認する' : '本題、理由、相手に期待する範囲を一つずつ分けて伝える',
      `${person.preset.workValues[0]}にどうつながるかを言語化する`,
    ],
    avoid: [
      person.preset.riskTriggers[0],
      person.preset.frictionPoints[0],
      '相手の性格を決めつける言い方',
    ],
    messageDraft: actionDrafts[request.actionId],
    talkingPoints: [
      `「${person.preset.workValues[0]}の観点で相談したいです」と切り出す`,
      '相手に判断してほしい点を一つだけ置く',
      '最後に期限、担当、次回確認のタイミングを合わせる',
    ],
    nextStep: request.userConcern?.trim()
      ? '相談内容を一文に要約し、15分の会話か短いテキストで先に打診してください。'
      : '実際に困っている場面を一つ入力してから、もう一度シミュレーションすると精度が上がります。',
    psychologyNote:
      '人間関係の摩擦は性格そのものより、重視する価値や必要な安心材料の違いから起きることが多いです。相手の価値を先に扱うと、防衛的な反応が下がりやすくなります。',
    caveat:
      '相手のMBTI候補は観察からの仮説です。実際の反応、立場、業務負荷を見て言い方を調整してください。',
  });
}

export async function generateWorkplaceAdvice(
  request: WorkplaceAdviceRequest,
): Promise<WorkplaceAdviceResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://api.z.ai/api/anthropic';
  const model = process.env.LLM_MODEL || 'glm-5-turbo';
  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS ?? 10000);

  if (!apiKey) return generateFallbackWorkplaceAdvice(request);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2200,
        system: systemPrompt,
        messages: [{ role: 'user', content: buildUserPrompt(request) }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`LLM API error (${response.status})`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) throw new Error('Empty response from LLM');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in response');

    return normalizeAdvice(JSON.parse(jsonMatch[0]) as Partial<WorkplaceAdviceResponse>);
  } catch (error) {
    console.warn(`Workplace advice fallback used: ${error}`);
    return generateFallbackWorkplaceAdvice(request);
  } finally {
    clearTimeout(timeout);
  }
}

export function isAdviceActionId(value: unknown): value is AdviceActionId {
  return workplaceActions.some(action => action.id === value);
}
