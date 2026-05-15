import { useState, useEffect, useCallback, useRef } from 'react';
import { ExploreNode, TreeGenerateResponse } from '../types/explore';
import { saveTreeHistory } from './explore-history';

interface TreeState {
  nodeTree: Record<string, ExploreNode>;
  childrenMap: Record<string, string[]>;
  rootIds: string[];
  currentParentId: string | null;
  selectedNodeId: string | null;
  path: string[];
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: TreeState = {
  nodeTree: {},
  childrenMap: {},
  rootIds: [],
  currentParentId: null,
  selectedNodeId: null,
  path: [],
  isLoading: false,
  error: null,
};

export function useTreeExploreState(mbtiType: string) {
  const [state, setState] = useState<TreeState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const fetchRootNodes = useCallback(async () => {
    if (!mbtiType) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const reqId = ++requestIdRef.current;

    setState(s => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await fetch('/api/explore/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mbtiType, depth: 0 }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error('生成に失敗しました');
      const data: TreeGenerateResponse = await res.json();
      const nodes = data.nodes;

      // Only update if this is still the latest request
      if (reqId !== requestIdRef.current) return;

      const nodeTree: Record<string, ExploreNode> = {};
      const rootIds: string[] = [];
      for (const n of nodes) {
        nodeTree[n.id] = n;
        rootIds.push(n.id);
      }

      setState({
        nodeTree,
        childrenMap: {},
        rootIds,
        currentParentId: null,
        selectedNodeId: rootIds[0] ?? null,
        path: [],
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if (controller.signal.aborted) return; // Stale request, ignore
      if (reqId !== requestIdRef.current) return;
      setState(s => ({ ...s, isLoading: false, error: 'ノードの生成に失敗しました。もう一度お試しください。' }));
    }
  }, [mbtiType]);

  useEffect(() => {
    fetchRootNodes();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchRootNodes]);

  const selectNode = useCallback((nodeId: string) => {
    setState(s => ({
      ...s,
      selectedNodeId: s.nodeTree[nodeId] ? nodeId : s.selectedNodeId,
      error: null,
    }));
  }, []);

  const expandNode = useCallback(async (nodeId: string) => {
    const node = state.nodeTree[nodeId];
    if (!node) return;

    const nextPath = state.currentParentId && state.currentParentId !== nodeId
      ? [...state.path, state.currentParentId]
      : state.path;

    setState(s => ({
      ...s,
      selectedNodeId: nodeId,
      isLoading: true,
      error: null,
    }));

    const nodeTexts = Object.fromEntries(
      Object.entries(state.nodeTree).map(([k, v]) => [k, v.text]),
    );
    const pathTexts = [...nextPath, nodeId].map(id => state.nodeTree[id]?.text).filter(Boolean);
    saveTreeHistory(mbtiType, [...nextPath, nodeId], nodeTexts);

    if (state.childrenMap[nodeId]) {
      setState(s => ({
        ...s,
        path: nextPath,
        currentParentId: nodeId,
        selectedNodeId: state.childrenMap[nodeId][0] ?? nodeId,
        isLoading: false,
      }));
      return;
    }

    try {
      const res = await fetch('/api/explore/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mbtiType,
          depth: nextPath.length + 1,
          parentNode: node,
          pathHistory: pathTexts,
        }),
      });
      if (!res.ok) throw new Error('生成に失敗しました');
      const data: TreeGenerateResponse = await res.json();
      const children = data.nodes;

      setState(s => {
        const newNodeTree = { ...s.nodeTree };
        const newChildrenMap = { ...s.childrenMap };
        const childIds: string[] = [];

        for (const c of children) {
          newNodeTree[c.id] = { ...c, parentId: nodeId };
          childIds.push(c.id);
        }
        newChildrenMap[nodeId] = childIds;

        return {
          ...s,
          nodeTree: newNodeTree,
          childrenMap: newChildrenMap,
          path: nextPath,
          currentParentId: nodeId,
          selectedNodeId: childIds[0] ?? nodeId,
          isLoading: false,
        };
      });
    } catch {
      setState(s => ({
        ...s,
        selectedNodeId: nodeId,
        isLoading: false,
        error: '子ノードの生成に失敗しました。',
      }));
    }
  }, [mbtiType, state.nodeTree, state.childrenMap, state.path, state.currentParentId]);

  const goBack = useCallback(() => {
    setState(s => {
      if (!s.currentParentId) {
        return {
          ...s,
          currentParentId: null,
          selectedNodeId: s.rootIds[0] ?? null,
        };
      }

      if (s.path.length === 0) {
        return {
          ...s,
          currentParentId: null,
          selectedNodeId: s.currentParentId,
        };
      }

      const newPath = s.path.slice(0, -1);
      const parentId = s.path[s.path.length - 1];
      const childIds = s.childrenMap[parentId] ?? [];
      return {
        ...s,
        path: newPath,
        currentParentId: parentId,
        selectedNodeId: childIds[0] ?? parentId,
      };
    });
  }, []);

  const currentIds = state.currentParentId
    ? (state.childrenMap[state.currentParentId] ?? [])
    : state.rootIds;

  const breadcrumbTexts = [
    ...state.path.map(id => state.nodeTree[id]?.text ?? ''),
    state.currentParentId ? state.nodeTree[state.currentParentId]?.text ?? '' : '',
    state.selectedNodeId ? state.nodeTree[state.selectedNodeId]?.text ?? '' : '',
  ].filter(Boolean);

  return {
    ...state,
    currentIds,
    breadcrumbTexts,
    fetchRootNodes,
    selectNode,
    expandNode,
    goBack,
  };
}
