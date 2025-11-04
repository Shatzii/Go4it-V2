import type { MetadataRoute } from 'next';

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    // Core Pages
    { url: `${appUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${appUrl}/register`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/login`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/dashboard`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${appUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Academy & Learning
    { url: `${appUrl}/academy`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/academy/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/academy/course-studio`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/dashboard/studio`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${appUrl}/flag-football-academy`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    
    // AI Services
    { url: `${appUrl}/ai-coach`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/ai-football-coach`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/athleteai`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    
    // Performance & Analytics
    { url: `${appUrl}/starpath`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/gar-upload`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/gar`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/video-analysis`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/performance`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/challenges`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    
    // Recruiting & NCAA
    { url: `${appUrl}/recruiting-hub`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/ncaa-eligibility`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/getverified`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/college-explorer`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/scholarship-tracker`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/audit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Events & Testing
    { url: `${appUrl}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${appUrl}/friday-night-lights`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/combine-registration`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    
    // Teams & Social
    { url: `${appUrl}/teams`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/leaderboard`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    
    // Automation Services
    { url: `${appUrl}/automation/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${appUrl}/automation/recruiting-hub`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/automation/social-media`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/automation/ai-enhancement`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/automation/pseo`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${appUrl}/automation/shortlinks`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${appUrl}/automation/video-conferencing`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    
    // Parent Night & Onboarding
    { url: `${appUrl}/parent-night`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    
    // Legal & Info
    { url: `${appUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${appUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${appUrl}/accessibility`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${appUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${appUrl}/apply`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  return routes;
}

// Revalidate sitemap periodically (1 hour)
export const revalidate = 3600;
