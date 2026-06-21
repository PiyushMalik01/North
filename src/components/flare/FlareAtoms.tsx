'use client';

import { Zap, Calendar, Users, Trophy } from 'lucide-react';
import type { FlareKind } from '@/data/platform/flare';

const KIND_ICON: Record<FlareKind, React.ElementType> = {
  hackathon: Trophy,
  contest: Zap,
  workshop: Calendar,
  meetup: Users,
};

const KIND_COLOR: Record<FlareKind, string> = {
  hackathon: 'color-mix(in srgb, var(--brand-purple) 90%, transparent)',
  contest: 'color-mix(in srgb, var(--brand-blue) 90%, transparent)',
  workshop: 'color-mix(in srgb, var(--text-secondary) 70%, transparent)',
  meetup: 'color-mix(in srgb, var(--text-muted) 90%, transparent)',
};

export function KindPill({ kind }: { kind: FlareKind }) {
  const Icon = KIND_ICON[kind];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
      style={{
        background: 'color-mix(in srgb, var(--scene-card-border) 40%, transparent)',
        color: KIND_COLOR[kind],
      }}
    >
      <Icon size={10} />
      {kind}
    </span>
  );
}

export function SpotsBar({ spots, spotsLeft }: { spots: number; spotsLeft: number }) {
  const filled = spots - spotsLeft;
  const pct = Math.round((filled / spots) * 100);
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1 flex-1 overflow-hidden rounded-full"
        style={{ background: 'color-mix(in srgb, var(--scene-card-border) 60%, transparent)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background:
              spotsLeft === 0
                ? 'var(--text-muted)'
                : 'color-mix(in srgb, var(--brand-purple) 80%, var(--brand-blue))',
          }}
        />
      </div>
      <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
        {spotsLeft === 0 ? 'full' : `${filled}/${spots}`}
      </span>
    </div>
  );
}
