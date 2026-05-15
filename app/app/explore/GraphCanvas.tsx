'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExploreNode, NodeType } from '../../src/types/explore';

interface GraphCanvasProps {
  nodes: ExploreNode[];
  parentNode: ExploreNode | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onRetry: () => void;
  isLoading: boolean;
  mbtiType: string;
}

const nodeSchemes: Record<NodeType, { color: string; soft: string; border: string; glow: string }> = {
  related: { color: '#6D4DE8', soft: '#F1EDFF', border: '#B99BFF', glow: 'rgba(109, 77, 232, 0.24)' },
  contrast: { color: '#FF7A45', soft: '#FFF1E9', border: '#FFB08C', glow: 'rgba(255, 122, 69, 0.22)' },
  deep: { color: '#3D7BEF', soft: '#EEF5FF', border: '#9BC1FF', glow: 'rgba(61, 123, 239, 0.20)' },
  growth: { color: '#18A879', soft: '#EAFBF5', border: '#8EDDC3', glow: 'rgba(24, 168, 121, 0.18)' },
  shadow: { color: '#EF5555', soft: '#FFF0F0', border: '#FFAAAA', glow: 'rgba(239, 85, 85, 0.20)' },
};

type AnchorSide = 'left' | 'right' | 'top' | 'bottom';

const GRAPH_WIDTH = 1120;
const GRAPH_HEIGHT = 900;
const NORMAL_CARD_WIDTH = 214;
const NORMAL_CARD_HEIGHT = 58;
const DENSE_CARD_WIDTH = 178;
const DENSE_CARD_HEIGHT = 52;
const CENTER_EDGE_RADIUS = 86;
const CENTER_VISUAL_RADIUS = 122;

function NodeGlyph({ type, className = 'w-5 h-5' }: { type: NodeType; className?: string }) {
  if (type === 'contrast') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M5 7h14M7 7l-3 7h6L7 7Zm10 0-3 7h6l-3-7Z" />
      </svg>
    );
  }
  if (type === 'deep') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c2.8 2.6 5 5.6 5 9a5 5 0 0 1-10 0c0-3.4 2.2-6.4 5-9Z" />
      </svg>
    );
  }
  if (type === 'growth') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 18c7.5 0 12-4.5 12-12M9 6h7v7M5 13l4-4" />
      </svg>
    );
  }
  if (type === 'shadow') {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6.5v5.8c0 4.3 3.1 7.2 7.5 8.7 4.4-1.5 7.5-4.4 7.5-8.7V6.5L12 3Z" />
        <path strokeLinecap="round" d="M9.5 12h5" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.8 14.5 9l5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4L9.5 9 12 3.8Z" />
    </svg>
  );
}

function getNodePosition(index: number, total: number) {
  const showcase = [
    { x: -300, y: -210 },
    { x: -330, y: -82 },
    { x: -314, y: 126 },
    { x: -208, y: 254 },
    { x: 310, y: -190 },
    { x: 356, y: -50 },
    { x: 346, y: 126 },
    { x: 252, y: 260 },
    { x: -236, y: 18 },
    { x: 184, y: -288 },
    { x: 80, y: 306 },
    { x: -70, y: -308 },
  ];

  if (total <= showcase.length) {
    return showcase[index];
  }

  const innerCount = Math.min(12, Math.ceil(total * 0.42));
  if (index < innerCount) {
    const angle = (index / innerCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * 300,
      y: Math.sin(angle) * 235,
    };
  }

  const outerIndex = index - innerCount;
  const outerCount = total - innerCount;
  const angle = (outerIndex / outerCount) * Math.PI * 2 - Math.PI / 2 + 0.16;
  const ripple = outerIndex % 2 === 0 ? 0 : 20;
  return {
    x: Math.cos(angle) * (470 + ripple),
    y: Math.sin(angle) * (350 + ripple * 0.25),
  };
}

function getAnchorSide(x: number, y: number): AnchorSide {
  if (Math.abs(x) < 135 && Math.abs(y) > 185) {
    return y > 0 ? 'top' : 'bottom';
  }

  return x >= 0 ? 'left' : 'right';
}

function getNodeAnchor(x: number, y: number, isDense: boolean) {
  const side = getAnchorSide(x, y);
  const halfWidth = (isDense ? DENSE_CARD_WIDTH : NORMAL_CARD_WIDTH) / 2;
  const halfHeight = (isDense ? DENSE_CARD_HEIGHT : NORMAL_CARD_HEIGHT) / 2;

  if (side === 'left') return { x: x - halfWidth, y, side };
  if (side === 'right') return { x: x + halfWidth, y, side };
  if (side === 'top') return { x, y: y - halfHeight, side };
  return { x, y: y + halfHeight, side };
}

function getCenterEdgePoint(targetX: number, targetY: number) {
  const length = Math.max(1, Math.hypot(targetX, targetY));

  return {
    x: (targetX / length) * CENTER_EDGE_RADIUS,
    y: (targetY / length) * CENTER_EDGE_RADIUS,
  };
}

function getEdgeControls(start: { x: number; y: number }, end: { x: number; y: number }, index: number) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const bend = (index % 2 === 0 ? 1 : -1) * Math.min(28, length * 0.055);
  const perpX = (-dy / length) * bend;
  const perpY = (dx / length) * bend;

  return {
    controlA: { x: start.x + dx * 0.38 + perpX, y: start.y + dy * 0.38 + perpY },
    controlB: { x: start.x + dx * 0.78 + perpX, y: start.y + dy * 0.78 + perpY },
  };
}

function getAnchorDotClass(side: AnchorSide) {
  if (side === 'left') return 'left-[-6px] top-1/2 -translate-y-1/2';
  if (side === 'right') return 'right-[-6px] top-1/2 -translate-y-1/2';
  if (side === 'top') return 'top-[-6px] left-1/2 -translate-x-1/2';
  return 'bottom-[-6px] left-1/2 -translate-x-1/2';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getGraphContentSize(nodeMetrics: { x: number; y: number }[], isDense: boolean) {
  const halfWidth = (isDense ? DENSE_CARD_WIDTH : NORMAL_CARD_WIDTH) / 2;
  const halfHeight = (isDense ? DENSE_CARD_HEIGHT : NORMAL_CARD_HEIGHT) / 2;
  let minX = -CENTER_VISUAL_RADIUS;
  let maxX = CENTER_VISUAL_RADIUS;
  let minY = -CENTER_VISUAL_RADIUS;
  let maxY = CENTER_VISUAL_RADIUS;

  for (const { x, y } of nodeMetrics) {
    minX = Math.min(minX, x - halfWidth);
    maxX = Math.max(maxX, x + halfWidth);
    minY = Math.min(minY, y - halfHeight);
    maxY = Math.max(maxY, y + halfHeight);
  }

  return {
    width: maxX - minX + 96,
    height: maxY - minY + 96,
  };
}

function getFallbackScale(nodeCount: number) {
  if (nodeCount > 24) return 0.94;
  if (nodeCount > 18) return 1;
  if (nodeCount > 12) return 1.06;
  return 1.1;
}

function getDefaultScale(
  nodeMetrics: { x: number; y: number }[],
  isDense: boolean,
  canvasSize: { width: number; height: number },
) {
  if (!canvasSize.width || !canvasSize.height) {
    return getFallbackScale(nodeMetrics.length);
  }

  const contentSize = getGraphContentSize(nodeMetrics, isDense);
  const availableWidth = Math.max(360, canvasSize.width - 148);
  const availableHeight = Math.max(360, canvasSize.height - 178);
  const fitScale = Math.min(
    availableWidth / contentSize.width,
    availableHeight / contentSize.height,
  );
  const maxScale = nodeMetrics.length > 24 ? 1.16 : nodeMetrics.length > 14 ? 1.22 : 1.3;
  const minScale = canvasSize.width < 780 ? 0.58 : 0.72;

  return clamp(fitScale * 0.98, minScale, maxScale);
}

export default function GraphCanvas({
  nodes,
  parentNode,
  selectedNodeId,
  onSelectNode,
  onRetry,
  isLoading,
  mbtiType,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const isDense = nodes.length > 14;
  const centerX = GRAPH_WIDTH / 2;
  const centerY = GRAPH_HEIGHT / 2;
  const centerScheme = parentNode ? nodeSchemes[parentNode.nodeType] : nodeSchemes.related;
  const nodeMetrics = useMemo(() => Array.from({ length: nodes.length }, (_, index) => {
    const { x, y } = getNodePosition(index, nodes.length);
    return { x, y };
  }), [nodes.length]);
  const defaultScale = useMemo(
    () => getDefaultScale(nodeMetrics, isDense, canvasSize),
    [canvasSize, isDense, nodeMetrics],
  );
  const [scale, setScale] = useState(defaultScale);

  useEffect(() => {
    setScale(defaultScale);
  }, [defaultScale, nodes.length, parentNode?.id]);

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
    <main className="flex-1 min-w-0 relative overflow-hidden explore-canvas-texture flex flex-col" ref={containerRef}>
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/80 to-transparent pointer-events-none z-10" />

      <div className="absolute top-6 left-7 right-7 flex items-start justify-between z-30 pointer-events-none gap-4">
        <button
          onClick={() => setScale(defaultScale)}
          className="pointer-events-auto glass-surface soft-card px-5 py-3 rounded-2xl text-[#332B45] font-bold text-sm flex items-center gap-3 hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          全体を表示
          <svg className="w-3.5 h-3.5 text-[#8A7CE5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex gap-3 pointer-events-auto">
          <div className="hidden md:flex glass-surface soft-card px-5 py-3 rounded-full text-[#332B45] font-bold text-sm items-center gap-3 whitespace-nowrap">
            <span className="text-[#7A62E8]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" />
              </svg>
            </span>
            ノード {nodes.length}件生成
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
          </div>

          <div className="glass-surface soft-card rounded-2xl overflow-hidden flex items-center">
            <button className="w-11 h-11 text-[#332B45] hover:bg-[#F5F1FF] font-bold" onClick={() => setScale(s => Math.max(0.55, s - 0.1))}>
              -
            </button>
            <span className="w-14 text-center text-xs font-bold text-[#5B536C] border-x border-[#E9E1D8] py-3">
              {Math.round(scale * 100)}%
            </span>
            <button className="w-11 h-11 text-[#332B45] hover:bg-[#F5F1FF] font-bold" onClick={() => setScale(s => Math.min(1.55, s + 0.1))}>
              +
            </button>
          </div>

          <button
            onClick={() => setScale(defaultScale)}
            className="glass-surface soft-card w-11 h-11 rounded-2xl text-[#332B45] hover:text-[#6D4DE8] flex items-center justify-center transition-colors"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M4 4l6 6m10-1V4h-5m5 0-6 6M4 15v5h5m-5 0 6-6m10 1v5h-5m5 0-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <motion.div
          className="relative w-[1120px] h-[900px] shrink-0 will-change-transform"
          style={{ scale }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <filter id="soft-line-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g transform={`translate(${centerX}, ${centerY})`}>
              <circle r="118" fill="none" stroke="rgba(255, 122, 69, 0.20)" strokeWidth="1.2" strokeDasharray="6 9" />
              <circle r="88" fill="rgba(109, 77, 232, 0.05)" />
              {nodes.map((node, index) => {
                const { x, y } = nodeMetrics[index];
                const scheme = nodeSchemes[node.nodeType];
                const gradientId = `edge-${index}`;
                const anchor = getNodeAnchor(x, y, isDense);
                const start = getCenterEdgePoint(anchor.x, anchor.y);
                const { controlA, controlB } = getEdgeControls(start, anchor, index);

                return (
                  <g key={`edge-${node.id}`}>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7A62E8" stopOpacity="0.72" />
                      <stop offset="100%" stopColor={scheme.color} stopOpacity="0.7" />
                    </linearGradient>
                    <path
                      d={`M ${start.x} ${start.y} C ${controlA.x} ${controlA.y}, ${controlB.x} ${controlB.y}, ${anchor.x} ${anchor.y}`}
                      fill="none"
                      stroke={`url(#${gradientId})`}
                      strokeWidth={selectedNodeId === node.id ? 3.8 : 2.8}
                      strokeLinecap="round"
                      opacity={selectedNodeId === node.id ? 0.98 : 0.76}
                      filter={selectedNodeId === node.id ? 'url(#soft-line-glow)' : undefined}
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          {nodes.map((node, index) => {
            const { x, y } = nodeMetrics[index];
            const scheme = nodeSchemes[node.nodeType];
            const isSelected = selectedNodeId === node.id;
            const anchorSide = getAnchorSide(x, y);

            return (
              <div
                key={node.id}
                className="absolute z-20"
                style={{ left: centerX + x, top: centerY + y, transform: 'translate(-50%, -50%)' }}
              >
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.035, 0.38), duration: 0.28 }}
                  className={[
                    'group relative flex items-center rounded-[24px] border bg-white/94 backdrop-blur-md text-left transition-all duration-200',
                    isDense ? 'h-[52px] w-[178px] gap-2 px-2.5' : 'h-[58px] w-[214px] gap-3 px-2.5',
                    isSelected
                      ? 'border-[#A77CFF] shadow-[0_12px_34px_rgba(109,77,232,0.24),0_0_0_6px_rgba(109,77,232,0.08)]'
                      : 'shadow-[0_10px_28px_rgba(50,38,72,0.08)] hover:shadow-[0_16px_34px_rgba(50,38,72,0.13)]',
                  ].join(' ')}
                  style={{ borderColor: isSelected ? scheme.border : `${scheme.border}99` }}
                  onClick={() => onSelectNode(node.id)}
                  title={node.text}
                  aria-label={`${node.text}を選択`}
                >
                  <span
                    className={`absolute z-10 h-3 w-3 rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(255,255,255,0.84),0_4px_10px_rgba(45,33,68,0.16)] ${getAnchorDotClass(anchorSide)}`}
                    style={{ background: scheme.color }}
                  />
                  <span
                    className={[
                      'rounded-full flex items-center justify-center shrink-0 transition-all',
                      isDense ? 'w-8 h-8' : 'w-10 h-10',
                      isSelected ? 'text-white shadow-[0_8px_18px_rgba(109,77,232,0.28)]' : '',
                    ].join(' ')}
                    style={{
                      color: isSelected ? '#FFFFFF' : scheme.color,
                      background: isSelected ? `linear-gradient(135deg, ${scheme.color}, #6D4DE8)` : scheme.soft,
                    }}
                  >
                    <NodeGlyph type={node.nodeType} className={isDense ? 'w-4 h-4' : 'w-5 h-5'} />
                  </span>
                  <span className={`${isDense ? 'max-w-[122px] text-[12px]' : 'max-w-[154px] text-[14px]'} truncate font-extrabold tracking-normal text-[#2A2338]`}>
                    {node.text}
                  </span>
                </motion.button>
              </div>
            );
          })}

          <div className="absolute z-30 -translate-x-1/2 -translate-y-1/2" style={{ left: centerX, top: centerY }}>
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[218px] h-[218px] rounded-full bg-[#6D4DE8]/10 blur-2xl" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[166px] h-[166px] rounded-full border border-white/70 shadow-[inset_0_0_0_10px_rgba(255,255,255,0.4)]" />
            <div
              className="relative w-[150px] h-[150px] rounded-full border-[7px] border-white flex flex-col items-center justify-center text-white shadow-[0_20px_56px_rgba(74,50,173,0.38)]"
              style={{ background: `radial-gradient(circle at 28% 22%, rgba(255,255,255,0.42), transparent 30%), linear-gradient(145deg, ${centerScheme.color}, #5130C9 72%)` }}
            >
              <div className="mb-2 text-white/95">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 11.5C7 10 7 7.6 8.5 6.2c1.4-1.4 3.7-1.2 5.1.3 1.4-1.5 3.7-1.7 5.1-.3 1.5 1.4 1.5 3.8 0 5.3l-5.1 5.1-5.1-5.1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 16.2c2.3-1.1 4.5-.8 6.5.8l2 1.6c1 .8 2.5.8 3.5 0l4.8-3.7" />
                </svg>
              </div>
              <h2 className="max-w-[126px] text-center text-[22px] font-extrabold leading-tight tracking-[0.04em]">
                {parentNode ? parentNode.text : mbtiType}
              </h2>
            </div>
          </div>
        </motion.div>
      </div>

      {!isLoading && nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-[24px] soft-card text-center pointer-events-auto">
            <p className="font-bold text-[#17131f] mb-1">表示できるノードがありません</p>
            <p className="text-sm text-[#746B82] mb-5">通信状況を確認して、もう一度生成してください。</p>
            <button
              type="button"
              onClick={onRetry}
              className="mx-auto flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#7A62E8] to-[#5430D1] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(86,48,209,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(86,48,209,0.28)]"
            >
              再生成
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 21.7 13.7 16.6l-2.5 2.2.6-9.4 5.2 7.9-3.3-.7M7.5 18.5A8.3 8.3 0 1 1 20.3 10.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {nodes.length <= 18 && (
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 pointer-events-auto hidden sm:block">
        <div className="glass-surface rounded-[26px] soft-card p-2 flex items-center gap-2">
          <button className="w-11 h-11 rounded-2xl bg-white text-[#332B45] flex items-center justify-center hover:bg-[#F7F2FF] transition-colors">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V7.8a1.4 1.4 0 0 1 2.8 0v3.3M9.8 11V6.5a1.4 1.4 0 0 1 2.8 0V11m0-.5V7.7a1.4 1.4 0 0 1 2.8 0v4.4m0-.5v-1.8a1.4 1.4 0 0 1 2.8 0v4.6c0 4.1-2.7 6.6-6.3 6.6h-.8c-2.4 0-3.9-1.2-5.2-3.1l-1.6-2.4a1.5 1.5 0 0 1 2.4-1.8L8 15" />
            </svg>
          </button>
          <button className="w-11 h-11 rounded-2xl text-[#746B82] border border-dashed border-[#CFC5DD] flex items-center justify-center hover:text-[#6D4DE8] transition-colors">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M4 4l6 6m10-1V4h-5m5 0-6 6M4 15v5h5m-5 0 6-6m10 1v5h-5m5 0-6-6" />
            </svg>
          </button>
          <div className="w-px h-9 bg-[#E7DFD6] mx-1" />
          <div className="w-44 h-[86px] rounded-[18px] bg-[#FBFAF7] border border-[#E8DED3] relative overflow-hidden shadow-inner">
            <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 176 86">
              <line x1="88" y1="43" x2="45" y2="24" stroke="#B6A1E8" strokeWidth="1.3" />
              <line x1="88" y1="43" x2="126" y2="22" stroke="#B6A1E8" strokeWidth="1.3" />
              <line x1="88" y1="43" x2="130" y2="62" stroke="#FFB08C" strokeWidth="1.3" />
              <line x1="88" y1="43" x2="52" y2="66" stroke="#8AB4FF" strokeWidth="1.3" />
              <circle cx="88" cy="43" r="9" fill="#D5C7F6" />
              <circle cx="45" cy="24" r="6" fill="#BCAAE8" />
              <circle cx="126" cy="22" r="5" fill="#C9B9EF" />
              <circle cx="130" cy="62" r="6" fill="#F8B093" />
              <circle cx="52" cy="66" r="5" fill="#9BC1FF" />
            </svg>
          </div>
          <button className="w-11 h-11 rounded-2xl text-[#746B82] flex items-center justify-center hover:bg-white hover:text-[#6D4DE8] transition-colors">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
        </div>
      </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white/48 backdrop-blur-[2px] z-40 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-full soft-card flex items-center gap-4">
            <div className="w-6 h-6 border-[3px] border-[#6D4DE8] border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-[#332B45]">ノードを展開中...</span>
          </div>
        </div>
      )}
    </main>
  );
}
