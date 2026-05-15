'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExploreNode, NodeType } from '../../src/types/explore';

const nodeSchemes: Record<NodeType, { color: string; soft: string; border: string; gradient: string }> = {
  related: { color: '#6D4DE8', soft: '#F1EDFF', border: '#B99BFF', gradient: 'linear-gradient(145deg, #8B6CF4, #5B35D5)' },
  contrast: { color: '#FF7A45', soft: '#FFF1E9', border: '#FFB08C', gradient: 'linear-gradient(145deg, #FF9A68, #FF6533)' },
  deep: { color: '#3D7BEF', soft: '#EEF5FF', border: '#9BC1FF', gradient: 'linear-gradient(145deg, #66A1FF, #2E6CE2)' },
  growth: { color: '#18A879', soft: '#EAFBF5', border: '#8EDDC3', gradient: 'linear-gradient(145deg, #33C997, #119A6D)' },
  shadow: { color: '#EF5555', soft: '#FFF0F0', border: '#FFAAAA', gradient: 'linear-gradient(145deg, #FF7777, #DF4141)' },
};

function NodeGlyph({ type, className = 'w-6 h-6' }: { type: NodeType; className?: string }) {
  if (type === 'contrast') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 7h14M7 7l-3 7h6L7 7Zm10 0-3 7h6l-3-7Z" />
      </svg>
    );
  }
  if (type === 'deep') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c2.8 2.6 5 5.6 5 9a5 5 0 0 1-10 0c0-3.4 2.2-6.4 5-9Z" />
      </svg>
    );
  }
  if (type === 'growth') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18c7.5 0 12-4.5 12-12M9 6h7v7M5 13l4-4" />
      </svg>
    );
  }
  if (type === 'shadow') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6.5v5.8c0 4.3 3.1 7.2 7.5 8.7 4.4-1.5 7.5-4.4 7.5-8.7V6.5L12 3Z" />
        <path strokeLinecap="round" d="M9.5 12h5" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.8 14.5 9l5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4L9.5 9 12 3.8Z" />
    </svg>
  );
}

interface DescriptionPanelProps {
  node: ExploreNode | null;
  breadcrumbTexts: string[];
  onBack: () => void;
  canGoBack: boolean;
  onDigDeeper: () => void;
  isLoadingChildren: boolean;
}

function InfoCard({
  title,
  items,
  color,
  icon,
}: {
  title: string;
  items: string[];
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <section className="bg-white/88 rounded-[18px] border border-[#ECE4DC] p-5 shadow-[0_10px_28px_rgba(45,33,68,0.06)]">
      <h3 className="flex items-center justify-between text-[16px] font-extrabold text-[#2A2338] mb-4">
        <span className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 0 5px ${color}18` }} />
          {title}
        </span>
        <span style={{ color }}>{icon}</span>
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-3 text-[14px] text-[#3D354B] font-medium leading-relaxed">
            <span className="text-[#17131f] mt-[0.55em] w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DescriptionPanel({
  node,
  breadcrumbTexts,
  onBack,
  canGoBack,
  onDigDeeper,
  isLoadingChildren,
}: DescriptionPanelProps) {
  if (!node) {
    return (
      <>
        <div className="lg:hidden fixed inset-x-3 bottom-3 z-40 rounded-[18px] bg-white/95 border border-[#E8DED3] shadow-[0_16px_38px_rgba(36,25,58,0.14)] p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#F1EDFF] text-[#6D4DE8] flex items-center justify-center">
              <NodeGlyph type="related" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#17131f]">テーマを選択</p>
              <p className="text-xs text-[#746B82]">ノードを選ぶと説明と深掘りが表示されます</p>
            </div>
          </div>
        </div>
        <aside className="hidden 2xl:flex w-[420px] bg-white/86 border border-[#E8DED3] h-[calc(100vh-28px)] my-3.5 mr-3.5 rounded-[28px] soft-card shrink-0 flex-col justify-center px-8 text-center z-20 backdrop-blur-xl">
          <div className="w-20 h-20 rounded-full bg-[#F1EDFF] text-[#6D4DE8] flex items-center justify-center mx-auto mb-5 shadow-[0_14px_30px_rgba(109,77,232,0.16)]">
            <NodeGlyph type="related" className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#17131f] mb-3">テーマを選択</h2>
          <p className="text-sm text-[#746B82] leading-relaxed">
            中央のノードを選ぶと、ここに説明と深掘りの入口が表示されます。
          </p>
        </aside>
      </>
    );
  }

  const scheme = nodeSchemes[node.nodeType] ?? nodeSchemes.related;
  const recentCrumbs = breadcrumbTexts.slice(-3);

  return (
    <>
      <section className="lg:hidden fixed inset-x-3 bottom-3 z-40 rounded-[22px] bg-white/96 border border-[#E8DED3] shadow-[0_18px_40px_rgba(36,25,58,0.16)] backdrop-blur-xl overflow-hidden max-h-[58dvh] flex flex-col">
        <div className="px-4 pt-4 pb-3 border-b border-[#EFE7DE]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-full text-white border-2 border-white shrink-0 shadow-[0_10px_22px_rgba(92,66,210,0.2)]" style={{ background: scheme.gradient }}>
              <div className="w-full h-full flex items-center justify-center">
                <NodeGlyph type={node.nodeType} className="w-5 h-5" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-[22px] font-extrabold text-[#17131f] leading-tight truncate">{node.text}</h2>
              <span className="inline-flex mt-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold" style={{ backgroundColor: scheme.soft, color: scheme.color }}>
                現在のテーマ
              </span>
            </div>
          </div>
          <p className="text-[13px] text-[#3D354B] leading-relaxed line-clamp-2">{node.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          <InfoCard title="特徴" items={node.features.slice(0, 2)} color="#806BE8" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          } />
          <div className="flex flex-wrap gap-2">
            {recentCrumbs.map((text, index) => (
              <span key={`${text}-${index}`} className="px-2.5 py-1 rounded-full bg-[#F7F4EF] text-[#746B82] text-[10px] font-extrabold max-w-[110px] truncate">
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3.5 pt-2 border-t border-[#EFE7DE] bg-white/96">
          <button
            onClick={onDigDeeper}
            disabled={isLoadingChildren}
            className="w-full bg-gradient-to-r from-[#7A62E8] to-[#5430D1] text-white font-extrabold text-[14px] py-3 rounded-[12px] transition-all flex items-center justify-center gap-2 mb-2 disabled:opacity-70"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 21.7 13.7 16.6l-2.5 2.2.6-9.4 5.2 7.9-3.3-.7M7.5 18.5A8.3 8.3 0 1 1 20.3 10.5" />
            </svg>
            {isLoadingChildren ? '探索中...' : 'さらに深掘り'}
          </button>
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="w-full bg-white text-[#2A2338] font-extrabold text-[13px] py-2.5 rounded-[12px] border border-[#E8DED3] disabled:opacity-45"
          >
            ルートに戻る
          </button>
        </div>
      </section>

      <aside className="hidden 2xl:flex w-[420px] bg-white/88 border border-[#E8DED3] h-[calc(100vh-28px)] my-3.5 mr-3.5 rounded-[28px] soft-card shrink-0 flex-col relative overflow-hidden z-20 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white via-white/92 to-transparent pointer-events-none z-10" />
        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col h-full overflow-y-auto relative z-0"
          >
            <header className="px-6 xl:px-8 pt-9 pb-5 shrink-0 relative z-20">
              <button className="absolute top-8 right-7 text-[#B7AFBD] hover:text-[#6D4DE8] transition-colors">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.6 3.3c1.1.1 1.9 1.1 1.9 2.2V21L12 17.3 4.5 21V5.5c0-1.1.8-2.1 1.9-2.2a48.5 48.5 0 0 1 11.2 0Z" />
                </svg>
              </button>

              <div className="flex items-center gap-5 mb-6 pr-10">
                <div
                  className="w-[76px] h-[76px] rounded-full flex items-center justify-center text-white shadow-[0_16px_32px_rgba(92,66,210,0.24)] border-[5px] border-white shrink-0"
                  style={{ background: scheme.gradient }}
                >
                  <NodeGlyph type={node.nodeType} className="w-9 h-9" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[32px] font-extrabold text-[#17131f] mb-2 tracking-[-0.04em] leading-tight truncate">
                    {node.text}
                  </h2>
                  <span className="inline-flex px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.02em]" style={{ backgroundColor: scheme.soft, color: scheme.color }}>
                    現在のテーマ
                  </span>
                </div>
              </div>

              <div className="text-[#3D354B] text-[14px] leading-[1.9] font-medium space-y-4">
                {node.description.split('\n').filter(Boolean).map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>

              {recentCrumbs.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {recentCrumbs.map((text, index) => (
                    <span key={`${text}-${index}`} className="px-3 py-1 rounded-full bg-[#F7F4EF] text-[#746B82] text-[11px] font-extrabold max-w-[118px] truncate" title={text}>
                      {text}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="px-6 xl:px-8 pb-36 space-y-5 flex-1">
              <InfoCard
                title="特徴"
                items={node.features}
                color="#806BE8"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                }
              />

              <InfoCard
                title="強み"
                items={node.strengths}
                color="#3D7BEF"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.8 14.5 9l5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4L9.5 9 12 3.8Z" />
                  </svg>
                }
              />

              <InfoCard
                title="注意点"
                items={node.cautions}
                color="#FF7A45"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.4 4.4 2.9 17.4A1.7 1.7 0 0 0 4.4 20h15.2a1.7 1.7 0 0 0 1.5-2.6L13.6 4.4a1.8 1.8 0 0 0-3.2 0Z" />
                  </svg>
                }
              />

              <section className="space-y-4 pt-1">
                <div>
                  <span className="text-xs font-extrabold text-[#5B536C] block mb-3">関連テーマ</span>
                  <div className="flex flex-wrap gap-2">
                    {node.relatedThemes.map((theme, index) => (
                      <span key={`${theme}-${index}`} className="px-3.5 py-1.5 bg-[#F1EDFF] text-[#6D4DE8] font-extrabold text-xs rounded-full border border-[#B99BFF]/50">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#5B536C] block mb-3">相反テーマ</span>
                  <div className="flex flex-wrap gap-2">
                    {node.opposingThemes.map((theme, index) => (
                      <span key={`${theme}-${index}`} className="px-3.5 py-1.5 bg-[#FFF1E9] text-[#E75F2E] font-extrabold text-xs rounded-full border border-[#FFB08C]/60">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-5 xl:p-6 pt-14 bg-gradient-to-t from-white via-white/96 to-transparent z-30">
          <button
            onClick={onDigDeeper}
            disabled={isLoadingChildren}
            className="w-full bg-gradient-to-r from-[#7A62E8] to-[#5430D1] hover:shadow-[0_18px_34px_rgba(86,48,209,0.28)] text-white font-extrabold text-[15px] py-4 rounded-[14px] transition-all flex items-center justify-center gap-3 mb-3 disabled:opacity-70 disabled:hover:shadow-none"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 21.7 13.7 16.6l-2.5 2.2.6-9.4 5.2 7.9-3.3-.7M7.5 18.5A8.3 8.3 0 1 1 20.3 10.5" />
            </svg>
            {isLoadingChildren ? '探索中...' : 'さらに深掘り'}
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-auto -mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="w-full bg-white hover:bg-[#FBFAF7] text-[#2A2338] font-extrabold text-[14px] py-3.5 rounded-[14px] border border-[#E8DED3] transition-colors flex items-center justify-center shadow-[0_8px_22px_rgba(45,33,68,0.06)] disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
            ルートに戻る
          </button>
        </div>
      </aside>
    </>
  );
}
