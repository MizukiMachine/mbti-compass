'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { WorkplacePerson, WorkplaceNodeTone } from '../../src/types/workplace';

interface WorkplaceMapCanvasProps {
  selfName: string;
  selfMbti: string;
  people: WorkplacePerson[];
  selectedPersonId: string | null;
  onSelectPerson: (personId: string) => void;
}

const toneSchemes: Record<WorkplaceNodeTone, { color: string; soft: string; border: string }> = {
  driver: { color: '#6D4DE8', soft: '#F1EDFF', border: '#B99BFF' },
  supporter: { color: '#18A879', soft: '#EAFBF5', border: '#8EDDC3' },
  analyst: { color: '#3D7BEF', soft: '#EEF5FF', border: '#9BC1FF' },
  creative: { color: '#FF7A45', soft: '#FFF1E9', border: '#FFB08C' },
  operator: { color: '#7D6B58', soft: '#F8F3EE', border: '#D6C4B2' },
  challenger: { color: '#EF5555', soft: '#FFF0F0', border: '#FFAAAA' },
};

const GRAPH_WIDTH = 1320;
const GRAPH_HEIGHT = 1180;
const CENTER_X = GRAPH_WIDTH / 2;
const CENTER_Y = GRAPH_HEIGHT / 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPersonPosition(index: number, total: number) {
  const slots = [
    ...[170, 415, 660, 905, 1150].map(x => ({ x, y: 105 })),
    ...[270, 430, 590, 750, 910].map(y => ({ x: 1190, y })),
    ...[1150, 905, 660, 415, 170].map(x => ({ x, y: 1075 })),
    ...[910, 750, 590, 430, 270].map(y => ({ x: 130, y })),
    { x: 380, y: 300 },
    { x: 660, y: 290 },
    { x: 940, y: 300 },
    { x: 520, y: 880 },
    { x: 800, y: 880 },
  ];

  if (index < slots.length) {
    const slot = slots[index];
    return {
      x: slot.x - CENTER_X,
      y: slot.y - CENTER_Y,
    };
  }

  const overflowIndex = index - slots.length;
  const overflowTotal = Math.max(total - slots.length, 1);
  const angle = (overflowIndex / overflowTotal) * Math.PI * 2 - Math.PI / 2;

  return {
    x: Math.cos(angle) * 330,
    y: Math.sin(angle) * 245,
  };
}

export default function WorkplaceMapCanvas({
  selfName,
  selfMbti,
  people,
  selectedPersonId,
  onSelectPerson,
}: WorkplaceMapCanvasProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const selectedPerson = people.find(person => person.id === selectedPersonId) ?? people[0] ?? null;
  const scale = useMemo(() => {
    if (!canvasSize.width || !canvasSize.height) return 0.72;
    const fitWidth = (canvasSize.width - 56) / GRAPH_WIDTH;
    const fitHeight = (canvasSize.height - 116) / GRAPH_HEIGHT;
    return clamp(Math.min(fitWidth, fitHeight), 0.36, 1);
  }, [canvasSize]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <main ref={containerRef} className="relative flex min-h-[520px] flex-1 overflow-hidden explore-canvas-texture">
      <div className="absolute left-4 right-4 top-4 z-30 flex items-start justify-between gap-3 md:left-6 md:right-6 md:top-6">
        <div className="glass-surface soft-card rounded-[18px] px-4 py-3">
          <p className="text-[11px] font-extrabold text-[#7A62E8]">FRICTION MAP</p>
          <p className="mt-1 max-w-[260px] truncate text-[14px] font-extrabold text-[#221B31]">
            {selectedPerson ? `${selectedPerson.preset.categoryLabel}: ${selectedPerson.preset.frictionName}` : '人物プリセットを選択'}
          </p>
        </div>
        <div className="hidden rounded-full border border-[#E8DED3] bg-white/86 px-4 py-3 text-[12px] font-extrabold text-[#5B536C] shadow-sm sm:block">
          {people.length} 個の摩擦プリセット
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pb-24 pt-20 lg:pb-8">
        <div className="relative h-[1180px] w-[1320px] shrink-0" style={{ transform: `scale(${scale})` }}>
          <svg className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <filter id="relationship-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
              <circle r="220" fill="rgba(109,77,232,0.04)" stroke="rgba(109,77,232,0.12)" strokeDasharray="7 10" />
              <circle r="430" fill="none" stroke="rgba(255,122,69,0.14)" strokeDasharray="5 12" />
              <circle r="600" fill="none" stroke="rgba(61,123,239,0.10)" strokeDasharray="4 14" />
              {people.map((person, index) => {
                const { x, y } = getPersonPosition(index, people.length);
                const scheme = toneSchemes[person.preset.tone];
                const isSelected = selectedPersonId === person.id;

                return (
                  <line
                    key={`line-${person.id}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={scheme.color}
                    strokeWidth={isSelected ? 3.8 : 2.4}
                    opacity={isSelected ? 0.78 : 0.36}
                    strokeLinecap="round"
                    filter={isSelected ? 'url(#relationship-glow)' : undefined}
                  />
                );
              })}
            </g>
          </svg>

          {people.map((person, index) => {
            const { x, y } = getPersonPosition(index, people.length);
            const scheme = toneSchemes[person.preset.tone];
            const isSelected = selectedPersonId === person.id;

            return (
              <button
                key={person.id}
                type="button"
                onClick={() => onSelectPerson(person.id)}
                className={[
                  'absolute z-20 flex h-[98px] w-[216px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border bg-white/94 p-3 text-left shadow-[0_12px_28px_rgba(45,33,68,0.10)] backdrop-blur-md transition-all hover:scale-[1.018]',
                  isSelected ? 'shadow-[0_18px_42px_rgba(82,55,190,0.22),0_0_0_7px_rgba(109,77,232,0.08)]' : '',
                ].join(' ')}
                style={{
                  left: CENTER_X + x,
                  top: CENTER_Y + y,
                  borderColor: isSelected ? scheme.border : `${scheme.border}99`,
                }}
                aria-label={`${person.preset.frictionName}を選択`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span
                    className="max-w-[116px] truncate rounded-full px-2.5 py-1 text-[10px] font-extrabold"
                    style={{ backgroundColor: scheme.soft, color: scheme.color }}
                  >
                    {person.preset.categoryLabel}
                  </span>
                  <span className="truncate text-[10px] font-extrabold text-[#8D839A]">
                    {person.preset.estimatedMbti.join('/')}
                  </span>
                </div>
                <p className="min-h-[50px] overflow-hidden text-[15px] font-extrabold leading-[1.2] text-[#221B31] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                  {person.preset.frictionName}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-extrabold text-[#8D839A]">
                  <span>信頼 {person.closeness}</span>
                  <span className="h-1 w-1 rounded-full bg-[#D3C8BF]" />
                  <span>負荷 {person.stress}</span>
                </div>
              </button>
            );
          })}

          <div
            className="absolute z-30 flex h-[156px] w-[156px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[8px] border-white text-center text-white shadow-[0_24px_62px_rgba(74,50,173,0.38)]"
            style={{
              left: CENTER_X,
              top: CENTER_Y,
              background:
                'radial-gradient(circle at 30% 22%, rgba(255,255,255,0.42), transparent 31%), linear-gradient(145deg, #7A62E8, #4B2BC2 72%)',
            }}
          >
            <span className="text-[11px] font-extrabold tracking-[0.08em] text-white/76">CENTER</span>
            <h1 className="mt-2 max-w-[126px] truncate text-[25px] font-extrabold leading-tight">
              {selfName || 'あなた'}
            </h1>
            <span className="mt-2 rounded-full bg-white/18 px-3 py-1 text-[13px] font-extrabold">
              {selfMbti}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
