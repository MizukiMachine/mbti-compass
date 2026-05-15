export type NodeType = 'related' | 'contrast' | 'deep' | 'growth' | 'shadow';

export interface ExploreNode {
  id: string;
  text: string;
  description: string;
  nodeType: NodeType;
  parentId: string | null;
  features: string[];
  strengths: string[];
  cautions: string[];
  relatedThemes: string[];
  opposingThemes: string[];
}

export interface TreeGenerateRequest {
  mbtiType: string;
  depth: number;
  parentNode?: ExploreNode;
  pathHistory?: string[];
}

export interface TreeGenerateResponse {
  nodes: ExploreNode[];
}
