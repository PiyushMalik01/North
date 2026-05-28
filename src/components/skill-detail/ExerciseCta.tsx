'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExerciseSpec } from '@/data/curriculum';

interface ExerciseCtaProps {
  skillSlug: string;
  exercise: ExerciseSpec;
}

export function ExerciseCta({ skillSlug, exercise }: ExerciseCtaProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-xl p-6 lg:p-8',
        'bg-[var(--card)] border border-[var(--border-color)]',
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="h-px w-6 bg-[var(--accent)] opacity-80" />
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-text)]">
          Exercise
        </span>
        <Code2 size={12} strokeWidth={2.25} className="text-[var(--accent-text)] opacity-80 ml-1" />
      </div>

      <h2 className="text-xl lg:text-2xl font-semibold text-[var(--text-primary)] tracking-[-0.02em] leading-snug">
        {exercise.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] max-w-[58ch]">
        {exercise.brief}
      </p>

      <ul className="mt-5 space-y-2">
        {exercise.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-sm text-[var(--text-primary)] leading-relaxed">
            <span className="shrink-0 mt-2 h-1 w-1 rounded-full bg-[var(--text-muted)]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7 flex items-center justify-between flex-wrap gap-3">
        <p className="text-[11px] text-[var(--text-muted)]">
          Opens a workspace inside this skill — no copy-paste, with an English block on submit.
        </p>
        <Link
          href={`/skills/${skillSlug}/exercise`}
          className={cn(
            'group inline-flex items-center gap-2',
            'h-10 px-4 rounded-lg',
            'text-sm font-medium',
            'bg-[var(--accent)] text-[var(--accent-fg)]',
            'hover:bg-[var(--accent-hover)] transition-colors duration-150',
            'active:translate-y-px',
          )}
        >
          Open the workspace
          <ArrowRight
            size={15}
            strokeWidth={2.25}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </motion.section>
  );
}
