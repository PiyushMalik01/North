'use client';

import { Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import type { GleamDef } from '@/data/platform/gleams';

interface GleamGridProps {
  gleams: GleamDef[];
  earnedGleamIds: string[];
}

export function GleamGrid({ gleams, earnedGleamIds }: GleamGridProps) {
  return (
    <motion.div variants={item}>
      <Card>
        <CardLabel className="mb-4">gleams</CardLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gleams.map((g) => {
            const earned = earnedGleamIds.includes(g.id);
            return (
              <div
                key={g.id}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-opacity',
                  'border border-[var(--scene-card-border)]',
                  !earned && 'opacity-45',
                )}
                style={{ background: 'color-mix(in srgb, var(--scene-bg) 60%, transparent)' }}
              >
                {earned ? (
                  <Award size={18} style={{ color: 'var(--text-primary)' }} />
                ) : (
                  <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                )}
                <span
                  className="text-[11px] font-semibold leading-tight"
                  style={{ color: earned ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {g.name}
                </span>
                {!earned && (
                  <span className="text-[9px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                    {g.how}
                  </span>
                )}
                {earned && (
                  <span className="text-[9px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
                    {g.desc}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
