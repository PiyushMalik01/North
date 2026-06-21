'use client';

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { mockPlayer } from '@/data/gameData';
import { container, item } from './cards/motion';
import { MissionHero } from './cards/MissionHero';
import { NorthRing } from './cards/NorthRing';
import { StreakCard } from './cards/StreakCard';
import { StatsRadar } from './cards/StatsRadar';
import { LearningCard } from './cards/LearningCard';
import { SwitcherPanel } from './cards/SwitcherPanel';
import { NorRail } from './rail/NorRail';

// Player name from onboarding, hydration-safe (server falls back to the mock).
const subscribeName = (cb: () => void) => useOnboardingStore.subscribe(cb);
const getName = () => useOnboardingStore.getState().data.name?.trim() || mockPlayer.name;
const getServerName = () => mockPlayer.name;

// Time-of-day greeting. useSyncExternalStore keeps it hydration-safe: the server
// renders a stable phrase, the client swaps in the time-based one after hydration.
const subscribeNoop = () => () => {};
const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'good morning' : h < 18 ? 'good afternoon' : 'good evening';
};
const getServerGreeting = () => 'welcome back';

/** nest — the home. Cinematic hero + identity bento + a persistent nor rail. */
export function NestHome() {
  const name = useSyncExternalStore(subscribeName, getName, getServerName);
  const greeting = useSyncExternalStore(subscribeNoop, getGreeting, getServerGreeting);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8"
    >
      <motion.p
        variants={item}
        className="mb-5 font-[family-name:var(--font-oswald)] text-lg font-semibold lowercase text-[var(--text-primary)]"
      >
        {greeting}, {name} <span className="text-[var(--text-muted)]">❄</span>
      </motion.p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* main bento */}
        <motion.div variants={container} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MissionHero />
          <NorthRing />
          <StreakCard />
          <StatsRadar />
          <LearningCard />
          <SwitcherPanel />
        </motion.div>

        {/* persistent right rail */}
        <motion.div variants={container}>
          <NorRail />
        </motion.div>
      </div>
    </motion.div>
  );
}
