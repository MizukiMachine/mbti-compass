# 開発手順

## セットアップ

```bash
cd app
npm install
```

## 開発サーバー

```bash
npm run dev
```

## テスト

```bash
npm run test
npm run test:watch
npm run test:coverage
npm run test:ci
```

## ビルド

```bash
npm run build
npm run lint
```

## 環境変数

| 変数名 | 必須 | 説明 |
|---|---:|---|
| `ANTHROPIC_API_KEY` | No | 設定すると相談回答にLLMを使用。未設定時はフォールバック回答 |
| `LLM_MODEL` | No | デフォルト: `glm-5-turbo` |
| `LLM_BASE_URL` | No | デフォルト: `https://api.z.ai/api/anthropic` |
| `LLM_TIMEOUT_MS` | No | デフォルト: `10000` |

## 補足

- Supabase関連の認証ファイルは旧実装の名残として残っているが、現在のMVPでは診断結果と関係マップは `localStorage` に保存する
- `app/.env.example` に環境変数のテンプレートがある
