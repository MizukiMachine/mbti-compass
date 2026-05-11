import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'シャドウフレンドAI - MBTI診断で見つけるもう一人の自分',
  description: '20の質問でMBTIタイプを診断。あなたの認知機能とシャドウ機能を可視化し、自分では気づかない偏りを見つけます。',
  keywords: 'MBTI, 性格診断, シャドウ機能, 認知機能, シャドウフレンドAI',
  openGraph: {
    title: 'シャドウフレンドAI - MBTI診断で見つけるもう一人の自分',
    description: '20の質問でMBTIタイプを診断。認知機能とシャドウ機能を可視化します。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'シャドウフレンドAI - MBTI診断で見つけるもう一人の自分',
    description: '20の質問でMBTIタイプを診断。認知機能とシャドウ機能を可視化します。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
