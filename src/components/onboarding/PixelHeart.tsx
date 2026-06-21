import { cn } from '@/lib/utils';

interface PixelHeartProps {
  className?: string;
  size?: number;
}

/**
 * Hand-built pixel-art heart (matches North's pixel-grid theme). Color via
 * `currentColor`, so set text color on the element or a parent.
 */
export function PixelHeart({ className, size }: PixelHeartProps) {
  return (
    <svg
      viewBox="0 0 8 7"
      fill="currentColor"
      className={cn('inline-block', className)}
      style={size ? { width: size, height: (size * 7) / 8 } : undefined}
      aria-hidden="true"
    >
      <path d="M1 0h2v1H1zM5 0h2v1H5zM0 1h8v3H0zM1 4h6v1H1zM2 5h4v1H2zM3 6h2v1H3z" />
    </svg>
  );
}
