'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const CELL = 8;
const GAP = 1;
const LETTER_GAP = 3;

const font: Record<string, number[][]> = {
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
};

interface Pixel {
  x: number;
  y: number;
  px: number;
  py: number;
}

function getPixels(word: string): Pixel[] {
  const pixels: Pixel[] = [];
  let offsetX = 0;

  for (const char of word) {
    const glyph = font[char];
    if (!glyph) continue;
    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < glyph[row].length; col++) {
        if (glyph[row][col]) {
          const x = offsetX + col;
          const y = row;
          pixels.push({
            x,
            y,
            px: x * (CELL + GAP),
            py: y * (CELL + GAP),
          });
        }
      }
    }
    offsetX += glyph[0].length + LETTER_GAP;
  }

  return pixels;
}

export function PixelSignature() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [pixels] = useState(() => getPixels('NORTH'));

  const maxX = Math.max(...pixels.map((p) => p.x));
  const maxY = Math.max(...pixels.map((p) => p.y));
  const totalW = (maxX + 1) * (CELL + GAP);
  const totalH = (maxY + 1) * (CELL + GAP);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleLeave = useCallback(() => setMousePos(null), []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="flex flex-col items-center gap-8">
        <div
          ref={containerRef}
          className="relative cursor-crosshair"
          style={{ width: totalW, height: totalH }}
          onMouseMove={handleMouse}
          onMouseLeave={handleLeave}
        >
          {pixels.map((p, i) => {
            let glowScale = 1;
            let glowOpacity = 0.7;

            if (mousePos && mounted) {
              const dx = mousePos.x - (p.px + CELL / 2);
              const dy = mousePos.y - (p.py + CELL / 2);
              const dist = Math.sqrt(dx * dx + dy * dy);
              const radius = 50;
              if (dist < radius) {
                const proximity = 1 - dist / radius;
                glowScale = 1 + proximity * 0.6;
                glowOpacity = 0.7 + proximity * 0.3;
              }
            }

            return (
              <motion.span
                key={i}
                className="absolute block"
                style={{
                  width: CELL,
                  height: CELL,
                  left: p.px,
                  top: p.py,
                  backgroundColor: 'var(--accent)',
                  boxShadow:
                    mousePos && glowScale > 1
                      ? `0 0 ${Math.round((glowScale - 1) * 20)}px var(--accent)`
                      : 'none',
                  transform: `scale(${glowScale})`,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  inView
                    ? { opacity: glowOpacity, scale: glowScale }
                    : { opacity: 0, scale: 0 }
                }
                transition={{
                  duration: 0.25,
                  delay: inView ? 0.012 * i : 0,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            );
          })}
        </div>

        <motion.p
          className="text-sm text-[var(--text-muted)] tracking-[0.04em] text-center max-w-[320px] leading-[1.7] italic"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
        >
          &ldquo;Every journey starts with a single pixel.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
