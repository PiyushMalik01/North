'use client';

import { cn } from '@/lib/utils';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import Link from 'next/link';

export const CTA = () => {
  const ref = useGsapReveal<HTMLDivElement>();

  return (
    <section className="py-16 lg:py-24">
      <div
        ref={ref}
        className="max-w-[640px] mx-auto px-6 md:px-12 text-center opacity-0"
      >
        <h2 className={cn(
          'font-semibold text-[var(--text-primary)]',
          'text-[clamp(1.75rem,2.5vw+0.75rem,2.5rem)] leading-[1.15] tracking-[-0.02em]'
        )}>
          Ready to stop guessing?
        </h2>
        <p className="text-[var(--text-secondary)] mt-3 text-base leading-[1.6] max-w-[480px] mx-auto">
          Map your skills. Track real progress. Walk into interviews knowing
          exactly what you bring to the table.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center justify-center group',
              'h-10 px-6 rounded-lg text-[0.9375rem] font-medium',
              'bg-[var(--accent)] text-[var(--accent-fg)]',
              'hover:bg-[var(--accent-hover)]',
              'transition-all duration-150 active:translate-y-px'
            )}
          >
            Start Free
            <svg className="w-4 h-4 ml-1.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/blog"
            className={cn(
              'inline-flex items-center justify-center',
              'h-10 px-6 rounded-lg text-[0.9375rem] font-medium',
              'text-[var(--text-primary)] border border-[var(--border-color)]',
              'hover:border-[var(--border-hover)] hover:bg-[var(--surface-1)]',
              'transition-all duration-150 active:translate-y-px'
            )}
          >
            Read Our Research
          </Link>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-5 tracking-[0.02em]">
          No credit card. No syllabus. Just pick a direction.
        </p>
      </div>
    </section>
  );
};
