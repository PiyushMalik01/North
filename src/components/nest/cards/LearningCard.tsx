'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card, CardLabel } from './Card';
import { Bar } from './Bar';
import { mockCourses } from '@/data/gameData';

/** Currently learning / courses taken — each row's bar fills into view. */
export function LearningCard() {
  return (
    <Card>
      <CardLabel className="mb-4">learning</CardLabel>
      <ul className="space-y-3">
        {mockCourses.slice(0, 5).map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-[var(--text-primary)]">{c.name}</span>
              {c.status === 'done' ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-primary)]">
                  <Check size={12} /> done
                </span>
              ) : (
                <span className="text-[11px] text-[var(--text-secondary)]">{c.progress}%</span>
              )}
            </div>
            <Bar value={c.progress} height={4} />
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}
