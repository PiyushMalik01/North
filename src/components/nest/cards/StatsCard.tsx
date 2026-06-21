'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from './Card';
import { Bar } from './Bar';
import { mockPlayer } from '@/data/gameData';

/** The 5 traits — a compact character sheet. */
export function StatsCard() {
  return (
    <Card>
      <CardLabel className="mb-4">stats</CardLabel>
      <ul className="space-y-2.5">
        {mockPlayer.attributes.map((a, i) => (
          <motion.li
            key={a.key}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          >
            <span className="w-24 shrink-0 text-xs text-[var(--text-secondary)]">{a.label}</span>
            <Bar value={a.value} height={5} />
            <span className="w-7 shrink-0 text-right text-[11px] text-[var(--text-muted)]">{a.value}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}
