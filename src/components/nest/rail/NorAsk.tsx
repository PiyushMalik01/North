'use client';

import { ArrowUp } from 'lucide-react';
import { Squircle } from '@/components/nest/ui/Squircle';
import { CardLabel } from '@/components/nest/cards/Card';

export function NorAsk() {
  return (
    <Squircle radius={22} hover={false}>
      <div className="p-4">
        <CardLabel className="mb-1">nor</CardLabel>
        <p
          className="mb-3 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          your guide is listening
        </p>
        <button
          type="button"
          aria-label="ask nor"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2"
          style={{
            background: 'color-mix(in srgb, var(--text-primary) 5%, transparent)',
            border: '1px solid var(--scene-card-border)',
          }}
        >
          <span className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            ask nor…
          </span>
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
            style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}
          >
            <ArrowUp size={12} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </Squircle>
  );
}
