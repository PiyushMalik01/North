'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Enable transitions after initial mount
    root.style.removeProperty('--disable-transitions');
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    if (theme === 'light') {
      root.classList.add('light');
    }
  }, [theme]);

  return <>{children}</>;
}
