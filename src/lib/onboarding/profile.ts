import type { OnboardingData, OnboardingProfile } from '@/types';
import { LOVE_CARDS, DOMAIN_LABELS } from '@/data/onboardingData';

/**
 * Turn raw onboarding answers into an inferred profile. Pure + deterministic —
 * this is the "hidden logic" behind the choices, and the source of Nor's
 * read-back (so Nor can never hallucinate about the user).
 */
export function computeProfile(data: OnboardingData): OnboardingProfile {
  const choices = data.choices ?? {};
  const loves = data.loves ?? [];

  // Interests: collect domains from every loved card, ranked by frequency.
  const counts = new Map<string, number>();
  for (const id of loves) {
    const card = LOVE_CARDS.find((c) => c.id === id);
    if (!card) continue;
    for (const domain of card.domains) {
      counts.set(domain, (counts.get(domain) ?? 0) + 1);
    }
  }
  const interests = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([domain]) => domain);

  return {
    buildStyle: choices['2am'] ? (choices['2am'] === 'blue' ? 'deep' : 'ship') : null,
    learnStyle: choices['doors'] ? (choices['doors'] === 'blue' ? 'guided' : 'explore') : null,
    goalLean: choices['future'] ? (choices['future'] === 'blue' ? 'career' : 'maker') : null,
    pace: choices['evening'] ? (choices['evening'] === 'blue' ? 'intense' : 'measured') : null,
    interests,
  };
}

function label(domain: string): string {
  return DOMAIN_LABELS[domain] ?? domain.toLowerCase();
}

/** Unique casual interest labels, in ranked order. */
export function interestLabels(profile: OnboardingProfile): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const d of profile.interests) {
    const l = label(d);
    if (!seen.has(l)) {
      seen.add(l);
      out.push(l);
    }
  }
  return out;
}

/**
 * Nor's opening read-back — a few short lines built from the profile.
 * Always accurate because it is generated from the inferred data, not an LLM.
 */
export function buildReadback(profile: OnboardingProfile, name: string): string[] {
  const lines: string[] = [];
  const who = name.trim() ? name.trim().toLowerCase() : 'you';

  lines.push(`alright ${who}, i've been paying attention.`);

  if (profile.buildStyle === 'ship') {
    lines.push("you're a builder — you'd rather ship the thing than read about it. fast hands, you learn by breaking stuff.");
  } else if (profile.buildStyle === 'deep') {
    lines.push("you're a craftsman — you go deep and get it right before you move on. quality over speed.");
  }

  const labels = interestLabels(profile);
  const goalBit =
    profile.goalLean === 'career'
      ? 'and that future text? you want the offer — the internship’s the target.'
      : profile.goalLean === 'maker'
        ? "and you're not chasing a title; you want to build things people actually use."
        : '';
  const interestBit =
    labels.length === 0
      ? "we'll find your lane together."
      : labels.length === 1
        ? `${labels[0]}'s your pull.`
        : `${labels[0]}'s your pull, with a little ${labels[1]} on the side.`;

  if (goalBit) lines.push(goalBit);
  lines.push(interestBit);

  return lines;
}
