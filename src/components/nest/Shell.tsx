import { PolarScene } from './PolarScene';
import { TopNav } from './TopNav';
import { SubPill } from './SubPill';

/**
 * The persistent polar shell: falling-ice scene, the sticky top bar, a content
 * slot, and the bottom sub-pill (which shows itself only inside zones that have
 * sub-places). Stays mounted across navigation so the nav animates.
 */
export function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[var(--scene-bg)] text-[var(--text-primary)]">
      <PolarScene className="fixed inset-0 -z-0" />
      <TopNav />
      <main className="relative z-[1] min-h-[100dvh] pt-14">{children}</main>
      <SubPill />
    </div>
  );
}
