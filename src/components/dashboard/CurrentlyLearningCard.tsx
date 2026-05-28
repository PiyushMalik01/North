'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActiveSkill } from '@/data/dashboardData';

interface CurrentlyLearningCardProps {
  skill: ActiveSkill | null;
}

const difficultyLabel: Record<ActiveSkill['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function CurrentlyLearningCard({ skill }: CurrentlyLearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {skill ? (
        <Link
          href={`/skills/${skill.id}`}
          className={cn(
            'group block rounded-xl p-5 lg:p-6',
            'bg-[var(--card)] border border-[var(--border-color)]',
            'hover:border-[var(--border-hover)]',
            'transition-colors duration-200',
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-[var(--accent)] opacity-80" />
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-text)]">
              Currently Learning
            </span>
          </div>

          <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-[-0.015em] leading-snug">
            {skill.name}
          </h3>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            {skill.category} <span className="text-[var(--text-muted)] opacity-50 mx-1">·</span>{' '}
            <span className="text-[var(--text-muted)]">{difficultyLabel[skill.difficulty]}</span>
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                {skill.progress}%
              </span>
              <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                ~{skill.estimatedHoursLeft}h left
              </span>
            </div>
            <div className="h-[3px] w-full bg-[var(--surface-3)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.progress}%` }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-[var(--accent)] rounded-full"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              Resume
            </span>
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </div>
        </Link>
      ) : (
        <Link
          href="/skills"
          className={cn(
            'group block rounded-xl p-5 lg:p-6',
            'bg-[var(--card)] border border-dashed border-[var(--border-color)]',
            'hover:border-[var(--accent)]/40',
            'transition-colors duration-200',
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
              Currently Learning
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-[-0.015em]">
            Start a skill
          </h3>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
            Open the tree and pick where to plant your flag.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-text)] transition-colors">
            <BookOpen size={13} strokeWidth={2.25} />
            Open the tree
          </div>
        </Link>
      )}
    </motion.div>
  );
}
