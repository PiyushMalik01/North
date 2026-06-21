'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';

function AnimatedValue({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');

  const numericMatch = value.match(/^[~≈]?(\d+)/);
  const prefix = value.match(/^[~≈]/)?.[0] || '';
  const target = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const rest = numericMatch ? value.slice((prefix + numericMatch[1]).length) : value;

  useEffect(() => {
    if (!inView || !target) {
      return;
    }

    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, value]);

  if (!target) return <>{value}</>;

  return (
    <span ref={ref}>
      {prefix}{display}{rest}{suffix}
    </span>
  );
}

const stats = [
  { value: '~50', suffix: '%', label: 'Graduate employability in India' },
  { value: '60', suffix: '–80%', label: 'Companies hiring by skills now' },
  { value: '3', suffix: '–5 yr', label: 'Curriculum lag vs industry' },
  { value: '52', suffix: 'K+', label: 'Underserved colleges' },
];

export const StatsBar = () => {
  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center">
            <p className={cn(
              'text-xl lg:text-2xl font-semibold text-[var(--text-primary)]',
              'tracking-[-0.02em] tabular-nums'
            )}>
              <AnimatedValue value={s.value} suffix={s.suffix} />
            </p>
            <p className="text-xs lg:text-sm text-[var(--text-muted)] mt-1 tracking-[0.02em]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
