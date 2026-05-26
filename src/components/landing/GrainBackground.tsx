'use client';

import { useEffect, useRef } from 'react';

export function GrainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let frame = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      frame++;
      // Only redraw grain every 3 frames (reduce CPU, grain doesn't need 60fps)
      if (frame % 3 !== 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const imageData = ctx!.createImageData(w, h);
      const data = imageData.data;
      const light = document.documentElement.classList.contains('light');

      // Noise grain — random pixel brightness
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        if (light) {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = v < 240 ? 0 : 6;
        } else {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = v < 240 ? 0 : 8;
        }
      }

      ctx!.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Grain texture */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      {/* Soft ambient glow — just two very subtle color washes */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute w-[800px] h-[600px] -top-[200px] left-1/2 -translate-x-1/2"
          style={{
            background: 'radial-gradient(ellipse, var(--accent) 0%, transparent 70%)',
            opacity: 0.04,
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] -bottom-[100px] -right-[200px]"
          style={{
            background: 'radial-gradient(ellipse, var(--brand-blue) 0%, transparent 70%)',
            opacity: 0.03,
            filter: 'blur(100px)',
          }}
        />
      </div>
    </>
  );
}
