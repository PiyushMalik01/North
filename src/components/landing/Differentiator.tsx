'use client';

import { cn } from '@/lib/utils';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';

const rows = [
  { old: 'Random YouTube tutorials', north: 'Prerequisite-mapped skill trees' },
  { old: 'Certificates nobody verifies', north: 'Assessed, verified skill proof' },
  { old: 'One GPA number for everything', north: 'Granular skill depth tracking' },
  { old: '"Top 10 skills" listicles', north: 'AI-personalized learning paths' },
  { old: 'Resume keyword stuffing', north: 'Dynamic skill profile for recruiters' },
];

export const Differentiator = () => {
  const headingRef = useGsapReveal<HTMLDivElement>();
  const tableRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.06 });

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 gradient-glow" />
      <div className="relative z-10 max-w-[720px] mx-auto px-6 md:px-12">
        <div ref={headingRef} className="text-center mb-10 lg:mb-14 opacity-0">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
            Why North is different
          </p>
          <h2 className={cn(
            'font-semibold text-[var(--text-primary)]',
            'text-[clamp(1.75rem,2.5vw+0.75rem,2.5rem)] leading-[1.15] tracking-[-0.02em]'
          )}>
            Not another course platform.
          </h2>
        </div>

        <div ref={tableRef} className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.old}
              className={cn(
                'grid grid-cols-[1fr_auto_1fr] items-center gap-4 group',
                'p-3.5 lg:p-4 rounded-lg',
                'bg-[var(--surface-1)] border border-[var(--border-color)]',
                'transition-all duration-200',
                'hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]'
              )}
            >
              <span className="text-sm text-[var(--text-muted)] line-through decoration-[var(--text-muted)]/30">
                {r.old}
              </span>
              <svg className="w-4 h-4 text-[var(--text-muted)] transition-colors duration-200 group-hover:text-[var(--accent-text)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {r.north}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
