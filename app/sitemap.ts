import type { MetadataRoute } from 'next';

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${appUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${appUrl}/register`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/login`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    // Marketing/feature pages (from global nav)
    { url: `${appUrl}/starpath`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${appUrl}/gar-upload`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${appUrl}/challenges`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    {
      url: `${appUrl}/ai-football-coach`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    { url: `${appUrl}/navigation`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${appUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  return routes;
}

// Revalidate sitemap periodically (1 hour)
export const revalidate = 3600;
