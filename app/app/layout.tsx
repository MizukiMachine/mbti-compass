import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Office Compass - 職場の人間関係シミュレーター',
  description: '自分のMBTI傾向と職場の人物スロットから、頼み方、断り方、1on1、関係修復の会話方針をシミュレーションします。',
  keywords: '職場, 人間関係, MBTI, コミュニケーション, 1on1, 相談, AI',
  openGraph: {
    title: 'Office Compass - 職場の人間関係シミュレーター',
    description: '職場の人物スロットを埋めて、相手ごとの伝え方や会話文面をシミュレーションします。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office Compass - 職場の人間関係シミュレーター',
    description: 'MBTI傾向と職場の人物マップから、具体的な会話方針と文面を生成します。',
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
