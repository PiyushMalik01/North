'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  branches,
  curriculum,
  type CurriculumBranch,
  type CurriculumSkill,
} from '@/data/curriculum';
import { SkipChallengeModal } from './SkipChallengeModal';

export function DiagnosticPage() {
  const [provedSlugs, setProvedSlugs] = useState<Set<string>>(new Set());
  const [activeSkill, setActiveSkill] = useState<CurriculumSkill | null>(null);

  const grouped = useMemo(() => {
    const out: { branch: CurriculumBranch; skills: CurriculumSkill[] }[] = [];
    for (const b of branches) {
      const s = curriculum.filter(
        (c) => c.branch === b.name && c.skipChallenge,
      );
      if (s.length > 0) out.push({ branch: b.name, skills: s });
    }
    return out;
  }, []);

  const provedCount = provedSlugs.size;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 lg:px-10 py-10 lg:py-14">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-6 bg-[var(--accent)] opacity-80" />
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-text)]">
            Calibrate
          </span>
        </div>
        <h1 className="text-[2rem] lg:text-[2.5rem] font-semibold text-[var(--text-primary)] tracking-[-0.025em] leading-[1.05]">
          Skip what you already know
        </h1>
        <p className="mt-4 text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[52ch]">
          Pick any skill, take the 4-question check. Get 3 right and we mark it
          as known. No remedial chapters, no pretending you don&apos;t know things you do.
        </p>

        {provedCount > 0 && (
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--skill-completed)]">
            <Check size={14} strokeWidth={2.5} />
            {provedCount} skill{provedCount === 1 ? '' : 's'} marked as known this session
          </p>
        )}
      </motion.section>

      {/* Branch sections */}
      <div className="mt-12 space-y-12">
        {grouped.map(({ branch, skills }) => (
          <motion.section
            key={branch}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
              <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
                {branch}
              </span>
            </div>

            <ul className="space-y-2">
              {skills.map((s) => {
                const isProved = provedSlugs.has(s.slug);
                return (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => !isProved && setActiveSkill(s)}
                      disabled={isProved}
                      id={s.slug}
                      className={cn(
                        'group w-full text-left',
                        'flex items-center justify-between gap-4',
                        'px-4 py-4 rounded-lg',
                        'border transition-colors duration-150',
                        isProved
                          ? 'border-[var(--skill-completed)]/30 bg-[var(--skill-completed)]/5 cursor-default'
                          : 'border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-1)]',
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {isProved && (
                            <Check
                              size={13}
                              strokeWidth={2.5}
                              className="text-[var(--skill-completed)] shrink-0"
                            />
                          )}
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {s.name}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--text-muted)] truncate">
                          {s.description}
                        </p>
                      </div>

                      {isProved ? (
                        <span className="shrink-0 text-[11px] text-[var(--skill-completed)] font-medium uppercase tracking-wider">
                          Known
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                          Quick check
                          <ArrowRight
                            size={13}
                            strokeWidth={2.25}
                            className="group-hover:translate-x-0.5 transition-transform duration-200"
                          />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        ))}
      </div>

      {/* Locked skills (no skip available yet) */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lock size={12} strokeWidth={2.25} className="text-[var(--text-muted)] opacity-60" />
          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
            Skip checks coming soon
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[52ch]">
          The remaining skills will have skip checks shortly. For now, take the
          lessons — they&apos;re tight.
        </p>
      </motion.section>

      {/* Bottom CTAs */}
      <div className="mt-14 flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/skills"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          I&apos;m new to all of this — start me at the top →
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            'group inline-flex items-center gap-1.5',
            'h-10 px-4 rounded-lg text-sm font-medium',
            'bg-[var(--accent)] text-[var(--accent-fg)]',
            'hover:bg-[var(--accent-hover)] transition-colors',
          )}
        >
          <Sparkles size={14} strokeWidth={2.25} />
          Done — open my dashboard
        </Link>
      </div>

      {activeSkill && (
        <SkipChallengeModal
          skill={activeSkill}
          open={!!activeSkill}
          onClose={() => setActiveSkill(null)}
          onPass={(slug) => {
            setProvedSlugs((prev) => new Set(prev).add(slug));
            setActiveSkill(null);
          }}
        />
      )}
    </div>
  );
}
