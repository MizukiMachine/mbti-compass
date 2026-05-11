'use client';

import { useState } from 'react';
import { createClient } from '@/src/lib/supabase/client';
import { toDummyEmail } from '@/src/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const dummyEmail = toDummyEmail(username);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: dummyEmail, password });

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'ユーザー名またはパスワードが正しくありません'
        : error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-display text-white text-center mb-2">ログイン</h1>
        <p className="text-body text-white/40 text-center mb-8">シャドウフレンドAI</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
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
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <p className="text-caption text-white/40 text-center mt-6">
          アカウントがない？{' '}
          <a href="/auth/signup" className="text-accent hover:underline">新規登録</a>
        </p>
        <p className="text-caption text-white/30 text-center mt-2">
          <a href="/" className="hover:text-white/50">← トップに戻る</a>
        </p>
      </div>
    </div>
  );
}
