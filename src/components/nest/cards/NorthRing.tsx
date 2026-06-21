'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { mockNorthProgress } from '@/data/gameData';

const SIZE = 180;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TARGET_OFFSET = CIRCUMFERENCE * (1 - mockNorthProgress / 100);

export function NorthRing() {
  return (
    <Card>
      <CardLabel className="mb-4">north</CardLabel>
      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              style={{ stroke: 'color-mix(in srgb, var(--text-muted) 22%, transparent)' }}
            />
            {/* Progress */}
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              whileInView={{ strokeDashoffset: TARGET_OFFSET }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.2, 0.7, 0.3, 1] }}
              style={{ stroke: 'var(--text-primary)', rotate: '-90deg', transformOrigin: 'center' }}
            />
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            aria-label={`${mockNorthProgress}% to north`}
          >
            <span
              className="text-4xl font-bold leading-none font-[family-name:var(--font-oswald)]"
              style={{ color: 'var(--text-primary)' }}
            >
              {mockNorthProgress}%
            </span>
            <span
              className="mt-1 text-xs tracking-widest uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              to north
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
