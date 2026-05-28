'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Flame,
  Play,
  Sparkles,
  Compass,
  MoveRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardUserState } from '@/data/dashboardData';

type HeroTier = 'save' | 'resume' | 'onward' | 'calibrate' | 'pick';
type HeroAccent = 'warm' | 'brand' | 'muted';

interface HeroVariant {
  tier: HeroTier;
  glyph: LucideIcon;
  contextLine: string;
  headline: string;
  supporting: string;
  ctaLabel: string;
  ctaHref: string;
  accent: HeroAccent;
}

const HOURS = 60 * 60 * 1000;

function pickHeroVariant(s: DashboardUserState): HeroVariant {
  const now = Date.now();
  const idleHours = (now - s.streak.lastActiveAt.getTime()) / HOURS;
  const questHoursLeft = s.activeQuest?.deadlineAt
    ? (s.activeQuest.deadlineAt.getTime() - now) / HOURS
    : Infinity;

  // Tier 1 — Save: streak about to break OR quest deadline imminent
  if (s.streak.days >= 3 && idleHours > 20) {
    const supporting = s.activeSkill
      ? `10 minutes on ${s.activeSkill.name} keeps your ${s.streak.days}-day streak alive.`
      : `Knock out one exercise to keep your ${s.streak.days}-day streak alive.`;
    return {
      tier: 'save',
      glyph: Flame,
      contextLine: `STREAK · ${s.streak.days} DAYS`,
      headline: "Don't lose your streak",
      supporting,
      ctaLabel: s.activeSkill ? `Continue ${s.activeSkill.name}` : 'Pick something fast',
      ctaHref: s.activeSkill ? `/skills/${s.activeSkill.id}` : '/skills',
      accent: 'warm',
    };
  }

  if (s.activeQuest && questHoursLeft < 24) {
    return {
      tier: 'save',
      glyph: Flame,
      contextLine: 'QUEST · EXPIRING',
      headline: s.activeQuest.title,
      supporting: `${Math.max(1, Math.round(questHoursLeft))}h left · +${s.activeQuest.reward} XP if you finish.`,
      ctaLabel: 'Open quest',
      ctaHref: `/quests/${s.activeQuest.id}`,
      accent: 'warm',
    };
  }

  // Tier 3 — Onward: just completed a skill
  if (s.recentlyCompletedSkill && s.nextUnlockedSkill) {
    const completedHours =
      (now - s.recentlyCompletedSkill.completedAt.getTime()) / HOURS;
    if (completedHours < 2) {
      return {
        tier: 'onward',
        glyph: Sparkles,
        contextLine: 'NICE WORK',
        headline: `${s.recentlyCompletedSkill.name} — done.`,
        supporting: `Next up: ${s.nextUnlockedSkill.name}. Unlocked just now.`,
        ctaLabel: `Start ${s.nextUnlockedSkill.name}`,
        ctaHref: `/skills/${s.nextUnlockedSkill.id}`,
        accent: 'brand',
      };
    }
  }

  // Tier 2 — Resume: in-progress skill, practiced recently
  if (s.activeSkill && idleHours < 48) {
    const hoursLeftLabel = formatHoursLeft(s.activeSkill.estimatedHoursLeft);
    return {
      tier: 'resume',
      glyph: Play,
      contextLine: `IN PROGRESS · ${s.activeSkill.category.toUpperCase()}`,
      headline: `Continue ${s.activeSkill.name}`,
      supporting: `${s.activeSkill.progress}% complete · ${hoursLeftLabel} left to wrap.`,
      ctaLabel: 'Resume',
      ctaHref: `/skills/${s.activeSkill.id}`,
      accent: 'brand',
    };
  }

  // Tier 4 — Calibrate: no diagnostic taken yet
  if (!s.diagnosticTaken) {
    return {
      tier: 'calibrate',
      glyph: Compass,
      contextLine: 'CALIBRATE',
      headline: "Let's skip what you already know",
      supporting:
        'A 5-minute check unlocks the right starting point in your tree. No remedial chapters.',
      ctaLabel: 'Start the check',
      ctaHref: '/diagnostic',
      accent: 'brand',
    };
  }

  // Tier 5 — Pick: quiet fallback
  return {
    tier: 'pick',
    glyph: MoveRight,
    contextLine: 'TODAY',
    headline: 'Pick where to spend an hour',
    supporting: 'Take a quest, or open the tree and find your next skill.',
    ctaLabel: 'Open the tree',
    ctaHref: '/skills',
    accent: 'muted',
  };
}

function formatHoursLeft(h: number): string {
  if (h < 1) return `~${Math.round(h * 60)} min`;
  if (h < 2) return '~1 hr';
  return `~${Math.round(h)} hrs`;
}

const accentStyles: Record<HeroAccent, { line: string; text: string; cta: string; ctaHover: string }> = {
  warm: {
    line: 'bg-[#E25A2C]',
    text: 'text-[#E25A2C]',
    cta: 'bg-[#E25A2C] text-white',
    ctaHover: 'hover:bg-[#C84A1F]',
  },
  brand: {
    line: 'bg-[var(--accent)]',
    text: 'text-[var(--accent-text)]',
    cta: 'bg-[var(--accent)] text-[var(--accent-fg)]',
    ctaHover: 'hover:bg-[var(--accent-hover)]',
  },
  muted: {
    line: 'bg-[var(--text-muted)]',
    text: 'text-[var(--text-secondary)]',
    cta: 'bg-[var(--surface-3)] text-[var(--text-primary)]',
    ctaHover: 'hover:bg-[var(--surface-2)]',
  },
};

interface HeroProps {
  state: DashboardUserState;
}

export function Hero({ state }: HeroProps) {
  const variant = pickHeroVariant(state);
  const a = accentStyles[variant.accent];
  const Glyph = variant.glyph;

  return (
    <motion.section
      key={variant.tier}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-[var(--card)] border border-[var(--border-color)]',
        'p-8 lg:p-12',
      )}
    >
      {/* Context line — small caps, leading accent rule */}
      <div className="flex items-center gap-3 mb-7 lg:mb-9">
        <span className={cn('h-px w-8 shrink-0', a.line)} />
        <span
          className={cn(
            'text-[10px] font-semibold tracking-[0.18em] uppercase',
            a.text,
          )}
        >
          {variant.contextLine}
        </span>
        <Glyph
          size={12}
          strokeWidth={2.25}
          className={cn('ml-auto opacity-80', a.text)}
        />
      </div>

      {/* Headline */}
      <h2
        className={cn(
          'text-[1.875rem] lg:text-[2.5rem] font-semibold',
          'text-[var(--text-primary)]',
          'tracking-[-0.025em] leading-[1.05]',
          'max-w-[28ch]',
        )}
      >
        {variant.headline}
      </h2>

      {/* Supporting */}
      <p
        className={cn(
          'mt-4 text-[15px] lg:text-base leading-relaxed',
          'text-[var(--text-secondary)]',
          'max-w-[52ch]',
        )}
      >
        {variant.supporting}
      </p>

      {/* CTA */}
      <div className="mt-8 lg:mt-10 flex items-center justify-between flex-wrap gap-3">
        <Link
          href={variant.ctaHref}
          className={cn(
            'group inline-flex items-center gap-2',
            'h-11 px-5 rounded-lg',
            'text-sm font-medium',
            'transition-colors duration-150',
            'active:translate-y-px',
            a.cta,
            a.ctaHover,
          )}
        >
          {variant.ctaLabel}
          <ArrowRight
            size={15}
            strokeWidth={2.25}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>

        {/* Quiet secondary link — depends on tier */}
        {variant.tier !== 'pick' && (
          <Link
            href="/skills"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            or open the tree
          </Link>
        )}
      </div>
    </motion.section>
  );
}
