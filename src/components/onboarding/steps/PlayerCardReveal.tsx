'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

const GOAL_LABELS: Record<string, string> = {
  internship: 'Targeting internships',
  placements: 'Leveling up for placements',
  exploring: 'Exploring freely',
};

function useResolvedCSSVar(varName: string, fallback: string): string {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    if (resolved) setValue(resolved);
  }, [varName]);
  return value;
}

interface PlayerCardRevealProps {
  onNext: () => void;
}

export function PlayerCardReveal({ onNext }: PlayerCardRevealProps) {
  const { data, playerCard } = useOnboardingStore();
  const [mounted, setMounted] = useState(false);

  const accentColor = useResolvedCSSVar('--accent', '#EFC028');
  const borderColor = useResolvedCSSVar('--border-color', 'rgba(255,255,255,0.08)');
  const mutedColor = useResolvedCSSVar('--text-muted', '#5C5C66');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const radarData = useMemo(
    () => playerCard?.radarData ?? [],
    [playerCard?.radarData],
  );

  if (!playerCard) return null;

  const staggerBase = 0.7; // card fade-in duration; children stagger after it

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={mounted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.2 }}
        className={cn(
          'w-full max-w-sm rounded-2xl overflow-hidden',
          'bg-[var(--surface-1)] border border-[var(--border-color)]',
        )}
      >
        {/* Accent bar */}
        <div className="h-1 bg-[var(--accent)]" />

        <div className="p-6 md:p-8">
          {/* Name + college */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: staggerBase + 0.1, duration: 0.4 }}
            className="text-sm uppercase tracking-widest text-[var(--text-muted)]"
          >
            {data.name}
          </motion.p>
          {data.college && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: staggerBase + 0.15, duration: 0.4 }}
              className="text-xs text-[var(--text-muted)] mt-0.5"
            >
              {data.college}
            </motion.p>
          )}

          {/* Personality type */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: staggerBase + 0.25, duration: 0.5 }}
            className={cn(
              'font-[family-name:var(--font-oswald)] text-3xl font-bold mt-4',
              'text-[var(--text-primary)] uppercase tracking-tight',
            )}
          >
            {playerCard.personalityType}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: staggerBase + 0.4, duration: 0.4 }}
            className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2"
          >
            {playerCard.personalityDescription}
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={mounted ? { scaleX: 1 } : {}}
            transition={{ delay: staggerBase + 0.5, duration: 0.4 }}
            className="h-px bg-[var(--border-color)] my-5 origin-left"
          />

          {/* Interest tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: staggerBase + 0.6, duration: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {playerCard.topInterests.map((interest) => (
              <span
                key={interest}
                className={cn(
                  'px-3 py-1 rounded-full text-xs',
                  'bg-[var(--surface-3)] text-[var(--text-secondary)]',
                )}
              >
                {interest}
              </span>
            ))}
          </motion.div>

          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: staggerBase + 0.75, duration: 0.5 }}
            className="mt-5 flex justify-center"
          >
            <ResponsiveContainer width={220} height={220}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="50%">
                <PolarGrid stroke={borderColor} />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 10, fill: mutedColor }}
                />
                <Radar
                  dataKey="value"
                  fill={accentColor}
                  fillOpacity={0.15}
                  stroke={accentColor}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Goal tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: staggerBase + 0.9, duration: 0.4 }}
            className="text-xs text-[var(--text-muted)] mt-4"
          >
            {GOAL_LABELS[data.goal] ?? data.goal}
          </motion.p>
        </div>
      </motion.div>

      {/* Sub-text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: staggerBase + 1.0, duration: 0.5 }}
        className="text-[var(--text-secondary)] text-center mt-6 text-sm"
      >
        this is you, {data.name}.
      </motion.p>

      {/* Continue */}
      <motion.button
        type="button"
        onClick={onNext}
        initial={{ opacity: 0, y: 8 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: staggerBase + 1.2, duration: 0.4 }}
        className={cn(
          'mt-4 text-sm font-medium cursor-pointer',
          'text-[var(--accent-text)] hover:text-[var(--accent-hover)]',
          'transition-colors duration-150',
        )}
      >
        continue &rarr;
      </motion.button>
    </div>
  );
}
