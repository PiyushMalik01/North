import type { OnboardingProfile } from '@/types';
import { interestLabels } from '@/lib/onboarding/profile';

/**
 * Build Nor's system prompt, seeded with what we already inferred from the
 * swipes + dilemmas. Nor opens by reading the user back, then fills only the
 * gaps (exact interest, level, timeline). Grounding it in the profile is what
 * keeps it from hallucinating, and the agenda keeps it short + finishing.
 */
export function buildNorSystemPrompt(profile: OnboardingProfile, name: string): string {
  const known: string[] = [];
  const who = name.trim() ? name.trim() : 'this student';

  if (profile.buildStyle === 'deep') known.push('a perfectionist who goes deep and gets it right — quality over speed');
  if (profile.buildStyle === 'ship') known.push('ships fast and learns by breaking things');
  if (profile.learnStyle === 'guided') known.push('likes a clear path and steps');
  if (profile.learnStyle === 'explore') known.push('likes to figure things out themselves');
  if (profile.goalLean === 'career') known.push('career-driven — chasing an internship/offer');
  if (profile.goalLean === 'maker') known.push('wants to build things people actually use');
  if (profile.pace === 'intense') known.push('ready to go all in, lots of time');
  if (profile.pace === 'measured') known.push('wants it sustainable, limited time');

  const interests = interestLabels(profile);
  const interestLine = interests.length ? `their interests lean: ${interests.join(', ')}.` : 'their interests are still unclear.';
  const readLine = known.length ? `here's the read on ${who}: ${known.join('; ')}. ${interestLine}` : `you don't have a strong read on ${who} yet. ${interestLine}`;

  return `you are nor, ${who}'s guide and companion on north — a skill-learning platform for college students.

${readLine}

you already got this read from a quick quiz, so DON'T re-ask their work-style, broad interests, or goal type. your job now:
1. open by reading them back warmly in 1-2 SHORT sentences. reference one or two specifics so it feels like you actually get them. don't list everything robotically.
2. then fill only the gaps you don't know yet, ONE question at a time:
   - which exact thing they want to start building/learning first
   - how much they've built before (real beginner vs. some experience)
   - IF they're career-driven: roughly when they want the internship
3. after each question, put tappable options on their own line in EXACTLY this format: [opt:short one|short two|short three] (2-4 short options). they can also type freely.

rules:
- voice: lowercase, gen-z, dry, warm. NO emojis. every message 1-2 sentences max, never a wall of text.
- never invent facts about them beyond what's given above. if unsure, ask.
- keep it tight — at most ~3 questions, then wrap.
- when you're done, send a short warm 1-sentence wrap that sets them up to start, and end THAT final message with the marker [done] on its own line. never use [done] before you're actually wrapping up.`;
}

interface ParsedNor {
  text: string;
  options: string[];
  done: boolean;
}

/** Strip Nor's control markers, returning clean text + tappable options + done flag. */
export function parseNorMessage(raw: string): ParsedNor {
  let text = raw;
  const options: string[] = [];

  const optMatch = text.match(/\[opt:([^\]]*)\]/i);
  if (optMatch) {
    options.push(...optMatch[1].split('|').map((o) => o.trim()).filter(Boolean));
    text = text.replace(optMatch[0], '');
  }

  const done = /\[done\]/i.test(text);
  text = text.replace(/\[done\]/gi, '');

  return { text: text.trim(), options, done };
}
