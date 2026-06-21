'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Squircle } from '@/components/nest/ui/Squircle';
import { CardLabel } from '@/components/nest/cards/Card';
import { mockDrift } from '@/data/gameData';

export function DriftSignals() {
  const signals = mockDrift.slice(0, 3);

  return (
    <Squircle radius={22} hover={false}>
      <div className="p-4">
        <CardLabel className="mb-3">drift</CardLabel>
        <ul className="flex flex-col gap-1">
          {signals.map((signal) => (
            <li key={signal.id}>
              <Link
                href={signal.href}
                className={cn(
                  'group flex items-start gap-2 rounded-lg px-2 py-2 transition-colors',
                  'hover:bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]',
                )}
              >
                <ChevronRight
                  size={12}
                  className="mt-0.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-80"
                  style={{ color: 'var(--text-muted)' }}
                />
                <div className="min-w-0">
                  <p
                    className="line-clamp-2 text-xs leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {signal.text}
                  </p>
                  <p className="mt-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {signal.meta}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Squircle>
  );
}
