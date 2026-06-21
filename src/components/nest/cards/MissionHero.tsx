'use client';

import Link from 'next/link';
import { ChevronRight, Circle } from 'lucide-react';
import { Squircle } from '@/components/nest/ui/Squircle';
import { CardLabel } from '@/components/nest/cards/Card';
import { mockNorth } from '@/data/gameData';

export function MissionHero() {
  return (
    <Squircle radius={34} smoothing={0.6} className="md:col-span-2 lg:col-span-3">
      <div className="p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative ghosted ring */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          aria-hidden
        >
          <Circle
            size={180}
            strokeWidth={1}
            style={{ color: 'color-mix(in srgb, var(--text-primary) 6%, transparent)' }}
          />
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Left: text stack */}
          <div className="flex flex-col gap-2">
            <CardLabel>beam today</CardLabel>

            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight font-[family-name:var(--font-oswald)] uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              {mockNorth.task}
            </h1>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              toward your north &middot; {mockNorth.goal}
            </p>

            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {mockNorth.node} &middot; {mockNorth.zone} &middot; ~{mockNorth.minutesLeft}m left
            </p>
          </div>

          {/* Right: Resume CTA */}
          <div className="shrink-0">
            <Link
              href={mockNorth.resumeHref}
              className="inline-flex items-center gap-1 rounded-xl px-5 py-3 font-bold text-sm lowercase transition-transform duration-150 hover:-translate-y-0.5"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--scene-bg)',
              }}
            >
              resume
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Squircle>
  );
}
