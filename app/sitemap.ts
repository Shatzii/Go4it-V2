import type { MetadataRoute } from 'next';

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${appUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${appUrl}/register`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/login`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  return routes;
}
