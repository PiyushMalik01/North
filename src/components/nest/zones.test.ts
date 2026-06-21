import { describe, it, expect } from 'vitest';
import { activeZone, MAIN_ZONES, UTILITY_ZONES, ZONES } from './zones';

describe('activeZone', () => {
  it('"/dashboard" resolves to nest zone', () => {
    const zone = activeZone('/dashboard');
    expect(zone).toBeDefined();
    expect(zone!.id).toBe('nest');
  });

  it('"/trace/roadmap" resolves to trace zone', () => {
    const zone = activeZone('/trace/roadmap');
    expect(zone).toBeDefined();
    expect(zone!.id).toBe('trace');
  });

  it('"/huddle/chat" resolves to huddle zone', () => {
    const zone = activeZone('/huddle/chat');
    expect(zone).toBeDefined();
    expect(zone!.id).toBe('huddle');
  });

  it('"/trace" (exact base href) resolves to trace zone', () => {
    const zone = activeZone('/trace');
    expect(zone).toBeDefined();
    expect(zone!.id).toBe('trace');
  });

  it('"/prove/logic" resolves to prove zone', () => {
    const zone = activeZone('/prove/logic');
    expect(zone).toBeDefined();
    expect(zone!.id).toBe('prove');
  });

  it('"/nope" returns undefined for unknown path', () => {
    expect(activeZone('/nope')).toBeUndefined();
  });

  it('"/" returns undefined (root is not a zone)', () => {
    expect(activeZone('/')).toBeUndefined();
  });

  it('"/halo/stats" resolves to halo (utility zone)', () => {
    const zone = activeZone('/halo/stats');
    expect(zone).toBeDefined();
    expect(zone!.id).toBe('halo');
  });
});

describe('ZONES collection', () => {
  it('MAIN_ZONES + UTILITY_ZONES === ZONES total', () => {
    expect(MAIN_ZONES.length + UTILITY_ZONES.length).toBe(ZONES.length);
  });

  it('all zone ids are unique', () => {
    const ids = ZONES.map((z) => z.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all zone hrefs are unique', () => {
    const hrefs = ZONES.map((z) => z.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('all sub hrefs across all zones are unique', () => {
    const subHrefs = ZONES.flatMap((z) => (z.subs ?? []).map((s) => s.href));
    expect(new Set(subHrefs).size).toBe(subHrefs.length);
  });

  it('every zone has a non-empty id, label, href, and hint', () => {
    for (const z of ZONES) {
      expect(z.id.length).toBeGreaterThan(0);
      expect(z.label.length).toBeGreaterThan(0);
      expect(z.href.startsWith('/')).toBe(true);
      expect(z.hint.length).toBeGreaterThan(0);
    }
  });

  it('every zone group is either "main" or "utility"', () => {
    for (const z of ZONES) {
      expect(['main', 'utility']).toContain(z.group);
    }
  });

  it('MAIN_ZONES all have group "main"', () => {
    for (const z of MAIN_ZONES) {
      expect(z.group).toBe('main');
    }
  });

  it('UTILITY_ZONES all have group "utility"', () => {
    for (const z of UTILITY_ZONES) {
      expect(z.group).toBe('utility');
    }
  });
});
