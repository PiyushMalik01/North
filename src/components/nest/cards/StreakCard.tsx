'use client';

import { motion } from 'framer-motion';
import { Flame, Snowflake } from 'lucide-react';
import { Card, CardLabel } from './Card';
import { mockPlayer, mockStreakCalendar, mockFreezes } from '@/data/gameData';

const cellColor = (v: number) =>
  v === 0
    ? 'color-mix(in srgb, var(--text-muted) 18%, transparent)'
    : `color-mix(in srgb, var(--text-primary) ${18 + v * 20}%, transparent)`;

/** Streak heatmap calendar — cells stagger in like a wave. */
export function StreakCard() {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <CardLabel>streak</CardLabel>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-bold text-[var(--text-primary)]">
            <Flame size={13} /> {mockPlayer.streakDays}
          </span>
          <span className="flex items-center gap-1 text-[var(--text-secondary)]">
            <Snowflake size={12} /> ×{mockFreezes}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {mockStreakCalendar.map((v, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-[4px]"
            style={{ background: cellColor(v) }}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.012, ease: 'easeOut' }}
          />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-[var(--text-secondary)]">last 5 weeks · keep the trail alive</p>
    </Card>
  );
}
