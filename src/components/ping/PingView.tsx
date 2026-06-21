'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Users, Flame, Award, Zap, CheckCheck } from 'lucide-react';
import { CardLabel } from '@/components/nest/cards/Card';
import { Squircle } from '@/components/nest/ui/Squircle';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import { pings as initialPings, pingKinds, type Ping, type PingKind } from '@/data/platform/ping';

const kindIcon: Record<PingKind, React.ReactNode> = {
  system:      <Bell size={16} />,
  social:      <Users size={16} />,
  streak:      <Flame size={16} />,
  achievement: <Award size={16} />,
  event:       <Zap size={16} />,
};

const kindAccent: Record<PingKind, string> = {
  system:      'var(--text-secondary)',
  social:      'var(--brand-blue)',
  streak:      'var(--accent)',
  achievement: '#22C55E',
  event:       '#A855F7',
};

type FilterTab = 'all' | 'unread' | PingKind;

function iconBg(kind: PingKind) {
  return `color-mix(in srgb, ${kindAccent[kind]} 18%, transparent)`;
}

export default function PingView() {
  const [items, setItems] = useState<Ping[]>(initialPings);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const unreadCount = items.filter((p) => !p.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((p) => ({ ...p, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, read: true } : p)));
  }

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'all' },
    { id: 'unread', label: 'unread' },
    ...pingKinds,
  ];

  const visible = items.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !p.read;
    return p.kind === activeTab;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-oswald)] text-4xl font-bold lowercase tracking-tight text-[var(--text-primary)] sm:text-5xl">
            ping
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            messages in
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-semibold text-[var(--accent-fg)]">
                {unreadCount}
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
          >
            <CheckCheck size={13} />
            mark all read
          </button>
        )}
      </motion.div>

      {/* Filter pills */}
      <motion.div variants={item} className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              activeTab === tab.id
                ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent-text)]'
                : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* List */}
      {visible.length === 0 ? (
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Bell size={28} className="mb-3 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)]">you&apos;re all caught up</p>
        </motion.div>
      ) : (
        <motion.ul variants={container} initial="hidden" animate="show" className="space-y-2">
          {visible.map((ping) => (
            <motion.li key={ping.id} variants={item}>
              <button onClick={() => markRead(ping.id)} className="w-full text-left" aria-label={`Mark "${ping.title}" as read`}>
                <Squircle
                  hover
                  radius={16}
                  style={
                    !ping.read
                      ? { background: `color-mix(in srgb, ${kindAccent[ping.kind]} 8%, var(--scene-card))` }
                      : undefined
                  }
                  className={cn(!ping.read && 'ring-1 ring-[var(--scene-card-border)]')}
                >
                  <div className="flex items-start gap-3 p-4">
                    <span
                      className="mt-0.5 flex-shrink-0 rounded-md p-1.5 text-[var(--text-secondary)]"
                      style={{ background: iconBg(ping.kind) }}
                    >
                      {kindIcon[ping.kind]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={cn(
                            'truncate text-sm',
                            ping.read
                              ? 'font-normal text-[var(--text-secondary)]'
                              : 'font-medium text-[var(--text-primary)]',
                          )}
                        >
                          {ping.title}
                        </p>
                        <CardLabel className="flex-shrink-0">{ping.ago}</CardLabel>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                        {ping.body}
                      </p>
                    </div>

                    {!ping.read && (
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                    )}
                  </div>
                </Squircle>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
