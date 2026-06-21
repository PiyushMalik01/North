'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, CalendarDays, FileText, Download, ClipboardCheck } from 'lucide-react';
import { Card, CardLabel } from '@/components/nest/cards/Card';
import { Bar } from '@/components/nest/cards/Bar';
import { container, item } from '@/components/nest/cards/motion';
import { cn } from '@/lib/utils';
import {
  subjects,
  timetable,
  pyqs,
  mockExams,
  gradePoints,
  type Subject,
} from '@/data/platform/chart';

// ── helpers ───────────────────────────────────────────────────────────────────

type TabId = 'subjects' | 'timetable' | 'pyqs' | 'mock';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

function computeGPA(subjectList: Subject[]): { gpa: string; totalCredits: number } {
  const graded = subjectList.filter((s) => s.grade !== undefined);
  if (graded.length === 0) return { gpa: '—', totalCredits: 0 };
  const totalCredits = subjectList.reduce((sum, s) => sum + s.credits, 0);
  const weightedPoints = graded.reduce((sum, s) => sum + (gradePoints[s.grade!] ?? 0) * s.credits, 0);
  const gradedCredits = graded.reduce((sum, s) => sum + s.credits, 0);
  return { gpa: (weightedPoints / gradedCredits).toFixed(2), totalCredits };
}

// ── sub-views ─────────────────────────────────────────────────────────────────

function SubjectsView() {
  const { gpa, totalCredits } = computeGPA(subjects);

  return (
    <div className="space-y-4">
      {/* GPA summary */}
      <Card>
        <div className="flex items-center gap-4">
          <GraduationCap
            size={28}
            style={{ color: 'var(--text-primary)', flexShrink: 0 }}
            strokeWidth={1.5}
          />
          <div>
            <CardLabel>current gpa</CardLabel>
            <p
              className="mt-0.5 font-[family-name:var(--font-oswald)] text-3xl font-bold leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              {gpa}
              <span
                className="ml-1.5 text-base font-normal"
                style={{ color: 'var(--text-secondary)' }}
              >
                / 10
              </span>
            </p>
          </div>
          <div className="ml-auto text-right">
            <CardLabel>total credits</CardLabel>
            <p
              className="mt-0.5 font-[family-name:var(--font-oswald)] text-2xl font-bold leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              {totalCredits}
            </p>
          </div>
        </div>
      </Card>

      {/* Subject rows */}
      <div className="space-y-2.5">
        {subjects.map((s) => (
          <motion.div key={s.id} variants={item}>
            <Card hover>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {s.name}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {s.code} · {s.credits} cr
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:w-56">
                  <div className="flex-1">
                    <Bar value={s.progress} height={5} />
                  </div>
                  <span
                    className="w-7 shrink-0 text-right text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {s.progress}%
                  </span>
                </div>

                {/* grade badge */}
                {s.grade ? (
                  <span
                    className="shrink-0 rounded-md px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {s.grade}
                  </span>
                ) : (
                  <span
                    className="shrink-0 rounded-md px-2.5 py-0.5 text-xs"
                    style={{
                      background: 'color-mix(in srgb, var(--text-muted) 15%, transparent)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    ongoing
                  </span>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TimetableView() {
  // build a map: day → sorted slots
  const byDay = DAYS.reduce<Record<string, typeof timetable>>((acc, d) => {
    acc[d] = timetable.filter((s) => s.day === d).sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {});

  return (
    <Card padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="border-b px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                  style={{
                    borderColor: 'var(--scene-card-border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* max 3 slots per day in mock data */}
            {[0, 1, 2].map((rowIdx) => (
              <tr key={rowIdx}>
                {DAYS.map((d) => {
                  const slot = byDay[d][rowIdx];
                  return (
                    <td
                      key={d}
                      className="border-b px-4 py-3 align-top"
                      style={{ borderColor: 'color-mix(in srgb, var(--scene-card-border) 50%, transparent)' }}
                    >
                      {slot ? (
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {slot.subject}
                          </p>
                          <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                            {slot.time} · {slot.room}
                          </p>
                        </div>
                      ) : (
                        <span style={{ color: 'color-mix(in srgb, var(--text-muted) 40%, transparent)' }}>
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PYQsView() {
  return (
    <div className="space-y-2.5">
      {pyqs.map((p) => (
        <motion.div key={p.id} variants={item}>
          <Card hover>
            <div className="flex items-center gap-3">
              <FileText
                size={18}
                strokeWidth={1.5}
                className="shrink-0"
                style={{ color: 'var(--text-muted)' }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {p.subject} · {p.year}
                </p>
              </div>
              <Link
                href="#"
                aria-label={`Download ${p.title}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                style={{
                  background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)',
                  color: 'var(--text-primary)',
                }}
              >
                <Download size={13} strokeWidth={1.5} />
                download
              </Link>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function MockView() {
  return (
    <div className="space-y-2.5">
      {mockExams.map((m) => (
        <motion.div key={m.id} variants={item}>
          <Card hover>
            <div className="flex items-center gap-3">
              <ClipboardCheck
                size={18}
                strokeWidth={1.5}
                className="shrink-0"
                style={{ color: 'var(--text-muted)' }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {m.subject} Mock
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {m.questions} Qs · {m.durationMin}m
                </p>
              </div>
              <Link
                href="/prove"
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{
                  background: 'color-mix(in srgb, var(--text-primary) 12%, transparent)',
                  color: 'var(--text-primary)',
                }}
              >
                start
              </Link>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// ── main view ─────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'subjects', label: 'subjects', icon: <GraduationCap size={14} strokeWidth={1.5} /> },
  { id: 'timetable', label: 'timetable', icon: <CalendarDays size={14} strokeWidth={1.5} /> },
  { id: 'pyqs', label: 'pyqs', icon: <FileText size={14} strokeWidth={1.5} /> },
  { id: 'mock', label: 'mock', icon: <ClipboardCheck size={14} strokeWidth={1.5} /> },
];

export function ChartView() {
  const [activeTab, setActiveTab] = useState<TabId>('subjects');

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-8"
    >
      {/* header */}
      <motion.div variants={item} className="mb-6">
        <h1
          className="font-[family-name:var(--font-oswald)] text-4xl font-bold lowercase leading-none sm:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          chart
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          plan your terms
        </p>
      </motion.div>

      {/* tab pills */}
      <motion.div variants={item} className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200',
              )}
              style={{
                borderColor: isActive
                  ? 'color-mix(in srgb, var(--text-primary) 60%, transparent)'
                  : 'var(--scene-card-border)',
                background: isActive
                  ? 'color-mix(in srgb, var(--text-primary) 10%, transparent)'
                  : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* tab content */}
      <motion.div key={activeTab} variants={container} initial="hidden" animate="show">
        {activeTab === 'subjects' && <SubjectsView />}
        {activeTab === 'timetable' && <TimetableView />}
        {activeTab === 'pyqs' && <PYQsView />}
        {activeTab === 'mock' && <MockView />}
      </motion.div>
    </motion.div>
  );
}
