'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useThemeStore } from '@/store/themeStore';
import { ANIMATION_CONFIG } from '@/config/animation.config';

interface AnimatedLogoProps {
  size: string;
  shouldAnimate?: boolean;
  onAnimationComplete?: () => void;
  forceDarkLogo?: boolean;
}

export const AnimatedLogo = ({ size, shouldAnimate = false, onAnimationComplete, forceDarkLogo = false }: AnimatedLogoProps) => {
  const logoWrapperRef = useRef<HTMLSpanElement>(null);
  const { theme } = useThemeStore();
  const useDarkLogo = forceDarkLogo || theme === 'dark';

  useEffect(() => {
    if (!shouldAnimate || !logoWrapperRef.current) return;

    const el = logoWrapperRef.current;

    // Disable any CSS transitions
    el.style.transition = 'none';
    el.style.transformOrigin = 'bottom center';
    el.style.display = 'inline-block';

    const keyframes: Keyframe[] = [
      { transform: 'translateX(-2.0em) translateY(-0.2em) rotate(0deg) scale(0)', offset: 0 },
      { transform: 'translateX(-2.0em) translateY(-0.2em) translateY(-0.2em) rotate(4deg) scale(0.2)', offset: 0.05 },
      { transform: 'translateX(-2.0em) translateY(-0.2em) rotate(8deg) scale(0.4)', offset: 0.1 },
      { transform: 'translateX(-2.0em) translateY(-0.2em)  rotate(0deg) scale(0.8)', offset: 0.15 },
      { transform: 'translateX(-2.0em) translateY(-0.2em) rotate(-10deg) scale(0.8)', offset: 0.2 },
      { transform: 'translateX(-2.0em) translateY(-0.2em) rotate(0deg) scale(0.8)', offset: 0.25 },
      { transform: 'translateX(-1.8em) translateY(-0.2em) rotate(10deg) scale(0.8)', offset: 0.3 },
      { transform: 'translateX(-1.6em) translateY(-0.2em) rotate(0deg) scale(0.8)', offset: 0.35 },
      { transform: 'translateX(-1.4em) translateY(-0.2em) rotate(-10deg) scale(0.8)', offset: 0.4 },
      { transform: 'translateX(-1.2em) translateY(-0.2em) rotate(-2deg) scale(0.8)', offset: 0.45 },
      { transform: 'translateX(-1em) translateY(-0.2em) rotate(8deg) scale(0.8)', offset: 0.5 },
      { transform: 'translateX(-0.85em) translateY(-0.2em) rotate(0deg) scale(0.8)', offset: 0.55 },
      { transform: 'translateX(-0.7em) translateY(-0.2em) rotate(-8deg) scale(0.8)', offset: 0.6 },
      { transform: 'translateX(-0.575em) translateY(-0.2em) rotate(-2deg) scale(0.8)', offset: 0.65 },
      { transform: 'translateX(-0.45em)translateY(-0.2em)  rotate(6deg) scale(0.8)', offset: 0.7 },
      { transform: 'translateX(-0.35em) translateY(-0.2em) rotate(2deg) scale(0.85)', offset: 0.75 },
      { transform: 'translateX(-0.25em) translateY(-0.1em) rotate(-4deg) scale(0.9)', offset: 0.8 },
      { transform: 'translateX(-0.175em) translateY(-0.1em) rotate(-2deg) scale(0.93)', offset: 0.85 },
      { transform: 'translateX(-0.1em)  rotate(2deg) scale(0.95)', offset: 0.9 },
      { transform: 'translateX(-0.05em)  rotate(1deg) scale(0.97)', offset: 0.95 },
      { transform: 'translateX(-0.01em)  rotate(0deg) scale(0.99)', offset: 0.98 },
      { transform: 'translateX(0) rotate(0deg) scale(1)', offset: 1 },
    ];

    const animation = el.animate(keyframes, {
      duration: ANIMATION_CONFIG.duration,
      easing: ANIMATION_CONFIG.easing,
      fill: 'forwards',
    });

    animation.onfinish = () => {
      onAnimationComplete?.();
    };

    return () => {
      animation.cancel();
    };
  }, [shouldAnimate, onAnimationComplete]);

  return (
    <span ref={logoWrapperRef} className="inline-block select-none">
      <Image
        src={useDarkLogo ? '/images/dark_themelogo.svg' : '/images/light_themelogo.svg'}
        alt="North Logo"
        width={100}
        height={100}
        className={`${size} h-auto relative z-0`}
        draggable={false}
        priority
      />
    </span>
  );
};
