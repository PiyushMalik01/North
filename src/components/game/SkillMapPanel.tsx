'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { mockNodeChain } from '@/data/gameData';
import { Panel } from './Panel';

interface SkillMapPanelProps {
  completed: number;
  total: number;
  className?: string;
}

const NODE_STYLES: Record<string, string> = {
  done: 'bg-[var(--accent)] border-[var(--accent)]',
  active: 'bg-[var(--accent-muted)] border-[var(--accent)] animate-pulse',
  locked: 'bg-[var(--surface-3)] border-[var(--border-color)]',
};

/** The world-map teaser: a node chain + a doorway into the full skill tree. */
export function SkillMapPanel({ completed, total, className }: SkillMapPanelProps) {
  return (
    <Panel label="World" className={cn('flex flex-col p-4 pt-5 sm:p-5 sm:pt-6', className)}>
      <div className="flex items-baseline justify-between">
        <span className="font-[family-name:var(--font-oswald)] text-2xl font-bold tabular-nums text-[var(--text-primary)]">
          {completed}
          <span className="text-base text-[var(--text-muted)]">/{total}</span>
        </span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          skills cleared
        </span>
      </div>

      {/* Node chain */}
      <div className="mt-4 flex items-center" aria-hidden="true">
        {mockNodeChain.map((node, i) => (
          <div key={node.id} className="flex flex-1 items-center last:flex-none">
            <span
              className={cn(
                'h-3.5 w-3.5 shrink-0 rotate-45 border-2',
                NODE_STYLES[node.state],
              )}
            />
            {i < mockNodeChain.length - 1 && (
              <span className="h-[2px] flex-1 bg-[var(--border-color)]" />
            )}
          </div>
        ))}
      </div>

      <Link
        href="/skills"
        className={cn(
          'mt-auto flex h-11 items-center justify-center gap-2 border-2 border-[var(--border-color)]',
          'mt-5 font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-[0.12em]',
          'text-[var(--text-primary)] transition-all duration-150',
          'hover:border-[var(--accent)] hover:text-[var(--accent-text)] hover:-translate-y-0.5',
        )}
      >
        Enter Map
        <span aria-hidden="true">&#9656;</span>
      </Link>
    </Panel>
  );
}
