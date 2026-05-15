'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  shuffleQuestions,
  calculateMbti,
  MbtiQuestion,
  MbtiAxis,
  DIAGNOSIS_QUESTION_COUNT,
} from '../src/data/mbti-questions';
import { createClient } from '../src/lib/supabase/client';
import { toDummyEmail } from '../src/lib/auth';
import type { User } from '@supabase/supabase-js';

const easeOut = [0.16, 1, 0.3, 1];
const STORAGE_KEY = 'mbti-shadow-friend-result';

const axisMeta: Record<MbtiAxis, { label: string; title: string; color: string; soft: string; border: string }> = {
  EI: { label: 'ENERGY', title: '外向 / 内向', color: '#6D4DE8', soft: '#F1EDFF', border: '#B99BFF' },
  SN: { label: 'PERCEIVE', title: '感覚 / 直感', color: '#3D7BEF', soft: '#EEF5FF', border: '#9BC1FF' },
  TF: { label: 'DECIDE', title: '思考 / 感情', color: '#18A879', soft: '#EAFBF5', border: '#8EDDC3' },
  JP: { label: 'STYLE', title: '判断 / 知覚', color: '#FF7A45', soft: '#FFF1E9', border: '#FFB08C' },
};

interface SavedResult {
  type: string;
  name: string;
  answeredAt: string;
}

type Step = 'landing' | 'diagnosis';
type AuthPhase = 'name' | 'password';

function LogoMark({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 41V23" stroke="#7D66D9" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 40h16" stroke="#7D66D9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="15" r="5.5" fill="#6D4DE8" />
      <circle cx="15" cy="19" r="3.4" fill="#FF7A45" />
      <circle cx="33" cy="19" r="3.4" fill="#3D7BEF" />
      <circle cx="18" cy="10" r="2.4" fill="#FFB35C" />
      <circle cx="30" cy="10" r="2.4" fill="#F56E9C" />
      <circle cx="10" cy="27" r="2" fill="#8D6AF2" />
      <circle cx="38" cy="27" r="2" fill="#18A879" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function BackIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

function SparkIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m18 14 .8 2.5 2.2.7-2.2.7-.8 2.5-.8-2.5-2.2-.7 2.2-.7.8-2.5ZM6 14l.6 1.8 1.6.5-1.6.5L6 18.6l-.6-1.8-1.6-.5 1.6-.5L6 14Z" />
    </svg>
  );
}

function AxisBadge({ axis }: { axis: MbtiAxis }) {
  const meta = axisMeta[axis];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-extrabold"
      style={{ color: meta.color, background: meta.soft, borderColor: meta.border }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
      {meta.title}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#7A62E8] to-[#5430D1] px-5 py-4 text-[15px] font-extrabold text-white shadow-[0_16px_34px_rgba(86,48,209,0.22)] transition-all disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
    >
      {children}
    </motion.button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'password';
  autoFocus?: boolean;
  onEnter?: () => void;
}) {
  return (
    <input
      type={type}
      required
      autoFocus={autoFocus}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[18px] border border-[#E8DED3] bg-white px-5 py-4 text-center text-[15px] font-bold text-[#17131f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#A49AAE] focus:border-[#A77CFF] focus:outline-none focus:ring-4 focus:ring-[#EDE8FF]"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onEnter?.();
        }
      }}
    />
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState<MbtiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
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

    // Login failed -> try signup
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

      // Redirect to explore page directly
      const params = new URLSearchParams({ name, mbti: result });
      window.location.href = `/explore?${params.toString()}`;
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answeredAxisCounts = questions.reduce<Record<MbtiAxis, number>>(
    (counts, question) => {
      if (answers[question.id]) counts[question.axis] += 1;
      return counts;
    },
    { EI: 0, SN: 0, TF: 0, JP: 0 },
  );

  return (
    <div className="min-h-screen bg-background text-[#17131f]">
      {step === 'landing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="min-h-screen explore-canvas-texture"
        >
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-7 lg:px-8">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LogoMark />
                <div className="font-display text-[23px] font-bold leading-[0.95] text-[#17131f]">
                  <div>Shadow</div>
                  <div>Friend</div>
                </div>
              </div>
              <span className="hidden rounded-full border border-[#E8DED3] bg-white/80 px-4 py-2 text-[12px] font-extrabold text-[#5B536C] shadow-sm sm:inline-flex">
                {DIAGNOSIS_QUESTION_COUNT} QUESTIONS
              </span>
            </header>

            <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-10">
              <section className="min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8DED3] bg-white/78 px-4 py-2 text-[12px] font-extrabold text-[#6D4DE8] soft-card">
                    <SparkIcon className="h-4 w-4" />
                    PERSONALITY TREE
                  </div>
                  <h1 className="font-display text-[48px] font-bold leading-[0.96] text-[#17131f] sm:text-[64px] lg:text-[76px]">
                    シャドウ
                    <br />
                    フレンドAI
                  </h1>
                  <p className="mt-5 max-w-xl text-[16px] font-bold leading-relaxed text-[#5B536C] sm:text-[17px]">
                    {DIAGNOSIS_QUESTION_COUNT}問の診断から、あなたのMBTIタイプと認知の偏りを探索ツリーで表示します。
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
                  className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {(Object.keys(axisMeta) as MbtiAxis[]).map((axis) => (
                    <div key={axis} className="rounded-[18px] border border-[#E8DED3] bg-white/86 p-4 soft-card">
                      <p className="text-[11px] font-extrabold text-[#9B91A8]">{axisMeta[axis].label}</p>
                      <p className="mt-2 text-[14px] font-extrabold text-[#2A2338]">{axisMeta[axis].title}</p>
                    </div>
                  ))}
                </motion.div>
              </section>

              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45, ease: easeOut }}
                className="glass-surface soft-card rounded-[30px] p-5 sm:p-7"
              >
                {!user ? (
                  <div className="space-y-5">
                    <div>
                      <p className="text-[12px] font-extrabold text-[#6D4DE8]">ACCOUNT</p>
                      <h2 className="mt-2 text-[26px] font-extrabold leading-tight text-[#17131f]">
                        {authPhase === 'name' ? '名前を入力' : 'パスワードを入力'}
                      </h2>
                      <p className="mt-2 text-[14px] font-bold leading-relaxed text-[#746B82]">
                        {authPhase === 'name'
                          ? '診断結果はアカウントとブラウザに保存されます。'
                          : `${authName} さんとして続けます。`}
                      </p>
                    </div>

                    {authPhase === 'name' ? (
                      <>
                        <TextInput
                          value={authName}
                          onChange={setAuthName}
                          placeholder="お名前"
                          onEnter={() => {
                            if (authName.trim()) {
                              setAuthPhase('password');
                              setAuthError('');
                            }
                          }}
                        />
                        <PrimaryButton
                          onClick={() => {
                            if (authName.trim()) {
                              setAuthPhase('password');
                              setAuthError('');
                            }
                          }}
                          disabled={!authName.trim()}
                        >
                          次へ
                          <ArrowRightIcon className="h-5 w-5" />
                        </PrimaryButton>
                      </>
                    ) : (
                      <>
                        <TextInput
                          type="password"
                          autoFocus
                          value={authPassword}
                          onChange={setAuthPassword}
                          placeholder="パスワード（6文字以上）"
                          onEnter={() => {
                            if (authPassword.length >= 6 && !authLoading) {
                              handleAuthSubmit();
                            }
                          }}
                        />
                        {authError && (
                          <p className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600">
                            {authError}
                          </p>
                        )}
                        <PrimaryButton
                          onClick={handleAuthSubmit}
                          disabled={authPassword.length < 6 || authLoading}
                        >
                          {authLoading ? '処理中...' : '開始する'}
                          {!authLoading && <ArrowRightIcon className="h-5 w-5" />}
                        </PrimaryButton>
                        <button
                          onClick={() => {
                            setAuthPhase('name');
                            setAuthPassword('');
                            setAuthError('');
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3 text-[13px] font-extrabold text-[#746B82] transition-colors hover:bg-white hover:text-[#6D4DE8]"
                        >
                          <BackIcon className="h-4 w-4" />
                          戻る
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#E8DED3] bg-white/82 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-extrabold text-[#9B91A8]">SIGNED IN</p>
                        <p className="truncate text-[14px] font-extrabold text-[#2A2338]">
                          {user.user_metadata?.display_name || user.email?.replace(/@shadow\.local$/, '') || 'ユーザー'}
                        </p>
                      </div>
                      <button onClick={handleLogout} className="shrink-0 text-[12px] font-extrabold text-[#6D4DE8] hover:underline">
                        ログアウト
                      </button>
                    </div>

                    <div>
                      <p className="text-[12px] font-extrabold text-[#6D4DE8]">DIAGNOSIS</p>
                      <h2 className="mt-2 text-[26px] font-extrabold leading-tight text-[#17131f]">診断を始める</h2>
                      <p className="mt-2 text-[14px] font-bold leading-relaxed text-[#746B82]">
                        名前は結果ページのURLと保存データに使われます。
                      </p>
                    </div>

                    <TextInput value={name} onChange={setName} placeholder="お名前" />

                    <PrimaryButton onClick={startDiagnosis} disabled={!name.trim()}>
                      診断を始める
                      <ArrowRightIcon className="h-5 w-5" />
                    </PrimaryButton>

                    {savedResult && (
                      <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          const params = new URLSearchParams({ name: savedResult.name, mbti: savedResult.type });
                          window.location.href = `/explore?${params.toString()}`;
                        }}
                        className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-[#B99BFF] bg-[#F1EDFF] px-5 py-4 text-left text-[#5B42D2] transition-all hover:border-[#7A62E8]"
                      >
                        <span className="font-extrabold">前回の結果を見る</span>
                        <span className="rounded-full bg-white px-3 py-1 text-[12px] font-extrabold">{savedResult.type}</span>
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.section>
            </main>
          </div>
        </motion.div>
      )}

      {step === 'diagnosis' && currentQuestion && (
        <div className="min-h-screen explore-canvas-texture">
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-7 lg:px-8">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LogoMark className="h-10 w-10" />
                <div>
                  <p className="text-[11px] font-extrabold text-[#9B91A8]">MBTI DIAGNOSIS</p>
                  <p className="text-[15px] font-extrabold text-[#2A2338]">シャドウフレンドAI</p>
                </div>
              </div>
              <div className="rounded-full border border-[#E8DED3] bg-white/86 px-4 py-2 text-[12px] font-extrabold text-[#5B536C] soft-card">
                {currentIndex + 1} / {questions.length}
              </div>
            </header>

            <main className="grid flex-1 items-center gap-6 py-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-9">
              <aside className="hidden lg:block">
                <div className="glass-surface soft-card rounded-[28px] p-5">
                  <p className="text-[12px] font-extrabold text-[#6D4DE8]">PROGRESS</p>
                  <div className="mt-4">
                    <div className="mb-3 flex items-end justify-between">
                      <span className="font-display text-[46px] font-bold leading-none text-[#17131f]">
                        {Math.round(progress)}%
                      </span>
                      <span className="text-[12px] font-extrabold text-[#746B82]">
                        {Object.keys(answers).length} answered
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[#E7DFD8]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-[#7A62E8] to-[#FF7A45]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(Object.keys(axisMeta) as MbtiAxis[]).map((axis) => {
                      const meta = axisMeta[axis];
                      return (
                        <div key={axis} className="rounded-[18px] border border-[#E8DED3] bg-white/74 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-extrabold text-[#9B91A8]">{meta.label}</p>
                              <p className="truncate text-[13px] font-extrabold text-[#2A2338]">{meta.title}</p>
                            </div>
                            <span
                              className="rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                              style={{ color: meta.color, background: meta.soft }}
                            >
                              {answeredAxisCounts[axis]} / 5
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <section className="min-w-0">
                <div className="mb-5 lg:hidden">
                  <div className="mb-2 flex justify-between text-[12px] font-extrabold text-[#5B536C]">
                    <span>{currentIndex + 1} / {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#E7DFD8]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#7A62E8] to-[#FF7A45]"
                    />
                  </div>
                </div>

                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: easeOut }}
                  className="soft-card rounded-[30px] border border-[#E8DED3] bg-white p-5 sm:p-7 lg:p-9"
                >
                  <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                    <AxisBadge axis={currentQuestion.axis} />
                    <span className="rounded-full bg-[#F7F4EF] px-3 py-1.5 text-[12px] font-extrabold text-[#746B82]">
                      QUESTION {currentIndex + 1}
                    </span>
                  </div>

                  <h2 className="text-[28px] font-extrabold leading-[1.25] text-[#17131f] sm:text-[34px] lg:text-[40px]">
                    {currentQuestion.question}
                  </h2>

                  <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2">
                    {[currentQuestion.optionA, currentQuestion.optionB].map((option, index) => {
                      const isSelected = answers[currentQuestion.id] === option.value;
                      const meta = axisMeta[currentQuestion.axis];
                      return (
                        <motion.button
                          key={`${currentQuestion.id}-${option.value}`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(currentQuestion.id, option.value)}
                          className={[
                            'group relative flex min-h-[148px] w-full flex-col items-start rounded-[24px] border bg-white p-5 text-left transition-all',
                            isSelected
                              ? 'shadow-[0_18px_42px_rgba(109,77,232,0.18),0_0_0_6px_rgba(109,77,232,0.08)]'
                              : 'shadow-[0_12px_30px_rgba(45,33,68,0.07)] hover:shadow-[0_18px_42px_rgba(45,33,68,0.11)]',
                          ].join(' ')}
                          style={{ borderColor: isSelected ? meta.border : '#E8DED3' }}
                        >
                          <span
                            className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white font-extrabold shadow-[0_10px_22px_rgba(45,33,68,0.12)]"
                            style={{ color: isSelected ? '#FFFFFF' : meta.color, background: isSelected ? meta.color : meta.soft }}
                          >
                            {index + 1}
                          </span>
                          <span className="block max-w-full break-words pr-12 text-[17px] font-extrabold leading-relaxed text-[#2A2338] [overflow-wrap:anywhere]">
                            {option.label}
                          </span>
                          <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F4EF] text-[#746B82] transition-colors group-hover:bg-[#F1EDFF] group-hover:text-[#6D4DE8]">
                            <ArrowRightIcon className="h-4 w-4" />
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                <button
                  onClick={goBack}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-[13px] font-extrabold text-[#746B82] transition-colors hover:bg-white hover:text-[#6D4DE8] sm:w-auto sm:px-5"
                >
                  <BackIcon className="h-4 w-4" />
                  戻る
                </button>
              </section>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
