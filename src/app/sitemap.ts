import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const routes = [
    '/',
    '/intro',
    '/dashboard',
    '/trace',
    '/prove',
    '/spark',
    '/drift',
    '/perch',
    '/flare',
    '/field',
    '/chart',
    '/dive',
    '/huddle',
    '/halo',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
}
