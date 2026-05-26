'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { AnimatedLogo } from './AnimatedLogo';
import { useLogoAnimation } from '@/hooks/useLogoAnimation';

const navLinks = [
  { name: 'Features', href: '/#features' },
  { name: 'Blog', href: '/blog' },
  { name: 'CodeSpaces', href: '/codespaces' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { shouldAnimate, markAnimationComplete } = useLogoAnimation();
  const isPlatform = pathname?.startsWith('/codespaces') || pathname?.startsWith('/dashboard');
  const isLanding = pathname === '/' || pathname === '/blog';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showPill = scrolled && isLanding && !isPlatform;

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50',
      !scrolled && isLanding && 'nav-over-hero'
    )}>
      {/* Full-width background layer */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-500',
          !showPill && (scrolled || isPlatform)
            ? 'bg-[var(--background)]/85 backdrop-blur-xl border-b border-[var(--border-color)] opacity-100'
            : 'opacity-0'
        )}
      />

      <div
        className={cn(
          'relative mx-auto flex items-center justify-between',
          'transition-[max-width,padding,height,margin,border-radius,background-color,box-shadow,border-color,backdrop-filter] duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          'border border-transparent',
          showPill
            ? 'mt-3 max-w-2xl px-5 h-12 rounded-full bg-[var(--background)]/70 backdrop-blur-xl !border-[var(--border-hover)] shadow-lg shadow-black/5'
            : 'max-w-[1200px] px-6 md:px-12 h-14 rounded-none'
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center font-semibold text-[var(--text-primary)] font-[family-name:var(--font-oswald)] tracking-wider"
        >
          <AnimatedLogo
            size={showPill ? 'w-[1.5em]' : 'w-[2em]'}
            shouldAnimate={shouldAnimate}
            onAnimationComplete={markAnimationComplete}
          />
          <span className={cn(
            'relative z-10 transition-all duration-[600ms]',
            showPill ? '-ml-[0.35em] text-base' : '-ml-[0.5em] text-lg'
          )}>
            NORTH
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <AnimatePresence>
            {!showPill && navLinks.map((link) => (
              <motion.div
                key={link.name}
                initial={false}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm font-medium text-[var(--text-primary)]/80 hover:text-[var(--text-primary)]',
                    'transition-colors duration-150 whitespace-nowrap'
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {!showPill && <div className="w-px h-4 bg-[var(--border-color)]" />}

          <Link
            href="/login"
            className={cn(
              'text-sm font-medium text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]',
              'transition-all duration-[400ms]',
              showPill && 'text-xs'
            )}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(
              'font-medium bg-[var(--accent)] text-[var(--accent-fg)]',
              'hover:bg-[var(--accent-hover)]',
              'transition-all duration-[400ms] inline-flex items-center group',
              showPill ? 'h-7 px-3 text-xs rounded-full' : 'h-8 px-4 text-sm rounded-lg'
            )}
          >
            Sign Up
            <svg className="w-3.5 h-3.5 ml-1 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile burger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden border-t border-[var(--border-color)] bg-[var(--background)]/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-[var(--border-color)] my-2" />
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-[var(--text-secondary)]">
                Log in
              </Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-[var(--accent-text)]">
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
