'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Video,
  FileText,
  File,
  Link as LinkIcon,
  Dumbbell,
  CheckCircle2,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { useProgressStore } from '@/store/progressStore';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { Bar } from '@/components/nest/cards/Bar';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import type { MaterialType } from '@/data/platform/content';

function MaterialIcon({ type }: { type: MaterialType }) {
  const props = { size: 15, style: { color: 'var(--text-secondary)' }, strokeWidth: 1.75 };
  switch (type) {
    case 'video':    return <Video {...props} />;
    case 'article':  return <FileText {...props} />;
    case 'doc':      return <File {...props} />;
    case 'link':     return <LinkIcon {...props} />;
    case 'exercise': return <Dumbbell {...props} />;
  }
}

interface CourseDetailProps {
  id: string;
}

export function CourseDetail({ id }: CourseDetailProps) {
  const topics    = useContentStore((s) => s.topics);
  const courses   = useContentStore((s) => s.courses);
  const materials = useContentStore((s) => s.materials);

  const completedMaterialIds = useProgressStore((s) => s.completedMaterialIds);
  const completedCourseIds   = useProgressStore((s) => s.completedCourseIds);
  const toggleMaterial       = useProgressStore((s) => s.toggleMaterial);
  const completeCourse       = useProgressStore((s) => s.completeCourse);

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-base" style={{ color: 'var(--text-muted)' }}>
          course not found
        </p>
        <Link
          href="/trace"
          className="text-[13px] font-semibold underline-offset-4 hover:underline"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← trace
        </Link>
      </div>
    );
  }

  const topic    = topics.find((t) => t.id === course.topicId);
  const mats     = materials.filter((m) => m.courseId === id);
  const doneMats = mats.filter((m) => completedMaterialIds.includes(m.id)).length;
  const total    = mats.length;
  const pct      = total > 0 ? Math.round((doneMats / total) * 100) : 0;
  const isDone   = completedCourseIds.includes(id);
  const allDone  = total > 0 && doneMats === total;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* back */}
      <motion.div variants={item} className="mb-6">
        <Link
          href="/trace"
          className="inline-flex items-center gap-1.5 text-[13px] transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={13} />
          trace
        </Link>
      </motion.div>

      {/* header card */}
      <motion.div variants={item} className="mb-6">
        <Card>
          <div className="mb-1 flex items-center gap-2">
            {topic && (
              <CardLabel>{topic.name}</CardLabel>
            )}
            <span
              className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
              style={{
                background: 'color-mix(in srgb, var(--text-primary) 12%, transparent)',
                color: 'var(--text-secondary)',
              }}
            >
              {course.level}
            </span>
          </div>

          <h1
            className="mt-2 font-[family-name:var(--font-oswald)] text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.title}
          </h1>

          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {course.summary}
          </p>

          <div className="mt-4 flex items-center justify-between text-[12px]">
            <span style={{ color: 'var(--text-muted)' }}>
              {doneMats}/{total} completed
            </span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              +{course.xp} xp
            </span>
          </div>
          <div className="mt-2">
            <Bar value={pct} height={6} />
          </div>
        </Card>
      </motion.div>

      {/* materials list */}
      <motion.div variants={item} className="mb-5">
        <Card>
          <CardLabel className="mb-4">materials</CardLabel>
          {mats.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              No materials yet.
            </p>
          ) : (
            <ul className="flex flex-col divide-y" style={{ borderColor: 'color-mix(in srgb, var(--text-muted) 15%, transparent)' }}>
              {mats.map((m) => {
                const done = completedMaterialIds.includes(m.id);
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => toggleMaterial(m.id)}
                      className={cn(
                        'flex w-full items-center gap-3 py-3 text-left transition-opacity',
                        'hover:opacity-80',
                      )}
                    >
                      {/* checkbox */}
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
                        style={{
                          borderColor: done
                            ? 'var(--text-primary)'
                            : 'color-mix(in srgb, var(--text-muted) 50%, transparent)',
                          background: done ? 'var(--text-primary)' : 'transparent',
                        }}
                      >
                        {done && <Check size={11} style={{ color: 'var(--scene-bg)' }} strokeWidth={3} />}
                      </span>

                      {/* type icon */}
                      <MaterialIcon type={m.type} />

                      {/* title */}
                      <span
                        className="flex-1 text-[13px] leading-snug"
                        style={{
                          color: done ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {m.title}
                      </span>

                      {/* duration */}
                      <span className="shrink-0 text-[11px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {m.minutes}m
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </motion.div>

      {/* complete / prove actions */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-3">
        {isDone ? (
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold"
            style={{
              background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
              color: 'var(--text-muted)',
            }}
          >
            <CheckCircle2 size={15} />
            completed
          </div>
        ) : allDone ? (
          <button
            onClick={() => completeCourse(id, course.xp)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-85"
            style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}
          >
            complete course +{course.xp} xp
          </button>
        ) : null}

        {course.proveId && (
          <Link
            href={`/prove?a=${course.proveId}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            test yourself →
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
