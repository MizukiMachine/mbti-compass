# Office Compass（職場の人間関係シミュレーター）

自分のMBTI傾向を診断し、職場の人物スロットを埋めながら、相手ごとの頼み方・断り方・1on1・関係修復をシミュレーションするアプリです。

MBTIは相手を断定するためではなく、職場コミュニケーションの仮説を作る補助情報として扱います。

## 機能

- **自分診断** — 20問（4軸×5問）で自分のMBTI傾向を判定
- **職場関係マップ** — 中心に自分、周囲に上司・同僚・後輩・他部署などの人物スロットを配置
- **人物プリセット** — 成果重視の上司、空気を読む同僚、慎重な先輩、圧が強い他部署などを初期配置
- **関係メモ** — 相手ごとに信頼度、心理的負荷、メモを調整
- **相談アクション** — 信頼構築、頼みごと、断り方、フィードバック、関係修復、距離の取り方、雑談、1on1
- **実用アウトプット** — 方針、避けたい言い方、文面ドラフト、会話の切り出し、次の一手を生成
- **ローカル保存** — 診断結果と職場マップをブラウザに保存

## アーキテクチャ

```text
mbti-shadow-friend/
├── app/
│   ├── app/
│   │   ├── page.tsx                         # 自分診断の入口
│   │   ├── explore/
│   │   │   ├── page.tsx                     # 職場関係マップ画面
│   │   │   ├── WorkplaceMapCanvas.tsx       # 中心に自分、周囲に人物スロット
│   │   │   └── RelationshipPanel.tsx        # 人物詳細、相談アクション、回答表示
│   │   └── api/workplace/advice/route.ts    # 相談アドバイス生成API
│   ├── src/
│   │   ├── data/
│   │   │   ├── mbti-questions.ts            # 自分診断の質問
│   │   │   └── workplace-presets.ts         # 職場人物プリセットと相談アクション
│   │   ├── lib/
│   │   │   └── workplace-advice.ts          # LLMプロンプトとフォールバック回答
│   │   └── types/
│   │       └── workplace.ts                 # 職場マップ関連の型
│   └── tailwind.config.ts
└── docs/
```

## 体験フロー

1. 名前を入力して自分診断を始める
2. 診断結果を中心にした職場関係マップへ移動
3. 上司、同僚、後輩、他部署などの人物スロットを選ぶ
4. プリセットや関係メモを実際の相手に合わせて調整
5. 「頼みごとをする」「断る」「1on1に備える」などの相談アクションを選ぶ
6. AIが方針、NG表現、文面ドラフト、次の一手を返す

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 14, React 18, Tailwind CSS, Framer Motion |
| LLM | GLM-5-turbo（Z.ai / Anthropic互換API） |
| 永続化 | localStorage（診断結果・職場マップ） |
| テスト | Jest |

## 環境変数

| 変数名 | 必須 | 説明 |
|---|---:|---|
| `ANTHROPIC_API_KEY` | No | 設定すると相談回答にLLMを使用。未設定時はフォールバック回答 |
| `LLM_MODEL` | No | デフォルト: `glm-5-turbo` |
| `LLM_BASE_URL` | No | デフォルト: `https://api.z.ai/api/anthropic` |
| `LLM_TIMEOUT_MS` | No | デフォルト: `10000` |

Supabase関連の認証ファイルは旧実装の名残として残っていますが、現在のMVPでは診断結果と職場マップはlocalStorageに保存します。

## 開発コマンド

```bash
cd app
npm install
npm run dev
npm run lint
npm run test
npm run build
```

## 注意

相手のMBTI候補は観察情報からの仮説です。実在の人物を断定・分類する目的ではなく、職場での伝え方や合意形成を考えるための補助として使います。
