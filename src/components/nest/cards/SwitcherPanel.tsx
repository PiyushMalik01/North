'use client';

import { useRef, useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { Squircle } from '@/components/nest/ui/Squircle';
import { mockQuests, mockLeaderboard, mockGleams } from '@/data/gameData';
import { cn } from '@/lib/utils';

const TABS = ['quests', 'perch', 'gleams'] as const;

export function SwitcherPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(mockQuests.map((q) => [q.id, q.done]))
  );

  function scrollTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActiveIndex(index);
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(index);
  }

  function toggleQuest(id: string) {
    setDoneMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Squircle shape="stadium" className="w-full md:col-span-2">
      <div className="px-8 sm:px-10 py-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => scrollTo(i)}
                className={cn(
                  'text-xs tracking-wide transition-colors',
                  i === activeIndex
                    ? 'font-bold'
                    : 'font-normal opacity-50'
                )}
                style={{
                  color: 'var(--text-primary)',
                  opacity: i === activeIndex ? 1 : 0.45,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {TABS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to ${TABS[i]}`}
                style={{
                  height: 6,
                  width: i === activeIndex ? 18 : 6,
                  borderRadius: 9999,
                  background:
                    i === activeIndex
                      ? 'var(--text-primary)'
                      : 'color-mix(in srgb, var(--text-primary) 28%, transparent)',
                  transition: 'width 0.2s ease, background 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* VIEW: quests */}
          <div className="snap-start shrink-0 w-full flex flex-col gap-1.5">
            {mockQuests.map((q) => {
              const done = doneMap[q.id] ?? q.done;
              return (
                <button
                  key={q.id}
                  onClick={() => toggleQuest(q.id)}
                  className="flex items-center gap-2.5 w-full text-left group"
                >
                  <span
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 16,
                      height: 16,
                      border: `1.5px solid color-mix(in srgb, var(--text-primary) 40%, transparent)`,
                      borderRadius: 3,
                      background: done
                        ? 'color-mix(in srgb, var(--text-primary) 14%, transparent)'
                        : 'transparent',
                    }}
                  >
                    {done && (
                      <Check
                        size={11}
                        style={{ color: 'var(--text-primary)' }}
                        strokeWidth={2.5}
                      />
                    )}
                  </span>
                  <span
                    className="flex-1 text-xs"
                    style={{
                      color: done
                        ? 'color-mix(in srgb, var(--text-primary) 38%, transparent)'
                        : 'var(--text-primary)',
                      textDecoration: done ? 'line-through' : 'none',
                    }}
                  >
                    {q.label}
                  </span>
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    +{q.reward}
                  </span>
                </button>
              );
            })}
          </div>

          {/* VIEW: perch */}
          <div className="snap-start shrink-0 w-full flex flex-col gap-1">
            {mockLeaderboard.map((row) => (
              <div
                key={row.rank}
                className="flex items-center gap-2.5 px-2 py-1 rounded"
                style={
                  row.you
                    ? {
                        background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--text-primary) 24%, transparent)',
                      }
                    : undefined
                }
              >
                <span
                  className="text-xs tabular-nums w-4 text-right shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {row.rank}
                </span>
                <span className="flex-1 text-xs" style={{ color: 'var(--text-primary)' }}>
                  {row.name}
                  {row.you && (
                    <span className="ml-1 opacity-50 text-[10px]">(you)</span>
                  )}
                </span>
                <span
                  className="text-xs tabular-nums shrink-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {row.xp.toLocaleString()} xp
                </span>
              </div>
            ))}
          </div>

          {/* VIEW: gleams */}
          <div className="snap-start shrink-0 w-full flex flex-wrap gap-2">
            {mockGleams.map((g) => (
              <span
                key={g.id}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                style={{
                  border: `1px solid var(--scene-card-border)`,
                  color: 'var(--text-primary)',
                  opacity: g.earned ? 1 : 0.45,
                }}
              >
                {!g.earned && <Lock size={10} strokeWidth={2} />}
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Squircle>
  );
}
