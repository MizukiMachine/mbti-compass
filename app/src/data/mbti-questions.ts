export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP';

export interface MbtiQuestion {
  id: number;
  axis: MbtiAxis;
  question: string;
  optionA: { label: string; value: string };
  optionB: { label: string; value: string };
}

export const mbtiQuestions: MbtiQuestion[] = [
  // EI軸（外向/内向）
  {
    id: 1,
    axis: 'EI',
    question: '忙しい一週間のあと、回復しやすい過ごし方は？',
    optionA: { label: '友達や知人と会って気分を切り替える', value: 'E' },
    optionB: { label: '一人の時間を作って静かに整える', value: 'I' },
  },
  {
    id: 2,
    axis: 'EI',
    question: '新しいコミュニティに入った時、最初にしやすい行動は？',
    optionA: { label: 'まず場の雰囲気や人間関係を観察する', value: 'I' },
    optionB: { label: '自分から話しかけて関係を作る', value: 'E' },
  },
  {
    id: 3,
    axis: 'EI',
    question: '考えを整理する時、やりやすいのは？',
    optionA: { label: '人に話しながら形にしていく', value: 'E' },
    optionB: { label: 'メモや頭の中で一人で深める', value: 'I' },
  },
  {
    id: 4,
    axis: 'EI',
    question: '初対面の相手と話す時、自然なのは？',
    optionA: { label: '共通点が見えるまで聞き役に回る', value: 'I' },
    optionB: { label: '自分から話題を振って距離を縮める', value: 'E' },
  },
  {
    id: 5,
    axis: 'EI',
    question: 'チームの空気が停滞している時、あなたは？',
    optionA: { label: '声に出して場を動かそうとする', value: 'E' },
    optionB: { label: '必要なタイミングまで発言を温める', value: 'I' },
  },

  // SN軸（感覚/直感）
  {
    id: 6,
    axis: 'SN',
    question: '何かを説明する時、あなたは？',
    optionA: { label: '具体例を挙げて説明する', value: 'S' },
    optionB: { label: '全体像や概念から話す', value: 'N' },
  },
  {
    id: 7,
    axis: 'SN',
    question: '新しい企画を考える時、先に気になるのは？',
    optionA: { label: 'まだ見えていない可能性や展開', value: 'N' },
    optionB: { label: '実現条件や必要な手順', value: 'S' },
  },
  {
    id: 8,
    axis: 'SN',
    question: '情報を読む時、信頼しやすいのは？',
    optionA: { label: '数字・事実・実例がはっきりしている内容', value: 'S' },
    optionB: { label: '背景にある意味やパターンが見える内容', value: 'N' },
  },
  {
    id: 9,
    axis: 'SN',
    question: '新しいスキルを学ぶ時、入りやすいのは？',
    optionA: { label: 'まず原理や考え方をつかむ', value: 'N' },
    optionB: { label: '手順通りに試して感覚をつかむ', value: 'S' },
  },
  {
    id: 10,
    axis: 'SN',
    question: '会話で印象に残りやすいのは？',
    optionA: { label: '実際にあった出来事や細かな描写', value: 'S' },
    optionB: { label: 'たとえ話や今後の広がり', value: 'N' },
  },

  // TF軸（思考/感情）
  {
    id: 11,
    axis: 'TF',
    question: '友達が悩みを相談してきたら、どう対応する？',
    optionA: { label: '解決策を論理的に考える', value: 'T' },
    optionB: { label: 'まず気持ちに寄り添う', value: 'F' },
  },
  {
    id: 12,
    axis: 'TF',
    question: '重要な決断をする時、何を重視する？',
    optionA: { label: '関係者への影響や納得感', value: 'F' },
    optionB: { label: '客観的な基準と筋の通り方', value: 'T' },
  },
  {
    id: 13,
    axis: 'TF',
    question: 'チームで意見が対立した時、どうする？',
    optionA: { label: '論点を整理して合理的な結論を探す', value: 'T' },
    optionB: { label: '関係性が壊れない落とし所を探す', value: 'F' },
  },
  {
    id: 14,
    axis: 'TF',
    question: '人を評価する時、何を見る？',
    optionA: { label: '努力や事情まで含めた姿勢', value: 'F' },
    optionB: { label: '成果・能力・再現性', value: 'T' },
  },
  {
    id: 15,
    axis: 'TF',
    question: 'フィードバックを伝える時、優先しやすいのは？',
    optionA: { label: '改善点を率直に伝えること', value: 'T' },
    optionB: { label: '相手が受け取りやすい形にすること', value: 'F' },
  },

  // JP軸（判断/知覚）
  {
    id: 16,
    axis: 'JP',
    question: '仕事や課題の進め方は？',
    optionA: { label: '計画を立ててから動く', value: 'J' },
    optionB: { label: 'まず始めて、進めながら考える', value: 'P' },
  },
  {
    id: 17,
    axis: 'JP',
    question: '急な予定変更が起きた時、近い反応は？',
    optionA: { label: '新しい選択肢が増えたと捉えやすい', value: 'P' },
    optionB: { label: '立て直すまで少し落ち着かない', value: 'J' },
  },
  {
    id: 18,
    axis: 'JP',
    question: '締め切りが決まっている課題、どう進める？',
    optionA: { label: '早めに区切って安心したい', value: 'J' },
    optionB: { label: '締め切り前の集中力で仕上げたい', value: 'P' },
  },
  {
    id: 19,
    axis: 'JP',
    question: '机や作業スペースの状態は？',
    optionA: { label: '必要なものが手に届くなら多少流動的でいい', value: 'P' },
    optionB: { label: '定位置がある方が落ち着く', value: 'J' },
  },
  {
    id: 20,
    axis: 'JP',
    question: '休日の過ごし方は？',
    optionA: { label: 'やりたいことをある程度決めておく', value: 'J' },
    optionB: { label: 'その日の気分で決める余地を残す', value: 'P' },
  },
];

export const DIAGNOSIS_QUESTION_COUNT = mbtiQuestions.length;

export function calculateMbti(answers: Record<number, string>): string {
  const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const value of Object.values(answers)) {
    counts[value] = (counts[value] || 0) + 1;
  }

  return (
    (counts.E >= counts.I ? 'E' : 'I') +
    (counts.S >= counts.N ? 'S' : 'N') +
    (counts.T >= counts.F ? 'T' : 'F') +
    (counts.J >= counts.P ? 'J' : 'P')
  );
}

export function shuffleQuestions(): MbtiQuestion[] {
  const shuffled = [...mbtiQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
