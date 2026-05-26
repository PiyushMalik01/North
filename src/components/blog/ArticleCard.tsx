'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogArticle } from '@/types';

export default function ArticleCard({ article }: { article: BlogArticle }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={cn(
        'rounded-xl border border-[var(--border-color)] overflow-hidden',
        'bg-[var(--surface-1)] transition-colors duration-200',
        open && 'border-[var(--border-hover)]'
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 lg:p-6 flex items-start justify-between gap-4"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--accent-text)]">
              {article.category}
            </span>
            <span className="text-[0.6875rem] text-[var(--text-muted)]">
              {article.readTime}
            </span>
          </div>
          <h3 className="text-base lg:text-lg font-medium text-[var(--text-primary)] leading-[1.3] tracking-[-0.01em]">
            {article.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-[1.6] line-clamp-2">
            {article.summary}
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            'shrink-0 mt-1 text-[var(--text-muted)] transition-transform duration-200',
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
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 lg:px-6 space-y-6 border-t border-[var(--border-color)] pt-5">
              {article.sections.map((section) => (
                <div key={section.heading}>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2 tracking-[-0.01em]">
                    {section.heading}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-[1.7]">
                    {section.content}
                  </p>
                  {section.bullets && (
                    <ul className="mt-2.5 space-y-1.5">
                      {section.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-[var(--text-secondary)] leading-[1.6]">
                          <span className="mt-2 w-1 h-1 rounded-full bg-[var(--text-muted)] shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
