'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CurriculumSkill, SkillStatus } from '@/data/curriculum';

interface SkillHeroProps {
  skill: CurriculumSkill;
  status: SkillStatus;
  progress?: number;
  hoursLeft?: number;
}

const difficultyLabel = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

export function SkillHero({ skill, status, progress = 0, hoursLeft }: SkillHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Breadcrumb */}
      <Link
        href="/skills"
        className={cn(
          'inline-flex items-center gap-1.5 -ml-1 mb-5',
          'text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
          'transition-colors duration-150',
        )}
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Skill tree / {skill.branch}
      </Link>

      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0 max-w-[44ch]">
          <h1 className="text-[2rem] lg:text-[2.5rem] font-semibold text-[var(--text-primary)] tracking-[-0.025em] leading-[1.05]">
            {skill.name}
          </h1>

          {/* Why now */}
          <div className="mt-5 flex items-start gap-3">
            <span className="mt-2 h-px w-6 shrink-0 bg-[var(--accent)] opacity-80" />
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed italic">
              {skill.whyNow}
            </p>
          </div>
        </div>

        {/* Skip via proof CTA */}
        {status !== 'completed' && status !== 'reinforced' && skill.skipChallenge && (
          <Link
            href={`/diagnostic#${skill.slug}`}
            className={cn(
              'group inline-flex items-center gap-2 shrink-0',
              'h-9 px-3.5 rounded-lg',
              'text-xs font-medium',
              'border border-[var(--border-color)] text-[var(--text-secondary)]',
              'hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]',
              'transition-colors duration-150',
            )}
          >
            <Compass size={13} strokeWidth={2.25} />
            Skip via proof
          </Link>
        )}
      </div>

      {/* Meta strip */}
      <div className="mt-7 flex items-center gap-4 flex-wrap text-[12px]">
        <StatusPill status={status} />
        <span className="text-[var(--text-muted)] opacity-50">·</span>
        <span className="text-[var(--text-secondary)]">
          {difficultyLabel[skill.difficulty]}
        </span>
        <span className="text-[var(--text-muted)] opacity-50">·</span>
        <span className="text-[var(--text-secondary)] tabular-nums">
          ~{skill.estimatedHours}h
        </span>
        {status === 'in-progress' && (
          <>
            <span className="text-[var(--text-muted)] opacity-50">·</span>
            <span className="text-[var(--accent-text)] tabular-nums font-medium">
              {progress}% · {hoursLeft ?? 0}h left
            </span>
          </>
        )}
      </div>

      {/* Progress bar — only when in progress */}
      {status === 'in-progress' && (
        <div className="mt-4 h-[3px] w-full bg-[var(--surface-3)] rounded-full overflow-hidden max-w-md">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-[var(--accent)] rounded-full"
          />
        </div>
      )}
    </motion.section>
  );
}

function StatusPill({ status }: { status: SkillStatus }) {
  const styles: Record<SkillStatus, { label: string; className: string }> = {
    locked: { label: 'Locked', className: 'text-[var(--text-muted)]' },
    unlocked: { label: 'Ready to start', className: 'text-[var(--text-secondary)]' },
    'in-progress': { label: 'In progress', className: 'text-[var(--accent-text)]' },
    completed: { label: 'Completed', className: 'text-[var(--skill-completed)]' },
    reinforced: { label: 'Reinforced', className: 'text-[var(--skill-completed)]' },
  };
  const s = styles[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium', s.className)}>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'completed' || status === 'reinforced' ? 'bg-[var(--skill-completed)]' : '',
          status === 'in-progress' ? 'bg-[var(--accent)]' : '',
          status === 'unlocked' ? 'bg-[var(--text-secondary)]' : '',
          status === 'locked' ? 'bg-[var(--text-muted)]' : '',
        )}
      />
      {s.label}
    </span>
  );
}
