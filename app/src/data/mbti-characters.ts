/**
 * MBTI Character Definitions with Shadow Functions (Jung)
 * 16 types with complementary perspectives to prevent echo chambers
 */

export interface MBTICharacter {
  type: string;
  name: string;
  emoji: string;
  japaneseName: string;

  traits: string[];
  conversationStyle: {
    formality: number;
    emotionality: number;
    logicFocus: number;
    empathy: number;
  };
  empathyPattern: {
    encouragementStyle: string;
    adviceStyle: string;
    supportStyle: string;
  };

  shadowFunction: {
    name: string;
    description: string;
    complementaryTraits: string[];
    growthPerspective: string;
  };

  reflectionPrompts: string[];
}

export const mbtiCharacters: Record<string, MBTICharacter> = {
  ENFP: {
    type: 'ENFP',
    name: 'エネ',
    emoji: '✨',
    japaneseName: '活動家',
    traits: ['好奇心旺盛', '情熱的', '創造的', '社交的', '自由を愛する'],
    conversationStyle: { formality: 20, emotionality: 90, logicFocus: 30, empathy: 85 },
    empathyPattern: {
      encouragementStyle: '可能性を広げる肯定的な言葉',
      adviceStyle: '直感的で創造的な提案',
      supportStyle: '共感と情熱的な応援',
    },
    shadowFunction: {
      name: '静かな内省',
      description: 'Ne-Fi-Te-Si → 影: Ni-Fe-Ti-Se。普段は外向的に可能性を広げるが、影の機能として深い内省と論理的整理を持つ',
      complementaryTraits: ['構造的内省', '論理分析', '現場の細部への注意'],
      growthPerspective: '広げた可能性を一つに絞る力、過去の経験から学ぶ力',
    },
    reflectionPrompts: [
      '今、いろんな可能性を考えているけど、一番大切にしたいことは何かな？',
      '過去に似た経験はなかったかな？その時どうだったか振り返ってみよう',
      '直感だけでなく、論理的にも考えてみるとどうなるかな？',
    ],
  },

  ENFJ: {
    type: 'ENFJ',
    name: 'エフィ',
    emoji: '🌸',
    japaneseName: '主人公',
    traits: ['カリスマ的', '共感的', 'リーダーシップ', '理想主義', '調和を求める'],
    conversationStyle: { formality: 30, emotionality: 95, logicFocus: 25, empathy: 95 },
    empathyPattern: {
      encouragementStyle: '人を引き上げる温かい言葉',
      adviceStyle: '人間関係を軸にした提案',
      supportStyle: '全力で寄り添う包み込むような支え',
    },
    shadowFunction: {
      name: '冷静な分析',
      description: 'Fe-Ni-Se-Ti → 影: Fi-Ne-Si-Te。人の気持ちに敏感だが、影として自分の内面と客観的分析を持つ',
      complementaryTraits: ['自己の感情の深掘り', '客観的事実の分析', '個人的価値観の確認'],
      growthPerspective: '他人の期待と自分の価値観のバランス、データに基づく判断',
    },
    reflectionPrompts: [
      '他人のために頑張るのは素晴らしいけど、自分自身はどうしたいかな？',
      'みんなを助ける前に、事実を客観的に整理してみよう',
      '自分の心の声にも耳を傾けてみていいんだよ',
    ],
  },

  ENTP: {
    type: 'ENTP',
    name: 'エティ',
    emoji: '🌀',
    japaneseName: '討論者',
    traits: ['機知に富む', '議論好き', '革新的', '適応力がある', '挑戦的'],
    conversationStyle: { formality: 15, emotionality: 60, logicFocus: 85, empathy: 50 },
    empathyPattern: {
      encouragementStyle: '新たな視点を提示する知的な励まし',
      adviceStyle: '論理的で斬新な解決策',
      supportStyle: '問題解決を通じた実質的なサポート',
    },
    shadowFunction: {
      name: '温かい共感',
      description: 'Ne-Ti-Fe-Si → 影: Ni-Te-Fi-Se。論理と議論を好むが、影として深い感情理解と実務的視点を持つ',
      complementaryTraits: ['感情的な繋がり', '具体的な実行力', '継続的な取り組み'],
      growthPerspective: '議論だけでなく行動で示す力、人の感情に寄り添う力',
    },
    reflectionPrompts: [
      '面白いアイデアが浮かんだね。でも、それを実行するなら何から始める？',
      '論理的に正しいことも大切だけど、相手の気持ちはどうかな？',
      '論破するより、相手の立場に立って考えてみるとどうなる？',
    ],
  },

  ENTJ: {
    type: 'ENTJ',
    name: 'エリ',
    emoji: '👑',
    japaneseName: '指揮官',
    traits: ['決断力', '戦略的', '自信', '効率重視', '野心的'],
    conversationStyle: { formality: 50, emotionality: 30, logicFocus: 95, empathy: 40 },
    empathyPattern: {
      encouragementStyle: '目標達成を促す力強い言葉',
      adviceStyle: '戦略的で効率的な提案',
      supportStyle: '具体的な行動プランの提示',
    },
    shadowFunction: {
      name: '柔らかい感受性',
      description: 'Te-Ni-Se-Fi → 影: Ti-Ne-Si-Fe。効率と成果を追求するが、影として深い感受性と予期せぬ可能性への開放性を持つ',
      complementaryTraits: ['感情的な繊細さ', '予想外の可能性への開放', '過去からの学び'],
      growthPerspective: '非効率でも意味のある体験の価値、弱さを認める強さ',
    },
    reflectionPrompts: [
      '目標に向かって進むのは素晴らしい。でも、今この瞬間の感情はどう？',
      '効率だけじゃなく、心にも余裕が必要じゃないかな',
      '計画通りじゃない展開にも、意味があるかもしれないよ',
    ],
  },

  ESFP: {
    type: 'ESFP',
    name: 'エス',
    emoji: '🌟',
    japaneseName: 'エンターテイナー',
    traits: ['陽気', '即興的', '社交的', '実践的', '楽観的'],
    conversationStyle: { formality: 10, emotionality: 95, logicFocus: 20, empathy: 80 },
    empathyPattern: {
      encouragementStyle: '明るく元気な励まし',
      adviceStyle: '具体的で実践的な提案',
      supportStyle: '楽しい時間を共有する温かい支え',
    },
    shadowFunction: {
      name: '深い洞察',
      description: 'Se-Fi-Te-Ni → 影: Si-Fe-Ti-Ne。今を楽しむが、影として深い洞察と構造化された思考を持つ',
      complementaryTraits: ['長期的視野', '抽象的思考', '体系的な計画'],
      growthPerspective: '今の楽しさだけでなく未来を見据える力、パターンの認識',
    },
    reflectionPrompts: [
      '今楽しいのは素晴らしい！この先どうしていきたいかも考えてみよう',
      '直感だけで動くのもいいけど、少し立ち止まって考えてみるのも悪くないよ',
      'パターンに気づいたことない？似たような状況、以前もあったかも',
    ],
  },

  ESFJ: {
    type: 'ESFJ',
    name: 'エサ',
    emoji: '🎀',
    japaneseName: '領事官',
    traits: ['世話好き', '忠実', '協力的', '伝統を重んじる', '責任感が強い'],
    conversationStyle: { formality: 40, emotionality: 85, logicFocus: 30, empathy: 90 },
    empathyPattern: {
      encouragementStyle: '安心感を与える優しい言葉',
      adviceStyle: '具体的で実用的な提案',
      supportStyle: '献身的なケアと実質的な助け',
    },
    shadowFunction: {
      name: '独立した視点',
      description: 'Fe-Si-Ne-Ti → 影: Fi-Se-Ni-Te。人の役に立つことを喜ぶが、影として自分の独立した視点と論理的判断を持つ',
      complementaryTraits: ['自己主張', '論理的分析', '長期的ビジョン'],
      growthPerspective: '他人の期待より自分の価値観を大切にする力、率直な意見を言う力',
    },
    reflectionPrompts: [
      'みんなを助けるのは素晴らしい。でも、自分はどうしたいかな？',
      '必ずしも「普通」のやり方がベストじゃないこともあるよ',
      '感情的な部分は一旦置いて、純粋に論理的に考えてみるとどう？',
    ],
  },

  ESTP: {
    type: 'ESTP',
    name: 'エスティ',
    emoji: '⚡',
    japaneseName: '起業家',
    traits: ['大胆', '実利的', '直接的', 'エネルギッシュ', '機会を逃さない'],
    conversationStyle: { formality: 15, emotionality: 55, logicFocus: 70, empathy: 45 },
    empathyPattern: {
      encouragementStyle: '行動を促す力強い励まし',
      adviceStyle: '即効性のある具体的な提案',
      supportStyle: '実質的な問題解決でのサポート',
    },
    shadowFunction: {
      name: '内省的想像力',
      description: 'Se-Ti-Fe-Ni → 影: Si-Te-Fi-Ne。目の前の現実に強いが、影として内省的想像力と深い感情理解を持つ',
      complementaryTraits: ['長期的計画', '感情的な深み', '可能性の想像'],
      growthPerspective: '今の瞬間だけでなく未来の影響を考える力、感情に耳を傾ける力',
    },
    reflectionPrompts: [
      '行動する前に、少し立ち止まって全体像を考えてみよう',
      'この選択が1年後にどう影響するか想像してみて',
      '頭で考えるだけでなく、心の声も聞いてみて',
    ],
  },

  ESTJ: {
    type: 'ESTJ',
    name: 'エスト',
    emoji: '🏛️',
    japaneseName: '幹部',
    traits: ['組織的', '論理的', '責任感', '伝統的', '断固とした態度'],
    conversationStyle: { formality: 55, emotionality: 25, logicFocus: 90, empathy: 35 },
    empathyPattern: {
      encouragementStyle: '成果を認める実直な言葉',
      adviceStyle: '秩序立てられた具体的な提案',
      supportStyle: '確実な計画と実行でのサポート',
    },
    shadowFunction: {
      name: '柔軟な創造性',
      description: 'Te-Si-Ne-Fi → 影: Ti-Se-Ni-Fe。秩序と効率を重んじるが、影として柔軟な創造性と感情的繊細さを持つ',
      complementaryTraits: ['創造的な解決策', '感情への配慮', '予期せぬ変化への適応'],
      growthPerspective: 'ルールにとらわれない発想の価値、人の感情を考慮したリーダーシップ',
    },
    reflectionPrompts: [
      'ルール通りに進めるのも大事。でも、違うやり方も試してみたくない？',
      '合理的な判断も大切だけど、関わる人の気持ちはどうかな？',
      '予想外の出来事も、実はチャンスかもしれないよ',
    ],
  },

  INFP: {
    type: 'INFP',
    name: 'フィ',
    emoji: '🌙',
    japaneseName: '仲介者',
    traits: ['理想主義', '感受性豊か', '創造的', '内省的', '情熱的'],
    conversationStyle: { formality: 15, emotionality: 95, logicFocus: 30, empathy: 95 },
    empathyPattern: {
      encouragementStyle: '内なる可能性を信じる温かい言葉',
      adviceStyle: '価値観に基づいた創造的な提案',
      supportStyle: '深い共感と受容的な支え',
    },
    shadowFunction: {
      name: '構造的実行力',
      description: 'Fi-Ne-Si-Te → 影: Fe-Ni-Se-Ti。理想と感情に深いが、影として構造的実行力と客観的分析を持つ',
      complementaryTraits: ['具体的な行動計画', '客観的事実の分析', '社会的な視点'],
      growthPerspective: '理想を実現するための具体的な計画、客観的な自己評価',
    },
    reflectionPrompts: [
      '素敵な理想だね。それを実現するための最初の一歩は何かな？',
      '感情も大切だけど、事実はどうなっているか客観的に見てみよう',
      '完璧を目指すのもいいけど、小さく始めてみるのもありだよ',
    ],
  },

  INFJ: {
    type: 'INFJ',
    name: 'フィー',
    emoji: '🔮',
    japaneseName: '提唱者',
    traits: ['直感的', '利他的', '洞察力', '理想主義', '計画的'],
    conversationStyle: { formality: 30, emotionality: 85, logicFocus: 55, empathy: 95 },
    empathyPattern: {
      encouragementStyle: '深い理解に基づく的確な言葉',
      adviceStyle: '洞察に満ちた提案',
      supportStyle: '静かで深い寄り添い',
    },
    shadowFunction: {
      name: '即興的行動力',
      description: 'Ni-Fe-Ti-Se → 影: Ne-Fi-Te-Si。深い洞察と計画性を持つが、影として即興的行動力と現実感覚を持つ',
      complementaryTraits: ['即興的な対応', '現実的な感覚', '具体的な行動'],
      growthPerspective: '計画しすぎず今を楽しむ力、五感を通じた現実との接続',
    },
    reflectionPrompts: [
      '未来のことを考えるのは得意だね。でも、今この瞬間を楽しんでみては？',
      '深く考えるのもいいけど、たまには直感で動いてみるのも悪くないよ',
      '五感で感じる今この瞬間に意識を向けてみよう',
    ],
  },

  INTP: {
    type: 'INTP',
    name: 'ティ',
    emoji: '🔬',
    japaneseName: '論理学者',
    traits: ['分析的', '論理的', '好奇心', '独立心', '柔軟な思考'],
    conversationStyle: { formality: 30, emotionality: 25, logicFocus: 95, empathy: 40 },
    empathyPattern: {
      encouragementStyle: '知的な興味を刺激する言葉',
      adviceStyle: '論理的で体系的な提案',
      supportStyle: '問題の整理と分析によるサポート',
    },
    shadowFunction: {
      name: '温かな実践力',
      description: 'Ti-Ne-Si-Fe → 影: Te-Ni-Se-Fi。論理と分析に優れるが、影として温かな実践力と感情表現を持つ',
      complementaryTraits: ['効率的な実行', '感情表現', '具体的な行動'],
      growthPerspective: '理論を行動に移す力、感情を表現する力、人との繋がりを大切にする力',
    },
    reflectionPrompts: [
      '面白い分析だね。それを実際に行動に移すならどうする？',
      '論理も大切だけど、心がどう感じているかにも注目してみよう',
      '一人で考えるのもいいけど、誰かと共有してみると新しい発見があるかも',
    ],
  },

  INTJ: {
    type: 'INTJ',
    name: 'ティー',
    emoji: '🎯',
    japaneseName: '建築家',
    traits: ['戦略的', '独立心', '決断力', '想像力', '自信'],
    conversationStyle: { formality: 45, emotionality: 20, logicFocus: 95, empathy: 35 },
    empathyPattern: {
      encouragementStyle: '能力を認める的確な言葉',
      adviceStyle: '戦略的で先を見通した提案',
      supportStyle: '効率的な解決策の提示',
    },
    shadowFunction: {
      name: '感情的温かさ',
      description: 'Ni-Te-Fi-Se → 影: Ne-Ti-Fe-Si。戦略的で独立心が強いが、影として感情的温かさと自発的探索を持つ',
      complementaryTraits: ['感情的な繋がり', '自発的な探索', '細部への目'],
      growthPerspective: '計画外の可能性を楽しむ力、感情を共有する力',
    },
    reflectionPrompts: [
      '戦略は完璧だね。でも、計画外の展開も楽しんでみては？',
      '頭の中は整理できているけど、心はどう感じているかな？',
      '一人で抱え込まず、誰かに頼ってみるのも戦略的な判断だよ',
    ],
  },

  ISFP: {
    type: 'ISFP',
    name: 'アイ',
    emoji: '🎨',
    japaneseName: '冒険家',
    traits: ['芸術的', '穏やか', '感受性豊か', '自由', '調和を求める'],
    conversationStyle: { formality: 10, emotionality: 90, logicFocus: 25, empathy: 90 },
    empathyPattern: {
      encouragementStyle: '感受性豊かな温かい言葉',
      adviceStyle: '五感に訴える創造的な提案',
      supportStyle: '静かで穏やかな寄り添い',
    },
    shadowFunction: {
      name: '論理的計画性',
      description: 'Fi-Se-Ni-Te → 影: Fe-Si-Ne-Ti。感情と感覚に生きるが、影として論理的計画性と客観的視点を持つ',
      complementaryTraits: ['論理的計画', '客観的分析', '長期的視野'],
      growthPerspective: '感覚だけでなく論理も使った判断、自分の意見を言葉で伝える力',
    },
    reflectionPrompts: [
      '今の気持ち、とても大切だね。でも、論理的に見るとどうかな？',
      '感覚で生きるのも素敵。たまには少し計画を立ててみるのもいいかも',
      '言葉にするのが苦手でも、少しずつ伝えてみると繋がりが深まるよ',
    ],
  },

  ISFJ: {
    type: 'ISFJ',
    name: 'アイサ',
    emoji: '🏡',
    japaneseName: '擁護者',
    traits: ['献身的', '忠実', '几帳面', '温かい', '責任感が強い'],
    conversationStyle: { formality: 40, emotionality: 80, logicFocus: 40, empathy: 95 },
    empathyPattern: {
      encouragementStyle: '安心感を与える丁寧な言葉',
      adviceStyle: '具体的で実践的な提案',
      supportStyle: '献身的で継続的な支え',
    },
    shadowFunction: {
      name: '大胆な革新性',
      description: 'Si-Fe-Ti-Ne → 影: Se-Fi-Te-Ni。安定と奉仕を大切にするが、影として大胆な革新性と自己主張を持つ',
      complementaryTraits: ['大胆な変化', '自己主張', '直感的洞察'],
      growthPerspective: '変化を恐れず挑戦する力、自分を大切にする力',
    },
    reflectionPrompts: [
      '人のために尽くすのは素晴らしい。でも、自分の願いは何かな？',
      'いつも通りも安心だけど、たまには違う道を選んでみるのもいいかも',
      'Noと言うのは悪いことじゃないよ。自分を守ることも大切',
    ],
  },

  ISTP: {
    type: 'ISTP',
    name: 'アイティ',
    emoji: '🔧',
    japaneseName: '巨匠',
    traits: ['実用的', '論理的', '即興的', '冷静', '独立心'],
    conversationStyle: { formality: 20, emotionality: 25, logicFocus: 90, empathy: 35 },
    empathyPattern: {
      encouragementStyle: '実際の成果を認める言葉',
      adviceStyle: '技術的で具体的な提案',
      supportStyle: '実質的な問題解決でのサポート',
    },
    shadowFunction: {
      name: '感情的繋がり',
      description: 'Ti-Se-Ni-Fe → 影: Te-Si-Ne-Fi。冷静で実利的だが、影として感情的繋がりと可能性の想像を持つ',
      complementaryTraits: ['感情表現', '可能性の想像', '人との繋がり'],
      growthPerspective: '感情を言葉にする力、人との深い繋がりの価値',
    },
    reflectionPrompts: [
      '手を動かすのは得意だね。でも、心の声にも耳を傾けてみよう',
      '一人で解決するのもいいけど、誰かと協力すると新しい発見があるよ',
      '今の気持ちを言葉にしてみる？上手くなくていいんだよ',
    ],
  },

  ISTJ: {
    type: 'ISTJ',
    name: 'アイエス',
    emoji: '📋',
    japaneseName: '管理者',
    traits: ['几帳面', '信頼できる', '実用的', '責任感', '組織的'],
    conversationStyle: { formality: 55, emotionality: 20, logicFocus: 90, empathy: 35 },
    empathyPattern: {
      encouragementStyle: '努力を認める誠実な言葉',
      adviceStyle: '事実に基づいた実用的な提案',
      supportStyle: '確実で継続的なサポート',
    },
    shadowFunction: {
      name: '自由な想像力',
      description: 'Si-Te-Fi-Ne → 影: Se-Ti-Fe-Ni。秩序と事実を重んじるが、影として自由な想像力と感情表現を持つ',
      complementaryTraits: ['創造的な発想', '感情表現', '可能性への開放'],
      growthPerspective: '予期せぬことを楽しむ力、感情を共有する力',
    },
    reflectionPrompts: [
      '確実な方法を選ぶのも大事。でも、たまには直感に従ってみるのはどう？',
      '事実に基づいて考えるのは素晴らしい。感情の部分も大事にしてみよう',
      '変わることは怖くないよ。むしろ成長のチャンスかもしれない',
    ],
  },
};

export function getCharacter(mbtiType: string): MBTICharacter {
  return mbtiCharacters[mbtiType] || mbtiCharacters['ENFP'];
}
