import { getTraitCardsForType } from '../data/trait-cards';
import { mbtiCharacters } from '../data/mbti-characters';
import { ExploreNode, NodeType, TreeGenerateRequest } from '../types/explore';

const nodeTypesByCategory: Record<string, NodeType> = {
  strength: 'related',
  tendency: 'deep',
  shadow: 'shadow',
  growth: 'growth',
};

const axisTerms: Record<string, { text: string; nodeType: NodeType; description: string }[]> = {
  E: [
    { text: '外向交流', nodeType: 'related', description: '人との会話や場の反応からエネルギーを得やすい傾向です。考えを外に出しながら整理し、周囲との関わりの中で自分の方向性を掴みます。' },
    { text: '反応速度', nodeType: 'deep', description: '状況に対して素早く反応し、まず動きながら調整する傾向です。停滞よりも展開を好み、人や出来事の変化に敏感です。' },
  ],
  I: [
    { text: '内省', nodeType: 'related', description: '外の刺激よりも、自分の内側で感じたことや考えたことを丁寧に整理する傾向です。一人で考える時間が判断の精度を支えます。' },
    { text: '一人時間', nodeType: 'deep', description: '人と関わった後に静かな時間を必要としやすい傾向です。距離を置くことで感情や情報を処理し、自分らしい判断に戻れます。' },
  ],
  N: [
    { text: '可能性', nodeType: 'related', description: '目の前の事実だけでなく、その奥にある意味や未来の展開を見ようとする傾向です。まだ形になっていないものに惹かれます。' },
    { text: '抽象化', nodeType: 'deep', description: '具体的な出来事から共通点やパターンを抜き出して理解する傾向です。細部よりも全体像や意味づけを重視します。' },
  ],
  S: [
    { text: '現実感覚', nodeType: 'related', description: '今ここにある事実や具体的な手触りを重視する傾向です。実際に使えるか、確かめられるかを判断の土台にします。' },
    { text: '具体観察', nodeType: 'deep', description: '細部の変化や実際の状況を丁寧に見取る傾向です。抽象的な話よりも、経験や実例から理解を深めます。' },
  ],
  T: [
    { text: '論理軸', nodeType: 'related', description: '感情よりも筋道や整合性を重視して判断する傾向です。物事を分解し、原因と結果を整理することで納得に近づきます。' },
    { text: '客観視', nodeType: 'contrast', description: '自分や相手の感情から少し距離を取り、状況を外側から見ようとする傾向です。冷静さが強みになる一方、温度差も生まれます。' },
  ],
  F: [
    { text: '価値観', nodeType: 'related', description: '正しさだけでなく、自分や相手にとって何が大切かを軸に判断する傾向です。納得感や誠実さを重んじます。' },
    { text: '感情感度', nodeType: 'deep', description: '言葉になっていない気持ちや場の空気を感じ取りやすい傾向です。人の変化に気づける一方、影響を受けすぎることもあります。' },
  ],
  J: [
    { text: '計画性', nodeType: 'growth', description: '先に見通しを立て、予定や役割を整理して進めたい傾向です。決めることで安心し、行動に集中しやすくなります。' },
    { text: '決着志向', nodeType: 'deep', description: '曖昧な状態を長く置くより、区切りをつけて次へ進みたい傾向です。判断が早い反面、変更への余白が狭くなることもあります。' },
  ],
  P: [
    { text: '柔軟性', nodeType: 'growth', description: '状況の変化に合わせて選択肢を残しながら進めたい傾向です。流れを見て調整できる一方、決定を先延ばしにしやすくもあります。' },
    { text: '探索志向', nodeType: 'deep', description: '一つに決め切る前に、複数の可能性を試してみたい傾向です。発見や偶然から新しい道筋を見つけやすいタイプです。' },
  ],
};

const commonMindMapTerms: { text: string; nodeType: NodeType; description: string }[] = [
  { text: '強み', nodeType: 'related', description: '自然に発揮しやすく、周囲からも価値として見えやすい側面です。無理に作るものではなく、普段の行動の中にすでに表れています。' },
  { text: '癖', nodeType: 'deep', description: '意識しないまま繰り返している反応パターンです。良し悪しではなく、まず気づくことで扱いやすくなります。' },
  { text: '苦手場面', nodeType: 'shadow', description: '自分の得意な判断だけではうまく進みにくい状況です。避けるよりも、反対側の視点を補うことで安定しやすくなります。' },
  { text: '安心条件', nodeType: 'related', description: '自分らしく力を出しやすい環境や関わり方です。これを知っておくと、疲れにくい選択をしやすくなります。' },
  { text: '疲れ方', nodeType: 'shadow', description: '負荷が高い時に出やすい反応です。普段の強みが過剰になったり、逆に使いにくい機能が急に表れたりします。' },
  { text: '成長余地', nodeType: 'growth', description: '今の自分を否定せずに、少し視点を広げるための方向です。苦手を完璧にするより、補助線として使うのが現実的です。' },
  { text: '対人傾向', nodeType: 'related', description: '人と関わる時に出やすい距離感や反応です。親しさ、配慮、率直さ、慎重さなどの形で日常に表れます。' },
  { text: '判断基準', nodeType: 'deep', description: '選択の奥にある優先順位です。効率、納得感、調和、自由、安定など、何を重く見るかが行動を方向づけます。' },
];

function compactIdPart(text: string): string {
  return Array.from(text)
    .map(char => char.charCodeAt(0).toString(36))
    .join('')
    .slice(0, 12);
}

function listFromText(text: string, fallback: string[]): string[] {
  const cleaned = text
    .replace(/[。！？]/g, '。')
    .split('。')
    .map(item => item.trim())
    .filter(Boolean);

  return (cleaned.length >= 2 ? cleaned : fallback).slice(0, 3);
}

function createNode(params: {
  id: string;
  text: string;
  description: string;
  nodeType: NodeType;
  parentId: string | null;
  features?: string[];
  strengths?: string[];
  cautions?: string[];
  relatedThemes?: string[];
  opposingThemes?: string[];
}): ExploreNode {
  return {
    id: params.id,
    text: params.text,
    description: params.description,
    nodeType: params.nodeType,
    parentId: params.parentId,
    features: params.features ?? listFromText(params.description, ['日常の判断に表れやすい', '人との関わり方に影響する']),
    strengths: params.strengths ?? ['自分らしさを活かしやすい', '状況理解の手がかりになる'],
    cautions: params.cautions ?? ['偏りが強くなると疲れやすい', '反対の視点も意識すると安定する'],
    relatedThemes: params.relatedThemes ?? [],
    opposingThemes: params.opposingThemes ?? [],
  };
}

function makeDescription(mbtiType: string, text: string, source: string): string {
  return `${mbtiType}の「${text}」は、${source}として表れやすい側面です。文章でまとめると見落としやすい小さな傾向を、単語として切り出して観察できるようにしています。`;
}

function createRootNode(
  mbtiType: string,
  index: number,
  text: string,
  nodeType: NodeType,
  description: string,
  relatedThemes: string[],
  opposingThemes: string[],
): ExploreNode {
  return createNode({
    id: `node-0-${index}`,
    text,
    description,
    nodeType,
    parentId: null,
    features: ['短い言葉で把握できる', '日常の反応に表れやすい'],
    strengths: nodeType === 'shadow'
      ? ['苦手の輪郭が見える', '補う視点を探しやすい']
      : ['自分らしさを掴みやすい', '行動の理由を説明しやすい'],
    cautions: ['一語だけで決めつけない', '場面によって出方が変わる'],
    relatedThemes,
    opposingThemes,
  });
}

export function generateFallbackTreeNodes(request: TreeGenerateRequest): ExploreNode[] {
  const character = mbtiCharacters[request.mbtiType];
  if (!character) return [];

  if (request.depth === 0) {
    const relatedThemes = character.traits.slice(0, 4);
    const opposingThemes = character.shadowFunction.complementaryTraits.slice(0, 4);
    const seen = new Set<string>();
    const nodes: ExploreNode[] = [];

    const add = (text: string, nodeType: NodeType, description: string, source = '性格傾向') => {
      const normalized = text.trim();
      if (!normalized || seen.has(normalized) || nodes.length >= 34) return;
      seen.add(normalized);
      nodes.push(createRootNode(
        request.mbtiType,
        nodes.length,
        normalized,
        nodeType,
        description || makeDescription(request.mbtiType, normalized, source),
        relatedThemes.filter(t => t !== normalized).slice(0, 3),
        opposingThemes.filter(t => t !== normalized).slice(0, 3),
      ));
    };

    getTraitCardsForType(request.mbtiType).forEach(card => {
      add(card.label, nodeTypesByCategory[card.category] ?? 'related', card.longDescription, card.shortDescription);
    });

    character.traits.forEach(trait => {
      add(trait, 'related', makeDescription(request.mbtiType, trait, '基本特徴'));
    });

    character.shadowFunction.complementaryTraits.forEach(trait => {
      add(trait, 'shadow', makeDescription(request.mbtiType, trait, 'シャドウ機能'));
    });

    character.type.split('').forEach(axis => {
      axisTerms[axis]?.forEach(term => add(term.text, term.nodeType, term.description));
    });

    [
      { text: character.shadowFunction.name, nodeType: 'shadow' as const, description: character.shadowFunction.description },
      { text: '理想追求', nodeType: 'deep' as const, description: character.shadowFunction.growthPerspective },
      { text: '自己理解', nodeType: 'growth' as const, description: '自分の反応や選択の背景を言葉にし、得意な形と負荷がかかる形を見分けていく視点です。' },
      { text: '関係性', nodeType: 'related' as const, description: character.empathyPattern.supportStyle },
      { text: '助言傾向', nodeType: 'contrast' as const, description: character.empathyPattern.adviceStyle },
    ].forEach(term => add(term.text, term.nodeType, term.description));

    commonMindMapTerms.forEach(term => add(term.text, term.nodeType, term.description));

    return nodes;
  }

  const parent = request.parentNode;
  if (!parent) return [];

  const base = [
    {
      text: '日常場面',
      description: `「${parent.text}」が日常の選択や会話にどう表れるかを観察する視点です。よく起きる場面を特定すると、無意識の反応を扱いやすくなります。`,
      nodeType: 'related' as const,
    },
    {
      text: '強み化',
      description: `「${parent.text}」を強みとして使うための視点です。自然にできている行動を見つけ、再現できる形に整えることで安定した力になります。`,
      nodeType: 'growth' as const,
    },
    {
      text: '過剰反応',
      description: `「${parent.text}」が強く出すぎる場面を見つける視点です。疲労や焦りと結びつくと判断が狭くなりやすいため、早めのサインを掴みます。`,
      nodeType: 'shadow' as const,
    },
    {
      text: '逆の視点',
      description: `「${parent.text}」とは反対側から状況を見る視点です。普段選ばない考え方を一つ足すことで、結論の偏りを減らせます。`,
      nodeType: 'contrast' as const,
    },
    {
      text: '深層動機',
      description: `「${parent.text}」の奥にある価値観や不安を探る視点です。行動の理由を言葉にすると、自分に合う選択が見えやすくなります。`,
      nodeType: 'deep' as const,
    },
    {
      text: '小さな実験',
      description: `「${parent.text}」を現実で試すための小さな行動に落とし込む視点です。大きく変えず、今日できる一歩にすると継続しやすくなります。`,
      nodeType: 'growth' as const,
    },
  ];

  return base.map((item, index) => createNode({
    id: `node-${request.depth}-${compactIdPart(parent.id)}-${index}`,
    parentId: parent.id,
    relatedThemes: [parent.text, ...character.traits].slice(0, 3),
    opposingThemes: character.shadowFunction.complementaryTraits.slice(0, 3),
    ...item,
  }));
}
