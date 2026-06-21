'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { item } from '../cards/motion';
import { squirclePath } from './squircle-path';

interface SquircleProps {
  /** `squircle` = superellipse corners; `stadium` = fully pill-ended. */
  shape?: 'squircle' | 'stadium';
  /** Corner radius in px (ignored for `stadium`, which uses height/2). */
  radius?: number;
  /** Superellipse smoothing 0..1 (iOS ≈ 0.6). */
  smoothing?: number;
  /** Enable the spring hover-lift. */
  hover?: boolean;
  /** Participate in the parent stagger container (default true). */
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Premium frosted-glass card surface with real superellipse corners.
 *
 * Renders three stacked layers behind its content: a blurred glass fill clipped
 * to the squircle, then an SVG overlay drawing the hairline border, a top-edge
 * light highlight, and a faint diagonal sheen. The shape is measured per-card
 * (ResizeObserver) so corners stay exact at any aspect ratio. Content sits on top
 * unclipped — keep it inside the padding so it never reaches the curved corners.
 */
export function Squircle({
  shape = 'squircle',
  radius = 26,
  smoothing = 0.6,
  hover = true,
  animate = true,
  className,
  style,
  children,
}: SquircleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const uid = useId().replace(/:/g, '');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const r = shape === 'stadium' ? h / 2 : radius;
  const s = shape === 'stadium' ? 0 : smoothing;
  const path = w > 0 && h > 0 ? squirclePath(w, h, r, s) : '';
  const fallbackRadius = shape === 'stadium' ? 9999 : radius; // pre-measure / unsupported

  return (
    <motion.div
      ref={ref}
      variants={animate ? item : undefined}
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={className}
      style={{ position: 'relative', filter: 'drop-shadow(var(--scene-card-shadow))', ...style }}
    >
      {/* frosted glass fill, clipped to the squircle */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--scene-card)',
          backdropFilter: 'var(--scene-card-blur)',
          WebkitBackdropFilter: 'var(--scene-card-blur)',
          clipPath: path ? `path('${path}')` : undefined,
          borderRadius: path ? undefined : fallbackRadius,
        }}
      />

      {/* border + top highlight + diagonal sheen */}
      {path && (
        <svg
          aria-hidden
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--scene-card-sheen)" />
              <stop offset="55%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id={`edge-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--scene-card-highlight)" />
              <stop offset="35%" stopColor="var(--scene-card-border)" />
              <stop offset="100%" stopColor="var(--scene-card-border)" />
            </linearGradient>
          </defs>
          <path d={path} fill={`url(#sheen-${uid})`} />
          <path d={path} fill="none" stroke={`url(#edge-${uid})`} strokeWidth={1} />
        </svg>
      )}

      {/* content */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </motion.div>
  );
}
