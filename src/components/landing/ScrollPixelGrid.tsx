'use client';

import { useEffect, useRef } from 'react';

const CELL = 10;
const GAP = 2;
const PIXEL = CELL - GAP;

const FALLBACK_DARK = ['#EFC028', '#F5CE4D', '#3B82F6', '#60A5FA', '#22D3EE'];
const FALLBACK_LIGHT = ['#1A1A1A', '#2A2A2A', '#3B3B3B', '#C48800', '#1E40AF'];

const DENSITY_KEYS = [
  { at: 0.0, fill: 0.72 },
  { at: 0.12, fill: 0.55 },
  { at: 0.22, fill: 0.12 },
  { at: 0.35, fill: 0.35 },
  { at: 0.50, fill: 0.10 },
  { at: 0.62, fill: 0.40 },
  { at: 0.78, fill: 0.55 },
  { at: 0.90, fill: 0.70 },
  { at: 1.0, fill: 0.72 },
];

function lerpDensity(progress: number): number {
  for (let i = 0; i < DENSITY_KEYS.length - 1; i++) {
    const a = DENSITY_KEYS[i];
    const b = DENSITY_KEYS[i + 1];
    if (progress >= a.at && progress <= b.at) {
      const t = (progress - a.at) / (b.at - a.at);
      const ease = t * t * (3 - 2 * t);
      return a.fill + (b.fill - a.fill) * ease;
    }
  }
  return DENSITY_KEYS[DENSITY_KEYS.length - 1].fill;
}

interface Cell {
  col: number;
  row: number;
  threshold: number;
  fallbackColor: string;
  fallbackColorLight: string;
}

export function ScrollPixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const cellsRef = useRef<Cell[]>([]);
  const fillRef = useRef(0.72);
  const targetFillRef = useRef(0.72);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const samplerRef = useRef<HTMLCanvasElement | null>(null);
  const videoReadyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cols = 0;
    let rows = 0;

    // Setup hidden video
    const video = document.createElement('video');
    video.src = '/images/video-ref.mp4';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    videoRef.current = video;

    // Offscreen canvas to sample video frames
    const sampler = document.createElement('canvas');
    samplerRef.current = sampler;

    video.addEventListener('canplay', () => {
      videoReadyRef.current = true;
      video.play().catch(() => {});
    });
    video.load();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(window.innerWidth / CELL);
      rows = Math.ceil(window.innerHeight / CELL);

      // Sampler matches grid dimensions (1 pixel per cell)
      sampler.width = cols;
      sampler.height = rows;

      buildCells();
    }

    function buildCells() {
      const cells: Cell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ex = Math.min(c / cols, (cols - 1 - c) / cols) * 2;
          const ey = Math.min(r / rows, (rows - 1 - r) / rows) * 2;
          const edgeDist = Math.min(ex, ey);
          const shaped = Math.pow(edgeDist, 0.6);
          const noise = Math.random() * 0.18;
          const threshold = shaped * 0.85 + noise;

          cells.push({
            col: c,
            row: r,
            threshold,
            fallbackColor: FALLBACK_DARK[Math.floor(Math.random() * FALLBACK_DARK.length)],
            fallbackColorLight: FALLBACK_LIGHT[Math.floor(Math.random() * FALLBACK_LIGHT.length)],
          });
        }
      }
      cellsRef.current = cells;
    }

    function onScroll() {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollH > 0 ? window.scrollY / scrollH : 0;
      targetFillRef.current = lerpDensity(Math.min(progress, 1));
    }

    // Reusable typed array for video pixel data
    let videoPixels: Uint8ClampedArray | null = null;

    function sampleVideo() {
      if (!videoReadyRef.current || video.readyState < 2) return;

      const sCtx = sampler.getContext('2d');
      if (!sCtx) return;

      // Draw video frame scaled down to grid size (1px = 1 cell)
      sCtx.drawImage(video, 0, 0, cols, rows);
      const imageData = sCtx.getImageData(0, 0, cols, rows);
      videoPixels = imageData.data;
    }

    function draw() {
      fillRef.current += (targetFillRef.current - fillRef.current) * 0.08;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      const fill = fillRef.current;
      const light = document.documentElement.classList.contains('light');
      const cells = cellsRef.current;

      // Sample video every frame
      sampleVideo();
      const hasVideo = videoPixels !== null && videoPixels.length > 0;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.threshold >= fill) continue;

        const proximity = (fill - cell.threshold) / fill;
        const alpha = Math.min(proximity * 2, 1) * 0.65;
        if (alpha < 0.03) continue;

        ctx!.globalAlpha = alpha;

        if (hasVideo) {
          // Read color from video frame
          const idx = (cell.row * cols + cell.col) * 4;
          const r = videoPixels![idx];
          const g = videoPixels![idx + 1];
          const b = videoPixels![idx + 2];
          const brightness = r * 0.299 + g * 0.587 + b * 0.114;

          if (light) {
            // In light mode, invert: bright video pixels → dark squares
            const inv = 255 - brightness;
            const factor = inv / 255;
            ctx!.fillStyle = `rgb(${Math.round(r * 0.3 * factor)},${Math.round(g * 0.3 * factor)},${Math.round(b * 0.3 * factor)})`;
          } else {
            // Dark mode: boost saturation slightly for pop
            const max = Math.max(r, g, b);
            const boost = max > 0 ? Math.min(255 / max, 1.4) : 1;
            ctx!.fillStyle = `rgb(${Math.min(255, Math.round(r * boost))},${Math.min(255, Math.round(g * boost))},${Math.min(255, Math.round(b * boost))})`;
          }
        } else {
          ctx!.fillStyle = light ? cell.fallbackColorLight : cell.fallbackColor;
        }

        ctx!.fillRect(cell.col * CELL, cell.row * CELL, PIXEL, PIXEL);
      }

      ctx!.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    onScroll();
    fillRef.current = targetFillRef.current;
    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      video.pause();
      video.src = '';
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
