'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import { useAntiPaste } from './hooks/useAntiPaste';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => m.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
        loading editor…
      </div>
    ),
  },
);

export interface CodeFile {
  filename: string;
  content: string;
  language?: string;
}

interface CodeEditorProps {
  files: CodeFile[];
  values: Record<string, string>;
  onChange: (filename: string, content: string) => void;
  onPasteAttempt?: (chars: number) => void;
  className?: string;
  style?: CSSProperties;
}

function inferLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'py':
      return 'python';
    case 'md':
      return 'markdown';
    default:
      return 'typescript';
  }
}

export function CodeEditor({
  files,
  values,
  onChange,
  onPasteAttempt,
  className,
  style,
}: CodeEditorProps) {
  const [activeFile, setActiveFile] = useState(files[0]?.filename ?? '');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const theme = useThemeStore((s) => s.theme);

  const antiPaste = useAntiPaste((chars) => onPasteAttempt?.(chars));

  // DOM-level paste interception — catches paste even when Monaco's command
  // override is bypassed by some edge cases.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: ClipboardEvent) => antiPaste.onPaste(e);
    el.addEventListener('paste', handler, true);
    return () => el.removeEventListener('paste', handler, true);
  }, [antiPaste]);

  const onMount: OnMount = (editor, monaco) => {
    // Override Monaco's paste action to be a no-op (DOM listener still records it)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      // intentionally empty — DOM event handler already flagged the attempt
    });
    editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyV, () => {});

    // Disable right-click context menu
    editor.updateOptions({
      contextmenu: false,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      fontSize: 13,
      fontFamily:
        '"Fira Code", "JetBrains Mono", "Geist Mono", Menlo, Consolas, monospace',
      fontLigatures: true,
      padding: { top: 14, bottom: 14 },
      lineNumbersMinChars: 3,
      tabSize: 2,
      renderLineHighlight: 'none',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      automaticLayout: true,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      scrollbar: { vertical: 'auto', horizontal: 'auto' },
    });

    // Track keystrokes
    editor.onKeyDown(() => antiPaste.onKeyDown());
  };

  const currentValue = values[activeFile] ?? '';
  const currentLang = useMemo(() => {
    const f = files.find((file) => file.filename === activeFile);
    return f?.language ?? inferLanguage(activeFile);
  }, [activeFile, files]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col rounded-xl overflow-hidden',
        'bg-[var(--card)] border border-[var(--border-color)]',
        className,
      )}
      style={style}
    >
      {/* Tabs */}
      <div
        className={cn(
          'flex items-center gap-1 px-2 pt-2',
          'border-b border-[var(--border-color)]',
          'bg-[var(--surface-1)]',
          'overflow-x-auto',
        )}
      >
        {files.map((f) => {
          const isActive = f.filename === activeFile;
          return (
            <button
              key={f.filename}
              type="button"
              onClick={() => setActiveFile(f.filename)}
              className={cn(
                'inline-flex items-center gap-2',
                'px-3 py-1.5 -mb-px rounded-t-md',
                'text-[12px] font-mono tracking-tight',
                'border-x border-t',
                'whitespace-nowrap',
                'transition-colors duration-150',
                isActive
                  ? 'bg-[var(--card)] border-[var(--border-color)] text-[var(--text-primary)]'
                  : 'bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
              )}
            >
              {f.filename}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[300px]">
        <MonacoEditor
          height="100%"
          theme={theme === 'light' ? 'vs' : 'vs-dark'}
          language={currentLang}
          value={currentValue}
          onChange={(value) => onChange(activeFile, value ?? '')}
          onMount={onMount}
          options={{
            wordWrap: 'on',
            renderWhitespace: 'selection',
          }}
        />
      </div>
    </div>
  );
}
