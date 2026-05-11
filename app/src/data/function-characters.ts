export interface TopicItem {
  title: string;
  content: string;
}

export interface Topic {
  id: string;
  emoji: string;
  title: string;
  summary: string;
  items: TopicItem[];
}

export interface FunctionCharacter {
  id: string;
  functionCode: string;
  functionName: string;
  name: string;
  role: string;
  roleLabel: string;
  emoji: string;
  color: string;
  colorLight: string;
  tagline: string;
  speechBubble: string;
  topics: Topic[];
}

const functionDefs: Record<string, Omit<FunctionCharacter, 'role' | 'roleLabel'>> = {
  Ni: {
    id: 'ni',
    functionCode: 'Ni',
    functionName: '内向直感',
    name: 'ニコ',
    emoji: '🔮',
    color: '#7C3AED',
    colorLight: '#EDE9FE',
    tagline: '未来を見通す導き手',
    speechBubble: '最近、将来のことばかり考えてない？少し深呼吸してみない？',
    topics: [
      {
        id: 'ni-vision',
        emoji: '🔭',
        title: '将来のビジョン',
        summary: 'あなたのNiが描く未来像について',
        items: [
          { title: '未来のパターン', content: 'Niは無意識に情報を集め、未来のパターンを見抜きます。あなたが「なんとなくわかる」と感じるのはNiの働きです。' },
          { title: '長期計画のコツ', content: 'Niが強い人は数年先を見通せますが、少し先のステップに集中すると成功率が上がります。' },
          { title: 'ビジョンの共有', content: '頭の中にある未来像を言葉にして人に伝えることで、より具体的なアクションに繋がります。' },
        ],
      },
      {
        id: 'ni-insight',
        emoji: '💭',
        title: '深い洞察',
        summary: 'Niがもたらす深い理解について',
        items: [
          { title: '直感の正体', content: 'Niの直感は「何か」ではなく、長期間蓄積した情報が瞬間的に結びついた結果です。あなたの直感はデータに基づいています。' },
          { title: '行動への変換', content: 'インサイトが湧いたら、すぐメモしましょう。Niの洞察は一瞬で消えることもあります。' },
        ],
      },
      {
        id: 'ni-challenge',
        emoji: '🌊',
        title: 'Niの課題',
        summary: '主機能ならではの落とし穴',
        items: [
          { title: '考えすぎ', content: 'Niが強いと考えがループしがちです。「70%わかったら動く」を意識してみてください。' },
          { title: '今を楽しむ', content: '未来ばかり見て今を逃す傾向があります。五感で「今」を感じる練習も大切です。' },
        ],
      },
    ],
  },
  Ne: {
    id: 'ne',
    functionCode: 'Ne',
    functionName: '外向直感',
    name: 'カイ',
    emoji: '🌀',
    color: '#F59E0B',
    colorLight: '#FEF3C7',
    tagline: '可能性を広げる探求者',
    speechBubble: 'ねえ、このアイデアどう？それ以外にも10個くらい思いついたんだけど！',
    topics: [
      {
        id: 'ne-possibility',
        emoji: '💡',
        title: '可能性の広がり',
        summary: 'Neが見つける無限の可能性',
        items: [
          { title: 'アイデアの連鎖', content: 'Neは一つの事実から無限の可能性を広げます。あなたが「これもできるかも」と次々思いつくのはNeの賜物です。' },
          { title: 'ブレインストーミング', content: 'Neが強い人は制限なしに考えるのが得意。まず量を出してから質を絞るのがコツです。' },
        ],
      },
      {
        id: 'ne-creativity',
        emoji: '🎨',
        title: '創造性を解放',
        summary: 'Neの創造的な力',
        items: [
          { title: '一見無関係なものを繋ぐ', content: 'Neは一見関係ない概念同士を結びつける天才です。これがイノベーションの源になります。' },
          { title: '創造的活動の推奨', content: 'Neを活かすには、定期的に新しい体験を取り入れることが重要です。いつもと違う道を通るだけでも効果的。' },
        ],
      },
      {
        id: 'ne-challenge',
        emoji: '🎯',
        title: 'Neの課題',
        summary: '可能性を絞る難しさ',
        items: [
          { title: '選択の迷い', content: 'Neは可能性が多すぎて一つに絞るのが苦手です。「これをやらない」ことも戦略の一部です。' },
          { title: '完遂の難しさ', content: '新しいことにワクワクする反面、途中で飽きる傾向が。最初の3日だけでなく、30日続けることを目標に。' },
        ],
      },
    ],
  },
  Si: {
    id: 'si',
    functionCode: 'Si',
    functionName: '内向感覚',
    name: 'シロ',
    emoji: '📚',
    color: '#10B981',
    colorLight: '#D1FAE5',
    tagline: '過去から学ぶ記録者',
    speechBubble: '前もこういう時あったよね？あの時どうしたっけ…覚えておこう',
    topics: [
      {
        id: 'si-memory',
        emoji: '🧠',
        title: '記憶の仕組み',
        summary: 'Siが蓄積する経験のデータベース',
        items: [
          { title: '身体が覚えている', content: 'Siは単なる記憶ではなく、身体感覚と結びついた経験の蓄積です。「なんか違う」と感じるのはSiの警告です。' },
          { title: 'ルーティンの力', content: 'Siが強い人は日課や習慣が安定の源。小さなルーティンを作ることで、大きなパフォーマンス向上に繋がります。' },
        ],
      },
      {
        id: 'si-detail',
        emoji: '🔍',
        title: '細部へのこだわり',
        summary: 'Siが捉える精密なディテール',
        items: [
          { title: '変化に気づく', content: 'Siは微妙な変化に敏感です。環境の小さな変化に気づくのはSiの強み。' },
          { title: '品質の担保', content: 'Siがいると品質が安定します。過去の成功パターンを再現する能力は、チームにおいて非常に重要です。' },
        ],
      },
    ],
  },
  Se: {
    id: 'se',
    functionCode: 'Se',
    functionName: '外向感覚',
    name: 'セナ',
    emoji: '⚡',
    color: '#EF4444',
    colorLight: '#FEE2E2',
    tagline: '今を生きる冒険者',
    speechBubble: 'たまには五感で楽しもうよ！美味しいもの食べた？いい天気だし散歩しない？',
    topics: [
      {
        id: 'se-senses',
        emoji: '🖐️',
        title: '五感を研ぎ澄ます',
        summary: 'Seが感じる今この瞬間',
        items: [
          { title: '今を感じる練習', content: 'Seが弱い人は頭の中で生きがちです。30秒だけ周りの音に耳を澄ませてみてください。それがSeのトレーニングです。' },
          { title: '身体感覚の重要性', content: '身体の感覚は心の状態と直結しています。肩が凝っているなら、それはサインかもしれません。' },
        ],
      },
      {
        id: 'se-action',
        emoji: '🏃',
        title: '即興的な行動',
        summary: 'Seがもたらす spontaneity',
        items: [
          { title: '計画を手放す', content: 'Seが強い人は今の状況に即座に反応できます。たまには「行き当たりばったり」も悪くありません。' },
          { title: '新しい体験', content: 'Seを鍛えるには新しい感覚体験が最適。今まで食べたことのないもの、行ったことのない場所に挑戦してみて。' },
        ],
      },
    ],
  },
  Ti: {
    id: 'ti',
    functionCode: 'Ti',
    functionName: '内向思考',
    name: 'レン',
    emoji: '🔬',
    color: '#3B82F6',
    colorLight: '#DBEAFE',
    tagline: '真理を探る分析者',
    speechBubble: 'それって本当にそうかな？論理的に分解して考えてみようよ',
    topics: [
      {
        id: 'ti-logic',
        emoji: '🧩',
        title: '論理の分解',
        summary: 'Tiが追求する根本的な理解',
        items: [
          { title: 'なぜを深掘りする', content: 'Tiは「なぜ？」を何度も繰り返すことで本質に近づきます。あなたの「違和感」はTiが矛盾を検知したサインです。' },
          { title: 'フレームワークの構築', content: 'Tiは物事を整理整頓するのが得意。独自のルールやフレームワークを作ることで、複雑な問題も解きやすくなります。' },
        ],
      },
      {
        id: 'ti-independent',
        emoji: '🏗️',
        title: '独立した思考',
        summary: 'Tiが守る自分なりの論理',
        items: [
          { title: '自分の基準を持つ', content: 'Tiは他人の意見より自分の論理を優先します。これは強みですが、他者の視点も取り入れるとより強固な論理になります。' },
          { title: '完璧主義の罠', content: 'Tiは理解が完璧になるまで動けない傾向が。「8割わかったら試す」ことも大事です。' },
        ],
      },
    ],
  },
  Te: {
    id: 'te',
    functionCode: 'Te',
    functionName: '外向思考',
    name: 'テル',
    emoji: '📊',
    color: '#0EA5E9',
    colorLight: '#E0F2FE',
    tagline: '実行に移す戦略家',
    speechBubble: '計画は完璧！さあ、次は実行するだけだよ。手順を整理しよう',
    topics: [
      {
        id: 'te-execute',
        emoji: '🚀',
        title: '効率的な実行',
        summary: 'Teが最適化するプロセス',
        items: [
          { title: 'システム思考', content: 'Teは物事をシステムとして捉え、非効率を排除します。あなたが「もっと効率よくできる」と思うのはTeの働きです。' },
          { title: '優先順位の付け方', content: 'Teは「何が一番効果的か」を見抜きます。毎朝3つの最優先タスクを決めるだけで生産性が劇的に上がります。' },
        ],
      },
      {
        id: 'te-impact',
        emoji: '📈',
        title: '結果とインパクト',
        summary: 'Teが重視する成果',
        items: [
          { title: '測定可能な目標', content: 'Teは数値化できる目標が好きです。「もっと良くする」より「先月比20%UP」のような具体性が重要です。' },
          { title: 'チームの力', content: 'Teは他者を動かす力もあります。明確な指示と期待を伝えることで、チーム全体の成果を引き上げられます。' },
        ],
      },
    ],
  },
  Fi: {
    id: 'fi',
    functionCode: 'Fi',
    functionName: '内向感情',
    name: 'フィル',
    emoji: '🌙',
    color: '#EC4899',
    colorLight: '#FCE7F3',
    tagline: '心の声を聴く詩人',
    speechBubble: '本当はどうしたいの？自分の気持ちに正直になってみよう',
    topics: [
      {
        id: 'fi-values',
        emoji: '💎',
        title: '自分の価値観',
        summary: 'Fiが大切にする内なる基準',
        items: [
          { title: '心の羅針盤', content: 'Fiは「これが大事」という自分なりの基準を持っています。迷った時は心に聞いてみてください。答えはすでに中にあります。' },
          { title: 'アンフェアへの敏感さ', content: 'Fiは不正義に敏感です。「これは違う」と感じる時、それはFiがあなたの価値観を守ろうとしているサインです。' },
        ],
      },
      {
        id: 'fi-empathy',
        emoji: '🤝',
        title: '深い共感',
        summary: 'Fiが届ける本物の理解',
        items: [
          { title: '言葉の裏を読む', content: 'Fiは他人の感情の機微を敏感に察知します。相手が言わなかったことにも気づけるのがFiの強みです。' },
          { title: '感情を大切に', content: 'Fiが弱い人は感情を無視しがちです。毎日5分でいいので「今どう感じてる？」と自分に聞いてみてください。' },
        ],
      },
    ],
  },
  Fe: {
    id: 'fe',
    functionCode: 'Fe',
    functionName: '外向感情',
    name: 'アキ',
    emoji: '🌸',
    color: '#F472B6',
    colorLight: '#FBCFE8',
    tagline: '繋がりを紡ぐ調停者',
    speechBubble: 'みんなの雰囲気どうかな？空気読んで調和取るの得意なんだ',
    topics: [
      {
        id: 'fe-harmony',
        emoji: '🎵',
        title: '調和を守る',
        summary: 'Feが感じ取る場の空気',
        items: [
          { title: '感情のレーダー', content: 'Feは部屋に入った瞬間に空気を読めます。この能力は人間関係において強力な武器になります。' },
          { title: '共感の表現', content: 'Feは適切なタイミングで適切な共感を示すのが得意。相手の感情に寄り添うことで信頼関係を築けます。' },
        ],
      },
      {
        id: 'fe-support',
        emoji: '🌟',
        title: '人を支える力',
        summary: 'Feが生み出す居場所',
        items: [
          { title: 'コミュニティの形成', content: 'Feが強い人は人を集め、居心地の良い場を作るのが得意です。あなたがいるだけで場が和むのはFeの力です。' },
          { title: '自分も大切に', content: 'Feは他人を優先しすぎる傾向があります。自分の感情にも同じくらい配慮することが長続きの秘訣です。' },
        ],
      },
    ],
  },
};

type FunctionStack = [string, string, string, string];

const mbtiFunctionStacks: Record<string, FunctionStack> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
};

const shadowFunctions: Record<string, string> = {
  Ni: 'Ne', Ne: 'Ni',
  Si: 'Se', Se: 'Si',
  Ti: 'Te', Te: 'Ti',
  Fi: 'Fe', Fe: 'Fi',
};

const roleLabels: Record<number, string> = {
  0: '主機能',
  1: '補助機能',
  2: '第三機能',
  3: '劣等機能',
  4: 'シャドウ①',
  5: 'シャドウ②',
};

export function getFunctionCharacters(mbtiType: string): FunctionCharacter[] {
  const stack = mbtiFunctionStacks[mbtiType] || mbtiFunctionStacks['INTJ'];
  const characters: FunctionCharacter[] = [];

  stack.forEach((funcCode, index) => {
    const def = functionDefs[funcCode];
    if (def) {
      characters.push({
        ...def,
        role: ['dominant', 'auxiliary', 'tertiary', 'inferior'][index],
        roleLabel: roleLabels[index],
      });
    }
  });

  const shadow1 = shadowFunctions[stack[0]];
  const shadow2 = shadowFunctions[stack[1]];
  [shadow1, shadow2].forEach((funcCode, i) => {
    if (!stack.includes(funcCode)) {
      const def = functionDefs[funcCode];
      if (def) {
        characters.push({
          ...def,
          role: 'shadow',
          roleLabel: roleLabels[4 + i],
        });
      }
    }
  });

  return characters;
}
