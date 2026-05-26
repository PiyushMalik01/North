'use client';

import { useEffect, useRef } from 'react';

const CELL = 8;
const GAP = 1;
const PIXEL = CELL - GAP;
const ROWS = 5;
const HEIGHT = ROWS * CELL;

type Variant = 'wave' | 'drift' | 'flow';

interface PixelDividerProps {
  color?: string;
  variant?: Variant;
  speed?: number;
}

export function PixelDivider({
  color = '#EFC028',
  variant = 'wave',
  speed = 1,
}: PixelDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cols = 0;
    let phase = 0;
    let w = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '100px' }
    );
    observer.observe(canvas);

    function resize() {
      w = canvas!.parentElement!.clientWidth;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = w * dpr;
      canvas!.height = HEIGHT * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = HEIGHT + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
    }

    function drawWave() {
      for (let c = 0; c < cols; c++) {
        const waveY =
          Math.sin(c * 0.06 + phase) * 1.5 +
          Math.sin(c * 0.03 + phase * 0.7) * 0.8 +
          ROWS / 2;

        for (let r = 0; r < ROWS; r++) {
          const dist = Math.abs(r - waveY);
          if (dist > 0.9) continue;

          const alpha = Math.max(0, 1 - dist / 0.9) * 0.45;
          if (alpha < 0.05) continue;

          ctx!.globalAlpha = alpha;
          ctx!.fillStyle = color;
          ctx!.fillRect(c * CELL, r * CELL, PIXEL, PIXEL);
        }
      }
    }

    function drawDrift() {
      for (let c = 0; c < cols; c++) {
        const hash = Math.sin(c * 127.1 + 311.7) * 43758.5453 % 1;
        const yOff = Math.sin(c * 0.04 + phase + hash * 6.28) * 1.8;
        const row = Math.round(ROWS / 2 + yOff);
        if (row < 0 || row >= ROWS) continue;

        const fade =
          Math.min(c / cols, (cols - 1 - c) / cols) * 4;
        const alpha = Math.min(fade, 1) * (0.2 + hash * 0.3);
        if (alpha < 0.05) continue;

        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = color;
        ctx!.fillRect(c * CELL, row * CELL, PIXEL, PIXEL);
      }
    }

    function drawFlow() {
      for (let c = 0; c < cols; c++) {
        const n1 = Math.sin(c * 0.09 + phase);
        const n2 = Math.sin(c * 0.04 - phase * 1.3);
        const waveY = (n1 * 0.4 + n2 * 0.6) * 1.6 + ROWS / 2;

        for (let r = 0; r < ROWS; r++) {
          const dist = Math.abs(r - waveY);
          if (dist > 1.1) continue;

          const alpha = Math.max(0, 1 - dist / 1.1) * 0.35;
          if (alpha < 0.05) continue;

          ctx!.globalAlpha = alpha;
          ctx!.fillStyle = color;
          ctx!.fillRect(c * CELL, r * CELL, PIXEL, PIXEL);
        }
      }
    }

    const drawFn =
      variant === 'drift' ? drawDrift : variant === 'flow' ? drawFlow : drawWave;

    function draw() {
      if (visibleRef.current) {
        phase += speed * 0.012;
        ctx!.clearRect(0, 0, w, HEIGHT);
        drawFn();
        ctx!.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [color, variant, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: HEIGHT }}
      aria-hidden="true"
    />
  );
}
