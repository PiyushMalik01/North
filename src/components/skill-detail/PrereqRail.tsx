'use client';

import Link from 'next/link';
import { Check, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getSkill,
  getSkillStatus,
  getDependents,
  type CurriculumSkill,
  type SkillStatus,
} from '@/data/curriculum';

interface PrereqRailProps {
  skill: CurriculumSkill;
}

export function PrereqRail({ skill }: PrereqRailProps) {
  const prereqs = skill.prerequisites
    .map((slug) => getSkill(slug))
    .filter((s): s is CurriculumSkill => s !== null);
  const unlocks = getDependents(skill.slug);

  return (
    <aside className="space-y-8">
      <Section label="Prerequisites">
        {prereqs.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">None — this is a starting point.</p>
        ) : (
          <ul className="space-y-2">
            {prereqs.map((p) => {
              const status = getSkillStatus(p.slug);
              return (
                <li key={p.slug}>
                  <SkillRow skill={p} status={status} />
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section label="Unlocks">
        {unlocks.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">Capstone — nothing comes after.</p>
        ) : (
          <ul className="space-y-2">
            {unlocks.slice(0, 5).map((u) => (
              <li key={u.slug}>
                <SkillRow skill={u} status={getSkillStatus(u.slug)} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="h-px w-6 bg-[var(--text-muted)] opacity-60" />
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function SkillRow({ skill, status }: { skill: CurriculumSkill; status: SkillStatus }) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      className={cn(
        'group flex items-center gap-2.5 -mx-2 px-2 py-1.5 rounded-md',
        'hover:bg-[var(--surface-1)] transition-colors duration-150',
      )}
    >
      <StatusGlyph status={status} />
      <span
        className={cn(
          'text-sm truncate',
          status === 'completed' || status === 'reinforced'
            ? 'text-[var(--text-primary)]'
            : status === 'in-progress'
            ? 'text-[var(--accent-text)]'
            : status === 'locked'
            ? 'text-[var(--text-muted)]'
            : 'text-[var(--text-secondary)]',
        )}
      >
        {skill.name}
      </span>
    </Link>
  );
}

function StatusGlyph({ status }: { status: SkillStatus }) {
  if (status === 'completed' || status === 'reinforced') {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--skill-completed)]/20">
        <Check size={10} strokeWidth={3} className="text-[var(--skill-completed)]" />
      </span>
    );
  }
  if (status === 'in-progress') {
    return <Circle size={10} strokeWidth={3} className="text-[var(--accent)] fill-[var(--accent)]/30" />;
  }
  if (status === 'locked') {
    return <Lock size={10} strokeWidth={2.25} className="text-[var(--text-muted)]" />;
  }
  return <Circle size={10} strokeWidth={2.25} className="text-[var(--text-muted)]" />;
}
