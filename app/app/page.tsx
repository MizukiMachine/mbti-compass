'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCharacter } from '../src/data/mbti-characters';
import { shuffleQuestions, calculateMbti, MbtiQuestion } from '../src/data/mbti-questions';
import { createClient } from '../src/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const easeOut = [0.16, 1, 0.3, 1];
const STORAGE_KEY = 'mbti-shadow-friend-result';

const toDummyEmail = (name: string) => {
  if (/^[a-zA-Z0-9._-]+$/.test(name)) return `${name}@shadowfriend.app`;
  const hex = Array.from(new TextEncoder().encode(name))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${hex}@shadowfriend.app`;
};

interface SavedResult {
  type: string;
  name: string;
  answeredAt: string;
}

type Step = 'landing' | 'diagnosis' | 'result';
type AuthPhase = 'name' | 'password';

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState<MbtiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [mbtiResult, setMbtiResult] = useState<string>('');
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authPhase, setAuthPhase] = useState<AuthPhase>('name');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Auth + saved result loading
  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const displayName = currentUser.user_metadata?.display_name || '';
        setName(displayName);
        // Try loading from Supabase first
        const { data } = await supabase
          .from('diagnosis_results')
          .select('mbti_type, answered_at')
          .eq('user_id', currentUser.id)
          .order('answered_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          const displayName = currentUser.user_metadata?.display_name || '';
          setSavedResult({ type: data.mbti_type, name: displayName, answeredAt: data.answered_at });
          setName(displayName);
          return;
        }
      }

      // Fallback to localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSavedResult(JSON.parse(saved));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const startDiagnosis = () => {
    setQuestions(shuffleQuestions());
    setCurrentIndex(0);
    setAnswers({});
    setStep('diagnosis');
  };

  const handleAuthSubmit = async () => {
    setAuthError('');
    setAuthLoading(true);
    const supabase = createClient();
    const dummyEmail = toDummyEmail(authName);

    // Try login first
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: dummyEmail,
      password: authPassword,
    });

    if (!loginError) {
      await migrateLocalStorage((await supabase.auth.getUser()).data.user!.id);
      setName(authName);
      setAuthLoading(false);
      return;
    }

    // Login failed → try signup
    const { error: signupError, data: signupData } = await supabase.auth.signUp({
      email: dummyEmail,
      password: authPassword,
      options: { data: { display_name: authName } },
    });

    if (signupError) {
      setAuthError(signupError.message);
      setAuthLoading(false);
      return;
    }

    // identities empty means user already exists (wrong password)
    if (signupData.user && signupData.user.identities?.length === 0) {
      setAuthError('パスワードが正しくありません');
      setAuthLoading(false);
      return;
    }
    setName(authName);
    setAuthLoading(false);
  };

  const handleAnswer = (questionId: number, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const result = calculateMbti(newAnswers);
      setMbtiResult(result);
      const saveData: SavedResult = { type: result, name, answeredAt: new Date().toISOString() };

      // Save to localStorage (always)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      setSavedResult(saveData);

      // Save to Supabase (if logged in)
      if (user) {
        const supabase = createClient();
        supabase.from('diagnosis_results').insert({
          user_id: user.id,
          mbti_type: result,
        }).then(({ error }) => {
          if (error) console.error('Failed to save diagnosis:', error);
        });
      }

      setStep('result');
    }
  };

  // Migrate localStorage data to Supabase after login
  const migrateLocalStorage = async (userId: string) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const { type } = JSON.parse(saved);
      if (/^[EI][SN][TF][JP]$/.test(type)) {
        const supabase = createClient();
        await supabase.from('diagnosis_results').insert({
          user_id: userId,
          mbti_type: type,
        });
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setStep('landing');
    }
  };

  const resetAll = () => {
    setStep('landing');
    setMbtiResult('');
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const displayType = mbtiResult || savedResult?.type || '';
  const displayName = name || savedResult?.name || '';
  const character = displayType ? getCharacter(displayType) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Landing */}
      {step === 'landing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="flex flex-col items-center justify-center min-h-screen px-6 py-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: easeOut }}
            className="font-display text-display text-white mb-4"
          >
            シャドウフレンドAI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: easeOut }}
            className="text-title-2 text-white/60 mb-12 text-center"
          >
            親友AIと話そう
          </motion.p>

          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: easeOut }}
              className="w-full max-w-sm space-y-4"
            >
              {authPhase === 'name' ? (
                <>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="お名前"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && authName.trim()) {
                        setAuthPhase('password');
                        setAuthError('');
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.01, opacity: 0.9 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (authName.trim()) {
                        setAuthPhase('password');
                        setAuthError('');
                      }
                    }}
                    disabled={!authName.trim()}
                    className="w-full bg-accent text-black font-semibold text-body py-3 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    次へ
                  </motion.button>
                </>
              ) : (
                <>
                  <p className="text-body text-white/50 text-center">
                    {authName} さん、パスワードを入力してください
                  </p>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="パスワード（6文字以上）"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && authPassword.length >= 6 && !authLoading) {
                        handleAuthSubmit();
                      }
                    }}
                  />
                  {authError && (
                    <p className="text-red-400 text-sm text-center">{authError}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.01, opacity: 0.9 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleAuthSubmit}
                    disabled={authPassword.length < 6 || authLoading}
                    className="w-full bg-accent text-black font-semibold text-body py-3 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {authLoading ? '処理中...' : '開始する'}
                  </motion.button>
                  <button
                    onClick={() => {
                      setAuthPhase('name');
                      setAuthPassword('');
                      setAuthError('');
                    }}
                    className="w-full text-white/40 hover:text-white/60 text-caption transition-colors text-center"
                  >
                    ← 戻る
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-sm space-y-4"
            >
              <p className="text-caption text-white/30 text-center mb-2">
                {user.user_metadata?.display_name || user.email?.replace(/@shadow\.local$/, '') || 'ユーザー'} でログイン中{' '}
                <button onClick={handleLogout} className="text-accent hover:underline">ログアウト</button>
              </p>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-center"
              />

              <motion.button
                whileHover={{ scale: 1.01, opacity: 0.9 }}
                whileTap={{ scale: 0.99 }}
                onClick={startDiagnosis}
                disabled={!name.trim()}
                className="w-full bg-accent text-black font-semibold text-body py-3 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                診断を始める
              </motion.button>

              {savedResult && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setName(savedResult.name);
                    setMbtiResult(savedResult.type);
                    setStep('result');
                  }}
                  className="w-full bg-surface border border-accent/20 text-accent font-semibold text-body py-3 rounded-xl transition-all duration-200"
                >
                  前回の結果を見る（{savedResult.type}）
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Diagnosis */}
      {step === 'diagnosis' && currentQuestion && (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
          {/* Progress */}
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between text-caption text-white/40 mb-2">
              <span>{currentIndex + 1} / {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="w-full max-w-md">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="bg-surface border border-white/5 rounded-2xl p-12"
            >
              <h2 className="text-title-1 text-white text-center mb-10">
                {currentQuestion.question}
              </h2>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(currentQuestion.id, currentQuestion.optionA.value)}
                  className={`w-full px-6 py-4 rounded-xl text-left transition-all duration-200 ${
                    answers[currentQuestion.id] === currentQuestion.optionA.value
                      ? 'bg-accent text-black font-semibold'
                      : 'bg-black/40 border border-white/10 text-white hover:border-accent/40'
                  }`}
                >
                  {currentQuestion.optionA.label}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(currentQuestion.id, currentQuestion.optionB.value)}
                  className={`w-full px-6 py-4 rounded-xl text-left transition-all duration-200 ${
                    answers[currentQuestion.id] === currentQuestion.optionB.value
                      ? 'bg-accent text-black font-semibold'
                      : 'bg-black/40 border border-white/10 text-white hover:border-accent/40'
                  }`}
                >
                  {currentQuestion.optionB.label}
                </motion.button>
              </div>
            </motion.div>

            <button
              onClick={goBack}
              className="mt-6 w-full text-white/40 hover:text-white/60 text-caption transition-colors text-center"
            >
              ← 戻る
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {step === 'result' && character && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="min-h-screen px-6 py-24"
        >
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: easeOut }}
                className="text-caption text-white/40 mb-4 uppercase tracking-wider"
              >
                {displayName}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: easeOut }}
                className="text-6xl mb-6"
              >
                {character.emoji}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: easeOut }}
                className="font-display text-[72px] leading-tight text-white mb-4"
              >
                {displayType}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4, ease: easeOut }}
                className="text-title-2 text-accent mb-4"
              >
                {character.name} — {character.japaneseName}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="text-body text-white/60"
              >
                {character.traits.join('・')}
              </motion.p>
            </motion.div>

            {/* Shadow Function */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: easeOut }}
              className="bg-surface border border-white/5 rounded-2xl p-12 mb-12"
            >
              <h2 className="text-title-1 text-white mb-4">
                影の機能：{character.shadowFunction.name}
              </h2>
              <p className="text-body text-white/70 leading-relaxed mb-4">
                {character.shadowFunction.description}
              </p>
              <p className="text-body text-accent/80">
                成長のヒント：{character.shadowFunction.growthPerspective}
              </p>
            </motion.div>

            {/* Reflection Prompts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6, ease: easeOut }}
              className="bg-surface border border-white/5 rounded-2xl p-12 mb-12"
            >
              <h2 className="text-title-1 text-white mb-6">振り返りのヒント</h2>
              <div className="space-y-4">
                {character.reflectionPrompts.map((prompt, i) => (
                  <div key={i} className="bg-surface-elevated rounded-xl p-4">
                    <p className="text-body text-white/70">{prompt}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.01, opacity: 0.9 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  const params = new URLSearchParams({ name: displayName, mbti: displayType });
                  window.location.href = `/chat?${params.toString()}`;
                }}
                className="w-full bg-accent text-black font-semibold text-body py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                AIと話す
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01, opacity: 0.9 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  const params = new URLSearchParams({ name: displayName, mbti: displayType });
                  window.location.href = `/explore?${params.toString()}`;
                }}
                className="w-full bg-white/10 border border-white/10 text-white font-semibold text-body py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:bg-white/15"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                キャラクターを探る
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={resetAll}
                className="w-full text-white/40 hover:text-white/60 text-body py-2 transition-colors"
              >
                もう一度診断する
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
