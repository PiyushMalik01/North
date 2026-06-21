'use client';

import { cn } from '@/lib/utils';
import type { PlayerAttribute } from '@/data/gameData';
import { Panel } from './Panel';
import { PixelMeter } from './PixelMeter';

interface AttributesPanelProps {
  attributes: PlayerAttribute[];
  className?: string;
}

/** The character sheet — five core attributes as pixel meters. */
export function AttributesPanel({ attributes, className }: AttributesPanelProps) {
  return (
    <Panel label="Attributes" className={cn('p-4 pt-5 sm:p-5 sm:pt-6', className)}>
      <div className="space-y-3.5">
        {attributes.map((attr) => (
          <div key={attr.key}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                {attr.label}
              </span>
              <span className="font-[family-name:var(--font-oswald)] text-xs tabular-nums text-[var(--text-muted)]">
                {attr.value}
              </span>
            </div>
            <PixelMeter value={attr.value} segments={14} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
