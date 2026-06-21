import { describe, it, expect } from 'vitest';
import { squirclePath } from './squircle-path';

/** Returns true if the string contains no 'NaN' or 'Infinity' substrings. */
function hasNoInvalidNumbers(s: string): boolean {
  return !s.includes('NaN') && !s.includes('Infinity');
}

describe('squirclePath', () => {
  it('returns a non-empty string for a square box', () => {
    const result = squirclePath(100, 100, 20, 0.6);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('starts with "M " (move-to command)', () => {
    const result = squirclePath(100, 100, 20, 0.6);
    expect(result.startsWith('M ')).toBe(true);
  });

  it('ends with "z" (close-path command)', () => {
    const result = squirclePath(100, 100, 20, 0.6);
    expect(result.endsWith('z')).toBe(true);
  });

  it('contains arc command "a " for circular segments', () => {
    const result = squirclePath(100, 100, 20, 0.6);
    expect(result).toContain('a ');
  });

  it('contains cubic bezier command "c " for smooth segments', () => {
    const result = squirclePath(100, 100, 20, 0.6);
    expect(result).toContain('c ');
  });

  it('produces no NaN values for a square box', () => {
    expect(hasNoInvalidNumbers(squirclePath(100, 100, 20, 0.6))).toBe(true);
  });

  it('produces no NaN values for a wide box', () => {
    expect(hasNoInvalidNumbers(squirclePath(300, 100, 20, 0.6))).toBe(true);
  });

  it('produces no NaN values for a tall box', () => {
    expect(hasNoInvalidNumbers(squirclePath(100, 300, 20, 0.6))).toBe(true);
  });

  it('produces no NaN values for a large radius relative to size', () => {
    // radius > half-side — should clamp gracefully
    expect(hasNoInvalidNumbers(squirclePath(60, 60, 100, 0.6))).toBe(true);
  });

  it('works with zero smoothing (plain circular corners)', () => {
    const result = squirclePath(120, 80, 16, 0);
    expect(result.startsWith('M ')).toBe(true);
    expect(result.endsWith('z')).toBe(true);
    expect(hasNoInvalidNumbers(result)).toBe(true);
  });

  it('works with full smoothing (max iOS feel)', () => {
    const result = squirclePath(120, 80, 16, 1);
    expect(result.startsWith('M ')).toBe(true);
    expect(result.endsWith('z')).toBe(true);
    expect(hasNoInvalidNumbers(result)).toBe(true);
  });

  it('returns different paths for different radii', () => {
    const r10 = squirclePath(100, 100, 10, 0.6);
    const r30 = squirclePath(100, 100, 30, 0.6);
    expect(r10).not.toBe(r30);
  });
});
