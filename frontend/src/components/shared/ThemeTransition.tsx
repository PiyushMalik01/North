'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeTransition() {
  const [isAnimating, setIsAnimating] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const handleTransition = () => {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 900);
      return () => clearTimeout(timer);
    };

    window.addEventListener('trigger-theme-transition', handleTransition);
    return () => window.removeEventListener('trigger-theme-transition', handleTransition);
  }, []);

  if (!isAnimating) return null;

  return (
    <>
      <div
        className="fixed top-0 right-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: '200vmax',
          height: '200vmax',
          background: theme === 'light' ? '#FFFFFF' : '#0D1117',
          animation: 'ripple-expand 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}
      />
      <style jsx>{`
        @keyframes ripple-expand {
          from {
            transform: translate(50%, -50%) scale(0);
            opacity: 1;
          }
          to {
            transform: translate(50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
