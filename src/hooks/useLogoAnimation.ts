'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ANIMATION_CONFIG } from '@/config/animation.config';

const ANIMATION_KEY = 'north_logo_animated';

export const useLogoAnimation = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    if (!isLandingPage) {
      setShouldAnimate(false);
      return;
    }

    if (ANIMATION_CONFIG.animateOncePerSession) {
      // Only animate if not played this session
      const hasAnimated = sessionStorage.getItem(ANIMATION_KEY);
      if (!hasAnimated) {
        setShouldAnimate(true);
      }
    } else {
      // Animate on every reload
      setShouldAnimate(true);
    }
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
