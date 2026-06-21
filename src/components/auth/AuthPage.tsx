'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedLogo } from '@/components/shared/AnimatedLogo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

const quotes = [
  { text: 'Direction is more important than speed.', author: null },
  { text: 'You don\'t need more courses. You need a map.', author: 'North' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'A degree says where you\'ve been. A skill profile says what you can do.', author: null },
];

interface AuthPageProps {
  initialMode: 'login' | 'signup';
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginFields, setLoginFields] = useState({ email: '', password: '' });
  const [signupFields, setSignupFields] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const switchMode = useCallback((newMode: 'login' | 'signup') => {
    if (mode === 'login' && newMode === 'signup') {
      setSignupFields((prev) => ({ ...prev, email: loginFields.email || prev.email }));
    } else if (mode === 'signup' && newMode === 'login') {
      setLoginFields((prev) => ({ ...prev, email: signupFields.email || prev.email }));
    }
    setShowPassword(false);
    setMode(newMode);
  }, [mode, loginFields.email, signupFields.email]);

  const isLogin = mode === 'login';

  const updateField = (field: string, value: string) => {
    if (isLogin) {
      setLoginFields((prev) => ({ ...prev, [field]: value }));
    } else {
      setSignupFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  const email = isLogin ? loginFields.email : signupFields.email;
  const password = isLogin ? loginFields.password : signupFields.password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isLogin) {
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res?.error) {
          setError('Invalid email or password.');
          return;
        }
        router.push('/dashboard');
        router.refresh();
      } else {
        const r = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: signupFields.name, email, password }),
        });
        const data = await r.json();
        if (!r.ok) {
          setError(data.error ?? 'Could not create account.');
          return;
        }
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res?.error) {
          setError('Account created — please log in.');
          switchMode('login');
          return;
        }
        router.push('/onboarding');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col px-6 sm:px-12 lg:px-20 py-8">
        {/* Top bar — logo + theme toggle */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center font-semibold text-[var(--text-primary)] font-[family-name:var(--font-oswald)] tracking-wider text-lg group"
          >
            <AnimatedLogo size="w-7" />
            <span className="relative -ml-[0.4em] z-10">NORTH</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form area — vertically centered */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[380px] mx-auto">
            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: isLogin ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 16 : -16 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <h1 className="text-[1.625rem] font-semibold text-[var(--text-primary)] tracking-[-0.02em] leading-[1.2]">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {isLogin
                    ? 'Pick up where you left off.'
                    : 'Start building your skill profile today.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form className="mt-7" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1], delay: 0.04 }}
                  className="space-y-4"
                >
                  {/* Name — signup only */}
                  {!isLogin && (
                    <FieldBlock label="Full name">
                      <input
                        type="text"
                        placeholder="What should we call you?"
                        value={signupFields.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        autoComplete="name"
                        className={inputClass}
                      />
                    </FieldBlock>
                  )}

                  {/* Email */}
                  <FieldBlock label="Email">
                    <input
                      type="email"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => updateField('email', e.target.value)}
                      autoComplete="email"
                      className={inputClass}
                    />
                  </FieldBlock>

                  {/* Password */}
                  <FieldBlock
                    label="Password"
                    trailing={isLogin ? (
                      <button type="button" className="text-xs text-[var(--accent-text)] hover:text-[var(--accent)] transition-colors">
                        Forgot?
                      </button>
                    ) : undefined}
                  >
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isLogin ? '••••••••' : 'Min. 8 characters'}
                        value={password}
                        onChange={(e) => updateField('password', e.target.value)}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        className={cn(inputClass, 'pr-10')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </FieldBlock>

                  {/* Error */}
                  {error && (
                    <p className="text-sm text-red-500" role="alert">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                      'w-full h-10 rounded-lg text-sm font-medium mt-2',
                      'bg-[var(--accent)] text-[var(--accent-fg)]',
                      'hover:bg-[var(--accent-hover)]',
                      'transition-all duration-150 active:translate-y-px',
                      'flex items-center justify-center group',
                      'disabled:opacity-60 disabled:pointer-events-none'
                    )}
                  >
                    {submitting ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
                    <svg className="w-4 h-4 ml-1.5 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Divider */}
              <div className="flex items-center gap-3 mt-6">
                <div className="flex-1 h-px bg-[var(--border-color)]" />
                <span className="text-xs text-[var(--text-muted)]">or</span>
                <div className="flex-1 h-px bg-[var(--border-color)]" />
              </div>

              {/* Social */}
              <div className="mt-4 flex gap-3">
                <SocialButton
                  icon={<GoogleIcon />}
                  label="Google"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                />
                <SocialButton
                  icon={<GitHubIcon />}
                  label="GitHub"
                  onClick={() => setError('GitHub sign-in isn’t enabled yet — use email or Google.')}
                />
              </div>
            </form>

            {/* Switch mode */}
            <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                className="text-[var(--accent-text)] hover:text-[var(--accent)] font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right — Image + Quote panel (desktop only) */}
      <div className="hidden lg:flex w-[44%] relative overflow-hidden">
        {/* Bird image as full background */}
        <Image
          src="/images/stand-out.jpg"
          alt="One yellow bird standing out among dark birds"
          fill
          sizes="44vw"
          className="object-cover"
          quality={85}
          priority
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Pixel corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--accent)]" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent)]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-[var(--accent)]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--accent)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top label */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-white/60">North</span>
          </div>

          {/* Quote over image */}
          <div className="flex-1 flex items-end pb-8">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quoteIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-[340px]"
              >
                <p className="text-xl font-medium text-white leading-[1.45] tracking-[-0.01em]">
                  &ldquo;{quotes[quoteIndex].text}&rdquo;
                </p>
                {quotes[quoteIndex].author && (
                  <footer className="mt-3.5 text-sm text-white/50">
                    — {quotes[quoteIndex].author}
                  </footer>
                )}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Dot indicator */}
          <div className="flex gap-1.5">
            {quotes.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  i === quoteIndex ? 'w-5 bg-[var(--accent)]' : 'w-1 bg-white/30'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

const inputClass = cn(
  'w-full h-10 px-3 rounded-lg text-sm',
  'bg-[var(--surface-1)] border border-[var(--border-color)]',
  'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
  'focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20',
  'transition-colors duration-150'
);

function FieldBlock({ label, trailing, children }: { label: string; trailing?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-[var(--text-secondary)] tracking-[0.02em]">{label}</label>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 h-10 rounded-lg text-sm font-medium',
        'bg-[var(--surface-1)] border border-[var(--border-color)]',
        'text-[var(--text-primary)]',
        'hover:bg-[var(--surface-2)] hover:border-[var(--border-hover)]',
        'transition-all duration-150 active:translate-y-px',
        'flex items-center justify-center gap-2'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
