'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { researchInsights } from '@/data/blogData';

export default function ResearchInsights() {
  const headingRef = useGsapReveal<HTMLDivElement>();
  const listRef = useStaggerReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[720px] mx-auto px-6 md:px-12">
        <div ref={headingRef} className="mb-10 opacity-0">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-text)] mb-3">
            Research
          </p>
          <h2
            className={cn(
              'font-semibold text-[var(--text-primary)]',
              'text-[clamp(1.5rem,2vw+0.5rem,2rem)] leading-[1.2] tracking-[-0.02em]'
            )}
          >
            What the Data Tells Us
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-[1.6] max-w-[500px]">
            Before building North, we studied employability reports, hiring
            trends, and policy changes across India.
          </p>
        </div>

        <div ref={listRef} className="space-y-3">
          {researchInsights.map((insight) => (
            <InsightBlock key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightBlock({ insight }: { insight: typeof researchInsights[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border-color)] overflow-hidden',
        'bg-[var(--surface-1)] transition-colors duration-200',
        open && 'border-[var(--border-hover)]'
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 lg:p-5 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-4 min-w-0">
          {insight.stats[0] && (
            <span className="text-lg font-semibold text-[var(--text-primary)] tracking-[-0.02em] shrink-0">
              {insight.stats[0].value}
            </span>
          )}
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {insight.title}
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            'shrink-0 text-[var(--text-muted)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 lg:px-5 border-t border-[var(--border-color)] pt-4">
              <ul className="space-y-1.5">
                {insight.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-[var(--text-secondary)] leading-[1.6]">
                    <span className="mt-2 w-1 h-1 rounded-full bg-[var(--text-muted)] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-[var(--accent-muted)]">
                <p className="text-xs font-medium text-[var(--accent-text)] uppercase tracking-[0.06em] mb-1">
                  North&apos;s position
                </p>
                <p className="text-sm text-[var(--text-primary)] leading-[1.5]">
                  {insight.northPosition}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
