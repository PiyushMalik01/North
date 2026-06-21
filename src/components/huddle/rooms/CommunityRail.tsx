'use client';

import { useCommunities } from '@/lib/huddle/hooks';
import { cn } from '@/lib/utils';

const rowClass =
  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)]';

const activeStyle = { background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)' };

export function CommunityRail({
  active,
  onSelect,
}: {
  active: string | undefined;
  onSelect: (slug?: string) => void;
}) {
  const { data } = useCommunities();

  return (
    <div className="space-y-1">
      <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        rooms
      </p>

      <button type="button" onClick={() => onSelect(undefined)} className={rowClass} style={!active ? activeStyle : undefined}>
        <span className="font-medium text-[var(--text-primary)]">all</span>
      </button>

      {data?.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.slug)}
          className={cn(rowClass)}
          style={active === c.slug ? activeStyle : undefined}
        >
          <span className="truncate font-medium text-[var(--text-primary)]">{c.name}</span>
          <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{c.memberCount}</span>
        </button>
      ))}
    </div>
  );
}
