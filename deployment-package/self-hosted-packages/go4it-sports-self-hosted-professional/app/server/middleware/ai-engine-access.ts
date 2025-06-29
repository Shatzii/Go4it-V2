/**
 * AI Engine Access Middleware
 * 
 * This middleware checks whether a user has access to the AI Engine features
 * based on their subscription level and permissions.
 */

import { Request, Response, NextFunction } from 'express';

// Types of AI Engine features
export enum AIEngineFeature {
  VIDEO_ANALYSIS = 'video_analysis',
  GAR_SCORING = 'gar_scoring',
  HIGHLIGHTS = 'highlights',
  HOT_100 = 'hot_100',
  STARPATH = 'starpath'
}

// Helper to check feature access based on subscription tier
export function checkFeatureAccess(
  subscriptionTier: string,
  feature: AIEngineFeature
): boolean {
  // Feature access matrix
  const featureAccess: Record<string, AIEngineFeature[]> = {
    free: [AIEngineFeature.VIDEO_ANALYSIS],
    basic: [AIEngineFeature.VIDEO_ANALYSIS, AIEngineFeature.GAR_SCORING],
    premium: [
      AIEngineFeature.VIDEO_ANALYSIS,
      AIEngineFeature.GAR_SCORING,
      AIEngineFeature.HIGHLIGHTS,
      AIEngineFeature.HOT_100
    ],
    enterprise: [
      AIEngineFeature.VIDEO_ANALYSIS,
      AIEngineFeature.GAR_SCORING,
      AIEngineFeature.HIGHLIGHTS,
      AIEngineFeature.HOT_100,
      AIEngineFeature.STARPATH
    ]
  };

  // Check if the user's subscription tier has access to the feature
  const accessibleFeatures = featureAccess[subscriptionTier] || [];
  return accessibleFeatures.includes(feature);
}

// Main middleware for checking AI Engine access
export function requireAIEngineAccess(feature: AIEngineFeature) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    // If no user is authenticated, deny access
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get the user's subscription tier (default to 'free' if not found)
    const subscriptionTier = user.subscriptionTier || 'free';

    // Check if the user has access to the requested feature
    if (!checkFeatureAccess(subscriptionTier, feature)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `Your subscription does not include access to this feature. Please upgrade to access ${feature.replace('_', ' ')}.`
      });
    }

    // User has access to the feature, proceed
    next();
  };
}