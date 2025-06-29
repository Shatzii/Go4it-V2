/**
 * Engine Connector Service
 * Provides a centralized service for accessing Go4It Engine functionality
 */

import { initializeGo4ItEngine, Go4ItEngineClient } from '../integrations/go4it-engine';
import { logger } from '../utils/logger';

let engineClient: Go4ItEngineClient | null = null;

/**
 * Initialize the engine connection
 */
export async function initializeEngine(): Promise<void> {
  try {
    engineClient = await initializeGo4ItEngine({
      apiEndpoint: process.env.GO4IT_ENGINE_API || 'http://localhost:3001/api',
      authType: process.env.GO4IT_ENGINE_AUTH_TYPE as 'jwt' | 'apiKey' || 'jwt',
    });
    
    logger.info('Go4It Engine initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Go4It Engine:', error);
    // Don't throw, allow the application to start without engine
  }
}

/**
 * Get the initialized engine client
 */
export function getEngineClient(): Go4ItEngineClient {
  if (!engineClient) {
    throw new Error('Engine client not initialized. Call initializeEngine() first.');
  }
  return engineClient;
}

/**
 * Check if the engine is connected
 */
export async function isEngineConnected(): Promise<boolean> {
  if (!engineClient) return false;
  
  try {
    // Simple ping to check connection
    await engineClient.httpClient.get('/health');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get GAR analysis for an athlete
 */
export async function getGarAnalysis(athleteId: number, videoId: number, options: any = {}): Promise<any> {
  const client = getEngineClient();
  return client.analyze({
    athleteId,
    videoId,
    ...options
  });
}

/**
 * Process a video for analysis
 */
export async function processVideo(videoData: any, options: any = {}): Promise<any> {
  const client = getEngineClient();
  return client.processMedia(videoData, options);
}

/**
 * Update athlete StarPath progression
 */
export async function updateStarPath(userId: number, progressData: any): Promise<any> {
  const client = getEngineClient();
  return client.updateStarPath(userId, progressData);
}

/**
 * Get academic data for a user
 */
export async function getAcademicData(userId: number): Promise<any> {
  const client = getEngineClient();
  return client.getAcademics(userId);
}

/**
 * Get personalized recommendations for an athlete
 */
export async function getRecommendations(userId: number, context: any = {}): Promise<any> {
  const client = getEngineClient();
  return client.getRecommendations(userId, context);
}

/**
 * Get AI coaching feedback
 */
export async function getCoachingFeedback(userId: number, performanceData: any): Promise<any> {
  const client = getEngineClient();
  return client.getCoachingFeedback(userId, performanceData);
}

/**
 * Check if a user has access to a feature based on subscription
 */
export async function checkFeatureAccess(userId: number, feature: string): Promise<boolean> {
  try {
    const client = getEngineClient();
    return client.validateSubscriptionAccess(userId, feature);
  } catch (error) {
    // Default to no access on error
    logger.error('Error checking feature access:', error);
    return false;
  }
}
