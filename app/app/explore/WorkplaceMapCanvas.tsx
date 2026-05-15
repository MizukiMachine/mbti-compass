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

const GRAPH_WIDTH = 900;
const GRAPH_HEIGHT = 640;
const CENTER_X = GRAPH_WIDTH / 2;
const CENTER_Y = GRAPH_HEIGHT / 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPersonPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radiusX = 320;
  const radiusY = 230;

  return {
    x: Math.cos(angle) * radiusX,
    y: Math.sin(angle) * radiusY,
  };
}

function RelationshipMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-extrabold text-[#7A7184]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#E9E2DA]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
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
    const fitHeight = (canvasSize.height - 132) / GRAPH_HEIGHT;
    return clamp(Math.min(fitWidth, fitHeight), 0.42, 1);
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
          <p className="text-[11px] font-extrabold text-[#7A62E8]">WORKPLACE MAP</p>
          <p className="mt-1 max-w-[260px] truncate text-[14px] font-extrabold text-[#221B31]">
            {selectedPerson ? `${selectedPerson.relationLabel}: ${selectedPerson.name}` : '人物スロットを選択'}
          </p>
        </div>
        <div className="hidden rounded-full border border-[#E8DED3] bg-white/86 px-4 py-3 text-[12px] font-extrabold text-[#5B536C] shadow-sm sm:block">
          {people.length} 人の関係スロット
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pb-24 pt-20 lg:pb-10">
        <div className="relative h-[640px] w-[900px] shrink-0" style={{ transform: `scale(${scale})` }}>
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
              <circle r="154" fill="rgba(109,77,232,0.04)" stroke="rgba(109,77,232,0.12)" strokeDasharray="7 10" />
              <circle r="252" fill="none" stroke="rgba(255,122,69,0.14)" strokeDasharray="5 12" />
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
                  'absolute z-20 flex h-[112px] w-[230px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[22px] border bg-white/94 p-4 text-left shadow-[0_14px_32px_rgba(45,33,68,0.10)] backdrop-blur-md transition-all hover:scale-[1.015]',
                  isSelected ? 'shadow-[0_18px_42px_rgba(82,55,190,0.22),0_0_0_7px_rgba(109,77,232,0.08)]' : '',
                ].join(' ')}
                style={{
                  left: CENTER_X + x,
                  top: CENTER_Y + y,
                  borderColor: isSelected ? scheme.border : `${scheme.border}99`,
                }}
                aria-label={`${person.name}を選択`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span
                    className="max-w-[128px] truncate rounded-full px-3 py-1 text-[11px] font-extrabold"
                    style={{ backgroundColor: scheme.soft, color: scheme.color }}
                  >
                    {person.relationLabel}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#8D839A]">
                    {person.preset.estimatedMbti.join('/')}
                  </span>
                </div>
                <p className="truncate text-[18px] font-extrabold leading-tight text-[#221B31]">
                  {person.name}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <RelationshipMeter label="信頼" value={person.closeness} color="#18A879" />
                  <RelationshipMeter label="負荷" value={person.stress} color="#EF5555" />
                </div>
              </button>
            );
          })}

          <div
            className="absolute z-30 flex h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[8px] border-white text-center text-white shadow-[0_24px_62px_rgba(74,50,173,0.38)]"
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
