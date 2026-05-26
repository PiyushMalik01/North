'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface TextRevealOptions {
  delay?: number;
  stagger?: number;
  duration?: number;
  scrollTriggered?: boolean;
}

export function useTextReveal<T extends HTMLElement>(options: TextRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const text = el.textContent ?? '';
    el.innerHTML = '';
    el.style.opacity = '1';

    const spans: HTMLSpanElement[] = [];
    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? ' ' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      el.appendChild(span);
      spans.push(span);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: options.delay ?? 0.2,
        ...(options.scrollTriggered
          ? {
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          : {}),
      });

      tl.fromTo(
        spans,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.04,
          stagger: options.stagger ?? 0.02,
          ease: 'power3.out',
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}
