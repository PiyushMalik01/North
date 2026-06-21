'use client';

import { cn } from '@/lib/utils';
import type { PlayerState } from '@/data/gameData';
import { Panel } from './Panel';
import { PixelAvatar } from './PixelAvatar';
import { PixelMeter } from './PixelMeter';

interface PlayerBannerProps {
  player: PlayerState;
  className?: string;
}

/** Top-of-base identity strip: emblem, name, level, XP, streak. */
export function PlayerBanner({ player, className }: PlayerBannerProps) {
  return (
    <Panel glow className={cn('p-4 sm:p-5', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Emblem */}
        <div className="h-16 w-16 shrink-0 border-2 border-[var(--accent)]/40 bg-[var(--surface-2)] sm:h-[72px] sm:w-[72px]">
          <PixelAvatar />
        </div>

        {/* Identity + XP */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase tracking-wide text-[var(--text-primary)] sm:text-3xl">
              {player.name}
            </h1>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Lv {player.level} · {player.rank}
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <PixelMeter value={player.xpIntoLevel} segments={16} className="flex-1" />
            <span className="shrink-0 font-[family-name:var(--font-oswald)] text-xs tabular-nums text-[var(--text-secondary)]">
              {player.xp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2.5 self-start border-l-2 border-[var(--border-color)] pl-4 sm:self-center">
          <span
            className="block h-3.5 w-3.5 animate-pulse rounded-[1px] bg-[var(--accent)]"
            style={{ boxShadow: '0 0 8px var(--accent)' }}
            aria-hidden="true"
          />
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-oswald)] text-xl font-bold tabular-nums text-[var(--text-primary)]">
              {player.streakDays}
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              day streak
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
