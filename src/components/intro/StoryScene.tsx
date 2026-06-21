'use client';

import { motion } from 'framer-motion';
import type { StoryScene as Scene } from '@/data/storyScript';

interface StorySceneProps {
  scene: Scene;
  reduced: boolean;
  /** The final scene composes its own closing text + CTA, so hide the auto caption. */
  showCaption?: boolean;
}

/**
 * One full-bleed scene: the artwork fills the whole screen (object-cover, no bars)
 * for an immersive, game-cinematic feel. A gentle Ken Burns drift gives it life;
 * a bottom scrim keeps the subtitle legible.
 */
export function StoryScene({ scene, reduced, showCaption = true }: StorySceneProps) {
  const dur = scene.dwellMs / 1000 + 1.2;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* The artwork, full-bleed (object-cover) + slow Ken Burns */}
      <motion.img
        src={scene.src}
        alt={scene.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduced ? false : { scale: 1.04, x: '0%', y: '0%' }}
        animate={reduced ? { scale: 1.04 } : { scale: scene.kb.scale + 0.04, x: `${scene.kb.x}%`, y: `${scene.kb.y}%` }}
        transition={{ duration: reduced ? 0 : dur, ease: 'linear' }}
      />

      {/* Legibility scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Subtitle */}
      {showCaption && (
      <div className="absolute inset-x-0 bottom-[14vh] flex justify-center px-6 sm:bottom-[16vh]">
        <div className="max-w-2xl text-center">
          {scene.lines.map((line, i) => (
            <motion.p
              key={i}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.45 + i * 0.5, duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
              className="text-balance text-lg leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl md:text-[26px]"
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
