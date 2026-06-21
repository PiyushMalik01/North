'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

interface Flake {
  x: number;
  y: number;
  r: number; // radius
  vy: number; // fall speed
  sway: number; // horizontal sway amplitude
  phase: number; // sway phase
  drift: number; // sway speed
  alpha: number;
}

interface SceneState {
  ctx: CanvasRenderingContext2D | null;
  flakes: Flake[];
  w: number;
  h: number;
  reduced: boolean;
}

/**
 * The polar scene: a full-bleed field of ice drifting down.
 * Theme-aware — ice + backdrop swap between Frost White and Coal Black via the
 * `--scene-ice` / `--scene-bg` CSS variables, recoloured live on theme toggle.
 */
export function PolarScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef('#F1FAEE');
  const repaintRef = useRef<() => void>(() => {});
  const theme = useThemeStore((s) => s.theme);

  // Keep the ice colour in sync with the active theme. Defer one frame so the
  // `.light` class (applied by ThemeProvider's effect) has landed before we read
  // `--scene-ice` — otherwise we'd read the outgoing theme's colour.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const c = getComputedStyle(document.documentElement)
        .getPropertyValue('--scene-ice')
        .trim();
      if (c) colorRef.current = c;
      repaintRef.current();
    });
    return () => cancelAnimationFrame(id);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state: SceneState = {
      ctx,
      flakes: [],
      w: 0,
      h: 0,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };

    const spawn = (seeded: boolean): Flake => {
      const r = Math.random() * 2.4 + 0.6; // 0.6 – 3.0px
      const depth = (r - 0.6) / 2.4; // 0 (far) – 1 (near)
      return {
        x: Math.random() * state.w,
        y: seeded ? Math.random() * state.h : -8,
        r,
        vy: 0.3 + depth * 1.0, // nearer ice falls faster
        sway: 4 + depth * 12,
        phase: Math.random() * Math.PI * 2,
        drift: 0.004 + Math.random() * 0.008,
        alpha: 0.3 + depth * 0.55,
      };
    };

    const paint = () => {
      const { w, h, flakes } = state;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = colorRef.current;
      for (const f of flakes) {
        const x = f.x + Math.sin(f.phase) * f.sway;
        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    repaintRef.current = paint;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = canvas.clientWidth;
      state.h = canvas.clientHeight;
      canvas.width = Math.floor(state.w * dpr);
      canvas.height = Math.floor(state.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(
        Math.min(170, Math.max(48, (state.w * state.h) / 13000)),
      );
      state.flakes = Array.from({ length: count }, () => spawn(true));
      if (state.reduced) paint();
    };

    let raf = 0;
    const tick = () => {
      for (const f of state.flakes) {
        f.y += f.vy;
        f.phase += f.drift;
        if (f.y - f.r > state.h) {
          Object.assign(f, spawn(false));
          f.x = Math.random() * state.w;
        }
      }
      paint();
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!state.reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      repaintRef.current = () => {};
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('block h-full w-full', className)}
    />
  );
}
