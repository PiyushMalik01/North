'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card } from '@/components/nest/cards/Card';
import { item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import type { FlareEvent } from '@/data/platform/flare';
import { KindPill, SpotsBar } from './FlareAtoms';

interface FlareCardProps {
  ev: FlareEvent;
  isReg: boolean;
  onToggle: (id: string) => void;
}

export function FlareCard({ ev, isReg, onToggle }: FlareCardProps) {
  const isFull = ev.spotsLeft === 0;

  return (
    <motion.div variants={item}>
      <Card hover className="h-full">
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <KindPill kind={ev.kind} />
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {ev.date}
            </span>
          </div>
          <div>
            <h3
              className="font-[family-name:var(--font-oswald)] text-lg font-bold lowercase leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {ev.title}
            </h3>
            <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {ev.host}
            </p>
          </div>
          <p className="flex-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {ev.blurb}
          </p>
          <div className="flex flex-wrap gap-1">
            {ev.tags.map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-[10px]"
                style={{
                  background: 'color-mix(in srgb, var(--scene-card-border) 50%, transparent)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <SpotsBar spots={ev.spots} spotsLeft={ev.spotsLeft} />
          <button
            disabled={isFull && !isReg}
            onClick={() => !isFull && onToggle(ev.id)}
            className={cn(
              'w-full rounded-md py-2 text-xs font-semibold transition-all duration-200',
              isFull && !isReg ? 'cursor-not-allowed opacity-40' : 'hover:opacity-90 active:scale-95',
            )}
            style={
              isReg
                ? { background: 'color-mix(in srgb, var(--scene-card-border) 60%, transparent)', color: 'var(--text-muted)' }
                : isFull
                  ? { background: 'color-mix(in srgb, var(--scene-card-border) 40%, transparent)', color: 'var(--text-muted)' }
                  : { background: 'color-mix(in srgb, var(--brand-blue) 80%, transparent)', color: 'white' }
            }
          >
            {isReg ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check size={11} /> registered
              </span>
            ) : isFull ? (
              'full'
            ) : (
              'register'
            )}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
