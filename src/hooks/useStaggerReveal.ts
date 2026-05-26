'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface StaggerRevealOptions {
  childSelector?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  duration?: number;
  start?: string;
}

export function useStaggerReveal<T extends HTMLElement>(options: StaggerRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const children = container.querySelectorAll(options.childSelector ?? ':scope > *');
      gsap.set(children, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const children = gsap.utils.toArray(
        container.querySelectorAll(options.childSelector ?? ':scope > *')
      );

      gsap.fromTo(
        children,
        { opacity: 0, y: 40, ...options.from },
        {
          opacity: 1,
          y: 0,
          ...options.to,
          duration: options.duration ?? 0.6,
          stagger: options.stagger ?? 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: options.start ?? 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}
