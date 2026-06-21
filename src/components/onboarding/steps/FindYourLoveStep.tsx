'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { LOVE_CARDS } from '@/data/onboardingData';
import { PixelHeart } from '@/components/onboarding/PixelHeart';

interface FindYourLoveStepProps {
  onNext: () => void;
}

const SWIPE_THRESHOLD = 110;

const FLOAT_STYLES = `
  @keyframes love-rise { 0% { transform: translateY(0) scale(.8); opacity: 0 }
    14% { opacity: .5 } 100% { transform: translateY(-380px) scale(1); opacity: 0 } }
  .love-float { position:absolute; bottom:-20px; color:#ff5d8f; animation-name: love-rise;
    animation-timing-function: linear; animation-iteration-count: infinite; }
`;

const FLOATS = [
  { left: '12%', size: 16, dur: '9s', delay: '0s' },
  { left: '32%', size: 11, dur: '11s', delay: '2s' },
  { left: '54%', size: 20, dur: '8s', delay: '1s' },
  { left: '74%', size: 14, dur: '10.5s', delay: '3s' },
  { left: '88%', size: 12, dur: '9.5s', delay: '.6s' },
];

export function FindYourLoveStep({ onNext }: FindYourLoveStepProps) {
  const { recordLove } = useOnboardingStore();
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState<'left' | 'right'>('right');
  const lock = useRef(false);
  const doneRef = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-11, 11]);
  const opacity = useTransform(x, [-200, -70, 0, 70, 200], [0, 1, 1, 1, 0]);

  const total = LOVE_CARDS.length;
  const card = LOVE_CARDS[index];

  const commit = useCallback(
    (dir: 'left' | 'right') => {
      if (lock.current || index >= total) return;
      lock.current = true;
      setExitDir(dir);
      recordLove(LOVE_CARDS[index].id, dir === 'right');
      setIndex((i) => i + 1);
      x.set(0);
      setTimeout(() => {
        lock.current = false;
      }, 220);
    },
    [index, total, recordLove, x],
  );

  // Advance to next step once the deck is cleared.
  useEffect(() => {
    if (index >= total && !doneRef.current) {
      doneRef.current = true;
      const t = setTimeout(onNext, 450);
      return () => clearTimeout(t);
    }
  }, [index, total, onNext]);

  return (
    <div
      className="relative w-full max-w-md mx-auto h-full flex flex-col items-center overflow-hidden rounded-3xl"
      style={{ background: 'radial-gradient(130% 100% at 50% -10%, #3a1730 0%, #1a0c15 55%, #120810 100%)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: FLOAT_STYLES }} />

      {/* floating pixel hearts */}
      {FLOATS.map((f, i) => (
        <span
          key={i}
          className="love-float"
          style={{ left: f.left, animationDuration: f.dur, animationDelay: f.delay }}
        >
          <PixelHeart size={f.size} />
        </span>
      ))}

      {/* Heading */}
      <div className="relative z-10 text-center pt-7 px-4">
        <h2 className="font-[family-name:var(--font-oswald)] text-2xl md:text-3xl font-semibold tracking-wide text-[#ffdbe7]">
          let&rsquo;s find your <span className="text-[#ff5d8f]">love</span>
        </h2>
        <p className="text-[#e7a9c0] text-xs mt-2">
          swipe right if you&rsquo;d fall for it, left if it&rsquo;s a no.
        </p>
        <div className="flex gap-1.5 justify-center mt-3.5">
          {LOVE_CARDS.map((_, i) => (
            <PixelHeart
              key={i}
              size={13}
              className={i < index ? 'text-[#ff5d8f]' : 'text-[#ff5d8f]/20'}
            />
          ))}
        </div>
      </div>

      {/* Deck */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center px-6">
        {/* peek card behind */}
        {index + 1 < total && (
          <div className="absolute w-[78%] max-w-[320px] h-[58%] rounded-3xl bg-[#1c1019] border border-[#43273a] rotate-3 translate-y-2 scale-95" />
        )}

        <AnimatePresence custom={exitDir} mode="popLayout">
          {card && (
            <motion.div
              key={card.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > SWIPE_THRESHOLD) commit('right');
                else if (info.offset.x < -SWIPE_THRESHOLD) commit('left');
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -2 }}
              exit={{ x: exitDir === 'right' ? 420 : -420, opacity: 0, transition: { duration: 0.22 } }}
              className={cn(
                'relative w-[80%] max-w-[330px] rounded-3xl px-6 py-8 cursor-grab active:cursor-grabbing select-none',
                'flex flex-col items-center text-center justify-center min-h-[230px]',
                'border border-[#5c3149] shadow-[0_20px_55px_rgba(0,0,0,0.5)]',
              )}
              style={{ x, rotate, opacity, background: 'linear-gradient(165deg,#241019,#1a0c14)' }}
            >
              <PixelHeart size={30} className="text-[#ff5d8f]/90 mb-4" />
              <p className="font-[family-name:var(--font-oswald)] text-xl md:text-2xl text-white leading-snug">
                {card.statement}
              </p>
              <p className="text-[11px] text-[#caa3b6] mt-4 tracking-wide">does this one get you?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {card && (
        <div className="relative z-10 flex items-center gap-7 pb-7">
          <button
            type="button"
            onClick={() => commit('left')}
            className="w-14 h-14 rounded-full border-2 border-[#5c3149] bg-[#1a0c14] text-[#caa3b6] text-xs tracking-wide hover:-translate-y-0.5 transition-transform cursor-pointer"
            aria-label="Not for me"
          >
            nope
          </button>
          <button
            type="button"
            onClick={() => commit('right')}
            className="w-14 h-14 rounded-full bg-[#ff5d8f] text-[#1a0c14] flex items-center justify-center hover:-translate-y-0.5 transition-transform cursor-pointer"
            aria-label="Love it"
          >
            <PixelHeart size={26} />
          </button>
        </div>
      )}
    </div>
  );
}
