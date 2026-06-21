/** Temporary centered placeholder for zones / sub-places we haven't built yet. */
export function ZoneStub({
  title,
  hint,
  eyebrow = 'north',
}: {
  title: string;
  hint: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">{eyebrow}</p>
      <h1 className="mt-2 font-[family-name:var(--font-oswald)] text-5xl lowercase text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="mt-3 max-w-xs text-sm text-[var(--text-secondary)]">{hint}</p>
    </div>
  );
}
