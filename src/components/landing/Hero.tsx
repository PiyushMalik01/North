'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from '@/lib/gsap';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { HeroVideoGrid } from './HeroVideoGrid';

const rotatingQuestions = [
  'where do I even start?',
  'is my degree going to be enough?',
  'what skills actually matter?',
  'how do I prove what I know?',
];

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo('.hero-question', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
        .fromTo('.hero-heading', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.1')
        .fromTo('.hero-underline', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
        .fromTo('.hero-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-cta', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power3.out' }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionIndex((prev) => (prev + 1) % rotatingQuestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28 overflow-hidden hero-section">
      {/* Dark base for light theme so video pops */}
      <div className="absolute inset-0 bg-transparent light-hero-dark" />

      {/* Video pixel grid background */}
      <div className="absolute inset-0">
        <HeroVideoGrid />
      </div>

      {/* Radial vignette for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 45%, var(--background) 0%, transparent 100%)',
        }}
      />

      {/* Top/bottom fade so hero blends into page */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--background)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />

      <div ref={containerRef} className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 text-center">
        <div className="hero-question opacity-0 mb-6 h-6 flex items-center justify-center">
          <span className="text-[var(--text-muted)] text-sm italic mr-1.5">&ldquo;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={questionIndex}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="text-sm text-[var(--text-muted)] italic"
            >
              {rotatingQuestions[questionIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="text-[var(--text-muted)] text-sm italic ml-0.5">&rdquo;</span>
        </div>

        <h1
          className={cn(
            'hero-heading opacity-0',
            'font-semibold text-[var(--text-primary)]',
            'text-[clamp(2.25rem,4vw+1rem,3.5rem)] leading-[1.08] tracking-[-0.03em]'
          )}
        >
          Find Your{' '}
          <span className="relative inline-block">
            <span className="text-[var(--accent-text)]">Direction.</span>
            <span
              className="hero-underline absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
          <br />
          Build Your Future.
        </h1>

        <p
          className={cn(
            'hero-sub opacity-0',
            'mt-5 text-[var(--text-secondary)] max-w-[520px] mx-auto',
            'text-base lg:text-[1.0625rem] leading-[1.65] tracking-[0.01em]'
          )}
        >
          North maps the skills you actually need, tests you on them, and
          builds a profile that proves what you can do — from first semester
          to first job.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className={cn(
              'hero-cta opacity-0 inline-flex items-center justify-center group',
              'h-10 px-6 rounded-lg text-[0.9375rem] font-medium',
              'bg-[var(--accent)] text-[var(--accent-fg)]',
              'hover:bg-[var(--accent-hover)]',
              'transition-all duration-150 active:translate-y-px'
            )}
          >
            Start Your Skill Map
            <svg className="w-4 h-4 ml-1.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/blog"
            className={cn(
              'hero-cta opacity-0 inline-flex items-center justify-center',
              'h-10 px-6 rounded-lg text-[0.9375rem] font-medium',
              'text-[var(--text-primary)] border border-[var(--border-color)]',
              'hover:border-[var(--border-hover)] hover:bg-[var(--surface-1)]',
              'transition-all duration-150 active:translate-y-px'
            )}
          >
            Why North Exists
          </Link>
        </div>
      </div>
    </section>
  );
};
