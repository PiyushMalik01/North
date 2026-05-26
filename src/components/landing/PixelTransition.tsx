'use client';

import { useEffect, useRef } from 'react';

const CELL = 8;
const GAP = 1;
const PIXEL = CELL - GAP;
const ROWS = 14;
const HEIGHT = ROWS * CELL;

function seededRandom(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function PixelTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let cols = 0;

    function paint() {
      const isLight = document.documentElement.classList.contains('light');
      if (!isLight) {
        ctx!.clearRect(0, 0, w, HEIGHT);
        return;
      }

      ctx!.clearRect(0, 0, w, HEIGHT);

      for (let r = 0; r < ROWS; r++) {
        const progress = r / (ROWS - 1);
        const density = 1 - progress * progress;

        for (let c = 0; c < cols; c++) {
          const rand = seededRandom(c, r);
          if (rand > density) continue;

          const edgeNoise = seededRandom(c + 100, r + 200) * 0.3;
          const alpha = Math.max(0, density - edgeNoise);
          if (alpha < 0.05) continue;

          ctx!.globalAlpha = alpha;
          ctx!.fillStyle = '#0A0A0B';
          ctx!.fillRect(c * CELL, r * CELL, PIXEL, PIXEL);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function resize() {
      w = canvas!.parentElement!.clientWidth;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = w * dpr;
      canvas!.height = HEIGHT * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = HEIGHT + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      paint();
    }

    const observer = new MutationObserver(() => paint());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block"
      style={{ height: HEIGHT }}
      aria-hidden="true"
    />
  );
}
