import { Shell } from '@/components/nest/Shell';

/**
 * Persistent polar shell for all zones. Because this layout stays mounted while
 * only the page content swaps, the nav (and its rolling ball) animate across
 * navigations instead of remounting. The scene keeps running too.
 */
export default function ZonesLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
