import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shadow Friend - 関係摩擦マップ',
  description: '自分のMBTI傾向と人物プリセットから、人間関係の摩擦、距離感、会話方針をシミュレーションします。',
  keywords: '人間関係, MBTI, コミュニケーション, 相性, 相談, AI',
  openGraph: {
    title: 'Shadow Friend - 関係摩擦マップ',
    description: '人物プリセットを選んで、相手ごとの摩擦や伝え方をシミュレーションします。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shadow Friend - 関係摩擦マップ',
    description: 'MBTI傾向と人物プリセットから、具体的な会話方針と文面を生成します。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
