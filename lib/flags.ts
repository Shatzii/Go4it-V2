/**
 * Feature Flags
 * 
 * Centralized feature toggle system for staged rollouts and A/B testing.
 * Set flags via environment variables in .env.local
 */

export const flags = {
  // New hero section with "All-in-One Hub" messaging
  NEW_HERO: process.env.NEXT_PUBLIC_FEATURE_NEW_HERO === 'true',
  
  // "Everything In One Place" hub section
  HUB_SECTION: process.env.NEXT_PUBLIC_FEATURE_ALL_IN_ONE_HUB === 'true',
  
  // JSON-LD structured data component
  JSONLD: process.env.NEXT_PUBLIC_FEATURE_JSONLD === 'true',
  
  // Dashboard V2 with real-time tiles
  DASHBOARD_V2: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD_V2 === 'true',
  
  // Study hall tracking system
  STUDY_HALL: process.env.NEXT_PUBLIC_FEATURE_STUDY_HALL === 'true',
  
  // NCAA checklist tracker
  NCAA_TRACKER: process.env.NEXT_PUBLIC_FEATURE_NCAA_TRACKER === 'true',
  
  // GAR scores integration
  GAR_INTEGRATION: process.env.NEXT_PUBLIC_FEATURE_GAR_INTEGRATION === 'true',
  
  // Parent Night RSVP page with Cal.com embeds
  PARENT_NIGHT_PAGE: process.env.NEXT_PUBLIC_FEATURE_PARENT_NIGHT_PAGE === 'true',

  // Enable Edge runtime for ICS route
  EDGE_ICS: process.env.NEXT_PUBLIC_FEATURE_EDGE_ICS === 'true',

  // Enable offer testing and payment plan variants
  OFFERS: process.env.NEXT_PUBLIC_FEATURE_OFFERS === 'true',
} as const;

export type FeatureFlag = keyof typeof flags;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag] === true;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return (Object.keys(flags) as FeatureFlag[]).filter((key) => flags[key]);
}

/**
 * Check if feature should be shown in production
 */
export function shouldShowFeature(flag: FeatureFlag, isProd = false): boolean {
  // In production, only show if explicitly enabled
  // In development, show all unless explicitly disabled
  if (isProd) {
    return flags[flag] === true;
  }
  return flags[flag] !== false;
}
