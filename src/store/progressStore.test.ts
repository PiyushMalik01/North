import { describe, it, expect } from 'vitest';
import { levelFromXp, xpIntoLevel, XP_PER_LEVEL } from './progressStore';

describe('XP_PER_LEVEL', () => {
  it('equals 500', () => {
    expect(XP_PER_LEVEL).toBe(500);
  });
});

describe('levelFromXp', () => {
  it('level 1 at xp=0', () => {
    expect(levelFromXp(0)).toBe(1);
  });

  it('level 2 at xp=500 (exact boundary)', () => {
    expect(levelFromXp(500)).toBe(2);
  });

  it('level 3 at xp=1000 (exact boundary)', () => {
    expect(levelFromXp(1000)).toBe(3);
  });

  it('level 3 at xp=1250 (mid-level)', () => {
    expect(levelFromXp(1250)).toBe(3);
  });

  it('level 2 at xp=999 (just before level 3)', () => {
    expect(levelFromXp(999)).toBe(2);
  });

  it('level 1 at xp=499 (just before level 2)', () => {
    expect(levelFromXp(499)).toBe(1);
  });

  it('level 5 at xp=2000', () => {
    expect(levelFromXp(2000)).toBe(5);
  });

  it('level 1 at xp=1 (start of first level)', () => {
    expect(levelFromXp(1)).toBe(1);
  });
});

describe('xpIntoLevel', () => {
  it('0% at xp=0', () => {
    expect(xpIntoLevel(0)).toBe(0);
  });

  it('50% at xp=250 (halfway through level 1)', () => {
    expect(xpIntoLevel(250)).toBe(50);
  });

  it('50% at xp=750 (halfway through level 2)', () => {
    expect(xpIntoLevel(750)).toBe(50);
  });

  it('0% at xp=500 (start of level 2)', () => {
    expect(xpIntoLevel(500)).toBe(0);
  });

  it('0% at xp=1000 (start of level 3)', () => {
    expect(xpIntoLevel(1000)).toBe(0);
  });

  it('100% at xp=499 rounds to 100', () => {
    // 499 % 500 = 499; 499/500*100 = 99.8 => rounds to 100
    expect(xpIntoLevel(499)).toBe(100);
  });

  it('20% at xp=100', () => {
    expect(xpIntoLevel(100)).toBe(20);
  });

  it('result is always 0..100', () => {
    const samples = [0, 1, 100, 250, 499, 500, 501, 750, 1000, 1499, 2000];
    for (const xp of samples) {
      const pct = xpIntoLevel(xp);
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(100);
    }
  });
});
