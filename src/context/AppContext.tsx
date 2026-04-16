import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getMessageForDate } from '../lib/messages';
import { applySelectionToRotation, getEligibleMissionItems } from '../lib/rotation';
import {
  canDeleteMissionItem as canDeleteMissionItemGuard,
  canEditModel as canEditModelForState,
  deriveAppState,
  getCycleDates,
  validateSelection,
} from '../lib/stateMachine';
import {
  clearStoredAppData,
  createEmptyAppData,
  exportAppData,
  loadAppData,
  saveAppData,
} from '../lib/storage';
import {
  type AppData,
  type AppState,
  type CoreValue,
  type CycleSelection,
  type HistoryCycle,
  type MissionCategory,
  type MissionItem,
  type SelectionErrors,
} from '../lib/types';

type AppContextValue = AppData & {
  nowIso: string;
  state: AppState;
  canEditModel: boolean;
  eligibleItems: Record<MissionCategory, MissionItem[]>;
  activeCycleItems: Record<MissionCategory, MissionItem | null>;
  cycleMessage: ReturnType<typeof getMessageForDate>;
  addCoreValue: (text: string) => void;
  updateCoreValue: (id: string, text: string) => void;
  deleteCoreValue: (id: string) => void;
  addMissionItem: (category: MissionCategory, text: string) => void;
  updateMissionItem: (id: string, text: string) => void;
  toggleMissionItemActive: (id: string) => void;
  deleteMissionItem: (id: string) => boolean;
  startCycle: (selection: CycleSelection) => { ok: boolean; errors: SelectionErrors };
  submitReflection: (text: string) => boolean;
  deleteHistoryRecord: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
};

type AppAction =
  | { type: 'add_core_value'; text: string; timestamp: string }
  | { type: 'update_core_value'; id: string; text: string; timestamp: string }
  | { type: 'delete_core_value'; id: string }
  | { type: 'add_mission_item'; category: MissionCategory; text: string }
  | { type: 'update_mission_item'; id: string; text: string }
  | { type: 'toggle_mission_item_active'; id: string }
  | { type: 'delete_mission_item'; id: string }
  | { type: 'start_cycle'; selection: CycleSelection; timestamp: string }
  | { type: 'mark_awaiting_reflection' }
  | { type: 'submit_reflection'; text: string; timestamp: string }
  | { type: 'delete_history_record'; id: string }
  | { type: 'clear_all' };

const AppContext = createContext<AppContextValue | undefined>(undefined);

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `tim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
}

function getMissionText(items: MissionItem[], id: string) {
  return items.find((item) => item.id === id)?.text ?? 'Removed mission item';
}

function buildHistoryCycle(
  activeCycle: NonNullable<AppData['activeCycle']>,
  items: MissionItem[],
  reflectionText: string,
  submittedAt: string,
): HistoryCycle {
  return {
    id: activeCycle.id,
    buildItemId: activeCycle.buildItemId,
    shapeItemId: activeCycle.shapeItemId,
    workWithItemId: activeCycle.workWithItemId,
    buildText: getMissionText(items, activeCycle.buildItemId),
    shapeText: getMissionText(items, activeCycle.shapeItemId),
    workWithText: getMissionText(items, activeCycle.workWithItemId),
    startDate: activeCycle.startDate,
    endDate: activeCycle.endDate,
    reflection: {
      text: reflectionText.trim(),
      submittedAt,
    },
  };
}

function initialAppData(_: undefined) {
  return loadAppData();
}

function appReducer(state: AppData, action: AppAction): AppData {
  switch (action.type) {
    case 'add_core_value': {
      const text = action.text.trim();

      if (!text) {
        return state;
      }

      const newValue: CoreValue = {
        id: createId(),
        text,
        createdAt: action.timestamp,
        updatedAt: action.timestamp,
      };

      return {
        ...state,
        coreValues: [...state.coreValues, newValue],
      };
    }

    case 'update_core_value': {
      const text = action.text.trim();

      if (!text) {
        return state;
      }

      return {
        ...state,
        coreValues: state.coreValues.map((value) =>
          value.id === action.id ? { ...value, text, updatedAt: action.timestamp } : value,
        ),
      };
    }

    case 'delete_core_value':
      return {
        ...state,
        coreValues: state.coreValues.filter((value) => value.id !== action.id),
      };

    case 'add_mission_item': {
      const text = action.text.trim();

      if (!text) {
        return state;
      }

      const newItem: MissionItem = {
        id: createId(),
        category: action.category,
        text,
        isActive: true,
        usedInCurrentRotation: false,
      };

      return {
        ...state,
        missionItems: [...state.missionItems, newItem],
      };
    }

    case 'update_mission_item': {
      const text = action.text.trim();

      if (!text) {
        return state;
      }

      return {
        ...state,
        missionItems: state.missionItems.map((item) =>
          item.id === action.id ? { ...item, text } : item,
        ),
      };
    }

    case 'toggle_mission_item_active':
      return {
        ...state,
        missionItems: state.missionItems.map((item) =>
          item.id === action.id
            ? {
                ...item,
                isActive: !item.isActive,
                usedInCurrentRotation: item.isActive ? item.usedInCurrentRotation : false,
              }
            : item,
        ),
      };

    case 'delete_mission_item':
      return {
        ...state,
        missionItems: state.missionItems.filter((item) => item.id !== action.id),
      };

    case 'start_cycle': {
      const { startDate, endDate } = getCycleDates(action.timestamp);
      const nextMissionItems = applySelectionToRotation(state.missionItems, action.selection);

      return {
        ...state,
        missionItems: nextMissionItems,
        activeCycle: {
          id: createId(),
          buildItemId: action.selection.build ?? '',
          shapeItemId: action.selection.shape ?? '',
          workWithItemId: action.selection.workWith ?? '',
          startDate,
          endDate,
          status: 'active',
        },
      };
    }

    case 'mark_awaiting_reflection':
      if (!state.activeCycle || state.activeCycle.status !== 'active') {
        return state;
      }

      return {
        ...state,
        activeCycle: {
          ...state.activeCycle,
          status: 'awaiting_reflection',
        },
      };

    case 'submit_reflection':
      if (!state.activeCycle || !action.text.trim()) {
        return state;
      }

      return {
        ...state,
        activeCycle: null,
        history: [
          buildHistoryCycle(state.activeCycle, state.missionItems, action.text, action.timestamp),
          ...state.history,
        ],
      };

    case 'delete_history_record':
      return {
        ...state,
        history: state.history.filter((entry) => entry.id !== action.id),
      };

    case 'clear_all':
      return createEmptyAppData();

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(appReducer, undefined, initialAppData);
  const [now, setNow] = useState(() => new Date());
  const skipPersistRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const nowIso = now.toISOString();
  const state = deriveAppState(data, nowIso);

  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    saveAppData(data);
  }, [data]);

  useEffect(() => {
    if (state === 'awaiting_reflection' && data.activeCycle?.status === 'active') {
      dispatch({ type: 'mark_awaiting_reflection' });
    }
  }, [data.activeCycle, state]);

  const eligibleItems = {
    build: getEligibleMissionItems(data.missionItems, 'build'),
    shape: getEligibleMissionItems(data.missionItems, 'shape'),
    workWith: getEligibleMissionItems(data.missionItems, 'workWith'),
  };

  const activeCycleItems = {
    build: data.activeCycle
      ? data.missionItems.find((item) => item.id === data.activeCycle?.buildItemId) ?? null
      : null,
    shape: data.activeCycle
      ? data.missionItems.find((item) => item.id === data.activeCycle?.shapeItemId) ?? null
      : null,
    workWith: data.activeCycle
      ? data.missionItems.find((item) => item.id === data.activeCycle?.workWithItemId) ?? null
      : null,
  };

  const value: AppContextValue = {
    ...data,
    nowIso,
    state,
    canEditModel: canEditModelForState(state),
    eligibleItems,
    activeCycleItems,
    cycleMessage: getMessageForDate(nowIso),
    addCoreValue: (text) =>
      dispatch({ type: 'add_core_value', text, timestamp: new Date().toISOString() }),
    updateCoreValue: (id, text) =>
      dispatch({
        type: 'update_core_value',
        id,
        text,
        timestamp: new Date().toISOString(),
      }),
    deleteCoreValue: (id) => dispatch({ type: 'delete_core_value', id }),
    addMissionItem: (category, text) => dispatch({ type: 'add_mission_item', category, text }),
    updateMissionItem: (id, text) => dispatch({ type: 'update_mission_item', id, text }),
    toggleMissionItemActive: (id) => dispatch({ type: 'toggle_mission_item_active', id }),
    deleteMissionItem: (id) => {
      if (!canDeleteMissionItemGuard(data, id)) {
        return false;
      }

      dispatch({ type: 'delete_mission_item', id });
      return true;
    },
    startCycle: (selection) => {
      const validation = validateSelection(data, selection, nowIso);

      if (!validation.isValid) {
        return {
          ok: false,
          errors: validation.errors,
        };
      }

      dispatch({ type: 'start_cycle', selection, timestamp: nowIso });

      return {
        ok: true,
        errors: {},
      };
    },
    submitReflection: (text) => {
      if (!text.trim()) {
        return false;
      }

      dispatch({ type: 'submit_reflection', text, timestamp: new Date().toISOString() });
      return true;
    },
    deleteHistoryRecord: (id) => dispatch({ type: 'delete_history_record', id }),
    clearAllData: () => {
      skipPersistRef.current = true;
      clearStoredAppData();
      dispatch({ type: 'clear_all' });
    },
    exportData: () => exportAppData(data),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
}
