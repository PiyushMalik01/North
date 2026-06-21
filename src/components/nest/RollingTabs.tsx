'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';

// Hydration-safe reduced-motion (server reports false).
const MQ = '(prefers-reduced-motion: reduce)';
const subR = (cb: () => void) => {
  const m = window.matchMedia(MQ);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getR = () => window.matchMedia(MQ).matches;
const getRServer = () => false;

export interface RollingItem {
  label: string;
  href: string;
}

interface RollingTabsProps {
  items: RollingItem[];
  activeRoute: number; // index derived from the current path
  itemW: number;
  ballD: number;
  barH: number;
  labelClass: string;
  onSelect: (index: number, href: string) => void;
}

/**
 * A row of fixed-width tabs with one dark "ball" that rolls (translate + true
 * rolling spin) to the active tab. Shared by the top nav and the bottom sub-pill.
 * When itemW === ballD === barH the ball fills each cell and nestles into a
 * stadium pill's rounded ends.
 */
export function RollingTabs({ items, activeRoute, itemW, ballD, barH, labelClass, onSelect }: RollingTabsProps) {
  const reduced = useSyncExternalStore(subR, getR, getRServer);

  const routeIndex = Math.max(0, activeRoute);
  // Optimistic active index — set on click so the ball rolls instantly, then
  // synced to the route (React's adjust-state-during-render-from-previous pattern).
  const [active, setActive] = useState(routeIndex);
  const [prevRoute, setPrevRoute] = useState(routeIndex);
  if (prevRoute !== routeIndex) {
    setPrevRoute(routeIndex);
    setActive(routeIndex);
  }

  const ballX = active * itemW + (itemW - ballD) / 2;
  const ballRotate = ((active * itemW) / (Math.PI * ballD)) * 360;

  const go = (i: number, href: string) => {
    setActive(i);
    onSelect(i, href);
  };

  return (
    <div className="relative flex" style={{ width: items.length * itemW, height: barH }}>
      <motion.div
        className="absolute rounded-full"
        style={{
          top: '50%',
          width: ballD,
          height: ballD,
          background: 'var(--scene-ice)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.28)',
        }}
        initial={false}
        animate={{ x: ballX, y: '-50%', rotate: ballRotate }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 24, mass: 1.15 }}
      />
      {items.map((it, i) => {
        const on = i === active;
        return (
          <button
            key={it.href}
            type="button"
            onClick={() => go(i, it.href)}
            style={{ width: itemW }}
            className="relative z-[1] flex h-full items-center justify-center"
            aria-current={on ? 'page' : undefined}
          >
            <span className={labelClass} style={{ color: on ? 'var(--scene-bg)' : 'var(--text-secondary)' }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
