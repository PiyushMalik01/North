'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Newspaper, TrendingUp, Users, CalendarDays } from 'lucide-react';
import { driftFeed, driftKinds, type DriftItem, type DriftKind } from '@/data/platform/drift';
import { useProgressStore } from '@/store/progressStore';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';

// ─── types ──────────────────────────────────────────────────────────────────

type FilterValue = 'all' | DriftKind | 'saved';

// ─── helpers ─────────────────────────────────────────────────────────────────

const kindIcon: Record<DriftKind, React.ReactNode> = {
  news: <Newspaper size={13} />,
  market: <TrendingUp size={13} />,
  peer: <Users size={13} />,
  event: <CalendarDays size={13} />,
};

// ─── SignalCard ───────────────────────────────────────────────────────────────

interface SignalCardProps {
  signal: DriftItem;
  isSaved: boolean;
  onToggle: (id: string) => void;
}

function SignalCard({ signal, isSaved, onToggle }: SignalCardProps) {
  return (
    <motion.div variants={item}>
      <Card hover padded>
        <div className="flex items-start gap-3">
          {/* main content */}
          <div className="min-w-0 flex-1">
            {/* top row: icon + kind + source + ago */}
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className="flex items-center gap-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {kindIcon[signal.kind]}
                <CardLabel>{signal.kind}</CardLabel>
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                ·
              </span>
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: 'var(--text-muted)' }}
              >
                {signal.source}
              </span>
              <span
                className="ml-auto text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                {signal.ago}
              </span>
            </div>

            {/* title */}
            <p
              className="mb-1 font-medium leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {signal.title}
            </p>

            {/* body */}
            <p
              className="mb-3 text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {signal.body}
            </p>

            {/* tags */}
            <div className="flex flex-wrap gap-1.5">
              {signal.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide"
                  style={{
                    background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',
                    color: 'var(--text-secondary)',
                    border: '1px solid color-mix(in srgb, var(--scene-card-border) 60%, transparent)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* bookmark button */}
          <button
            aria-label={isSaved ? 'Remove from shelf' : 'Save to shelf'}
            onClick={() => onToggle(signal.id)}
            className={cn(
              'mt-0.5 shrink-0 rounded-md p-1.5 transition-colors duration-150',
              isSaved
                ? 'text-[var(--brand-blue)]'
                : 'opacity-40 hover:opacity-100',
            )}
            style={{ color: isSaved ? 'var(--brand-blue)' : 'var(--text-muted)' }}
          >
            {isSaved ? (
              <BookmarkCheck size={16} fill="currentColor" />
            ) : (
              <Bookmark size={16} />
            )}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── filter chip ─────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors duration-150',
        active ? 'border-[var(--scene-card-border)]' : 'border-transparent opacity-60 hover:opacity-90',
      )}
      style={
        active
          ? { background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)', color: 'var(--text-primary)' }
          : { background: 'transparent', color: 'var(--text-secondary)' }
      }
    >
      {label}
    </button>
  );
}

// ─── DriftView ────────────────────────────────────────────────────────────────

export default function DriftView() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const saved = useProgressStore((s) => s.savedDriftIds);
  const toggleSavedDrift = useProgressStore((s) => s.toggleSavedDrift);

  const filtered = driftFeed.filter((sig) => {
    if (filter === 'all') return true;
    if (filter === 'saved') return saved.includes(sig.id);
    return sig.kind === filter;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* header */}
      <motion.div variants={item} className="mb-6">
        <h1
          className="font-[family-name:var(--font-oswald)] text-3xl font-medium lowercase leading-none tracking-wide"
          style={{ color: 'var(--text-primary)' }}
        >
          drift
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          what&apos;s moving in your field
        </p>
      </motion.div>

      {/* filter chips */}
      <motion.div variants={item} className="mb-6 flex flex-wrap gap-2">
        <Chip label="all" active={filter === 'all'} onClick={() => setFilter('all')} />
        {driftKinds.map((k) => (
          <Chip
            key={k.id}
            label={k.label}
            active={filter === k.id}
            onClick={() => setFilter(k.id)}
          />
        ))}
        <Chip label="saved" active={filter === 'saved'} onClick={() => setFilter('saved')} />
      </motion.div>

      {/* feed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          {filtered.length === 0 && filter === 'saved' ? (
            <motion.p
              variants={item}
              className="py-16 text-center text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              nothing on your shelf yet — bookmark a signal.
            </motion.p>
          ) : (
            filtered.map((sig) => (
              <SignalCard
                key={sig.id}
                signal={sig}
                isSaved={saved.includes(sig.id)}
                onToggle={toggleSavedDrift}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
