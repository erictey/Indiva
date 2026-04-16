import type { AppData } from './types';

export const STORAGE_KEYS = {
  coreValues: 'tim_core_values',
  missionItems: 'tim_mission_items',
  activeCycle: 'tim_active_cycle',
  history: 'tim_history',
} as const;

export function createEmptyAppData(): AppData {
  return {
    coreValues: [],
    missionItems: [],
    activeCycle: null,
    history: [],
  };
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

  return {
    coreValues: readJson(STORAGE_KEYS.coreValues, emptyState.coreValues),
    missionItems: readJson(STORAGE_KEYS.missionItems, emptyState.missionItems),
    activeCycle: readJson(STORAGE_KEYS.activeCycle, emptyState.activeCycle),
    history: readJson(STORAGE_KEYS.history, emptyState.history),
  };
}

export function saveAppData(data: AppData) {
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
