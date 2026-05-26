'use client';

import { cn } from '@/lib/utils';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { sources } from '@/data/blogData';
import { useState } from 'react';

export default function WhyNorthExists() {
  const ref = useGsapReveal<HTMLDivElement>();
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[720px] mx-auto px-6 md:px-12">
        <div ref={ref} className="opacity-0">
          <h2
            className={cn(
              'font-semibold text-[var(--text-primary)]',
              'text-[clamp(1.5rem,2vw+0.5rem,2rem)] leading-[1.2] tracking-[-0.02em]'
            )}
          >
            Why North Exists
          </h2>

          <div className="mt-6 space-y-4 text-[var(--text-secondary)] text-base leading-[1.7]">
            <p>The data shows three simultaneous shifts:</p>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li className="text-[var(--text-primary)]">Curriculum lags industry.</li>
              <li className="text-[var(--text-primary)]">Students lack structured direction.</li>
              <li className="text-[var(--text-primary)]">Employers evaluate demonstrable skill.</li>
            </ol>
            <p>
              North is built at the intersection of these three forces. It is
              not another course platform. It is a skill navigation system.
            </p>
          </div>
        </div>

        {/* Sources */}
        <div className="mt-12 rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] overflow-hidden">
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="w-full text-left p-4 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Sources &amp; References
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={cn(
                'text-[var(--text-muted)] transition-transform duration-200',
                sourcesOpen && 'rotate-180'
              )}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {sourcesOpen && (
            <div className="px-4 pb-4 border-t border-[var(--border-color)] pt-3">
              <ol className="space-y-1.5">
                {sources.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)] mr-2">{String(i + 1).padStart(2, '0')}</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] transition-colors duration-150"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
