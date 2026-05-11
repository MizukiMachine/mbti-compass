'use client';

import { useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('パスワードは6文字以上にしてください');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-display text-white text-center mb-2">新規登録</h1>
        <p className="text-body text-white/40 text-center mb-8">MBTI Shadow Friend</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="表示名"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード（6文字以上）"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-semibold text-body py-3 rounded-xl transition-all duration-200 disabled:opacity-30"
          >
            {loading ? '登録中...' : '新規登録'}
          </button>
        </form>

        <p className="text-caption text-white/40 text-center mt-6">
          すでにアカウントがある？{' '}
          <a href="/auth/login" className="text-accent hover:underline">ログイン</a>
        </p>
        <p className="text-caption text-white/30 text-center mt-2">
          <a href="/" className="hover:text-white/50">← トップに戻る</a>
        </p>
      </div>
    </div>
  );
}
