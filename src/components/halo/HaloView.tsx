'use client';

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Download } from 'lucide-react';
import { useProgressStore, levelFromXp, xpIntoLevel } from '@/store/progressStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { mockPlayer } from '@/data/gameData';
import { gleams, trail } from '@/data/platform/gleams';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { Bar } from '@/components/nest/cards/Bar';
import { container, item } from '@/components/nest/cards/motion';
import { StreakCard } from '@/components/nest/cards/StreakCard';
import { StatsRadar } from '@/components/nest/cards/StatsRadar';
import { GleamGrid } from './GleamGrid';
import { TrailList } from './TrailList';
import { cn } from '@/lib/utils';

/* ── helpers ─────────────────────────────────────────────────────────── */

function rankFromLevel(level: number): string {
  if (level >= 8) return 'Pathfinder';
  if (level >= 5) return 'Rising Dev';
  return 'Explorer';
}

/* ── name hydration (SSR-safe) ───────────────────────────────────────── */

const subscribeName = (cb: () => void) => useOnboardingStore.subscribe(cb);
const getName = () => useOnboardingStore.getState().data.name?.trim() || mockPlayer.name;
const getServerName = () => mockPlayer.name;

/* ── component ───────────────────────────────────────────────────────── */

export function HaloView() {
  const xp = useProgressStore((s) => s.xp);
  const streakDays = useProgressStore((s) => s.streakDays);
  const completed = useProgressStore((s) => s.completedNodeIds);
  const earnedGleamIds = useProgressStore((s) => s.earnedGleamIds);

  const name = useSyncExternalStore(subscribeName, getName, getServerName);

  const level = levelFromXp(xp);
  const withinLevel = xpIntoLevel(xp);
  const rank = rankFromLevel(level);
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* ── Header card ─────────────────────────────────────────────── */}
      <motion.div variants={item} className="mb-4">
        <Card>
          <div className="flex flex-col items-center gap-4 py-2 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            {/* Avatar */}
            <div
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-3xl font-bold"
              style={{
                fontFamily: 'var(--font-oswald)',
                background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
                border: '2px solid color-mix(in srgb, var(--text-primary) 30%, transparent)',
                color: 'var(--text-primary)',
              }}
            >
              {initial}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <h1
                className="text-3xl font-bold leading-tight tracking-wide"
                style={{ fontFamily: 'var(--font-oswald)', color: 'var(--text-primary)' }}
              >
                {name}
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                lv {level} · {rank}
              </p>
              <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                {mockPlayer.northStar}
              </p>

              {/* XP bar */}
              <div className="mt-3 space-y-1">
                <Bar value={withinLevel} color="var(--text-primary)" height={5} />
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {xp} xp · {100 - withinLevel}% to lv {level + 1}
                </p>
              </div>

              {/* Stat strip */}
              <div className="mt-3 flex flex-wrap gap-4 pt-1">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Star size={13} style={{ color: 'var(--text-primary)' }} />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {completed.length}
                  </span>{' '}
                  nodes
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Flame size={13} style={{ color: 'var(--text-primary)' }} />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {streakDays}
                  </span>{' '}
                  day streak
                </span>
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'var(--text-primary)' }}
                  />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {earnedGleamIds.length}
                  </span>{' '}
                  gleams
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Bento: StreakCard + StatsRadar ──────────────────────────── */}
      <div className={cn('mb-4 grid gap-4', 'grid-cols-1 md:grid-cols-2')}>
        <motion.div variants={item}>
          <StreakCard />
        </motion.div>
        <motion.div variants={item}>
          <StatsRadar />
        </motion.div>
      </div>

      {/* ── Gleams grid ─────────────────────────────────────────────── */}
      <div className="mb-4">
        <GleamGrid gleams={gleams} earnedGleamIds={earnedGleamIds} />
      </div>

      {/* ── Trail ───────────────────────────────────────────────────── */}
      <div className="mb-4">
        <TrailList trail={trail} />
      </div>

      {/* ── Crest teaser ────────────────────────────────────────────── */}
      <motion.div variants={item}>
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardLabel>crest</CardLabel>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                your exportable skill passport
              </p>
              <p className="max-w-sm text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A verified snapshot of every node, gleam, and assessment you&apos;ve cleared — shareable with recruiters and colleges.
              </p>
            </div>
            <button
              disabled
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold opacity-40 transition-opacity"
              style={{
                border: '1.5px solid var(--scene-card-border)',
                color: 'var(--text-primary)',
                background: 'color-mix(in srgb, var(--scene-bg) 60%, transparent)',
                cursor: 'not-allowed',
              }}
            >
              <Download size={14} />
              export crest · coming soon
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
