'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskPanel } from './TaskPanel';
import { CodeEditor, type CodeFile } from './CodeEditor';
import { EnglishBlock } from './EnglishBlock';
import { ExerciseSubmit, type SubmitState } from './ExerciseSubmit';
import type { CurriculumSkill } from '@/data/curriculum';

interface ExerciseRunnerProps {
  skill: CurriculumSkill;
}

const MIN_WORDS = 100;

export function ExerciseRunner({ skill }: ExerciseRunnerProps) {
  const router = useRouter();

  const files: CodeFile[] = useMemo(() => {
    return (
      skill.exercise.starterCode ?? [
        {
          filename: 'index.ts',
          content: '// Your solution here\n\n',
        },
      ]
    );
  }, [skill.exercise.starterCode]);

  const [codeValues, setCodeValues] = useState<Record<string, string>>(() =>
    files.reduce<Record<string, string>>((acc, f) => {
      acc[f.filename] = f.content;
      return acc;
    }, {}),
  );

  const [english, setEnglish] = useState('');
  const [submit, setSubmit] = useState<SubmitState>({ kind: 'idle' });
  const [pasteToast, setPasteToast] = useState<{
    id: number;
    chars: number;
  } | null>(null);

  const wordCount = english.trim().split(/\s+/).filter(Boolean).length;
  const wordsEnough = wordCount >= MIN_WORDS;

  const onCodeChange = useCallback((filename: string, content: string) => {
    setCodeValues((prev) => ({ ...prev, [filename]: content }));
  }, []);

  const onPasteAttempt = useCallback((chars: number) => {
    setPasteToast({ id: Date.now(), chars });
  }, []);

  const onSubmit = useCallback(() => {
    if (!wordsEnough) return;
    setSubmit({ kind: 'submitting' });
    // Mock validation — always passes for v1
    setTimeout(() => {
      setSubmit({
        kind: 'success',
        xp: 120,
      });
    }, 850);
  }, [wordsEnough]);

  const onContinue = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row',
        'min-h-[calc(100vh-3.5rem)]',
        'bg-[var(--background)]',
      )}
    >
      <TaskPanel
        skillName={skill.name}
        skillSlug={skill.slug}
        exercise={skill.exercise}
      />

      <main className="flex-1 p-5 lg:p-8 flex flex-col gap-5 lg:gap-6 min-w-0">
        <div className="flex-1 min-h-[460px]">
          <CodeEditor
            files={files}
            values={codeValues}
            onChange={onCodeChange}
            onPasteAttempt={onPasteAttempt}
            className="h-full"
          />
        </div>

        <EnglishBlock
          prompt={skill.exercise.englishPromptHint}
          minWords={MIN_WORDS}
          value={english}
          onChange={setEnglish}
        />

        <ExerciseSubmit
          state={submit}
          disabled={!wordsEnough}
          disabledReason={
            wordsEnough
              ? undefined
              : `Write at least ${MIN_WORDS} words explaining your approach before submitting.`
          }
          onSubmit={onSubmit}
          onContinue={onContinue}
        />
      </main>

      {/* Paste toast */}
      <AnimatePresence>
        {pasteToast && (
          <PasteToast
            key={pasteToast.id}
            chars={pasteToast.chars}
            onDismiss={() => setPasteToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PasteToast({
  chars,
  onDismiss,
}: {
  chars: number;
  onDismiss: () => void;
}) {
  useState(() => {
    setTimeout(onDismiss, 2600);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-2.5',
        'px-4 py-2.5 rounded-full',
        'bg-[var(--surface-2)] border border-[var(--border-color)]',
        'shadow-[0_8px_30px_rgba(0,0,0,0.18)]',
        'text-sm text-[var(--text-primary)]',
      )}
      role="status"
    >
      <AlertCircle size={14} strokeWidth={2.25} className="text-[#E25A2C]" />
      <span>
        Paste isn&apos;t allowed.{' '}
        <span className="text-[var(--text-muted)]">{chars} chars blocked.</span>
      </span>
    </motion.div>
  );
}
