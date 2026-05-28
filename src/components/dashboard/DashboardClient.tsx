'use client';

import { Hero } from './Hero';
import { StatsStrip } from './StatsStrip';
import { ActiveQuestCard } from './ActiveQuestCard';
import { CurrentlyLearningCard } from './CurrentlyLearningCard';
import { Pulse } from './Pulse';
import { mockUserState, mockPulseItems } from '@/data/dashboardData';

export function DashboardClient() {
  const state = mockUserState;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 lg:px-10 py-8 lg:py-12">
      <div className="space-y-8 lg:space-y-12">
        <Hero state={state} />

        <StatsStrip state={state} />

        <div className="grid gap-4 lg:gap-5 sm:grid-cols-2">
          <ActiveQuestCard quest={state.activeQuest} />
          <CurrentlyLearningCard skill={state.activeSkill} />
        </div>

        <Pulse items={mockPulseItems} treeName={state.treeName} />
      </div>
    </div>
  );
}
