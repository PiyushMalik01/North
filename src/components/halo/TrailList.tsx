'use client';

import { motion } from 'framer-motion';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { item } from '@/components/nest/cards/motion';
import type { TrailItem } from '@/data/platform/gleams';

interface TrailListProps {
  trail: TrailItem[];
}

export function TrailList({ trail: items }: TrailListProps) {
  return (
    <motion.div variants={item}>
      <Card>
        <CardLabel className="mb-4">trail</CardLabel>
        <ol className="flex flex-col gap-0">
          {items.map((t, i) => (
            <li key={t.id} className="flex items-start gap-3">
              {/* connector column */}
              <div className="flex flex-col items-center" style={{ minWidth: 16 }}>
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: 'var(--text-primary)' }}
                />
                {i < items.length - 1 && (
                  <span
                    className="w-px grow"
                    style={{
                      minHeight: 24,
                      background:
                        'color-mix(in srgb, var(--text-muted) 28%, transparent)',
                    }}
                  />
                )}
              </div>
              {/* content */}
              <div className="pb-4">
                <p className="text-[13px] leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {t.text}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {t.ago}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </motion.div>
  );
}
