import { CATEGORY_ORDER, type CycleSelection, type MissionCategory, type MissionItem } from './types';

export function getActiveMissionItems(items: MissionItem[], category: MissionCategory) {
  return items.filter((item) => item.category === category && item.isActive);
}

export function isCategoryExhausted(items: MissionItem[], category: MissionCategory) {
  const activeItems = getActiveMissionItems(items, category);

  return activeItems.length > 0 && activeItems.every((item) => item.usedInCurrentRotation);
}

export function getEligibleMissionItems(items: MissionItem[], category: MissionCategory) {
  const activeItems = getActiveMissionItems(items, category);
  const availableItems = activeItems.filter((item) => !item.usedInCurrentRotation);

  return availableItems.length > 0 ? availableItems : activeItems;
}

export function isMissionItemEligible(items: MissionItem[], itemId: string) {
  const target = items.find((item) => item.id === itemId && item.isActive);

  if (!target) {
    return false;
  }

  return getEligibleMissionItems(items, target.category).some((item) => item.id === itemId);
}

export function applySelectionToRotation(items: MissionItem[], selection: CycleSelection) {
  let nextItems = [...items];

  for (const category of CATEGORY_ORDER) {
    if (!isCategoryExhausted(nextItems, category)) {
      continue;
    }

    nextItems = nextItems.map((item) =>
      item.category === category && item.isActive
        ? { ...item, usedInCurrentRotation: false }
        : item,
    );
  }

  const selectedIds = CATEGORY_ORDER.map((category) => selection[category]).filter(
    (value): value is string => Boolean(value),
  );

  return nextItems.map((item) =>
    selectedIds.includes(item.id) ? { ...item, usedInCurrentRotation: true } : item,
  );
}
