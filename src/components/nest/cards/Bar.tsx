'use client';

import { motion } from 'framer-motion';

interface BarProps {
  value: number; // 0-100
  height?: number;
  color?: string;
}

/** A progress bar that fills from 0 to `value` when it scrolls into view. */
export function Bar({ value, height = 6, color = 'var(--text-primary)' }: BarProps) {
  return (
    <span
      className="block w-full overflow-hidden rounded-full"
      style={{ height, background: 'color-mix(in srgb, var(--text-muted) 22%, transparent)' }}
    >
      <motion.span
        className="block h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.3, 1], delay: 0.15 }}
      />
    </span>
  );
}
