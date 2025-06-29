/**
 * AI Engine Configuration
 * 
 * This module contains configuration settings for the AI Engine integration.
 * In the future, this will be updated to connect to the actual AI Engine API endpoints.
 */

export const AI_ENGINE_CONFIG = {
  // Base URL for the future AI Engine API
  apiBaseUrl: process.env.AI_ENGINE_URL || 'http://localhost:8000',
  
  // API endpoints
  endpoints: {
    videoAnalysis: '/api/v1/analyze',
    garScore: '/api/v1/gar-score',
    highlights: '/api/v1/highlights',
    rankings: '/api/v1/rankings',
    starPath: '/api/v1/starpath',
  },
  
  // Connection settings
  connectionTimeout: 30000, // ms
  retryAttempts: 3,
  
  // Whether to use mock data for development/testing
  useMockData: process.env.NODE_ENV !== 'production',
  
  // Model settings
  models: {
    videoAnalysis: 'action-recognition-v2',
    playerTracking: 'player-tracking-v1',
    scoreGeneration: 'gar-scoring-v3',
  }
};

// Export default configurations
export default AI_ENGINE_CONFIG;