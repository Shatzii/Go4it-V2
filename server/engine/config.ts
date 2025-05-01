/**
 * Go4It AI Engine Configuration
 * 
 * This file contains configuration settings for the AI Engine microservice.
 * The engine will be hosted as a separate service and accessed via HTTP API.
 */

// Check if we're in development mode
const isDev = process.env.NODE_ENV !== 'production';

// Base URL for the AI Engine microservice
// In production, this will be the URL of the deployed AI Engine
// In development, we'll use mock data by default
const AI_ENGINE_BASE_URL = process.env.AI_ENGINE_URL || 'http://localhost:5000';

// API endpoints for different AI Engine services
const AI_ENGINE_ENDPOINTS = {
  videoAnalysis: '/api/video-analysis',
  garScore: '/api/gar-score',
  highlights: '/api/highlights',
  rankings: '/api/rankings',
  starPath: '/api/starpath',
};

// Model versions for each service
const AI_ENGINE_MODELS = {
  videoAnalysis: process.env.AI_ENGINE_VIDEO_MODEL || 'v1.0.0',
  garScore: process.env.AI_ENGINE_GAR_MODEL || 'v1.0.0',
  highlights: process.env.AI_ENGINE_HIGHLIGHTS_MODEL || 'v1.0.0',
  rankings: process.env.AI_ENGINE_RANKINGS_MODEL || 'v1.0.0',
  starPath: process.env.AI_ENGINE_STARPATH_MODEL || 'v1.0.0',
};

// Configuration for AI Engine API
export const AI_ENGINE_CONFIG = {
  // In development mode or when specified, use mock data instead of making API calls
  useMockData: isDev || process.env.USE_MOCK_AI_DATA === 'true',
  
  // Base URL for the AI Engine API
  baseUrl: AI_ENGINE_BASE_URL,
  
  // API endpoints
  endpoints: AI_ENGINE_ENDPOINTS,
  
  // Model versions for each service
  models: AI_ENGINE_MODELS,
  
  // API key for authentication (if applicable)
  apiKey: process.env.AI_ENGINE_API_KEY || '',
  
  // Request timeout in milliseconds
  timeout: parseInt(process.env.AI_ENGINE_TIMEOUT || '30000', 10),
  
  // Maximum number of retries for failed requests
  maxRetries: parseInt(process.env.AI_ENGINE_MAX_RETRIES || '3', 10),
  
  // Retry delay in milliseconds
  retryDelay: parseInt(process.env.AI_ENGINE_RETRY_DELAY || '1000', 10),
  
  // Rate limiting: maximum requests per minute
  rateLimit: parseInt(process.env.AI_ENGINE_RATE_LIMIT || '60', 10),
};

// External model provider configuration (OpenAI fallback if needed)
export const EXTERNAL_MODEL_CONFIG = {
  openAi: {
    useOpenAi: process.env.USE_OPENAI === 'true',
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1024', 10),
  },
  anthropic: {
    useAnthropic: process.env.USE_ANTHROPIC === 'true',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-7-sonnet-20250219',
    temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '1024', 10),
  },
};

// Logging configuration
export const LOGGING_CONFIG = {
  enabled: process.env.AI_ENGINE_LOGGING === 'true',
  level: process.env.AI_ENGINE_LOG_LEVEL || 'info',
  logToFile: process.env.AI_ENGINE_LOG_TO_FILE === 'true',
  logFilePath: process.env.AI_ENGINE_LOG_FILE_PATH || './logs/ai-engine.log',
};