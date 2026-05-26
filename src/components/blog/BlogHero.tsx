'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { gsap } from '@/lib/gsap';

const headlines = [
  { line1: 'You Don\'t Need More Courses.', line2: 'You Need Direction.' },
  { line1: 'The Skill Map', line2: 'Your College Never Gave You.' },
  { line1: 'Stop Guessing.', line2: 'Start Building.' },
];

export default function BlogHero() {
  const [index, setIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = setInterval(() => setIndex((i) => (i + 1) % headlines.length), 5000);
      return () => clearInterval(id);
    }

    const ctx = gsap.context(() => {
      const cycle = () => {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            setIndex((i) => (i + 1) % headlines.length);
            gsap.fromTo(
              textRef.current,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
            );
          },
        });
      };
      const id = setInterval(cycle, 5000);
      return () => clearInterval(id);
    });

    return () => ctx.revert();
  }, []);

  const h = headlines[index];

  return (
    <section className="pt-24 pb-14 lg:pt-32 lg:pb-20 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--accent-text)] mb-6">
        North Insights
      </p>
      <div ref={textRef} className="min-h-[5rem] lg:min-h-[6.5rem]">
        <h1
          className={cn(
            'font-semibold text-[var(--text-primary)]',
            'text-[clamp(1.75rem,3.5vw+0.5rem,3rem)] leading-[1.15] tracking-[-0.02em]'
          )}
        >
          {h.line1}
          <br />
          {h.line2}
        </h1>
      </div>
      <p className="mt-4 text-[var(--text-secondary)] text-base max-w-[520px] mx-auto leading-[1.6]">
        Research, insights, and perspectives on skill-based education —
        grounded in data, written without fluff.
      </p>
    </section>
  );
}
