'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useThemeStore } from '@/store/themeStore';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ZONES, activeZone } from './zones';
import { RollingTabs } from './RollingTabs';

const ITEM_W = 70;
const BALL_D = 46;
const BAR_H = 46;

/**
 * The platform top bar: full-width, sticky, brand on the left, every zone in one
 * rolling-ball row, theme toggle on the right. The ball rolls to the active zone
 * and routes there.
 */
export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useThemeStore((s) => s.theme);

  const active = activeZone(pathname);
  const activeIndex = Math.max(0, ZONES.findIndex((z) => z.id === active?.id));
  const logo = theme === 'light' ? '/images/light_themelogo.svg' : '/images/dark_themelogo.svg';

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b px-4 sm:px-6"
      style={{
        background: 'color-mix(in srgb, var(--scene-bg) 85%, transparent)',
        borderColor: 'var(--border-color)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Brand */}
      <Link href="/dashboard" className="flex shrink-0 items-center gap-2" aria-label="North — home">
        <span
          className="block h-7 w-7 bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${logo})`, backgroundSize: 'contain' }}
          aria-hidden="true"
        />
        <span className="hidden font-[family-name:var(--font-oswald)] text-base font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] sm:inline">
          North
        </span>
      </Link>

      <span className="h-6 w-px shrink-0" style={{ background: 'var(--border-color)' }} aria-hidden="true" />

      {/* Zone row (rolling ball) */}
      <div className="min-w-0 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <RollingTabs
          items={ZONES}
          activeRoute={activeIndex}
          itemW={ITEM_W}
          ballD={BALL_D}
          barH={BAR_H}
          labelClass="font-[family-name:var(--font-primary)] text-[14px] font-bold lowercase tracking-wide transition-colors duration-300"
          onSelect={(_, href) => router.push(href)}
        />
      </div>

      <ThemeToggle />
    </header>
  );
}
