import {
  AdviceAction,
  AdviceActionId,
  WorkplacePerson,
  WorkplacePersonPreset,
} from '../types/workplace';

export const workplacePresets: WorkplacePersonPreset[] = [
  {
    id: 'outcome_manager',
    roleLabel: '上司',
    displayName: '成果重視の上司',
    shortLabel: '成果上司',
    archetype: '結論、数字、責任範囲を重視する意思決定者',
    tone: 'driver',
    estimatedMbti: ['ENTJ', 'ESTJ'],
    confidence: 'medium',
    description:
      '結論と成果を先に知りたがるタイプ。相談は歓迎するが、曖昧な説明や感情だけの訴えには反応が硬くなりやすい。',
    traits: ['結論を急ぐ', '数字と期限を重視', '責任範囲に敏感'],
    workValues: ['成果', '効率', '優先順位'],
    frictionPoints: ['背景説明が長い', '依頼の目的が曖昧', '期限が見えない'],
    trustSignals: ['結論から話す', '選択肢を添える', '次のアクションを明確にする'],
    riskTriggers: ['感情だけで押す', '問題を後出しする', '責任の所在をぼかす'],
    defaultNotes:
      '報告や相談では、最初に結論、次に根拠、最後に相談したい判断を置くと通りやすい。',
  },
  {
    id: 'empathic_peer',
    roleLabel: '同僚',
    displayName: '空気を読む同僚',
    shortLabel: '共感同僚',
    archetype: '場の温度と人の納得感をよく見ている調整役',
    tone: 'supporter',
    estimatedMbti: ['ENFJ', 'ISFJ', 'ESFJ'],
    confidence: 'medium',
    description:
      '周囲の感情変化に敏感で、チームの空気を整えることが多い。正論だけで押されると距離を取りやすい。',
    traits: ['配慮が細かい', '場の空気を見る', '対立を避けがち'],
    workValues: ['納得感', '信頼', 'チームの安定'],
    frictionPoints: ['強い言い切り', '相手の事情を無視する', '公開の場で詰める'],
    trustSignals: ['先に感謝を伝える', '事情を聞く', '巻き込み方を相談する'],
    riskTriggers: ['冷たい言い方', '一方的な依頼', '周囲への配慮不足'],
    defaultNotes:
      '依頼や相談の前に、相手の負荷と周囲への影響を一言確認すると協力を得やすい。',
  },
  {
    id: 'cautious_senior',
    roleLabel: '先輩',
    displayName: '慎重な先輩',
    shortLabel: '慎重先輩',
    archetype: '経験則と手順を重視する品質管理タイプ',
    tone: 'operator',
    estimatedMbti: ['ISTJ', 'ISFJ'],
    confidence: 'medium',
    description:
      '急な変更や根拠の薄い提案には慎重。過去の経緯や手順を尊重すると、実務的な助けをくれやすい。',
    traits: ['手順を守る', '経験則を大切にする', 'リスクに敏感'],
    workValues: ['安定', '正確さ', '再現性'],
    frictionPoints: ['急な方針転換', '準備不足', '過去経緯の軽視'],
    trustSignals: ['事前に共有する', '確認事項を整理する', '過去の知見を尊重する'],
    riskTriggers: ['勢いだけの提案', '独断で進める', '細部を軽く扱う'],
    defaultNotes:
      '相談時は「確認したい点」「リスク」「過去のやり方との差分」を整理して持っていく。',
  },
  {
    id: 'idea_peer',
    roleLabel: '同僚',
    displayName: 'アイデア先行の同僚',
    shortLabel: '発想同僚',
    archetype: '新しい可能性を広げる発想型のメンバー',
    tone: 'creative',
    estimatedMbti: ['ENFP', 'ENTP'],
    confidence: 'medium',
    description:
      '発想が早く、会話の中で次々に可能性を出す。自由度が高いと力を出すが、細かな詰めを後回しにしやすい。',
    traits: ['発想が多い', '変化に強い', '飽きやすい'],
    workValues: ['可能性', '自由度', '新しさ'],
    frictionPoints: ['細かすぎる管理', '否定から入る', '裁量が少ない'],
    trustSignals: ['まず案を受け止める', '選択肢を一緒に絞る', '役割を軽く区切る'],
    riskTriggers: ['頭ごなしの否定', '細部だけ詰める', '自由を奪う指示'],
    defaultNotes:
      '最初は案を広げ、次に期限と担当を一緒に決めると実行につながりやすい。',
  },
  {
    id: 'quiet_specialist',
    roleLabel: '専門職',
    displayName: '無口な専門家',
    shortLabel: '専門家',
    archetype: '論点と品質を静かに見ている分析型の人',
    tone: 'analyst',
    estimatedMbti: ['INTP', 'ISTP', 'INTJ'],
    confidence: 'low',
    description:
      '会議では多く話さないが、論点の穴や品質には敏感。雑な依頼より、整理された問いに強く反応する。',
    traits: ['観察が鋭い', '無駄な会話が少ない', '品質に厳しい'],
    workValues: ['整合性', '専門性', '静かな集中'],
    frictionPoints: ['感覚的な依頼', '論点が散る', '頻繁な割り込み'],
    trustSignals: ['問いを絞る', '前提を共有する', '専門判断を尊重する'],
    riskTriggers: ['雑な丸投げ', '感情的な催促', '集中時間の中断'],
    defaultNotes:
      '相談は短く、前提、聞きたい判断、期限を明確にすると協力を得やすい。',
  },
  {
    id: 'pressure_cross_team',
    roleLabel: '他部署',
    displayName: '圧が強い他部署の人',
    shortLabel: '他部署',
    archetype: '自部署の成果とスピードを強く守る交渉相手',
    tone: 'challenger',
    estimatedMbti: ['ESTJ', 'ENTJ', 'ESTP'],
    confidence: 'low',
    description:
      '要求が強く、交渉の場で主導権を取りやすい。感情で受けるより、条件と境界線を明確にした方が安定する。',
    traits: ['要求が明確', '圧が強い', '譲れない条件が多い'],
    workValues: ['スピード', '成果', '交渉力'],
    frictionPoints: ['曖昧な返答', '責任範囲の不明確さ', '期限の先延ばし'],
    trustSignals: ['条件を明文化する', '代替案を出す', '合意事項を残す'],
    riskTriggers: ['その場で飲み込む', '感情的に反発する', '曖昧に逃げる'],
    defaultNotes:
      '境界線、代替案、合意事項をセットで扱う。口頭だけで終わらせない。',
  },
  {
    id: 'waiting_junior',
    roleLabel: '後輩',
    displayName: '指示待ち気味の後輩',
    shortLabel: '後輩',
    archetype: '安心できる枠があると動きやすい若手メンバー',
    tone: 'supporter',
    estimatedMbti: ['INFP', 'ISFP', 'ISFJ'],
    confidence: 'low',
    description:
      '自分から判断するより、期待値が見えると動きやすい。詰めるより、小さく任せて成功体験を作る方が伸びる。',
    traits: ['慎重', '自信が揺れやすい', '丁寧に進める'],
    workValues: ['安心感', '具体的な期待値', '成長実感'],
    frictionPoints: ['丸投げ', '強い叱責', '正解が見えない指示'],
    trustSignals: ['期待値を明確にする', '小さく任せる', '途中確認を置く'],
    riskTriggers: ['人格評価に聞こえる指摘', '曖昧な指示', '失敗だけ拾う'],
    defaultNotes:
      'フィードバックは「できている点」「次の一手」「確認タイミング」に分けると伝わりやすい。',
  },
  {
    id: 'mood_maker',
    roleLabel: 'チーム',
    displayName: '雑談好きなムードメーカー',
    shortLabel: 'ムード役',
    archetype: '会話量と雰囲気でチームを明るくする人',
    tone: 'creative',
    estimatedMbti: ['ESFP', 'ENFP', 'ESFJ'],
    confidence: 'low',
    description:
      '場を明るくし、人との距離を縮めるのが得意。雑談を完全に切ると関係が硬くなるが、境界線は必要。',
    traits: ['会話が多い', '雰囲気を作る', '感情表現が豊か'],
    workValues: ['楽しさ', 'つながり', '反応の良さ'],
    frictionPoints: ['冷たい反応', '雑談を全否定する', '反応が薄い'],
    trustSignals: ['短く反応する', '雑談の時間を区切る', '良い影響を言語化する'],
    riskTriggers: ['無視する', '人前で遮る', '存在価値を否定する言い方'],
    defaultNotes:
      '雑談を切るより、時間と場所を区切って付き合う方が関係を保ちやすい。',
  },
];

export const workplaceActions: AdviceAction[] = [
  {
    id: 'build_trust',
    label: '信頼関係を作る',
    description: 'この人が安心して関わりやすい接点を作る',
    promptFocus: '信頼構築の初動、頻度、言葉選び',
  },
  {
    id: 'request',
    label: '頼みごとをする',
    description: '依頼が通りやすい順序と文面を作る',
    promptFocus: '依頼の切り出し、相手の負荷、代替案',
  },
  {
    id: 'decline',
    label: '断る',
    description: '関係を壊しにくい断り方を設計する',
    promptFocus: '境界線、代替案、相手の納得感',
  },
  {
    id: 'feedback',
    label: 'フィードバックする',
    description: '指摘や改善依頼を受け取りやすく伝える',
    promptFocus: '観察事実、期待値、次の行動',
  },
  {
    id: 'repair',
    label: '関係を修復する',
    description: '誤解や気まずさをほどく会話を作る',
    promptFocus: '謝意、事実確認、再発防止',
  },
  {
    id: 'distance',
    label: '距離を置く',
    description: '仕事上の接点を保ちながら負荷を下げる',
    promptFocus: '接触頻度、境界線、記録の残し方',
  },
  {
    id: 'smalltalk',
    label: '雑談する',
    description: '無理なく関係を温める話題を選ぶ',
    promptFocus: '安全な話題、深掘りしすぎない質問',
  },
  {
    id: 'one_on_one',
    label: '1on1に備える',
    description: '話す順番と確認事項を準備する',
    promptFocus: 'アジェンダ、相談事項、合意形成',
  },
];

export function getWorkplacePreset(id: string): WorkplacePersonPreset {
  return workplacePresets.find(preset => preset.id === id) ?? workplacePresets[0];
}

export function getWorkplaceAction(id: AdviceActionId): AdviceAction {
  return workplaceActions.find(action => action.id === id) ?? workplaceActions[0];
}

export function createWorkplacePerson(params: {
  id: string;
  presetId: string;
  relationLabel?: string;
  name?: string;
  closeness?: number;
  stress?: number;
  notes?: string;
}): WorkplacePerson {
  const preset = getWorkplacePreset(params.presetId);

  return {
    id: params.id,
    presetId: preset.id,
    name: params.name ?? preset.displayName,
    roleLabel: preset.roleLabel,
    relationLabel: params.relationLabel ?? preset.roleLabel,
    closeness: params.closeness ?? 46,
    stress: params.stress ?? 48,
    notes: params.notes ?? preset.defaultNotes,
    preset,
  };
}

export function createDefaultWorkplacePeople(): WorkplacePerson[] {
  return [
    createWorkplacePerson({
      id: 'slot-manager',
      presetId: 'outcome_manager',
      relationLabel: '直属上司',
      closeness: 42,
      stress: 64,
    }),
    createWorkplacePerson({
      id: 'slot-peer-a',
      presetId: 'empathic_peer',
      relationLabel: '同僚',
      closeness: 68,
      stress: 32,
    }),
    createWorkplacePerson({
      id: 'slot-senior',
      presetId: 'cautious_senior',
      relationLabel: '先輩',
      closeness: 48,
      stress: 42,
    }),
    createWorkplacePerson({
      id: 'slot-cross',
      presetId: 'pressure_cross_team',
      relationLabel: '他部署',
      closeness: 28,
      stress: 76,
    }),
    createWorkplacePerson({
      id: 'slot-junior',
      presetId: 'waiting_junior',
      relationLabel: '後輩',
      closeness: 58,
      stress: 38,
    }),
    createWorkplacePerson({
      id: 'slot-specialist',
      presetId: 'quiet_specialist',
      relationLabel: '専門職',
      closeness: 36,
      stress: 54,
    }),
  ];
}
