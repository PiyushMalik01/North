/** Monochrome initials avatar. */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
        color: 'var(--text-primary)',
        border: '1px solid var(--scene-card-border)',
      }}
    >
      {initials}
    </div>
  );
}
