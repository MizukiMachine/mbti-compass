import { mbtiCharacters } from './mbti-characters';

export interface TraitCardData {
  id: string;
  label: string;
  emoji: string;
  color: string;
  category: 'strength' | 'tendency' | 'shadow' | 'growth';
  shortDescription: string;
  longDescription: string;
  relatedFunctions: string[];
}

const functionColors: Record<string, string> = {
  Ni: '#7C3AED',
  Ne: '#F59E0B',
  Si: '#10B981',
  Se: '#EF4444',
  Ti: '#3B82F6',
  Te: '#0EA5E9',
  Fi: '#EC4899',
  Fe: '#F472B6',
};

type TraitDef = { emoji: string; shortDescription: string; longDescription: string; relatedFunctions: string[] };

const coreTraitCatalog: Record<string, TraitDef> = {
  // Ni-related
  '直感的': {
    emoji: '🔮', shortDescription: '直感で本質を見抜く力',
    longDescription: '表面的な情報から背後にあるパターンや本質を瞬時に見抜く能力。論理的な分析を飛び越えて答えにたどり着くことができます。',
    relatedFunctions: ['Ni'],
  },
  '洞察力': {
    emoji: '👁️', shortDescription: '深く見通す観察眼',
    longDescription: '他の人が見逃す微細な手がかりから、全体像や背後にある意図を読み取る力。人や状況の本質を素早く理解します。',
    relatedFunctions: ['Ni'],
  },
  '戦略的': {
    emoji: '♟️', shortDescription: '長期的視点で計画を立てる',
    longDescription: '複数の変数を考慮しながら、最も効果的な道筋を設計する能力。目標達成のための最適な戦略を自然に構築できます。',
    relatedFunctions: ['Ni', 'Te'],
  },
  '計画的': {
    emoji: '📅', shortDescription: '順序立てて準備を進める',
    longDescription: '目標に向かって具体的なステップを組み立て、着実に実行していく力。先を見越した準備で予期せぬ事態にも対応できます。',
    relatedFunctions: ['Ni', 'Si'],
  },

  // Ne-related
  '好奇心旺盛': {
    emoji: '🌟', shortDescription: '常に新しいものを求める',
    longDescription: '未知の分野やアイデアに対して強い興味を持ち、積極的に探索する性質。学びの喜びを原動力に成長し続けます。',
    relatedFunctions: ['Ne'],
  },
  '創造的': {
    emoji: '🎨', shortDescription: '独創的なアイデアを生み出す',
    longDescription: '既存の枠にとらわれず、新しい組み合わせや発想で斬新な解決策を生み出す能力。想像力を通じて世界を豊かにします。',
    relatedFunctions: ['Ne', 'Fi'],
  },
  '自由を愛する': {
    emoji: '🦋', shortDescription: '束縛を嫌い自由を大切にする',
    longDescription: '自分のペースと選択の自由を何よりも大切にする性質。制約のない環境でこそ最高のパフォーマンスを発揮します。',
    relatedFunctions: ['Ne', 'Fi'],
  },
  '機知に富む': {
    emoji: '💡', shortDescription: '頭の回転が速くユーモアがある',
    longDescription: '状況に応じて素早く適切な反応やユーモアを繰り出す能力。会話に知的なスパイスを加え、周囲を楽しませます。',
    relatedFunctions: ['Ne', 'Ti'],
  },
  '革新的': {
    emoji: '🚀', shortDescription: '新しいやり方で変革をもたらす',
    longDescription: '現状に満足せず、常に改善や革新を追求する性質。常識を覆すアイデアで周囲に変化をもたらします。',
    relatedFunctions: ['Ne'],
  },
  '好奇心': {
    emoji: '🔍', shortDescription: '知りたいという純粋な欲求',
    longDescription: '「なぜ？」「どうなっているの？」という問いを持ち続ける性質。探究心が深い知識と理解の土台になります。',
    relatedFunctions: ['Ne', 'Ti'],
  },
  '想像力': {
    emoji: '🌈', shortDescription: '豊かな心の風景を描く',
    longDescription: '目に見えない可能性や世界を心の中に鮮やかに描き出す力。創造的な活動や問題解決の源泉になります。',
    relatedFunctions: ['Ne', 'Ni'],
  },
  '自由': {
    emoji: '🕊️', shortDescription: '自分らしさを大切にする',
    longDescription: '型にはまらない生き方を好み、自分の価値観に従って行動する性質。独立した精神が独自の視点を生みます。',
    relatedFunctions: ['Ne', 'Fi'],
  },
  '適応力がある': {
    emoji: '🌊', shortDescription: 'どんな環境でも柔軟に対応',
    longDescription: '変化する状況に素早く対応し、新しい環境でも力を発揮できる能力。予期せぬ事態でも冷静に対処できます。',
    relatedFunctions: ['Ne', 'Se'],
  },
  '柔軟な思考': {
    emoji: '🧩', shortDescription: '多角的な視点で考えられる',
    longDescription: '一つの考えに固執せず、複数の視点から物事を捉え直す能力。新しい情報に基づいて思考を柔軟に更新できます。',
    relatedFunctions: ['Ne', 'Ti'],
  },

  // Si-related
  '忠実': {
    emoji: '🤝', shortDescription: '約束と関係を大切にする',
    longDescription: '一度築いた信頼関係を何よりも大切にし、約束を守り抜く性質。周囲の人から深く信頼される存在です。',
    relatedFunctions: ['Si'],
  },
  '伝統を重んじる': {
    emoji: '🏯', shortDescription: '受け継がれてきた知恵を尊ぶ',
    longDescription: '過去から受け継がれた習慣や知恵の価値を理解し、次の世代に伝えていく性質。文化や組織の継承において重要な役割を果たします。',
    relatedFunctions: ['Si'],
  },
  '責任感が強い': {
    emoji: '💪', shortDescription: '任されたことは最後までやり抜く',
    longDescription: '自分の役割や義務を重んじ、一度引き受けたことは確実に完了させる性質。周囲の安心感の土台になります。',
    relatedFunctions: ['Si', 'Te'],
  },
  '責任感': {
    emoji: '🏗️', shortDescription: '自分の役割を全うする',
    longDescription: '与えられた責任を真摯に受け止め、期待以上の成果を出そうとする性質。信頼の連鎖を生み出します。',
    relatedFunctions: ['Si', 'Te'],
  },
  '伝統的': {
    emoji: '📜', shortDescription: '確立された方法を重視する',
    longDescription: '時間をかけて培われた方法論やルールの価値を理解し、安定した基盤の上に物事を進める性質。',
    relatedFunctions: ['Si'],
  },
  '几帳面': {
    emoji: '📐', shortDescription: '細部まで丁寧にこだわる',
    longDescription: '小さな Detail も見落とさず、正確で秩序ある仕事をする性質。品質の安定した成果物を生み出します。',
    relatedFunctions: ['Si'],
  },
  '信頼できる': {
    emoji: '🛡️', shortDescription: '常に安定して頼りになる',
    longDescription: '言葉と行動が一致し、周囲の人が安心して任せることができる性質。組織の信頼の柱となります。',
    relatedFunctions: ['Si'],
  },

  // Se-related
  '即興的': {
    emoji: '🎭', shortDescription: 'その場で柔軟に対応できる',
    longDescription: '事前の計画に頼らず、目の前の状況に即座に反応して最適な行動をとる能力。予測不能な場面で輝きます。',
    relatedFunctions: ['Se'],
  },
  '実践的': {
    emoji: '🔨', shortDescription: '現実的な解決策を実行する',
    longDescription: '理論だけでなく、実際に手を動かして問題を解決する能力。アイデアを行動に移す架け橋となります。',
    relatedFunctions: ['Se', 'Te'],
  },
  '大胆': {
    emoji: '🔥', shortDescription: '恐れずに挑戦する勇気',
    longDescription: 'リスクを恐れず、自分を信じて果敢に挑戦する性質。壁にぶつかっても諦めない強い意志を持っています。',
    relatedFunctions: ['Se'],
  },
  '実利的': {
    emoji: '💰', shortDescription: '成果と効率を最優先する',
    longDescription: '理想論よりも実際の成果と利益を重視する現実的な視点。限られたリソースで最大の効果を狙います。',
    relatedFunctions: ['Se', 'Te'],
  },
  '直接的': {
    emoji: '🎯', shortDescription: '率直に本音を伝える',
    longDescription: '遠回しではなく、明確で正直な言葉で意図を伝える性質。コミュニケーションの無駄を省き、本質に素早くたどり着きます。',
    relatedFunctions: ['Se', 'Te'],
  },
  'エネルギッシュ': {
    emoji: '⚡', shortDescription: 'みなぎる活力で周囲を引っ張る',
    longDescription: '豊かなエネルギーと行動力で、周囲の人々を巻き込みながら前に進む性質。停滞した状況に風を入れます。',
    relatedFunctions: ['Se'],
  },
  '機会を逃さない': {
    emoji: '🦅', shortDescription: 'チャンスを瞬時に捉える',
    longDescription: '目の前に現れたチャンスを素早く見極め、迷わず行動に移す能力。タイミングの良さが成功の鍵になります。',
    relatedFunctions: ['Se'],
  },
  '実用的': {
    emoji: '🔧', shortDescription: '使える解決策を選ぶ',
    longDescription: '理論的な美しさより実際の使い勝手を重視する現実的な視点。問題に対して最も効果的な手段を見極めます。',
    relatedFunctions: ['Se', 'Ti'],
  },
  '冷静': {
    emoji: '🧊', shortDescription: 'どんな時も動じない精神',
    longDescription: 'プレッシャーや混乱の中でも感情に流されず、冷静に状況を分析できる性質。危機管理において頼りになる存在です。',
    relatedFunctions: ['Ti', 'Se'],
  },

  // Ti-related
  '議論好き': {
    emoji: '⚔️', shortDescription: '知的な議論を楽しむ',
    longDescription: '自分と異なる視点とぶつかり合うことで、より深い理解に到達することを好む性質。議論を通じて真理に近づきます。',
    relatedFunctions: ['Ti', 'Ne'],
  },
  '論理的': {
    emoji: '🧠', shortDescription: '筋道を立てて考えられる',
    longDescription: '感情や偏見にとらわれず、論理的で一貫した思考プロセスで結論に導く能力。複雑な問題も整理して解き明かします。',
    relatedFunctions: ['Ti'],
  },
  '分析的': {
    emoji: '🔬', shortDescription: '物事を分解して理解する',
    longDescription: '複雑な現象を要素に分解し、それぞれの関係性を明らかにする能力。データや事実に基づいた深い理解を生みます。',
    relatedFunctions: ['Ti'],
  },
  '独立心': {
    emoji: '🐺', shortDescription: '自分の道を自分で切り開く',
    longDescription: '他人の意見や社会の期待に流されず、自分の判断で道を選ぶ性質。自立した思考と行動が独自の成果を生みます。',
    relatedFunctions: ['Ti', 'Fi'],
  },

  // Te-related
  'リーダーシップ': {
    emoji: '👑', shortDescription: '人を導きまとめ上げる',
    longDescription: '明確なビジョンと決断力で人々を一つの方向に導く能力。チームの力を最大化し、目標達成に導きます。',
    relatedFunctions: ['Te', 'Fe'],
  },
  '挑戦的': {
    emoji: '🏔️', shortDescription: '困難に立ち向かう意志',
    longDescription: '高い目標に向かって果敢に挑戦し、壁を乗り越えることを楽しむ性質。現状維持ではなく常に上を目指します。',
    relatedFunctions: ['Te'],
  },
  '決断力': {
    emoji: '⚖️', shortDescription: '迷わず的確に判断する',
    longDescription: '情報を素早く整理し、タイミングよく確固たる決断を下す能力。優柔不断を排除し、チームの前進を支えます。',
    relatedFunctions: ['Te', 'Ni'],
  },
  '自信': {
    emoji: '✨', shortDescription: '自分の力を信じている',
    longDescription: '自分の能力と判断を信じ、堂々と行動できる性質。自信は周囲にも安心感と信頼を与え、チーム全体の士気を高めます。',
    relatedFunctions: ['Te'],
  },
  '効率重視': {
    emoji: '⚙️', shortDescription: '無駄を省いて最短を目指す',
    longDescription: 'プロセスの無駄を排除し、最小の労力で最大の成果を追求する性質。リソースを最適に配分する達人です。',
    relatedFunctions: ['Te'],
  },
  '野心的': {
    emoji: '🚩', shortDescription: '高い目標に向かって突き進む',
    longDescription: '現状に満足せず、より大きな目標を掲げて挑戦し続ける性質。その推進力が個人の成長と組織の発展を同時に実現します。',
    relatedFunctions: ['Te', 'Ni'],
  },
  '組織的': {
    emoji: '📊', shortDescription: '秩序をもって事を進める',
    longDescription: '人やリソースを体系化し、効率的に機能する仕組みを作る能力。混沌とした状況に秩序をもたらします。',
    relatedFunctions: ['Te', 'Si'],
  },
  '断固とした態度': {
    emoji: '🗿', shortDescription: '揺るぎない信念で決める',
    longDescription: '一度決めたことはぶれず、周囲の反対や困難があっても自分の判断を貫く強さ。安定した意志決定の柱となります。',
    relatedFunctions: ['Te'],
  },

  // Fi-related
  '情熱的': {
    emoji: '❤️‍🔥', shortDescription: '心から熱く打ち込む',
    longDescription: '自分が信じることに対して全身全霊で取り組む性質。その熱意は周囲の人々にもインスピレーションを与えます。',
    relatedFunctions: ['Fi'],
  },
  '理想主義': {
    emoji: '🌈', shortDescription: 'より良い世界を信じる',
    longDescription: '現実の不完全さを認めつつも、あるべき姿を追求し続ける性質。理想と現実のギャップを埋める行動力の源泉です。',
    relatedFunctions: ['Fi', 'Ne'],
  },
  '感受性豊か': {
    emoji: '🌊', shortDescription: '繊細な感情の波を感じ取る',
    longDescription: '自分自身と他人の感情の機微を深く感じ取る能力。豊かな内面世界が共感と表現の土台になります。',
    relatedFunctions: ['Fi'],
  },
  '内省的': {
    emoji: '🌙', shortDescription: '深く自分を見つめ直す',
    longDescription: '自分の感情や行動の理由を深く掘り下げる性質。内省を通じて得た気づきが、より良い自己理解と成長に繋がります。',
    relatedFunctions: ['Fi', 'Ni'],
  },
  '芸術的': {
    emoji: '🎭', shortDescription: '美を感じ取り表現する',
    longDescription: '世界の美しさに敏感で、それを独自の形で表現する能力。感情と感覚が融合した豊かな創造性を持っています。',
    relatedFunctions: ['Fi', 'Se'],
  },
  '穏やか': {
    emoji: '🍃', shortDescription: '静かで落ち着いた存在',
    longDescription: '激しい感情の波に飲まれず、静かで安定した内面を保つ性質。その落ち着きは周囲にも安らぎを与えます。',
    relatedFunctions: ['Fi'],
  },

  // Fe-related
  '社交的': {
    emoji: '🎉', shortDescription: '人との関わりを楽しむ',
    longDescription: '様々な人との交流からエネルギーを得て、自然なコミュニケーションで場を盛り上げる性質。人脈の広さが財産になります。',
    relatedFunctions: ['Fe'],
  },
  'カリスマ的': {
    emoji: '💫', shortDescription: '人を惹きつける魅力がある',
    longDescription: '言葉や存在感で自然に人々を引き寄せる力。言葉だけでなく、態度や行動で人々にインスピレーションを与えます。',
    relatedFunctions: ['Fe'],
  },
  '共感的': {
    emoji: '💝', shortDescription: '他人の気持ちに寄り添える',
    longDescription: '相手の立場に立って感情を理解し、適切なサポートを提供する能力。深い人間関係の構築に不可欠な資質です。',
    relatedFunctions: ['Fe'],
  },
  '調和を求める': {
    emoji: '☮️', shortDescription: '場の空気を整え平和を保つ',
    longDescription: '対立や緊張を感じ取って、双方が納得できる着地点を見つける能力。チームの結束力を高め、協働を促進します。',
    relatedFunctions: ['Fe'],
  },
  '陽気': {
    emoji: '☀️', shortDescription: '明るく周囲を元気にする',
    longDescription: '持ち前の明るさとユーモアで、場の雰囲気をポジティブにする性質。周囲の人の笑顔が何よりの原動力です。',
    relatedFunctions: ['Fe', 'Se'],
  },
  '楽観的': {
    emoji: '🌻', shortDescription: '前向きに未来を見据える',
    longDescription: 'どんな状況でも明るい側面を見つけ、希望を持ち続ける性質。その前向きな姿勢は周囲の励みになります。',
    relatedFunctions: ['Fe', 'Ne'],
  },
  '世話好き': {
    emoji: '🏡', shortDescription: '人のために尽くす喜び',
    longDescription: '他者の困りごとに自然と手を差し伸べ、サポートすることに喜びを感じる性質。縁の下の力持ちとして愛されます。',
    relatedFunctions: ['Fe', 'Si'],
  },
  '協力的': {
    emoji: '🤲', shortDescription: 'チームの一員として貢献',
    longDescription: '自分の役割を理解し、他者と連携して目標を達成する性質。調和のとれたチームワークの核となります。',
    relatedFunctions: ['Fe'],
  },
  '利他的': {
    emoji: '🕊️', shortDescription: '他人のために尽くす優しさ',
    longDescription: '自分の利益よりも他者の幸福を優先する深い思いやりの性質。見返りを求めない奉仕が信頼の絆を築きます。',
    relatedFunctions: ['Fe', 'Fi'],
  },
  '献身的': {
    emoji: '💐', shortDescription: '心を込めて打ち込む',
    longDescription: '信じる人や目的のために、惜しみなく時間とエネルギーを注ぐ性質。その献身は深い信頼と感謝を生み出します。',
    relatedFunctions: ['Fe', 'Si'],
  },
  '温かい': {
    emoji: '🧣', shortDescription: '人を包み込む優しさ',
    longDescription: '誰に対しても親しみやすく、受け入れる温かさを持つ性質。その包容力が周囲に安心感と居心地の良さをもたらします。',
    relatedFunctions: ['Fe'],
  },
};

const shadowTraitCatalog: Record<string, TraitDef> = {
  '構造的内省': {
    emoji: '🧘', shortDescription: '体系的に自分を振り返る',
    longDescription: '感情や思考を整理しながら深く自己理解を進める力。内省の質を高めることで、より確かな成長に繋がります。',
    relatedFunctions: ['Ni'],
  },
  '論理分析': {
    emoji: '📊', shortDescription: '論理的に物事を分解する',
    longDescription: '複雑な事象を要素に分解し、因果関係を明らかにする力。感情に流されない客観的な判断の基盤になります。',
    relatedFunctions: ['Ti'],
  },
  '現場の細部への注意': {
    emoji: '🔎', shortDescription: '小さな変化を見逃さない',
    longDescription: '現場の微細な変化や違和感に敏感に反応する力。早期発見が大きな問題の予防に繋がります。',
    relatedFunctions: ['Si'],
  },
  '自己の感情の深掘り': {
    emoji: '💎', shortDescription: '自分の心を深く理解する',
    longDescription: '自分の感情の奥にある本当の理由や欲求に向き合う力。自己受容と感情のコントロールの第一歩です。',
    relatedFunctions: ['Fi'],
  },
  '客観的事実の分析': {
    emoji: '📈', shortDescription: '事実に基づいて判断する',
    longDescription: '感情や先入観を排除し、データと事実だけから結論を導く力。公正で説得力のある判断の基盤です。',
    relatedFunctions: ['Ti'],
  },
  '個人的価値観の確認': {
    emoji: '🎯', shortDescription: '自分の大切なものを見極める',
    longDescription: '外からの圧力に流されず、自分の芯となる価値観を確認する力。迷いを減らし、自信を持った決断を支えます。',
    relatedFunctions: ['Fi'],
  },
  '感情的な繋がり': {
    emoji: '🔗', shortDescription: '心と心を結ぶ力',
    longDescription: '表面的な関係を超えて、本質的な感情の交流を生み出す力。深い人間関係の構築に不可欠です。',
    relatedFunctions: ['Fi', 'Fe'],
  },
  '具体的な実行力': {
    emoji: '🏃', shortDescription: 'アイデアを行動に変える',
    longDescription: '頭の中のアイデアや計画を具体的な行動に落とし込む力。着想と結果の間の橋渡しをする重要な能力です。',
    relatedFunctions: ['Te', 'Se'],
  },
  '継続的な取り組み': {
    emoji: '📚', shortDescription: '最後までやり抜く忍耐力',
    longDescription: '飽きずに一つのことに継続的に取り組み続ける力。大きな成果は小さな積み重ねの先にあります。',
    relatedFunctions: ['Si'],
  },
  '感情的な繊細さ': {
    emoji: '🌸', shortDescription: '繊細な感情の機微を感じる',
    longDescription: '自分や他人の微妙な感情の変化に気づく繊細さ。配慮の行き届いたコミュニケーションの基盤です。',
    relatedFunctions: ['Fi'],
  },
  '予想外の可能性への開放': {
    emoji: '🎁', shortDescription: '思いがけないことにも耳を傾ける',
    longDescription: '計画外や予想外の展開を否定せず、むしろチャンスとして捉える柔軟性。偶然を味方につける力です。',
    relatedFunctions: ['Ne'],
  },
  '過去からの学び': {
    emoji: '📖', shortDescription: '経験を教訓として活かす',
    longDescription: '過去の成功も失敗も貴重なデータとして蓄積し、今の判断に活かす力。経験値が最強の武器になります。',
    relatedFunctions: ['Si'],
  },
  '長期的視野': {
    emoji: '🔭', shortDescription: '先を見据えて今を決める',
    longDescription: '目先の利益だけでなく、数年先の影響まで考慮して判断する力。持続可能な成長の設計図です。',
    relatedFunctions: ['Ni'],
  },
  '抽象的思考': {
    emoji: '💭', shortDescription: '概念レベルで物事を捉える',
    longDescription: '具体的な事象から共通のパターンや原則を抽出する力。複雑な問題の本質をシンプルに理解できます。',
    relatedFunctions: ['Ne', 'Ni'],
  },
  '体系的な計画': {
    emoji: '📋', shortDescription: '秩序立てて計画を構築する',
    longDescription: 'バラバラの要素を論理的に組み合わせ、全体として機能する計画を作る力。複雑なプロジェクトの設計に不可欠です。',
    relatedFunctions: ['Te'],
  },
  '自己主張': {
    emoji: '📢', shortDescription: '自分の意見を堂々と言う',
    longDescription: '自分の考えや感情を遠慮せずに適切に表現する力。自己主張は健全な関係性の土台です。',
    relatedFunctions: ['Te', 'Fi'],
  },
  '論理的分析': {
    emoji: '🧪', shortDescription: '論理の糸を解きほぐす',
    longDescription: '主張や現象の背後にある論理構造を明らかにする力。矛盾や飛躍を見抜き、筋の通った結論を導きます。',
    relatedFunctions: ['Ti'],
  },
  '長期的ビジョン': {
    emoji: '🌅', shortDescription: '遠い未来を描いて導く',
    longDescription: '数年先の理想像を明確に描き、そこから逆算して今をデザインする力。将来への投資として現在の行動を位置づけます。',
    relatedFunctions: ['Ni'],
  },
  '長期的計画': {
    emoji: '🗓️', shortDescription: '将来を見据えたロードマップ',
    longDescription: '目標までの道のりを具体的なマイルストーンに分け、現実的な計画に落とし込む力。夢をスケジュールに変える技術です。',
    relatedFunctions: ['Ni', 'Te'],
  },
  '感情的な深み': {
    emoji: '🌙', shortDescription: '感情の奥底まで潜れる',
    longDescription: '表面の感情だけでなく、その下にある深い感情層にアクセスする力。豊かな内面世界が創造性の源泉です。',
    relatedFunctions: ['Fi'],
  },
  '可能性の想像': {
    emoji: '🎪', shortDescription: 'まだ見ぬ未来を思い描く',
    longDescription: '現状から出発して「もしこうだったら？」と広げる想像力。イノベーションの出発点はいつもこの問いから始まります。',
    relatedFunctions: ['Ne'],
  },
  '創造的な解決策': {
    emoji: '🗝️', shortDescription: '型破りな方法で問題を解く',
    longDescription: '従来のやり方に縛られず、斬新で意外なアプローチで問題に取り組む力。視点の転換がブレイクスルーを生みます。',
    relatedFunctions: ['Ne'],
  },
  '感情への配慮': {
    emoji: '💐', shortDescription: '人の気持ちに思いやりを持つ',
    longDescription: '言葉や行動が相手にどう影響するかを考える思いやり。配慮の行き届いた対応が信頼の絆を強めます。',
    relatedFunctions: ['Fe'],
  },
  '予期せぬ変化への適応': {
    emoji: '🔄', shortDescription: '変化を柔軟に受け入れる',
    longDescription: '予想外の事態に動じることなく、むしろ新しい状況を楽しみながら対応する柔軟性。変化こそが成長のチャンスです。',
    relatedFunctions: ['Se', 'Ne'],
  },
  '具体的な行動計画': {
    emoji: '📝', shortDescription: '理想を具体的ステップに変える',
    longDescription: '大きなビジョンを小さな実行可能なステップに分解する力。夢と現実の架け橋を構築する実践的なスキルです。',
    relatedFunctions: ['Te'],
  },
  '社会的な視点': {
    emoji: '🌍', shortDescription: '社会全体を見渡す広い視野',
    longDescription: '自分個人の視点にとどまらず、社会や集団全体への影響を考える広い視点。公益を考える力は真のリーダーシップの核です。',
    relatedFunctions: ['Fe'],
  },
  '即興的な対応': {
    emoji: '🎸', shortDescription: 'その場の状況に即座に反応',
    longDescription: '準備不足や予期せぬ質問にも、その場で機転を利かせて対応する力。臨機応変さが信頼を生みます。',
    relatedFunctions: ['Se'],
  },
  '現実的な感覚': {
    emoji: '👁️', shortDescription: '現実をありのままに捉える',
    longDescription: '希望や先入観で現実を歪めず、ありのままの状況を正確に認識する力。現実に基づいた判断の土台です。',
    relatedFunctions: ['Se'],
  },
  '具体的な行動': {
    emoji: '👟', shortDescription: '考えるよりまず動く',
    longDescription: '分析や計画で止まらず、実際に一歩を踏み出す行動力。行動してこそ得られる学びと気づきがあります。',
    relatedFunctions: ['Se'],
  },
  '効率的な実行': {
    emoji: '⚡', shortDescription: '最小の手間で最大の成果を',
    longDescription: '無駄なプロセスを削ぎ落とし、最短ルートで結果を出す力。効率性は達成感と余裕を生み出します。',
    relatedFunctions: ['Te'],
  },
  '感情表現': {
    emoji: '🎭', shortDescription: '気持ちを言葉や態度で伝える',
    longDescription: '内にある感情を適切な方法で外に表現する力。感情を伝えることで、より深い理解し合いが生まれます。',
    relatedFunctions: ['Fe', 'Fi'],
  },
  '自発的な探索': {
    emoji: '🗺️', shortDescription: '自分から未知の世界に足を踏み入れる',
    longDescription: '誰かに言われるのではなく、自ら好奇心に従って新しい領域を探求する力。自発性こそが真の学びのエンジンです。',
    relatedFunctions: ['Ne'],
  },
  '細部への目': {
    emoji: '🔍', shortDescription: '細かい部分までしっかり確認',
    longDescription: '全体的な方向性だけでなく、個々の細部の質まで目を行き届かせる力。細部へのこだわりが全体の品質を決めます。',
    relatedFunctions: ['Si'],
  },
  '論理的計画': {
    emoji: '📐', shortDescription: '論理に基づいて計画を立てる',
    longDescription: '感情や勢いではなく、論理的な根拠に基づいて計画を構築する力。説得力のある計画は実行率も高まります。',
    relatedFunctions: ['Ti', 'Te'],
  },
  '客観的分析': {
    emoji: '🔭', shortDescription: '偏りなく公平に分析する',
    longDescription: '自分の好みや先入観を脇に置き、事実に基づいて分析する力。客観性は信頼性の高い結論を導きます。',
    relatedFunctions: ['Ti'],
  },
  '大胆な変化': {
    emoji: '💥', shortDescription: '勇気を持って大きく変える',
    longDescription: '小さな改善ではなく、根本的な変革に挑む勇気。変化への恐怖を乗り越えた先に、飛躍的な成長が待っています。',
    relatedFunctions: ['Se'],
  },
  '直感的洞察': {
    emoji: '💫', shortDescription: '直感で本質にたどり着く',
    longDescription: '論理的なプロセスを経ずに、瞬時に本質を捉える力。長年の経験と知識が無意識下で統合された結果です。',
    relatedFunctions: ['Ni'],
  },
  '人との繋がり': {
    emoji: '🫂', shortDescription: '人と人を結ぶ力を持つ',
    longDescription: '孤独な作業だけでなく、人との交流からエネルギーと知恵を得る力。人の輪が広がるほど可能性も広がります。',
    relatedFunctions: ['Fe'],
  },
  '創造的な発想': {
    emoji: '💡', shortDescription: '誰も思いつかないアイデア',
    longDescription: '常識の枠を超えた斬新なアイデアを生み出す力。既存の概念の組み替えから生まれる発想がイノベーションを起こします。',
    relatedFunctions: ['Ne'],
  },
  '可能性への開放': {
    emoji: '🚪', shortDescription: '新しい扉を開く勇気',
    longDescription: '未知の領域に対して心を開き、挑戦することを恐れない姿勢。閉じた扉の向こうに新しい世界が広がっています。',
    relatedFunctions: ['Ne'],
  },
};

const communicationTraitTemplates: Record<string, TraitDef> = {
  formality: {
    emoji: '🎩', shortDescription: '丁寧で礼儀正しい言葉遣い',
    longDescription: '相手との関係性や場の雰囲気に合わせて、適切な丁寧さでコミュニケーションをとる能力。信頼を築く第一歩です。',
    relatedFunctions: ['Te', 'Fe'],
  },
  emotionality: {
    emoji: '💫', shortDescription: '感情を豊かに表現する',
    longDescription: '自分の気持ちを素直に表現し、相手の感情にも敏感に反応する能力。感情の交流が深い人間関係の土台です。',
    relatedFunctions: ['Fe', 'Fi'],
  },
  logicFocus: {
    emoji: '🧠', shortDescription: '筋道を立てて説明する',
    longDescription: '感情論ではなく論理的で説得力のある言葉で意見を伝える能力。明確な根拠が信頼を生みます。',
    relatedFunctions: ['Ti', 'Te'],
  },
  empathy: {
    emoji: '💝', shortDescription: '相手の気持ちを深く理解する',
    longDescription: '相手の立場に立ち、言葉の裏にある感情まで読み取る能力。共感が心の距離を縮めます。',
    relatedFunctions: ['Fe', 'Fi'],
  },
};

export function getTraitCardsForType(mbti: string): TraitCardData[] {
  const char = mbtiCharacters[mbti];
  if (!char) return [];

  const cards: TraitCardData[] = [];
  let idCounter = 0;

  // 5 core traits: first 3 = strength, next 2 = tendency
  char.traits.forEach((trait, i) => {
    const catalog = coreTraitCatalog[trait];
    if (!catalog) return;
    const color = functionColors[catalog.relatedFunctions[0]] || '#C084FC';
    cards.push({
      id: `core-${idCounter++}`,
      label: trait,
      emoji: catalog.emoji,
      color,
      category: i < 3 ? 'strength' : 'tendency',
      shortDescription: catalog.shortDescription,
      longDescription: catalog.longDescription,
      relatedFunctions: catalog.relatedFunctions,
    });
  });

  // 3 shadow traits
  char.shadowFunction.complementaryTraits.forEach((trait) => {
    const catalog = shadowTraitCatalog[trait];
    if (!catalog) return;
    const color = functionColors[catalog.relatedFunctions[0]] || '#C084FC';
    cards.push({
      id: `shadow-${idCounter++}`,
      label: trait,
      emoji: catalog.emoji,
      color,
      category: 'shadow',
      shortDescription: catalog.shortDescription,
      longDescription: catalog.longDescription,
      relatedFunctions: catalog.relatedFunctions,
    });
  });

  // 2 communication traits from top 2 conversationStyle metrics
  const cs = char.conversationStyle;
  const metrics = [
    { key: 'formality', value: cs.formality },
    { key: 'emotionality', value: cs.emotionality },
    { key: 'logicFocus', value: cs.logicFocus },
    { key: 'empathy', value: cs.empathy },
  ];
  metrics.sort((a, b) => b.value - a.value);
  metrics.slice(0, 2).forEach((m) => {
    const template = communicationTraitTemplates[m.key];
    const color = functionColors[template.relatedFunctions[0]] || '#C084FC';
    cards.push({
      id: `comm-${idCounter++}`,
      label: m.key === 'formality' ? 'フォーマルな表現' :
             m.key === 'emotionality' ? '感情豊かな表現' :
             m.key === 'logicFocus' ? '論理的説明' : '共感的対話',
      emoji: template.emoji,
      color,
      category: 'growth',
      shortDescription: template.shortDescription,
      longDescription: template.longDescription,
      relatedFunctions: template.relatedFunctions,
    });
  });

  return cards;
}

