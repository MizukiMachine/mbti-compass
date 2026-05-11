import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'シャドウフレンドAI - あなたの影と対話するAI',
  description: '20の質問でMBTIタイプを診断。あなたと同じ性格のAIが、自分では気づかない偏り（シャドウ機能）を代弁してくれます。',
  keywords: 'MBTI, 性格診断, シャドウ機能, AIチャット, シャドウフレンドAI',
  openGraph: {
    title: 'シャドウフレンドAI - あなたの影と対話するAI',
    description: 'あなたと同じ性格のAIが、自分の見えない部分（シャドウ）を代弁。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'シャドウフレンドAI - あなたの影と対話するAI',
    description: 'あなたと同じ性格のAIが、自分の見えない部分（シャドウ）を代弁。',
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
