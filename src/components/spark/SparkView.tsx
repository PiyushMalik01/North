'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy } from 'lucide-react';

import { CardLabel } from '@/components/nest/cards/Card';
import { container } from '@/components/nest/cards/motion';
import { QuestCard } from './QuestCard';
import { quests } from '@/data/platform/spark';
import type { QuestType } from '@/data/platform/spark';
import { useProgressStore } from '@/store/progressStore';

const SECTION_META: Record<QuestType, { label: string; Icon: React.ElementType }> = {
  daily: { label: 'daily', Icon: Flame },
  weekly: { label: 'weekly', Icon: Calendar },
  milestone: { label: 'milestones', Icon: Trophy },
};

const SECTION_ORDER: QuestType[] = ['daily', 'weekly', 'milestone'];

export function SparkView() {
  const questSteps = useProgressStore((s) => s.questSteps);
  const claimedQuestIds = useProgressStore((s) => s.claimedQuestIds);

  const claimableCount = quests.filter((q) => {
    const allDone = q.steps.every((step) => questSteps[`${q.id}:${step.id}`]);
    return allDone && !claimedQuestIds.includes(q.id);
  }).length;

  const totalXpAvailable = quests
    .filter((q) => !claimedQuestIds.includes(q.id))
    .reduce((sum, q) => sum + q.xp, 0);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
        className="mb-8"
      >
        <h1
          className="font-[family-name:var(--font-oswald)] text-4xl font-bold lowercase tracking-tight sm:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          spark
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          quests &amp; tasks — stay consistent, earn xp
        </p>
        <p className="mt-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
          {claimableCount > 0
            ? `${claimableCount} quest${claimableCount > 1 ? 's' : ''} ready to claim · ${totalXpAvailable} xp available`
            : totalXpAvailable > 0
              ? `${totalXpAvailable} xp available`
              : 'all quests claimed'}
        </p>
      </motion.div>

      {/* Sections */}
      <div className="flex flex-col gap-10">
        {SECTION_ORDER.map((type) => {
          const sectionQuests = quests.filter((q) => q.type === type);
          if (sectionQuests.length === 0) return null;
          const { label, Icon } = SECTION_META[type];

          return (
            <section key={type} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                <CardLabel>{label}</CardLabel>
              </div>

              <div className="flex flex-col gap-4">
                {sectionQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
}
