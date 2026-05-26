'use client';

import { useEffect, useRef } from 'react';

const CELL = 8;
const GAP = 1;
const PIXEL = CELL - GAP;
const EMERGE_DURATION = 2.8;

export function HeroVideoGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cols = 0;
    let rows = 0;
    let frameCount = 0;
    const startTime = performance.now();
    const isMobile = window.innerWidth < 768;
    const sampleEvery = isMobile ? 3 : 2;

    const video = document.createElement('video');
    video.src = '/images/video-ref.mp4';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.playbackRate = 0.35;

    const sampler = document.createElement('canvas');
    const sCtx = sampler.getContext('2d', { willReadFrequently: true });

    let videoReady = false;
    let videoPixels: Uint8ClampedArray | null = null;

    video.addEventListener('canplaythrough', () => {
      videoReady = true;
      video.play().catch(() => {});
    });
    video.load();

    let centerX = 0;
    let centerY = 0;
    let maxDist = 1;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      sampler.width = cols;
      sampler.height = rows;

      centerX = cols / 2;
      centerY = rows / 2;
      maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    }

    function sampleVideo() {
      if (!videoReady || !sCtx || video.readyState < 2) return;
      sCtx.drawImage(video, 0, 0, cols, rows);
      videoPixels = sCtx.getImageData(0, 0, cols, rows).data;
    }

    function draw() {
      frameCount++;
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx!.clearRect(0, 0, w, h);

      if (frameCount % sampleEvery === 0) sampleVideo();

      if (!videoPixels || videoPixels.length === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (performance.now() - startTime) / 1000;
      const emergeProgress = Math.min(elapsed / EMERGE_DURATION, 1);
      const emergeEased = emergeProgress * emergeProgress * (3 - 2 * emergeProgress);
      const emergeRadius = emergeEased * maxDist * 1.2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c) * 4;
          const rv = videoPixels[idx];
          const gv = videoPixels[idx + 1];
          const bv = videoPixels[idx + 2];

          const brightness = rv * 0.299 + gv * 0.587 + bv * 0.114;
          if (brightness < 12) continue;

          const dx = c - centerX;
          const dy = r - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > emergeRadius) continue;

          let pixelAlpha = 1;
          if (emergeProgress < 1) {
            const edge = emergeRadius - dist;
            pixelAlpha = Math.min(edge / 8, 1);
          }

          const max = Math.max(rv, gv, bv);
          const boost = max > 0 ? Math.min(255 / max, 1.5) : 1;
          const rr = Math.min(255, Math.round(rv * boost));
          const gg = Math.min(255, Math.round(gv * boost));
          const bb = Math.min(255, Math.round(bv * boost));

          ctx!.globalAlpha = pixelAlpha;
          ctx!.fillStyle = `rgb(${rr},${gg},${bb})`;
          ctx!.fillRect(c * CELL, r * CELL, PIXEL, PIXEL);
        }
      }

      ctx!.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      video.pause();
      video.src = '';
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
