'use client';

import { cn } from '@/lib/utils';

// North sigil — an upward arrow rendered in an 8x8 pixel grid.
// 'X' = solid accent, 'o' = soft accent, '.' = empty cell.
const SIGIL = [
  '...XX...',
  '..XXXX..',
  '.XXXXXX.',
  'XXXXXXXX',
  '..XooX..',
  '..XooX..',
  '..XooX..',
  '..XooX..',
];

interface PixelAvatarProps {
  className?: string;
}

/** The player's pixel emblem — a North arrow, framed like a game portrait. */
export function PixelAvatar({ className }: PixelAvatarProps) {
  return (
    <div
      className={cn(
        'grid aspect-square w-full p-[2px]',
        'grid-cols-8 grid-rows-8 gap-[1px]',
        className,
      )}
      aria-hidden="true"
    >
      {SIGIL.flatMap((row, r) =>
        row.split('').map((ch, c) => (
          <span
            key={`${r}-${c}`}
            className="rounded-[1px]"
            style={{
              background:
                ch === 'X'
                  ? 'var(--accent)'
                  : ch === 'o'
                    ? 'var(--accent-muted)'
                    : 'transparent',
              boxShadow: ch === 'X' ? '0 0 4px var(--accent)' : 'none',
            }}
          />
        )),
      )}
    </div>
  );
}
