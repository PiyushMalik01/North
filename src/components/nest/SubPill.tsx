'use client';

import { usePathname, useRouter } from 'next/navigation';
import { activeZone } from './zones';
import { RollingTabs } from './RollingTabs';

// Square cells: itemW === ballD === barH, so the ball fills each cell and its
// radius matches the stadium pill's rounded ends (PAD on every side).
const D = 40;
const PAD = 6;

/**
 * Bottom-center stadium pill that appears inside zones with sub-places. Same
 * rolling ball as the top bar; the ball's diameter equals the pill's inner
 * height, so it nestles into the rounded ends. Renders nothing without subs.
 */
export function SubPill() {
  const pathname = usePathname();
  const router = useRouter();

  const zone = activeZone(pathname);
  const subs = zone?.subs;
  if (!subs || subs.length < 2) return null;

  const activeIndex = Math.max(0, subs.findIndex((s) => s.href === pathname));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <nav
        className="pointer-events-auto rounded-full border shadow-lg"
        style={{
          padding: PAD,
          background: 'color-mix(in srgb, var(--scene-bg) 80%, transparent)',
          borderColor: 'var(--border-color)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* key by zone so the ball resets per zone instead of animating across zones */}
        <RollingTabs
          key={zone.id}
          items={subs}
          activeRoute={activeIndex}
          itemW={D}
          ballD={D}
          barH={D}
          labelClass="font-[family-name:var(--font-primary)] text-[11px] font-medium lowercase tracking-tight transition-colors duration-300"
          onSelect={(_, href) => router.push(href)}
        />
      </nav>
    </div>
  );
}
