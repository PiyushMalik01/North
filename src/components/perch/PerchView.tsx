'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Crown } from 'lucide-react';
import { adminUsers } from '@/data/platform/admin';
import { useProgressStore, levelFromXp } from '@/store/progressStore';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';

type Filter = 'all-time' | 'this-week';

const MY_EMAIL = 'piyush@north.dev';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function Avatar({ name, you }: { name: string; you: boolean }) {
  return (
    <div
      className={cn(
        'grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-semibold',
        you
          ? 'border-[color-mix(in_srgb,var(--brand-blue)_60%,transparent)] bg-[color-mix(in_srgb,var(--brand-blue)_18%,transparent)] text-[var(--text-primary)]'
          : 'border-[color-mix(in_srgb,var(--scene-card-border)_80%,transparent)] bg-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] text-[var(--text-secondary)]',
      )}
    >
      {initials(name)}
    </div>
  );
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={16} className="text-amber-400" />;
  if (rank === 2) return <Medal size={16} className="text-slate-400" />;
  if (rank === 3) return <Medal size={16} className="text-amber-700" />;
  return <span className="w-4 text-center text-xs text-[var(--text-muted)]">{rank}</span>;
}

export default function PerchView() {
  const myXp = useProgressStore((s) => s.xp);
  const myStreak = useProgressStore((s) => s.streakDays);
  const [filter, setFilter] = useState<Filter>('all-time');

  const standings = useMemo(() => {
    const active = adminUsers
      .filter((u) => u.status === 'active')
      .map((u) =>
        u.email === MY_EMAIL
          ? { ...u, xp: myXp, level: levelFromXp(myXp), streak: myStreak, you: true }
          : { ...u, you: false },
      );

    const sorted =
      filter === 'this-week'
        ? [...active].sort((a, b) => b.streak - a.streak)
        : [...active].sort((a, b) => b.xp - a.xp);

    return sorted.map((u, i) => ({ ...u, rank: i + 1 }));
  }, [filter, myXp, myStreak]);

  const top3 = standings.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const podiumHeights = ['h-20', 'h-28', 'h-16'];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-6">
        <h1
          className="font-[family-name:var(--font-oswald)] text-5xl font-bold lowercase tracking-tight text-[var(--text-primary)] sm:text-6xl"
        >
          perch
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">the standings</p>
      </motion.div>

      {/* Filter pills */}
      <motion.div variants={item} className="mb-8 flex gap-2">
        {(['all-time', 'this-week'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors',
              filter === f
                ? 'border-[var(--brand-blue)] bg-[color-mix(in_srgb,var(--brand-blue)_18%,transparent)] text-[var(--text-primary)]'
                : 'border-[var(--scene-card-border)] bg-transparent text-[var(--text-secondary)] hover:border-[color-mix(in_srgb,var(--text-primary)_30%,transparent)]',
            )}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Podium */}
      {top3.length >= 3 && (
        <motion.div variants={item} className="mb-8">
          <CardLabel className="mb-4">top 3</CardLabel>
          <div className="flex items-end justify-center gap-3">
            {podiumOrder.map((u, idx) => (
              <div key={u.id} className="flex flex-col items-center gap-2">
                <Avatar name={u.name} you={u.you} />
                <p className="max-w-[80px] truncate text-center text-xs font-medium text-[var(--text-primary)]">
                  {u.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {filter === 'this-week' ? `${u.streak}d` : `${u.xp.toLocaleString()} xp`}
                </p>
                <div
                  className={cn(
                    'flex w-20 flex-col items-center justify-start rounded-t-lg pt-2',
                    podiumHeights[idx],
                    idx === 1
                      ? 'bg-[color-mix(in_srgb,var(--brand-blue)_22%,transparent)]'
                      : 'bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]',
                  )}
                >
                  <RankMedal rank={u.rank} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full list */}
      <motion.div variants={item}>
        <Card padded={false}>
          <div className="divide-y divide-[color-mix(in_srgb,var(--scene-card-border)_60%,transparent)]">
            {standings.map((u) => (
              <div
                key={u.id}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 transition-colors',
                  u.you &&
                    'bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] outline outline-1 outline-[color-mix(in_srgb,var(--brand-blue)_40%,transparent)]',
                )}
              >
                <div className="flex w-6 shrink-0 justify-center">
                  <RankMedal rank={u.rank} />
                </div>
                <Avatar name={u.name} you={u.you} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {u.name}
                    </span>
                    {u.you && (
                      <span className="rounded-full bg-[color-mix(in_srgb,var(--brand-blue)_25%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--brand-blue)]">
                        you
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">lv {u.level}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Flame size={12} className="text-orange-400" />
                  <span>{u.streak}d</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-primary)]">
                  <Trophy size={11} className="text-[var(--text-muted)]" />
                  <span>{u.xp.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
          standings are opt-in — only consenting users appear here
        </p>
      </motion.div>
    </motion.div>
  );
}
