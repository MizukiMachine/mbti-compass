# MBTI Shadow Friend（もう一人の自分）

MBTI性格診断で見つける、あなたの分身AI。20の質問に答えると、あなたと同じMBTIタイプのキャラクターが「影の機能（シャドウ）」の視点から新しい気づきを与えてくれます。

## 機能

- **MBTI診断** — 20問（4軸×5問）でMBTIタイプを判定
- **16キャラクター** — 各タイプにユニークな名前・会話スタイル・シャドウ機能を定義
- **AIチャット** — GLM-5-turboによるキャラクター寄りの自然な対話
- **音声入力** — Web Speech APIでマイクから入力可能
- **ユーザー認証** — Supabase Auth（メール+パスワード）
- **データ永続化** — 診断結果・チャット履歴をSupabaseに保存（直近50件）
- **結果シェア** — Web Share API / Twitterで診断結果を共有

## アーキテクチャ

```
mbti-shadow-friend/
├── app/                          # Next.js 14 アプリケーション
│   ├── app/
│   │   ├── page.tsx              # ランディング + 診断 + 結果表示
│   │   ├── chat/page.tsx         # AIチャット画面
│   │   ├── api/chat/route.ts     # LLM API（GLM-5-turbo）
│   │   └── auth/                 # 認証ページ
│   │       ├── login/page.tsx
│   │       ├── signup/page.tsx
│   │       └── callback/route.ts
│   ├── middleware.ts             # セッション管理 + /chat保護
│   ├── src/
│   │   ├── lib/supabase/        # Supabaseクライアント
│   │   ├── data/                 # MBTIキャラクター・診断データ
│   │   ├── services/             # 会話エンジン
│   │   ├── components/           # UIコンポーネント
│   │   └── types/                # 型定義
│   └── tailwind.config.ts        # Tailwind設定
├── supabase/
│   └── migrations/001_initial.sql # DDL + RLSポリシー
├── src/                          # Rust CLI（旧実装、現在未使用）
└── docs/                         # 設計ドキュメント
```

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 14, React 18, Tailwind CSS, Framer Motion |
| LLM | GLM-5-turbo（Z.ai / Anthropic互換API） |
| 認証・DB | Supabase（Auth, PostgreSQL, RLS） |
| 音声入力 | Web Speech API（ブラウザネイティブ） |

## データモデル

```sql
profiles          -- auth.usersと1:1（display_name）
diagnosis_results -- ユーザーの診断履歴（mbti_type + CHECK制約）
conversations     -- ユーザー×キャラクターの会話セッション
messages          -- 直近50件を保存、古いものは自動削除
```

全テーブルRLS有効。ユーザーは自分のデータのみアクセス可能。

## 認証フロー

- **未ログイン**: 診断・チャット可能（localStorageのみ、リロードでチャット履歴消失）
- **ログイン済み**: 診断結果・チャット履歴がSupabaseに永続化
- `/chat` はログイン必須（ミドルウェアで保護）
- サインアップ時に `auth.users` → `profiles` 自動作成（トリガー）

## セットアップ

```bash
cd app
npm install

# .envに以下を設定
cp .env.example .env
# ANTHROPIC_API_KEY       — Z.ai APIキー
# NEXT_PUBLIC_SUPABASE_URL — Supabase Project URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase Anon Key

# SupabaseのSQL Editorで supabase/migrations/001_initial.sql を実行

npm run dev
```

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Yes | Z.ai APIキー |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Anon Key |
| `LLM_MODEL` | No | デフォルト: `glm-5-turbo` |
| `LLM_BASE_URL` | No | デフォルト: `https://api.z.ai/api/anthropic` |

## 開発コマンド

```bash
npm run dev     # 開発サーバー起動
npm run build   # プロダクションビルド
npm run lint    # ESLint
npm run test    # Jest
```

## ライセンス

Apache-2.0
