'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExerciseSpec } from '@/data/curriculum';

interface TaskPanelProps {
  skillName: string;
  skillSlug: string;
  exercise: ExerciseSpec;
}

export function TaskPanel({ skillName, skillSlug, exercise }: TaskPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col gap-6',
        'p-6 lg:p-8',
        'border-b lg:border-b-0 lg:border-r border-[var(--border-color)]',
        'bg-[var(--card)]',
        'lg:max-w-md lg:w-[40%]',
      )}
    >
      {/* Breadcrumb */}
      <Link
        href={`/skills/${skillSlug}`}
        className={cn(
          'inline-flex items-center gap-1.5',
          'text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
          'transition-colors duration-150 -ml-1',
        )}
      >
        <ChevronLeft size={14} strokeWidth={2} />
        {skillName}
      </Link>

      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-6 bg-[var(--accent)] opacity-80" />
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-text)]">
            Exercise
          </span>
        </div>
        <h1 className="text-[1.5rem] lg:text-[1.75rem] font-semibold text-[var(--text-primary)] tracking-[-0.02em] leading-[1.15]">
          {exercise.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {exercise.brief}
        </p>
      </div>

      {/* Spec bullets */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)] mb-3">
          What it should do
        </p>
        <ul className="space-y-2.5">
          {exercise.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm text-[var(--text-primary)] leading-relaxed">
              <span className="shrink-0 mt-2 h-1 w-1 rounded-full bg-[var(--text-muted)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Anti-cheat reminder */}
      <div
        className={cn(
          'rounded-lg p-3.5 border border-dashed',
          'border-[var(--border-color)] bg-[var(--surface-1)]/50',
        )}
      >
        <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
          <span className="text-[var(--text-secondary)] font-medium">No paste.</span>{' '}
          Typing it is the point. The English block below your code is graded too — explain what you built, in your own words.
        </p>
      </div>

      {/* Nor — placeholder */}
      <button
        type="button"
        disabled
        className={cn(
          'mt-auto inline-flex items-center gap-2',
          'text-xs text-[var(--text-muted)]',
          'opacity-60 cursor-not-allowed',
          'self-start',
        )}
        title="Nor will be available here in a future release."
      >
        <Sparkles size={13} strokeWidth={2} />
        Ask Nor
        <span className="text-[10px] uppercase tracking-wider opacity-80">soon</span>
      </button>
    </motion.aside>
  );
}
