'use client';

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { PixelGrid } from '@/components/landing/PixelGrid';
import { useOnboardingStore } from '@/store/onboardingStore';
import { mockPlayer } from '@/data/gameData';

// Pull the name the player entered in onboarding, hydration-safe: the server
// snapshot is the mock fallback, so SSR and the first client render agree, then
// the real name swaps in after the persisted store rehydrates.
const subscribeName = (cb: () => void) => useOnboardingStore.subscribe(cb);
const getName = () => useOnboardingStore.getState().data.name?.trim() || mockPlayer.name;
const getServerName = () => mockPlayer.name;
import { PlayerBanner } from './PlayerBanner';
import { NorConsole } from './NorConsole';
import { QuestPanel } from './QuestPanel';
import { SkillMapPanel } from './SkillMapPanel';
import { AttributesPanel } from './AttributesPanel';

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.4, ease: [0.2, 0.7, 0.3, 1] as const },
  }),
};

/** The home base — a full-screen game HUD that replaces the old dashboard. */
export function GameHome() {
  const name = useSyncExternalStore(subscribeName, getName, getServerName);
  const player = { ...mockPlayer, name };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--background)]">
      <PixelGrid />
      <div className="pixel-grid-overlay" />

      <div className="relative z-[2] mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Wordmark + north star objective */}
        <div className="mb-5 flex items-center justify-between">
          <span className="font-[family-name:var(--font-oswald)] text-lg font-bold uppercase tracking-[0.3em] text-[var(--text-primary)]">
            North
          </span>
          <span className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] sm:flex">
            <span aria-hidden="true">&#9656;</span> north star: {player.northStar}
          </span>
        </div>

        <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
          <PlayerBanner player={player} />
        </motion.div>

        {/* Mobile north-star line */}
        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)] sm:hidden">
          <span aria-hidden="true">&#9656;</span> north star: {player.northStar}
        </p>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <motion.div variants={rise} initial="hidden" animate="show" custom={1}>
              <NorConsole norLine={player.norLine} skill={player.activeSkill} />
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={rise} initial="hidden" animate="show" custom={2}>
                <QuestPanel quest={player.activeQuest} className="h-full" />
              </motion.div>
              <motion.div variants={rise} initial="hidden" animate="show" custom={3}>
                <SkillMapPanel
                  completed={player.skillsCompleted}
                  total={player.skillsTotal}
                  className="h-full"
                />
              </motion.div>
            </div>
          </div>

          <motion.div variants={rise} initial="hidden" animate="show" custom={2}>
            <AttributesPanel attributes={player.attributes} className="h-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
