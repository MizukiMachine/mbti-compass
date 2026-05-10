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
    question: '休日、どう過ごすのが好き？',
    optionA: { label: '友達と出かける', value: 'E' },
    optionB: { label: '家でリラックスする', value: 'I' },
  },
  {
    id: 2,
    axis: 'EI',
    question: 'パーティーに招待されたら？',
    optionA: { label: 'ワクワクする', value: 'E' },
    optionB: { label: 'できれば断りたい', value: 'I' },
  },
  {
    id: 3,
    axis: 'EI',
    question: '仕事や勉強で良いアイデアが浮かんだ時、どうする？',
    optionA: { label: '誰かにすぐ話したくなる', value: 'E' },
    optionB: { label: 'まず一人でじっくり考える', value: 'I' },
  },
  {
    id: 4,
    axis: 'EI',
    question: 'エネルギーが湧いてくるのはどんな時？',
    optionA: { label: '人と一緒にいる時', value: 'E' },
    optionB: { label: '一人で過ごしている時', value: 'I' },
  },
  {
    id: 5,
    axis: 'EI',
    question: '新しい環境に入った時、どうする？',
    optionA: { label: '積極的に話しかける', value: 'E' },
    optionB: { label: '様子を見ながら少しずつ慣れる', value: 'I' },
  },

  // SN軸（感覚/直感）
  {
    id: 6,
    axis: 'SN',
    question: '何かを説明する時、あなたは？',
    optionA: { label: '具体例を上げて説明する', value: 'S' },
    optionB: { label: '全体像や概念から話す', value: 'N' },
  },
  {
    id: 7,
    axis: 'SN',
    question: '将来のことを考える時、どんな考え方が多い？',
    optionA: { label: '現実的に起こりそうことを考える', value: 'S' },
    optionB: { label: 'どんな可能性があるか想像する', value: 'N' },
  },
  {
    id: 8,
    axis: 'SN',
    question: '本を読むならどっち？',
    optionA: { label: '実用書やハウツー本', value: 'S' },
    optionB: { label: '小説や哲学的な本', value: 'N' },
  },
  {
    id: 9,
    axis: 'SN',
    question: '仕事や勉強で大切にするのは？',
    optionA: { label: '確実な方法で確実な結果を出す', value: 'S' },
    optionB: { label: '新しいアプローチを試してみる', value: 'N' },
  },
  {
    id: 10,
    axis: 'SN',
    question: '旅行の計画、どう立てる？',
    optionA: { label: '具体的なスケジュールを組み立てる', value: 'S' },
    optionB: { label: 'ざっくりイメージだけで行く', value: 'N' },
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
    optionA: { label: '客観的なデータと論理', value: 'T' },
    optionB: { label: '自分の価値観と直感', value: 'F' },
  },
  {
    id: 13,
    axis: 'TF',
    question: 'チームで意見が対立した時、どうする？',
    optionA: { label: '正しい意見を論理的に主張する', value: 'T' },
    optionB: { label: 'みんなが納得できる落とし所を探す', value: 'F' },
  },
  {
    id: 14,
    axis: 'TF',
    question: '人を評価する時、何を見る？',
    optionA: { label: '成果と能力', value: 'T' },
    optionB: { label: '努力と人柄', value: 'F' },
  },
  {
    id: 15,
    axis: 'TF',
    question: '批判を受けた時、どう感じる？',
    optionA: { label: '内容が正しければ受け入れる', value: 'T' },
    optionB: { label: '言い方にもよるが基本的に辛い', value: 'F' },
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
    question: '部屋や机の状態は？',
    optionA: { label: '大体整理されている', value: 'J' },
    optionB: { label: '散らかっていることが多い', value: 'P' },
  },
  {
    id: 18,
    axis: 'JP',
    question: '締め切りが決まっている課題、どう進める？',
    optionA: { label: '早めに終わらせる', value: 'J' },
    optionB: { label: 'ギリギリまで粘る', value: 'P' },
  },
  {
    id: 19,
    axis: 'JP',
    question: '旅行や外出の準備、どうする？',
    optionA: { label: '前日に荷物をまとめる', value: 'J' },
    optionB: { label: '当日の朝に詰める', value: 'P' },
  },
  {
    id: 20,
    axis: 'JP',
    question: '急な予定変更、どう感じる？',
    optionA: { label: '予定が崩れてストレス', value: 'J' },
    optionB: { label: '臨機応変に対応できてラク', value: 'P' },
  },
];

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
