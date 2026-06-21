'use client';

import { cn } from '@/lib/utils';
import type { ActiveQuest } from '@/data/gameData';
import { Panel } from './Panel';
import { PixelMeter } from './PixelMeter';

interface QuestPanelProps {
  quest: ActiveQuest;
  className?: string;
}

/** The active mission tile. */
export function QuestPanel({ quest, className }: QuestPanelProps) {
  return (
    <Panel label="Active Quest" className={cn('flex flex-col p-4 pt-5 sm:p-5 sm:pt-6', className)}>
      <h3 className="font-[family-name:var(--font-oswald)] text-lg font-bold uppercase leading-tight tracking-wide text-[var(--text-primary)]">
        {quest.title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
        {quest.detail}
      </p>

      <div className="mt-auto pt-4">
        <PixelMeter value={quest.progress} segments={12} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {quest.progress}% done
          </span>
          <span className="font-[family-name:var(--font-oswald)] text-sm font-bold tabular-nums text-[var(--accent-text)]">
            +{quest.reward} XP
          </span>
        </div>
      </div>
    </Panel>
  );
}
