'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardUserState } from '@/data/dashboardData';

interface StatsStripProps {
  state: DashboardUserState;
}

export function StatsStrip({ state }: StatsStripProps) {
  const skillsPct = Math.round((state.skills.completed / state.skills.total) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Your stats"
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4',
        'gap-y-6 gap-x-8 sm:gap-x-10',
        'px-1 py-1',
      )}
    >
      {/* Streak — the only colored number */}
      <Link
        href="/profile"
        className="group flex flex-col items-start min-w-0"
      >
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'text-[2rem] lg:text-[2.25rem] font-semibold tabular-nums leading-none',
              'text-[var(--accent-text)]',
              'tracking-[-0.02em]',
            )}
          >
            {state.streak.days}
          </span>
          <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
            day streak
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
          <Snowflake size={11} strokeWidth={2.25} className="opacity-70" />
          <span className="tabular-nums">×&nbsp;{state.streak.freezes}</span>
          <span className="opacity-70">freezes</span>
        </div>
      </Link>

      {/* XP */}
      <div className="flex flex-col items-start min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[2rem] lg:text-[2.25rem] font-semibold tabular-nums leading-none text-[var(--text-primary)] tracking-[-0.02em]">
            {state.xp.toLocaleString()}
          </span>
          <span className="text-xs text-[var(--text-muted)]">xp</span>
        </div>
        <span className="mt-2 text-[11px] text-[var(--text-muted)]">
          lifetime
        </span>
      </div>

      {/* Rank */}
      <div className="flex flex-col items-start min-w-0">
        <span className="text-[1.375rem] lg:text-[1.5rem] font-semibold leading-tight text-[var(--text-primary)] tracking-[-0.015em]">
          {state.rank}
        </span>
        <span className="mt-2 text-[11px] text-[var(--text-muted)]">
          current rank
        </span>
      </div>

      {/* Skills + 1px bar */}
      <Link
        href="/skills"
        className="group flex flex-col items-start min-w-0"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[2rem] lg:text-[2.25rem] font-semibold tabular-nums leading-none text-[var(--text-primary)] group-hover:text-[var(--accent-text)] transition-colors tracking-[-0.02em]">
            {state.skills.completed}
            <span className="text-[var(--text-muted)] font-normal"> / {state.skills.total}</span>
          </span>
          <span className="text-xs text-[var(--text-muted)]">skills</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 w-full max-w-[140px]">
          <div className="h-px flex-1 bg-[var(--surface-3)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skillsPct}%` }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-[var(--text-secondary)] group-hover:bg-[var(--accent-text)] transition-colors"
            />
          </div>
          <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
            {skillsPct}%
          </span>
        </div>
      </Link>
    </motion.section>
  );
}
