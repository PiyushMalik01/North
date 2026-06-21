'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Trash2, Terminal, Code2 } from 'lucide-react';
import { Squircle } from '@/components/nest/ui/Squircle';
import { CardLabel } from '@/components/nest/cards/Card';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { diveExercises, type DiveExercise } from '@/data/platform/dive';

// Exercise sidebar item
function ExerciseItem({
  ex,
  active,
  onClick,
}: {
  ex: DiveExercise;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-xl px-3 py-2.5 text-left transition-colors',
        active
          ? 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--scene-card-border)_40%,transparent)] hover:text-[var(--text-primary)]',
      )}
    >
      <p className="text-sm font-medium leading-snug">{ex.title}</p>
    </button>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function DiveView() {
  const theme = useThemeStore((s) => s.theme);
  const [selectedId, setSelectedId] = useState(diveExercises[0].id);
  const [code, setCode] = useState(diveExercises[0].starter);
  const [output, setOutput] = useState('');

  const selected = diveExercises.find((e) => e.id === selectedId) ?? diveExercises[0];

  function selectExercise(ex: DiveExercise) {
    setSelectedId(ex.id);
    setCode(ex.starter);
    setOutput('');
  }

  function resetCode() {
    setCode(selected.starter);
    setOutput('');
  }

  function runCode() {
    const logs: string[] = [];
    const fakeConsole = {
      log: (...a: unknown[]) => logs.push(a.map(String).join(' ')),
    };
    try {
      const fn = new Function('console', code);
      fn(fakeConsole);
      setOutput(logs.length ? logs.join('\n') : '(no output)');
    } catch (err) {
      setOutput('Error: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-oswald)] text-4xl lowercase tracking-tight text-[var(--text-primary)]">
            dive
          </h1>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            go deep — build &amp; make things
          </p>
        </div>
        <button
          onClick={resetCode}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--scene-card-border)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
        >
          <RotateCcw size={12} />
          reset code
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        {/* Exercise list */}
        <Squircle radius={20} hover={false} className="h-fit">
          <div className="p-4">
            <CardLabel className="mb-3 flex items-center gap-1.5">
              <Code2 size={10} />
              exercises
            </CardLabel>
            <div className="flex flex-col gap-1">
              {diveExercises.map((ex) => (
                <ExerciseItem
                  key={ex.id}
                  ex={ex}
                  active={ex.id === selectedId}
                  onClick={() => selectExercise(ex)}
                />
              ))}
            </div>
          </div>
        </Squircle>

        {/* Editor + console column */}
        <div className="flex flex-col gap-4">
          {/* Brief */}
          <Squircle radius={20} hover={false}>
            <div className="p-4">
              <CardLabel className="mb-1.5">brief</CardLabel>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {selected.brief}
              </p>
            </div>
          </Squircle>

          {/* Monaco editor */}
          <Squircle radius={20} hover={false}>
            <div className="p-3">
              <CardLabel className="mb-2 flex items-center gap-1.5">
                <Code2 size={10} />
                editor
              </CardLabel>
              <div className="overflow-hidden rounded-xl">
                <Editor
                  height="360px"
                  language="javascript"
                  value={code}
                  onChange={(v) => setCode(v ?? '')}
                  theme={theme === 'light' ? 'light' : 'vs-dark'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    fontFamily: 'ui-monospace, "Cascadia Code", monospace',
                    lineDecorationsWidth: 4,
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={runCode}
                  className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] transition-opacity hover:opacity-90 active:opacity-75"
                >
                  <Play size={14} />
                  Run
                </button>
              </div>
            </div>
          </Squircle>

          {/* Console output */}
          <Squircle radius={20} hover={false}>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <CardLabel className="flex items-center gap-1.5">
                  <Terminal size={10} />
                  console
                </CardLabel>
                {output && (
                  <button
                    onClick={() => setOutput('')}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
                  >
                    <Trash2 size={10} />
                    clear
                  </button>
                )}
              </div>
              <pre
                className={cn(
                  'min-h-[80px] whitespace-pre-wrap rounded-xl p-3 font-mono text-xs leading-relaxed',
                  'bg-[color-mix(in_srgb,var(--scene-bg)_60%,transparent)]',
                  output.startsWith('Error:')
                    ? 'text-red-400'
                    : output
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)]',
                )}
              >
                {output || 'run your code to see output here'}
              </pre>
            </div>
          </Squircle>
        </div>
      </div>
    </div>
  );
}
