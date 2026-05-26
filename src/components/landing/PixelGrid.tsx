'use client';

import { useEffect, useRef } from 'react';

const CELL = 10;
const GAP = 2;
const PIXEL = CELL - GAP;

const DARK_COLORS = [
  '#EFC028',
  '#F5CE4D',
  '#3B82F6',
  '#60A5FA',
  '#22D3EE',
];

const LIGHT_COLORS = [
  '#1A1A1A',
  '#2A2A2A',
  '#3B3B3B',
  '#D4A017',
  '#1E40AF',
];

interface Pixel {
  col: number;
  row: number;
  opacity: number;
  target: number;
  color: string;
  speed: number;
  life: number;
  maxLife: number;
}

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  intensity: number;
}

export function PixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cols = 0;
    let rows = 0;
    let pixels: Pixel[] = [];
    let waves: Wave[] = [];
    let time = 0;

    const isLight = () => document.documentElement.classList.contains('light');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(window.innerWidth / CELL);
      rows = Math.ceil(window.innerHeight / CELL);
      seedPixels();
    }

    function getPalette() {
      return isLight() ? LIGHT_COLORS : DARK_COLORS;
    }

    function seedPixels() {
      const palette = getPalette();
      const density = 0.035;
      const total = Math.floor(cols * rows * density);
      pixels = [];
      for (let i = 0; i < total; i++) {
        pixels.push(makePixel(palette));
      }
    }

    function makePixel(palette: string[]): Pixel {
      const maxLife = 120 + Math.random() * 300;
      return {
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        opacity: 0,
        target: 0.4 + Math.random() * 0.6,
        color: palette[Math.floor(Math.random() * palette.length)],
        speed: 0.02 + Math.random() * 0.03,
        life: 0,
        maxLife,
      };
    }

    function spawnWave() {
      const palette = getPalette();
      waves.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 0,
        maxRadius: 150 + Math.random() * 250,
        speed: 1.5 + Math.random() * 2,
        color: palette[Math.floor(Math.random() * 2)],
        intensity: 0.5 + Math.random() * 0.5,
      });
    }

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);
      time++;

      const light = isLight();
      const palette = light ? LIGHT_COLORS : DARK_COLORS;

      // Spawn waves periodically
      if (time % 180 === 0) spawnWave();

      // Update and draw waves — spawn temporary bright pixels along the wavefront
      for (let wi = waves.length - 1; wi >= 0; wi--) {
        const wave = waves[wi];
        wave.radius += wave.speed;

        if (wave.radius > wave.maxRadius) {
          waves.splice(wi, 1);
          continue;
        }

        const ringWidth = 30;
        const fadeProgress = wave.radius / wave.maxRadius;
        const ringAlpha = (1 - fadeProgress) * wave.intensity;

        if (ringAlpha > 0.05) {
          const circumference = 2 * Math.PI * wave.radius;
          const pixelCount = Math.floor(circumference / (CELL * 3));

          for (let p = 0; p < pixelCount; p++) {
            const angle = (p / pixelCount) * Math.PI * 2 + time * 0.002;
            const r = wave.radius + (Math.random() - 0.5) * ringWidth;
            const px = wave.x + Math.cos(angle) * r;
            const py = wave.y + Math.sin(angle) * r;

            if (px < 0 || px > w || py < 0 || py > h) continue;

            const col = Math.floor(px / CELL);
            const row = Math.floor(py / CELL);

            ctx!.globalAlpha = ringAlpha * (0.3 + Math.random() * 0.7);
            ctx!.fillStyle = wave.color;
            ctx!.fillRect(col * CELL, row * CELL, PIXEL, PIXEL);
          }
        }
      }

      // Update and draw persistent pixels
      for (let i = 0; i < pixels.length; i++) {
        const px = pixels[i];
        px.life++;

        // Lifecycle: fade in → hold → fade out → respawn
        const fadeIn = Math.min(px.life * px.speed, 1);
        const fadeOut = Math.max(1 - (px.life - px.maxLife * 0.7) / (px.maxLife * 0.3), 0);
        px.opacity = px.target * fadeIn * (px.life > px.maxLife * 0.7 ? fadeOut : 1);

        if (px.life > px.maxLife) {
          pixels[i] = makePixel(palette);
          continue;
        }

        if (px.opacity > 0.02) {
          ctx!.globalAlpha = px.opacity;
          ctx!.fillStyle = px.color;
          ctx!.fillRect(px.col * CELL, px.row * CELL, PIXEL, PIXEL);
        }
      }

      ctx!.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    spawnWave();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
