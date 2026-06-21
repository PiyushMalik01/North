'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ActiveSkill } from '@/data/gameData';
import { Panel } from './Panel';
import { PixelMeter } from './PixelMeter';

interface NorConsoleProps {
  norLine: string;
  skill: ActiveSkill;
  className?: string;
}

/**
 * Nor lives at the center of the base. It greets the player and owns the one
 * primary action — continue the current skill. No sidebar; the game tells you
 * what's next.
 */
export function NorConsole({ norLine, skill, className }: NorConsoleProps) {
  return (
    <Panel glow label="Nor" className={cn('p-4 pt-5 sm:p-6 sm:pt-7', className)}>
      <div className="flex items-start gap-3">
        <span
          className="mt-1 block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--accent)]"
          style={{ boxShadow: '0 0 8px var(--accent)' }}
          aria-hidden="true"
        />
        <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{norLine}</p>
      </div>

      <div className="mt-5 border-t-2 border-[var(--border-color)] pt-4">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Continue · {skill.branch}
          </span>
          <span className="font-[family-name:var(--font-oswald)] text-xs tabular-nums text-[var(--text-secondary)]">
            {skill.progress}%
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-[var(--text-primary)]">
          {skill.name}
        </h2>
        <PixelMeter value={skill.progress} segments={20} className="mt-2.5" />

        <Link
          href={`/skills/${skill.slug}`}
          className={cn(
            'mt-4 flex h-12 w-full items-center justify-center gap-2 border-2 border-[var(--accent)]',
            'bg-[var(--accent)] font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-[0.12em]',
            'text-[var(--accent-fg)] transition-all duration-150',
            'hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 active:translate-y-0',
          )}
        >
          Continue
          <span aria-hidden="true">&#9656;</span>
        </Link>
        <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
          next up: {skill.nextNode}
        </p>
      </div>
    </Panel>
  );
}
