/** Compact relative time: now, 5m, 3h, 2d, then a date. */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return 'now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Clock time for chat bubbles, e.g. "4:21 PM". */
export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
