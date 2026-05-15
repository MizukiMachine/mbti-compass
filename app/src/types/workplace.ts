export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type RelationshipCategory =
  | 'work'
  | 'friend'
  | 'love'
  | 'family'
  | 'boundary'
  | 'community';

export type WorkplaceNodeTone =
  | 'driver'
  | 'supporter'
  | 'analyst'
  | 'creative'
  | 'operator'
  | 'challenger';

export interface WorkplacePersonPreset {
  id: string;
  category: RelationshipCategory;
  categoryLabel: string;
  roleLabel: string;
  displayName: string;
  shortLabel: string;
  frictionName: string;
  archetype: string;
  tone: WorkplaceNodeTone;
  estimatedMbti: string[];
  confidence: ConfidenceLevel;
  description: string;
  hiddenNeed: string;
  traits: string[];
  workValues: string[];
  frictionPoints: string[];
  trustSignals: string[];
  riskTriggers: string[];
  defaultNotes: string;
}

export interface WorkplacePerson {
  id: string;
  presetId: string;
  name: string;
  roleLabel: string;
  relationLabel: string;
  closeness: number;
  stress: number;
  notes: string;
  preset: WorkplacePersonPreset;
}

export type AdviceActionId =
  | 'build_trust'
  | 'request'
  | 'decline'
  | 'feedback'
  | 'repair'
  | 'distance'
  | 'smalltalk'
  | 'one_on_one';

export interface AdviceAction {
  id: AdviceActionId;
  label: string;
  description: string;
  promptFocus: string;
}

export interface WorkplaceAdviceRequest {
  selfMbti: string;
  selfName: string;
  person: WorkplacePerson;
  actionId: AdviceActionId;
  userConcern?: string;
}

export interface WorkplaceAdviceResponse {
  title: string;
  summary: string;
  strategy: string[];
  avoid: string[];
  messageDraft: string;
  talkingPoints: string[];
  nextStep: string;
  psychologyNote: string;
  caveat: string;
}
