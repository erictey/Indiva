import { describe, expect, it } from 'vitest';
import {
  applySelectionToRotation,
  getActiveMissionItems,
  getEligibleMissionItems,
  isCategoryExhausted,
  isMissionItemEligible,
} from './rotation';
import type { MissionItem } from './types';

function makeItem(
  id: string,
  category: MissionItem['category'],
  used = false,
  active = true,
): MissionItem {
  return { id, category, text: id, isActive: active, usedInCurrentRotation: used };
}

describe('getActiveMissionItems', () => {
  it('returns only active items for category', () => {
    const items = [
      makeItem('a', 'build'),
      makeItem('b', 'build', false, false),
      makeItem('c', 'shape'),
    ];
    const result = getActiveMissionItems(items, 'build');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });

  it('returns empty for unknown category', () => {
    const items = [makeItem('a', 'build')];
    expect(getActiveMissionItems(items, 'shape')).toHaveLength(0);
  });
});

describe('isCategoryExhausted', () => {
  it('false when no active items', () => {
    expect(isCategoryExhausted([], 'build')).toBe(false);
  });

  it('false when some items unused', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', false)];
    expect(isCategoryExhausted(items, 'build')).toBe(false);
  });

  it('true when all active items used', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', true)];
    expect(isCategoryExhausted(items, 'build')).toBe(true);
  });
});

describe('getEligibleMissionItems', () => {
  it('returns unused items when available', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', false)];
    const result = getEligibleMissionItems(items, 'build');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b');
  });

  it('returns all active items when all used (rotation reset)', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', true)];
    const result = getEligibleMissionItems(items, 'build');
    expect(result).toHaveLength(2);
  });
});

describe('isMissionItemEligible', () => {
  it('false for inactive item', () => {
    const items = [makeItem('a', 'build', false, false)];
    expect(isMissionItemEligible(items, 'a')).toBe(false);
  });

  it('false when item used and others unused', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', false)];
    expect(isMissionItemEligible(items, 'a')).toBe(false);
  });

  it('true for unused item', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', false)];
    expect(isMissionItemEligible(items, 'b')).toBe(true);
  });

  it('true when all used (all eligible)', () => {
    const items = [makeItem('a', 'build', true), makeItem('b', 'build', true)];
    expect(isMissionItemEligible(items, 'a')).toBe(true);
  });
});

describe('applySelectionToRotation', () => {
  it('marks selected items as used', () => {
    const items = [
      makeItem('a', 'build'),
      makeItem('b', 'shape'),
      makeItem('c', 'workWith'),
    ];
    const selection = { build: 'a', shape: 'b', workWith: 'c' };
    const result = applySelectionToRotation(items, selection);
    expect(result.find((i) => i.id === 'a')?.usedInCurrentRotation).toBe(true);
    expect(result.find((i) => i.id === 'b')?.usedInCurrentRotation).toBe(true);
    expect(result.find((i) => i.id === 'c')?.usedInCurrentRotation).toBe(true);
  });

  it('resets exhausted category before marking', () => {
    const items = [
      makeItem('a', 'build', true),
      makeItem('b', 'build', true),
      makeItem('c', 'shape'),
      makeItem('d', 'workWith'),
    ];
    const selection = { build: 'a', shape: 'c', workWith: 'd' };
    const result = applySelectionToRotation(items, selection);
    expect(result.find((i) => i.id === 'b')?.usedInCurrentRotation).toBe(false);
    expect(result.find((i) => i.id === 'a')?.usedInCurrentRotation).toBe(true);
  });

  it('does not mutate original array', () => {
    const items = [makeItem('a', 'build'), makeItem('b', 'shape'), makeItem('c', 'workWith')];
    const selection = { build: 'a', shape: 'b', workWith: 'c' };
    applySelectionToRotation(items, selection);
    expect(items[0].usedInCurrentRotation).toBe(false);
  });
});
