'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { Card, CardLabel } from '@/components/nest/cards/Card';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import { flareEvents, flareKinds } from '@/data/platform/flare';
import type { FlareKind } from '@/data/platform/flare';
import { KindPill, SpotsBar } from './FlareAtoms';
import { FlareCard } from './FlareCard';

export function FlareView() {
  const [activeKind, setActiveKind] = useState<FlareKind | 'all'>('all');
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  const featured = flareEvents.find((e) => e.featured);
  const rest = flareEvents.filter((e) => !e.featured);
  const visible = activeKind === 'all' ? rest : rest.filter((e) => e.kind === activeKind);

  function toggle(id: string) {
    setRegistered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const pills: { id: FlareKind | 'all'; label: string }[] = [
    { id: 'all', label: 'all' },
    ...flareKinds,
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
        className="mb-8"
      >
        <h1
          className="font-[family-name:var(--font-oswald)] text-4xl font-bold lowercase tracking-tight sm:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          flare
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          live events — hackathons, contests, workshops
        </p>
      </motion.div>

      {/* Featured hero card */}
      {featured && (
        <motion.div variants={item} className="mb-8">
          <Card hover className="relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: 'radial-gradient(ellipse at top left, var(--brand-purple), transparent 70%)' }}
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <KindPill kind={featured.kind} />
                  <CardLabel>{featured.date}</CardLabel>
                  <CardLabel>hosted by {featured.host}</CardLabel>
                </div>
                <h2
                  className="font-[family-name:var(--font-oswald)] text-2xl font-bold lowercase sm:text-3xl"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {featured.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {featured.blurb}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        background: 'color-mix(in srgb, var(--scene-card-border) 50%, transparent)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <SpotsBar spots={featured.spots} spotsLeft={featured.spotsLeft} />
              </div>
              <div className="shrink-0">
                <button
                  onClick={() => toggle(featured.id)}
                  className={cn(
                    'rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200',
                    registered.has(featured.id) ? 'opacity-80' : 'hover:opacity-90 active:scale-95',
                  )}
                  style={
                    registered.has(featured.id)
                      ? { background: 'color-mix(in srgb, var(--scene-card-border) 60%, transparent)', color: 'var(--text-muted)' }
                      : { background: 'color-mix(in srgb, var(--brand-purple) 85%, var(--brand-blue))', color: 'white' }
                  }
                >
                  {registered.has(featured.id) ? (
                    <span className="flex items-center gap-1.5">
                      <Check size={13} /> registered
                    </span>
                  ) : (
                    'register'
                  )}
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Filter pills */}
      <motion.div variants={item} className="mb-6 flex flex-wrap gap-2">
        {pills.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveKind(p.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
              activeKind === p.id ? 'scale-[1.03]' : 'hover:opacity-80',
            )}
            style={
              activeKind === p.id
                ? { background: 'color-mix(in srgb, var(--brand-purple) 20%, var(--scene-bg))', borderColor: 'var(--brand-purple)', color: 'var(--brand-purple)' }
                : { background: 'transparent', borderColor: 'var(--scene-card-border)', color: 'var(--text-muted)' }
            }
          >
            {p.label}
          </button>
        ))}
      </motion.div>

      {/* Event grid */}
      <motion.div variants={container} className="grid gap-4 sm:grid-cols-2">
        {visible.map((ev) => (
          <FlareCard key={ev.id} ev={ev} isReg={registered.has(ev.id)} onToggle={toggle} />
        ))}
      </motion.div>
    </motion.div>
  );
}
