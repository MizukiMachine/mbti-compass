'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTreeExploreState } from '../../src/lib/use-explore-state';
import LeftSidebar from './LeftSidebar';
import GraphCanvas from './GraphCanvas';
import DescriptionPanel from './DescriptionPanel';

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-bold text-sm tracking-wide">Loading...</p>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mbtiType = searchParams.get('mbti') || '';

  const {
    nodeTree, currentIds, selectedNodeId, breadcrumbTexts, path,
    isLoading, error, currentParentId, fetchRootNodes, selectNode, expandNode, goBack,
  } = useTreeExploreState(mbtiType);

  useEffect(() => {
    if (!mbtiType) {
      const stored = localStorage.getItem('mbti-shadow-friend-result');
      if (stored) {
        try {
          const { type, name } = JSON.parse(stored);
          const params = new URLSearchParams();
          if (type) params.set('mbti', type);
          if (name) params.set('name', name);
          router.replace(`/explore?${params.toString()}`);
          return;
        } catch { }
      }
      router.replace('/');
    }
  }, [mbtiType, router]);

  if (!mbtiType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedNode = selectedNodeId ? nodeTree[selectedNodeId] ?? null : null;
  const currentParentNode = currentParentId ? nodeTree[currentParentId] ?? null : null;
  const currentNodes = currentIds.map(id => nodeTree[id]).filter(Boolean);
  const currentDepth = currentParentId ? path.length + 1 : 0;

  return (
    <div className="h-dvh w-screen bg-background flex overflow-hidden font-sans text-[#17131f]">

      {/* 1. Left Sidebar */}
      <LeftSidebar
        mbtiType={mbtiType}
        depth={currentDepth}
        breadcrumbTexts={breadcrumbTexts}
        onBack={goBack}
        canGoBack={currentParentId !== null}
      />

      {/* 2. Graph Canvas (Center) */}
      <GraphCanvas
        nodes={currentNodes}
        parentNode={currentParentNode}
        selectedNodeId={selectedNodeId}
        onSelectNode={selectNode}
        onRetry={fetchRootNodes}
        isLoading={isLoading}
        mbtiType={mbtiType}
      />

      {/* 3. Description Panel (Right Sidebar) */}
      <DescriptionPanel
        node={selectedNode}
        breadcrumbTexts={breadcrumbTexts}
        onBack={goBack}
        canGoBack={currentParentId !== null}
        onDigDeeper={() => {
          if (selectedNode) expandNode(selectedNode.id);
        }}
        isLoadingChildren={isLoading}
      />

      {/* Error Overlay */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-3">
          <span>⚠️ {error}</span>
          <button onClick={fetchRootNodes} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm transition-colors">
            リトライ
          </button>
        </div>
      )}

    </div>
  );
}
