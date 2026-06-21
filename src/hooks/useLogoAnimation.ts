'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ANIMATION_CONFIG } from '@/config/animation.config';

const ANIMATION_KEY = 'north_logo_animated';

export const useLogoAnimation = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  // Derive animation state synchronously at render time instead of in an effect
  const [prevIsLandingPage, setPrevIsLandingPage] = useState(isLandingPage);
  if (prevIsLandingPage !== isLandingPage) {
    setPrevIsLandingPage(isLandingPage);
    if (!isLandingPage) {
      setShouldAnimate(false);
    }
  }

  useEffect(() => {
    if (!isLandingPage) return;

    // Defer setState to avoid synchronous setState-in-effect lint error
    const raf = requestAnimationFrame(() => {
      if (ANIMATION_CONFIG.animateOncePerSession) {
        const hasAnimated = sessionStorage.getItem(ANIMATION_KEY);
        if (!hasAnimated) {
          setShouldAnimate(true);
        }
      } else {
        setShouldAnimate(true);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [isLandingPage]);

  const markAnimationComplete = () => {
    if (ANIMATION_CONFIG.animateOncePerSession) {
      sessionStorage.setItem(ANIMATION_KEY, 'true');
    }
    setShouldAnimate(false);
  };

  return {
    shouldAnimate,
    markAnimationComplete,
  };
};
