import { describe, it, expect } from 'vitest';
import { assessments } from './prove';

describe('assessments — structural integrity', () => {
  it('each assessment has at least one question', () => {
    for (const a of assessments) {
      expect(a.questions.length,
        `assessment "${a.id}" has no questions`
      ).toBeGreaterThan(0);
    }
  });

  it('every question.answer index is within options bounds', () => {
    for (const a of assessments) {
      for (const q of a.questions) {
        expect(q.answer,
          `assessment "${a.id}" question "${q.id}" answer=${q.answer} but options.length=${q.options.length}`
        ).toBeGreaterThanOrEqual(0);
        expect(q.answer,
          `assessment "${a.id}" question "${q.id}" answer=${q.answer} out of bounds`
        ).toBeLessThan(q.options.length);
      }
    }
  });

  it('every assessment passPct is between 1 and 100 inclusive', () => {
    for (const a of assessments) {
      expect(a.passPct,
        `assessment "${a.id}" has passPct=${a.passPct}`
      ).toBeGreaterThanOrEqual(1);
      expect(a.passPct,
        `assessment "${a.id}" has passPct=${a.passPct}`
      ).toBeLessThanOrEqual(100);
    }
  });

  it('all assessment ids are unique', () => {
    const ids = assessments.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all question ids are unique within each assessment', () => {
    for (const a of assessments) {
      const qIds = a.questions.map((q) => q.id);
      expect(new Set(qIds).size,
        `assessment "${a.id}" has duplicate question ids`
      ).toBe(qIds.length);
    }
  });

  it('all question ids are globally unique', () => {
    const allIds = assessments.flatMap((a) => a.questions.map((q) => q.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('every assessment has xp > 0', () => {
    for (const a of assessments) {
      expect(a.xp,
        `assessment "${a.id}" has xp=${a.xp}`
      ).toBeGreaterThan(0);
    }
  });

  it('every question has at least 2 options', () => {
    for (const a of assessments) {
      for (const q of a.questions) {
        expect(q.options.length,
          `assessment "${a.id}" question "${q.id}" has only ${q.options.length} option(s)`
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('every question has a non-empty prompt and explain', () => {
    for (const a of assessments) {
      for (const q of a.questions) {
        expect(q.prompt.length).toBeGreaterThan(0);
        expect(q.explain.length).toBeGreaterThan(0);
      }
    }
  });

  it('rapid assessments have durationSec defined and > 0', () => {
    for (const a of assessments) {
      if (a.kind === 'rapid') {
        expect(a.durationSec,
          `rapid assessment "${a.id}" missing durationSec`
        ).toBeDefined();
        expect(a.durationSec!).toBeGreaterThan(0);
      }
    }
  });
});
