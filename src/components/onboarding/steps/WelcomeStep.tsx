'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedLogo } from '@/components/shared/AnimatedLogo';
import { useOnboardingStore } from '@/store/onboardingStore';

interface WelcomeStepProps {
  onNext: () => void;
}

const FULL_TEXT = "yo, welcome to north.\nwhat should we call you?";
const TYPE_SPEED = 30;

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { data, updateData } = useOnboardingStore();
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(FULL_TEXT.slice(0, i));
      if (i >= FULL_TEXT.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typingDone) inputRef.current?.focus();
  }, [typingDone]);

  const handleSubmit = useCallback(() => {
    if (data.name.trim().length >= 2) onNext();
  }, [data.name, onNext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    },
    [handleSubmit],
  );

  const showButton = data.name.trim().length >= 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <div className="w-full max-w-md flex flex-col items-start gap-8">
        {/* Logo */}
        <AnimatedLogo size="w-[3em]" shouldAnimate={true} />

        {/* Typing heading */}
        <h1
          className={cn(
            'font-[family-name:var(--font-oswald)] text-2xl leading-snug',
            'text-[var(--text-primary)] whitespace-pre-line min-h-[3.5em]',
          )}
        >
          {displayedText}
          <span
            className={cn(
              'inline-block w-[2px] h-[1.1em] bg-[var(--accent)] ml-0.5 align-text-bottom',
              typingDone && 'animate-pulse',
            )}
          />
        </h1>

        {/* Input + button — fade in after typing */}
        <AnimatePresence>
          {typingDone && (
            <motion.div
              className="w-full flex flex-col gap-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder="your name"
                autoComplete="off"
                className={cn(
                  'w-full bg-transparent text-xl text-[var(--text-primary)]',
                  'border-b-2 border-[var(--border-color)] focus:border-[var(--accent)]',
                  'outline-none pb-2 placeholder:text-[var(--text-muted)]',
                  'transition-colors duration-200',
                )}
              />

              <AnimatePresence>
                {showButton && (
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
