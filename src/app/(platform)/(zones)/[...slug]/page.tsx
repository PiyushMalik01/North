import { notFound } from 'next/navigation';
import { activeZone } from '@/components/nest/zones';
import { ZoneStub } from '@/components/nest/ZoneStub';

/**
 * One catch-all renders every zone + sub-place as a stub from the nav map, so the
 * whole platform is navigable without a file per route. Replace a zone with its
 * own static page when it's ready — static routes take precedence over this.
 */
export default async function ZonePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const pathname = '/' + (slug ?? []).join('/');
  const zone = activeZone(pathname);
  if (!zone) notFound();

  const sub = zone.subs?.find((s) => s.href === pathname);
  return sub
    ? <ZoneStub eyebrow={zone.label} title={sub.label} hint={zone.hint} />
    : <ZoneStub title={zone.label} hint={zone.hint} />;
}
