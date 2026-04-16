import {
  CATEGORY_ORDER,
  createEmptyCycleEvidence,
  createEmptyIntentions,
  type AppData,
  type CycleEvidence,
  type CycleIntentions,
  type HistoryCycle,
  type MissionItem,
} from './types';

export const STORAGE_KEYS = {
  setupCompleted: 'tim_setup_completed',
  coreValues: 'tim_core_values',
  missionItems: 'tim_mission_items',
  activeCycle: 'tim_active_cycle',
  history: 'tim_history',
} as const;

export function createEmptyAppData(): AppData {
  return {
    setupCompleted: false,
    coreValues: [],
    missionItems: [],
    activeCycle: null,
    history: [],
  };
}

function hasMinimumStoredSetup(missionItems: MissionItem[]) {
  return CATEGORY_ORDER.every((category) =>
    missionItems.some((item) => item.category === category && item.isActive),
  );
}

export function readJson<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadAppData() {
  const emptyState = createEmptyAppData();
  const coreValues = readJson(STORAGE_KEYS.coreValues, emptyState.coreValues);
  const missionItems = readJson(STORAGE_KEYS.missionItems, emptyState.missionItems);
  const activeCycleRaw = readJson(STORAGE_KEYS.activeCycle, emptyState.activeCycle);
  const historyRaw = readJson(STORAGE_KEYS.history, emptyState.history);

  const normalizeEvidence = (value: unknown): CycleEvidence => {
    const fallback = createEmptyCycleEvidence();
    if (!value || typeof value !== 'object') return fallback;

    const record = value as Partial<Record<keyof CycleEvidence, unknown>>;
    return {
      build: Array.isArray(record.build) ? record.build : [],
      shape: Array.isArray(record.shape) ? record.shape : [],
      workWith: Array.isArray(record.workWith) ? record.workWith : [],
    };
  };

  const normalizeIntentions = (value: unknown): CycleIntentions => {
    const fallback = createEmptyIntentions();
    if (!value || typeof value !== 'object') return fallback;

    const record = value as Partial<Record<keyof CycleIntentions, unknown>>;
    return {
      build: typeof record.build === 'string' ? record.build : '',
      shape: typeof record.shape === 'string' ? record.shape : '',
      workWith: typeof record.workWith === 'string' ? record.workWith : '',
    };
  };

  const activeCycle = activeCycleRaw
    ? {
        ...activeCycleRaw,
        evidence: normalizeEvidence((activeCycleRaw as { evidence?: unknown }).evidence),
        intentions: normalizeIntentions((activeCycleRaw as { intentions?: unknown }).intentions),
      }
    : null;

  const history = (Array.isArray(historyRaw) ? historyRaw : []).map((entry) => ({
    ...(entry as HistoryCycle),
    evidence: normalizeEvidence((entry as { evidence?: unknown }).evidence),
    intentions: normalizeIntentions((entry as { intentions?: unknown }).intentions),
  }));
  const inferredSetupCompleted =
    !!activeCycle ||
    history.length > 0 ||
    (coreValues.length > 0 && hasMinimumStoredSetup(missionItems));

  return {
    setupCompleted: readJson(STORAGE_KEYS.setupCompleted, inferredSetupCompleted),
    coreValues,
    missionItems,
    activeCycle,
    history,
  };
}

export function saveAppData(data: AppData) {
  writeJson(STORAGE_KEYS.setupCompleted, data.setupCompleted);
  writeJson(STORAGE_KEYS.coreValues, data.coreValues);
  writeJson(STORAGE_KEYS.missionItems, data.missionItems);
  writeJson(STORAGE_KEYS.activeCycle, data.activeCycle);
  writeJson(STORAGE_KEYS.history, data.history);
}

export function clearStoredAppData() {
  if (typeof window === 'undefined') {
    return;
  }

  for (const key of Object.values(STORAGE_KEYS)) {
    window.localStorage.removeItem(key);
  }
}

export function exportAppData(data: AppData) {
  return JSON.stringify(
    {
      [STORAGE_KEYS.setupCompleted]: data.setupCompleted,
      [STORAGE_KEYS.coreValues]: data.coreValues,
      [STORAGE_KEYS.missionItems]: data.missionItems,
      [STORAGE_KEYS.activeCycle]: data.activeCycle,
      [STORAGE_KEYS.history]: data.history,
    },
    null,
    2,
  );
}

export function makeExportFilename(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `tim-export-${year}-${month}-${day}.json`;
}

export function downloadTextFile(filename: string, content: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const blob = new Blob([content], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
