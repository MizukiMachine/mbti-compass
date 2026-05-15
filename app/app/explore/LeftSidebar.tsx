import React from 'react';
import { mbtiCharacters } from '../../src/data/mbti-characters';

interface LeftSidebarProps {
  mbtiType: string;
  depth: number;
  breadcrumbTexts: string[];
  onBack: () => void;
  canGoBack: boolean;
}

export default function LeftSidebar({ mbtiType, depth, breadcrumbTexts, onBack, canGoBack }: LeftSidebarProps) {
  const character = mbtiCharacters[mbtiType];
  if (!character) return null;

  const tags = character.traits.slice(0, 4);
  const progress = Math.min(100, Math.max(10, (depth / 5) * 100));

  return (
    <aside className="hidden 2xl:flex w-[340px] bg-[#FBFAF7]/95 border-r border-[#E7DED4] h-full flex-col px-6 pt-7 pb-4 relative shrink-0 z-20">
      <div className="flex items-center gap-3.5 mb-9">
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm">
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
        </div>
        <div className="font-display text-[24px] leading-[0.95] font-bold tracking-[-0.04em] text-[#17131f]">
          <div>Personality</div>
          <div>Tree</div>
        </div>
      </div>

      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={[
          'flex items-center gap-4 mb-6 py-4 px-5 rounded-[18px] border bg-white font-extrabold text-sm transition-all soft-card',
          canGoBack
            ? 'border-[#E8DED3] text-[#2A2338] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(45,33,68,0.1)]'
            : 'border-[#EFE7DF] text-[#A49AAE] cursor-not-allowed opacity-75',
        ].join(' ')}
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        親に戻る
      </button>

      <section className="bg-white rounded-[24px] p-5 xl:p-6 mb-4 soft-card">
        <h3 className="text-[12px] font-extrabold text-[#5B536C] mb-2 tracking-[0.04em]">あなたのMBTI</h3>
        <h2
          className="font-display text-[58px] xl:text-[66px] font-bold leading-none mb-3 tracking-[-0.03em]"
          style={{
            background: 'linear-gradient(135deg, #5B42D2 10%, #9D70E7 54%, #E07B8A 96%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {mbtiType}
        </h2>
        <p className="text-[15px] font-extrabold text-[#2A2338] mb-5">{character.japaneseName}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {tags.map(tag => (
            <span key={tag} className="px-3 py-2 bg-[#F3EDFA] text-[#6D4DE8] font-extrabold text-xs rounded-full text-center">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[20px] p-5 mb-4 soft-card">
        <h3 className="text-[12px] font-extrabold text-[#5B536C] mb-3 tracking-[0.04em]">現在のナビゲーション</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm mb-5">
          <span className="text-[#2A2338] bg-[#F7F4EF] px-3 py-1.5 rounded-full font-extrabold text-xs">{mbtiType}</span>
          {breadcrumbTexts.slice(-3).map((text, index) => {
            const isLast = index === Math.min(breadcrumbTexts.length, 3) - 1;
            return (
              <React.Fragment key={`${text}-${index}`}>
                <span className="text-[#C8BFD3] text-sm font-bold">›</span>
                <span
                  className={[
                    'px-3 py-1.5 rounded-full font-extrabold text-xs max-w-[120px] truncate',
                    isLast ? 'text-[#6D4DE8] border border-[#A77CFF] bg-white' : 'text-[#5B536C] bg-[#F7F4EF]',
                  ].join(' ')}
                  title={text}
                >
                  {text}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[12px] font-extrabold text-[#5B536C] tracking-[0.04em]">探索の深さ</h3>
          <span className="text-[12px] font-extrabold text-[#2A2338]">レベル {depth} / ∞</span>
        </div>
        <div className="relative w-full h-4 flex items-center">
          <div className="absolute left-0 right-0 h-[3px] bg-[#E7DFD8] rounded-full" />
          <div className="absolute left-0 h-[3px] bg-gradient-to-r from-[#6D4DE8] to-[#8A7CE5] rounded-full" style={{ width: `${progress}%` }} />
          <div className="absolute left-0 right-0 flex justify-between">
            {Array.from({ length: 7 }).map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full border-2 border-[#FBFAF7] ${index <= depth ? 'bg-[#6D4DE8]' : 'bg-[#DDD7D2]'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[20px] p-5 mb-4 soft-card">
        <h3 className="text-[12px] font-extrabold text-[#5B536C] mb-4 tracking-[0.04em]">凡例</h3>
        <div className="space-y-3.5">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#6D4DE8] shadow-[0_0_0_5px_rgba(109,77,232,0.12)]" />
            <span className="text-xs text-[#2A2338] font-extrabold">関連する傾向</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FF7A45] shadow-[0_0_0_5px_rgba(255,122,69,0.12)]" />
            <span className="text-xs text-[#2A2338] font-extrabold">相反する傾向</span>
          </div>
        </div>
      </section>

      <div className="mt-auto relative overflow-hidden rounded-[22px] soft-card h-40 bg-gradient-to-b from-white to-[#EEE7FF]">
        <svg viewBox="0 0 320 170" className="absolute inset-0 w-full h-full">
          <path d="M0 170V92c34 20 53 13 80-4 33-20 63-18 93 9 27 25 59 27 91 4 24-17 40-22 56-15v84H0Z" fill="#F4F0FF" />
          <path d="M0 170V121c42-8 67-2 94 20 29 24 60 20 90-2 38-28 78-28 136-2v33H0Z" fill="#DDD3F3" opacity="0.75" />
          {[24, 54, 210, 246, 282].map((x, index) => (
            <path key={x} d={`M${x} 146l${12 + index * 2}-54 ${14 + index * 2} 54H${x}Z`} fill="#BBAEE1" opacity="0.52" />
          ))}
          <path d="M107 170c20-38 43-59 73-72 13-6 24-10 34-22-18 28-40 48-65 68-11 9-19 17-23 26h-19Z" fill="white" opacity="0.86" />
        </svg>
        <p className="absolute left-0 right-0 top-6 text-center text-xs text-[#5B536C] font-extrabold leading-relaxed">
          どこまでも深掘りできる<br />
          あなたの性格の森を探検しよう
        </p>
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[#5B536C]">
          {['?', 'bookmark', 'gear'].map(item => (
            <button key={item} className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center hover:text-[#6D4DE8] transition-colors">
              {item === '?' && <span className="font-bold">?</span>}
              {item === 'bookmark' && (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.6 3.3c1.1.1 1.9 1.1 1.9 2.2V21L12 17.3 4.5 21V5.5c0-1.1.8-2.1 1.9-2.2a48.5 48.5 0 0 1 11.2 0Z" />
                </svg>
              )}
              {item === 'gear' && (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 4.3c.4-1.7 2.9-1.7 3.4 0a1.7 1.7 0 0 0 2.5 1c1.5-.9 3.2.8 2.3 2.3a1.7 1.7 0 0 0 1 2.5c1.7.4 1.7 2.9 0 3.4a1.7 1.7 0 0 0-1 2.5c.9 1.5-.8 3.2-2.3 2.3a1.7 1.7 0 0 0-2.5 1c-.4 1.7-2.9 1.7-3.4 0a1.7 1.7 0 0 0-2.5-1c-1.5.9-3.2-.8-2.3-2.3a1.7 1.7 0 0 0-1-2.5c-1.7-.4-1.7-2.9 0-3.4a1.7 1.7 0 0 0 1-2.5c-.9-1.5.8-3.2 2.3-2.3a1.7 1.7 0 0 0 2.5-1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
