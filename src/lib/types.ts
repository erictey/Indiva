export const CATEGORY_ORDER = ['build', 'shape', 'workWith'] as const;

export type MissionCategory = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<MissionCategory, string> = {
  build: 'Build',
  shape: 'Shape',
  workWith: 'Work With',
};

export type AppState =
  | 'setup'
  | 'ready_to_select'
  | 'active_week'
  | 'awaiting_reflection'
  | 'completed_cycle';

export type CoreValue = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type MissionItem = {
  id: string;
  category: MissionCategory;
  text: string;
  isActive: boolean;
  usedInCurrentRotation: boolean;
};

export type ReflectionData = {
  text: string;
  submittedAt: string;
};

export type ActiveCycle = {
  id: string;
  buildItemId: string;
  shapeItemId: string;
  workWithItemId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'awaiting_reflection' | 'completed';
  reflection?: ReflectionData;
} | null;

export type HistoryCycle = {
  id: string;
  buildItemId: string;
  shapeItemId: string;
  workWithItemId: string;
  buildText: string;
  shapeText: string;
  workWithText: string;
  startDate: string;
  endDate: string;
  reflection: ReflectionData;
};

export type AppData = {
  coreValues: CoreValue[];
  missionItems: MissionItem[];
  activeCycle: ActiveCycle;
  history: HistoryCycle[];
};

export type CycleSelection = Record<MissionCategory, string | null>;

export type SelectionErrors = Partial<Record<MissionCategory | 'form', string>>;

export type MessageType = 'encouragement' | 'discipline' | 'values' | 'consistency';

export type MotivationalMessage = {
  id: string;
  text: string;
  type: MessageType;
};
