'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, FileText, Notebook, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CurriculumLesson, LessonKind } from '@/data/curriculum';

interface LessonListProps {
  lessons: CurriculumLesson[];
}

const kindIcon: Record<LessonKind, typeof BookOpen> = {
  read: FileText,
  watch: PlayCircle,
  doc: BookOpen,
  note: Notebook,
};

const kindLabel: Record<LessonKind, string> = {
  read: 'Read',
  watch: 'Watch',
  doc: 'Doc',
  note: 'Note',
};

export function LessonList({ lessons }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Lessons coming soon for this skill.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {lessons.map((lesson, i) => {
        const Icon = kindIcon[lesson.kind];
        const isExternal = !!lesson.url;
        const Wrapper = (props: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) =>
          isExternal ? (
            <a
              href={lesson.url}
              target="_blank"
              rel="noreferrer noopener"
              className={props.className}
            >
              {props.children}
            </a>
          ) : (
            <div className={props.className}>{props.children}</div>
          );

        return (
          <motion.li
            key={lesson.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Wrapper
              className={cn(
                'group flex items-start gap-4',
                'rounded-lg px-4 py-3.5',
                'border border-[var(--border-color)]',
                isExternal && 'hover:border-[var(--border-hover)] hover:bg-[var(--surface-1)]',
                'transition-colors duration-150',
              )}
            >
              {/* Index */}
              <div
                className={cn(
                  'shrink-0 mt-0.5 w-6 h-6 rounded-md',
                  'flex items-center justify-center',
                  'bg-[var(--surface-2)] text-[var(--text-muted)]',
                  'text-[11px] font-mono tabular-nums',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                    {lesson.title}
                  </p>
                  {isExternal && (
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2}
                      className={cn(
                        'shrink-0 mt-0.5',
                        'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]',
                        'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                        'transition-all duration-200',
                      )}
                    />
                  )}
                </div>
                {lesson.body && (
                  <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {lesson.body}
                  </p>
                )}
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                  <Icon size={11} strokeWidth={2} />
                  <span>{kindLabel[lesson.kind]}</span>
                  <span className="opacity-50">·</span>
                  <span className="tabular-nums">{lesson.estimatedMinutes} min</span>
                  {lesson.source && (
                    <>
                      <span className="opacity-50">·</span>
                      <span className="truncate">{lesson.source}</span>
                    </>
                  )}
                </div>
              </div>
            </Wrapper>
          </motion.li>
        );
      })}
    </ol>
  );
}
