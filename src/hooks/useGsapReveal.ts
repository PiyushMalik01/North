'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface GsapRevealOptions {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  duration?: number;
  delay?: number;
  scrollTrigger?: ScrollTrigger.Vars;
}

const DEFAULTS = {
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
  duration: 0.7,
  ease: 'power3.out',
};

export function useGsapReveal<T extends HTMLElement>(options: GsapRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { ...DEFAULTS.from, ...options.from },
        {
          ...DEFAULTS.to,
          ...options.to,
          duration: options.duration ?? DEFAULTS.duration,
          delay: options.delay ?? 0,
          ease: DEFAULTS.ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}
