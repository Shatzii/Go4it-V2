import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const host = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000').replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
