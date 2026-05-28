'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { COLLEGES, YEAR_OPTIONS } from '@/data/onboardingData';

interface CollegeStepProps {
  onNext: () => void;
}

const MAX_RESULTS = 6;

export function CollegeStep({ onNext }: CollegeStepProps) {
  const { data, updateData } = useOnboardingStore();
  const [query, setQuery] = useState(data.college);
  const [open, setOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? COLLEGES.filter((c) => c.toLowerCase().includes(query.toLowerCase())).slice(0, MAX_RESULTS)
    : COLLEGES.slice(0, MAX_RESULTS);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectCollege = useCallback(
    (value: string) => {
      setQuery(value);
      updateData({ college: value });
      setOpen(false);
      setIsCustom(false);
    },
    [updateData],
  );

  const handleOther = useCallback(() => {
    setIsCustom(true);
    setQuery('');
    updateData({ college: '' });
    setOpen(false);
  }, [updateData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (isCustom) {
        updateData({ college: val });
      } else {
        setOpen(true);
        // Only persist if it exactly matches a known college
        const exact = COLLEGES.find((c) => c.toLowerCase() === val.toLowerCase());
        updateData({ college: exact || '' });
      }
    },
    [isCustom, updateData],
  );

  const canContinue = data.college.trim().length > 0 && data.year.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <div className="w-full max-w-md flex flex-col items-start gap-8">
        {/* Greeting */}
        <div>
          <h1
            className={cn(
              'font-[family-name:var(--font-oswald)] text-xl text-[var(--text-primary)]',
            )}
          >
            nice to meet you, {data.name || 'friend'}.
          </h1>
          <p className="text-[var(--text-secondary)] text-base mt-1">
            where are you studying?
          </p>
        </div>

        {/* College combobox */}
        <div ref={wrapperRef} className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => !isCustom && setOpen(true)}
            placeholder={isCustom ? 'type your college name' : 'search your college'}
            autoComplete="off"
            className={cn(
              'w-full bg-transparent text-lg text-[var(--text-primary)]',
              'border-b-2 border-[var(--border-color)] focus:border-[var(--accent)]',
              'outline-none pb-2 placeholder:text-[var(--text-muted)]',
              'transition-colors duration-200',
            )}
          />

          <AnimatePresence>
            {open && !isCustom && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute left-0 right-0 top-full mt-2 z-20',
                  'bg-[var(--surface-2)] rounded-lg overflow-hidden',
                  'border border-[var(--border-color)]',
                )}
              >
                {filtered.map((college) => (
                  <li key={college}>
                    <button
                      type="button"
                      onClick={() => selectCollege(college)}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm',
                        'text-[var(--text-primary)] hover:bg-[var(--surface-3)]',
                        'transition-colors duration-100 cursor-pointer',
                        data.college === college && 'text-[var(--accent-text)]',
                      )}
                    >
                      {college}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={handleOther}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm',
                      'text-[var(--text-muted)] hover:bg-[var(--surface-3)]',
                      'transition-colors duration-100 cursor-pointer',
                      'border-t border-[var(--border-color)]',
                    )}
                  >
                    Other...
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Year picker */}
        <div className="w-full">
          <p className="text-[var(--text-secondary)] text-sm mb-3">and which year?</p>
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.map((opt) => {
              const selected = data.year === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => updateData({ year: opt.value })}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm cursor-pointer',
                    'border transition-colors duration-150',
                    selected
                      ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--border-hover)]',
                  )}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Continue */}
        <AnimatePresence>
          {canContinue && (
            <motion.button
              type="button"
              onClick={onNext}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'self-end w-12 h-12 rounded-full',
                'bg-[var(--accent)] text-[var(--accent-fg)]',
                'flex items-center justify-center text-xl',
                'cursor-pointer',
              )}
              aria-label="Continue"
            >
              &rarr;
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
