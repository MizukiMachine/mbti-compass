export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type WorkplaceNodeTone =
  | 'driver'
  | 'supporter'
  | 'analyst'
  | 'creative'
  | 'operator'
  | 'challenger';

export interface WorkplacePersonPreset {
  id: string;
  roleLabel: string;
  displayName: string;
  shortLabel: string;
  archetype: string;
  tone: WorkplaceNodeTone;
  estimatedMbti: string[];
  confidence: ConfidenceLevel;
  description: string;
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
