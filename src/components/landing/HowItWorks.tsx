'use client';

import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useGsapReveal } from '@/hooks/useGsapReveal';

const steps = [
  {
    num: '01',
    title: 'Pick a direction',
    description: 'Tell North your interests and goals. AI recommends a skill tree tailored to where you want to go.',
  },
  {
    num: '02',
    title: 'Learn with structure',
    description: 'Follow prerequisite-mapped paths with curated content and AI assistance when you\'re stuck.',
  },
  {
    num: '03',
    title: 'Prove what you know',
    description: 'Complete coding challenges, reasoning tasks, and projects. Not video completions — real proof.',
  },
  {
    num: '04',
    title: 'Show up ready',
    description: 'Your dynamic skill profile speaks for itself. Recruiters see verified depth, not a keyword list.',
  },
];

export const HowItWorks = () => {
  const headingRef = useGsapReveal<HTMLDivElement>();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: '-80px' });

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div ref={headingRef} className="text-center mb-10 lg:mb-14 opacity-0">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
            How it works
          </p>
          <h2 className={cn(
            'font-semibold text-[var(--text-primary)]',
            'text-[clamp(1.75rem,2.5vw+0.75rem,2.5rem)] leading-[1.15] tracking-[-0.02em]'
          )}>
            Four steps. No guesswork.
          </h2>
        </div>

        <div ref={gridRef} className="relative">
          {/* Connecting line (desktop only) */}
          <motion.div
            className="hidden lg:block absolute top-[3.25rem] left-[12%] right-[12%] h-px bg-[var(--border-color)]"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ transformOrigin: 'left' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                  'relative p-5 lg:p-6 rounded-xl group',
                  'bg-[var(--surface-1)] border border-[var(--border-color)]',
                  'transition-all duration-200',
                  'hover:bg-[var(--surface-2)] hover:border-[var(--border-hover)]',
                  'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.03]'
                )}
              >
                <span className={cn(
                  'text-2xl font-semibold tracking-[-0.02em]',
                  'text-[var(--text-muted)] transition-colors duration-200 group-hover:text-[var(--accent-text)]'
                )}>
                  {step.num}
                </span>
                <h3 className="text-base font-medium text-[var(--text-primary)] mt-3 mb-1.5 tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-[1.6]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
