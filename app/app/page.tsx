'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  calculateMbti,
  DIAGNOSIS_QUESTION_COUNT,
  MbtiAxis,
  MbtiQuestion,
  shuffleQuestions,
} from '../src/data/mbti-questions';

const easeOut = [0.16, 1, 0.3, 1];
const STORAGE_KEY = 'office-compass-self-result';
const LEGACY_STORAGE_KEY = 'mbti-shadow-friend-result';

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

function LogoMark({ className = 'h-12 w-12' }: { className?: string }) {
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

function ArrowRightIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function BackIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-gradient-to-r from-[#7A62E8] to-[#5430D1] px-5 py-4 text-[15px] font-extrabold text-white shadow-[0_16px_34px_rgba(86,48,209,0.22)] transition-all disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
    >
      {children}
    </motion.button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onEnter?: () => void;
}) {
  return (
    <input
      type="text"
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[16px] border border-[#E8DED3] bg-white px-5 py-4 text-center text-[15px] font-bold text-[#17131f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none placeholder:text-[#A49AAE] focus:border-[#A77CFF] focus:ring-4 focus:ring-[#EDE8FF]"
      onKeyDown={(event) => {
        if (event.key === 'Enter') onEnter?.();
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SavedResult;
      setSavedResult(parsed);
      if (parsed.name) setName(parsed.name);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const startDiagnosis = () => {
    setQuestions(shuffleQuestions());
    setCurrentIndex(0);
    setAnswers({});
    setStep('diagnosis');
  };

  const openMap = (result: SavedResult) => {
    const params = new URLSearchParams({ name: result.name, mbti: result.type });
    window.location.href = `/explore?${params.toString()}`;
  };

  const handleAnswer = (questionId: number, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const result = calculateMbti(newAnswers);
    const saveData: SavedResult = {
      type: result,
      name: name.trim() || 'あなた',
      answeredAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    setSavedResult(saveData);
    openMap(saveData);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setStep('landing');
    }
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
                <div>
                  <p className="text-[11px] font-extrabold text-[#7A62E8]">OFFICE COMPASS</p>
                  <div className="text-[22px] font-extrabold leading-[1.02] text-[#17131f]">
                    職場関係
                    <br />
                    シミュレーター
                  </div>
                </div>
              </div>
              <span className="hidden rounded-full border border-[#E8DED3] bg-white/80 px-4 py-2 text-[12px] font-extrabold text-[#5B536C] shadow-sm sm:inline-flex">
                {DIAGNOSIS_QUESTION_COUNT} QUESTIONS
              </span>
            </header>

            <main className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
              <section className="min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8DED3] bg-white/78 px-4 py-2 text-[12px] font-extrabold text-[#6D4DE8] soft-card">
                    WORKPLACE RELATIONSHIP MAP
                  </div>
                  <h1 className="text-[46px] font-extrabold leading-[0.98] text-[#17131f] sm:text-[62px] lg:text-[76px]">
                    職場の人間関係を
                    <br />
                    相談できる地図に
                  </h1>
                  <p className="mt-5 max-w-xl text-[16px] font-bold leading-relaxed text-[#5B536C] sm:text-[17px]">
                    まず自分のMBTI傾向を診断し、中心に自分、周囲に上司・同僚・後輩などの人物スロットを配置します。相手ごとに、頼み方、断り方、1on1、関係修復の方針をシミュレーションできます。
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
                  className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
                >
                  {[
                    ['人物スロット', '上司・同僚・後輩をプリセットで配置'],
                    ['相談パネル', '頼む・断る・謝る・雑談を選択'],
                    ['実用アウトプット', '方針、NG表現、文面、次の一手'],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-[18px] border border-[#E8DED3] bg-white/86 p-4 soft-card">
                      <p className="text-[13px] font-extrabold text-[#2A2338]">{title}</p>
                      <p className="mt-2 text-[12px] font-bold leading-relaxed text-[#746B82]">{body}</p>
                    </div>
                  ))}
                </motion.div>
              </section>

              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45, ease: easeOut }}
                className="glass-surface soft-card rounded-[28px] p-5 sm:p-7"
              >
                <div className="space-y-5">
                  <div>
                    <p className="text-[12px] font-extrabold text-[#6D4DE8]">START</p>
                    <h2 className="mt-2 text-[27px] font-extrabold leading-tight text-[#17131f]">
                      自分の診断から始める
                    </h2>
                    <p className="mt-2 text-[14px] font-bold leading-relaxed text-[#746B82]">
                      名前は職場マップの中心表示と保存データにだけ使います。
                    </p>
                  </div>

                  <TextInput
                    value={name}
                    onChange={setName}
                    placeholder="お名前"
                    onEnter={() => {
                      if (name.trim()) startDiagnosis();
                    }}
                  />

                  <PrimaryButton onClick={startDiagnosis} disabled={!name.trim()}>
                    自分診断を始める
                    <ArrowRightIcon />
                  </PrimaryButton>

                  {savedResult && (
                    <button
                      type="button"
                      onClick={() => openMap(savedResult)}
                      className="flex w-full items-center justify-between gap-4 rounded-[16px] border border-[#B99BFF] bg-[#F1EDFF] px-5 py-4 text-left text-[#5B42D2] transition-all hover:border-[#7A62E8]"
                    >
                      <span className="font-extrabold">前回の職場マップを開く</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[12px] font-extrabold">{savedResult.type}</span>
                    </button>
                  )}
                </div>
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
                  <p className="text-[11px] font-extrabold text-[#9B91A8]">SELF DIAGNOSIS</p>
                  <p className="text-[15px] font-extrabold text-[#2A2338]">職場関係シミュレーター</p>
                </div>
              </div>
              <div className="rounded-full border border-[#E8DED3] bg-white/86 px-4 py-2 text-[12px] font-extrabold text-[#5B536C] soft-card">
                {currentIndex + 1} / {questions.length}
              </div>
            </header>

            <main className="grid flex-1 items-center gap-6 py-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-9">
              <aside className="hidden lg:block">
                <div className="glass-surface soft-card rounded-[26px] p-5">
                  <p className="text-[12px] font-extrabold text-[#6D4DE8]">PROGRESS</p>
                  <div className="mt-4">
                    <div className="mb-3 flex items-end justify-between">
                      <span className="text-[46px] font-extrabold leading-none text-[#17131f]">
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
                        <div key={axis} className="rounded-[16px] border border-[#E8DED3] bg-white/74 p-3">
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
                  className="soft-card rounded-[28px] border border-[#E8DED3] bg-white p-5 sm:p-7 lg:p-9"
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
                            'group relative flex min-h-[148px] w-full flex-col items-start rounded-[22px] border bg-white p-5 text-left transition-all',
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
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-3 text-[13px] font-extrabold text-[#746B82] transition-colors hover:bg-white hover:text-[#6D4DE8] sm:w-auto sm:px-5"
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
