'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { useProgressStore } from '@/store/progressStore';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { Bar } from '@/components/nest/cards/Bar';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import type { Roadmap } from '@/data/platform/content';

type Tab = 'roadmaps' | 'courses';

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'color-mix(in srgb, #22c55e 70%, transparent)',
  intermediate: 'color-mix(in srgb, #f59e0b 70%, transparent)',
  advanced: 'color-mix(in srgb, #ef4444 70%, transparent)',
};

function TabToggle({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div
      className="inline-flex gap-1 rounded-full p-1"
      style={{ background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)' }}
    >
      {(['roadmaps', 'courses'] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-200',
            'font-[family-name:var(--font-oswald)] lowercase tracking-wide',
          )}
          style={
            active === t
              ? { background: 'var(--text-primary)', color: 'var(--scene-bg)' }
              : { color: 'var(--text-secondary)' }
          }
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const courses = useContentStore((s) => s.courses);
  const completedCourseIds = useProgressStore((s) => s.completedCourseIds);

  const total = roadmap.steps.length;
  const doneCount = roadmap.steps.filter((st) => completedCourseIds.includes(st.courseId)).length;
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const firstNotDone = roadmap.steps.find((st) => !completedCourseIds.includes(st.courseId))?.courseId;

  return (
    <motion.div variants={item}>
      <Card hover>
        <CardLabel className="mb-2">{roadmap.title}</CardLabel>
        <p className="mb-4 text-[13px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
          {roadmap.blurb}
        </p>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {doneCount}/{total} courses
          </span>
          <span className="text-[11px] font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {progressPct}%
          </span>
        </div>
        <Bar value={progressPct} height={5} />

        <ol className="mt-4 flex flex-col gap-2">
          {roadmap.steps.map((step, i) => {
            const course = courses.find((c) => c.id === step.courseId);
            const done = completedCourseIds.includes(step.courseId);
            const available = !done && step.courseId === firstNotDone;
            const upcoming = !done && !available;

            return (
              <li key={step.courseId}>
                <Link
                  href={`/trace/course/${step.courseId}`}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-opacity',
                    upcoming ? 'opacity-40' : 'hover:opacity-80',
                  )}
                >
                  <span className="shrink-0">
                    {done ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--text-primary)' }} />
                    ) : available ? (
                      <Circle size={14} style={{ color: 'var(--text-primary)' }} strokeWidth={2.5} />
                    ) : (
                      <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </span>
                  <span
                    style={{
                      color: done ? 'var(--text-muted)' : available ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textDecoration: done ? 'line-through' : 'none',
                    }}
                  >
                    {i + 1}. {course?.title ?? step.courseId}
                    {step.note && (
                      <span className="ml-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        — {step.note}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Card>
    </motion.div>
  );
}

function CourseCatalog() {
  const topics = useContentStore((s) => s.topics);
  const courses = useContentStore((s) => s.courses);
  const materials = useContentStore((s) => s.materials);
  const completedMaterialIds = useProgressStore((s) => s.completedMaterialIds);
  const completedCourseIds = useProgressStore((s) => s.completedCourseIds);

  return (
    <div className="flex flex-col gap-8">
      {topics.map((topic) => {
        const topicCourses = courses.filter((c) => c.topicId === topic.id);
        if (topicCourses.length === 0) return null;
        return (
          <div key={topic.id}>
            <div className="mb-3">
              <CardLabel className="mb-0.5">{topic.name}</CardLabel>
              <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                {topic.blurb}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topicCourses.map((course) => {
                const mats = materials.filter((m) => m.courseId === course.id);
                const doneMats = mats.filter((m) => completedMaterialIds.includes(m.id)).length;
                const pct = mats.length > 0 ? Math.round((doneMats / mats.length) * 100) : 0;
                const done = completedCourseIds.includes(course.id);
                return (
                  <motion.div key={course.id} variants={item}>
                    <Link href={`/trace/course/${course.id}`} className="block h-full">
                      <Card hover className="h-full">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
                            style={{ background: LEVEL_COLOR[course.level], color: 'var(--text-primary)' }}
                          >
                            {course.level}
                          </span>
                          {done && <CheckCircle2 size={15} style={{ color: 'var(--text-primary)' }} />}
                        </div>
                        <p
                          className="mt-2 text-[15px] font-semibold leading-snug font-[family-name:var(--font-oswald)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {course.title}
                        </p>
                        <p className="mt-1 text-[12px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          {course.summary}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          <span>{mats.length} materials</span>
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            +{course.xp} xp
                          </span>
                        </div>
                        <div className="mt-2">
                          <Bar value={pct} height={4} />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TraceView() {
  const [tab, setTab] = useState<Tab>('roadmaps');
  const roadmaps = useContentStore((s) => s.roadmaps);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8"
    >
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1
            className="font-[family-name:var(--font-oswald)] text-5xl font-bold lowercase leading-none sm:text-6xl"
            style={{ color: 'var(--text-primary)' }}
          >
            trace
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            the route north
          </p>
        </div>
        <TabToggle active={tab} onChange={setTab} />
      </div>

      {tab === 'roadmaps' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((rm) => (
            <RoadmapCard key={rm.id} roadmap={rm} />
          ))}
        </div>
      ) : (
        <CourseCatalog />
      )}
    </motion.div>
  );
}
