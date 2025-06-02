/**
 * Go4It AI Engine Utilities
 * 
 * This file contains utility functions for interacting with the AI Engine.
 */

import axios from 'axios';
import { AI_ENGINE_CONFIG, LOGGING_CONFIG } from './config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an Axios instance for the AI Engine API
export const aiEngineClient = axios.create({
  baseURL: AI_ENGINE_CONFIG.baseUrl,
  timeout: AI_ENGINE_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    ...(AI_ENGINE_CONFIG.apiKey ? { 'X-API-Key': AI_ENGINE_CONFIG.apiKey } : {}),
  },
});

// Add request interceptor for rate limiting
let requestCount = 0;
let lastMinute = Date.now();

aiEngineClient.interceptors.request.use((config) => {
  // Reset counter if a minute has passed
  const now = Date.now();
  if (now - lastMinute > 60000) {
    requestCount = 0;
    lastMinute = now;
  }
  
  // Enforce rate limit
  if (requestCount >= AI_ENGINE_CONFIG.rateLimit) {
    throw new Error('AI Engine rate limit exceeded');
  }
  
  // Increment request counter
  requestCount++;
  
  return config;
});

/**
 * Log AI Engine activity for monitoring and debugging
 * 
 * @param action The action being performed
 * @param params Parameters for the action
 * @param result The result of the action
 * @param error Any error that occurred
 */
export function logAIEngineActivity(
  action: string,
  params: any,
  result: any = null,
  error: Error | null = null
): void {
  if (!LOGGING_CONFIG.enabled) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    params,
    result,
    error: error ? { message: error.message, stack: error.stack } : null,
  };
  
  // Log to console
  console.log(`[AI Engine] ${action}: ${error ? 'ERROR' : 'SUCCESS'}`);
  
  // Log to file if enabled
  if (LOGGING_CONFIG.logToFile) {
    try {
      const logDir = path.dirname(LOGGING_CONFIG.logFilePath);
      
      // Ensure log directory exists
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      fs.appendFileSync(
        LOGGING_CONFIG.logFilePath,
        JSON.stringify(logEntry) + '\n'
      );
    } catch (err) {
      console.error('Error writing to AI Engine log file:', err);
    }
  }
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn The function to retry
 * @param retries Number of retries remaining
 * @param delay Delay before next retry in milliseconds
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = AI_ENGINE_CONFIG.maxRetries,
  delay: number = AI_ENGINE_CONFIG.retryDelay
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // If we're out of retries, throw the error
    if (retries <= 0) throw error;
    
    // Log the retry attempt
    console.log(`Retrying AI Engine request after ${delay}ms (${retries} retries left)`);
    
    // Wait for the delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with exponential backoff
    return withRetry(fn, retries - 1, delay * 2);
  }
}

/**
 * Get server healthy status and metrics
 */
export async function getAIEngineHealth(): Promise<{
  healthy: boolean;
  metrics?: {
    requestCount: number;
    errorRate: number;
    avgResponseTime: number;
  };
  error?: string;
}> {
  try {
    if (AI_ENGINE_CONFIG.useMockData) {
      return {
        healthy: true,
        metrics: {
          requestCount: 0,
          errorRate: 0,
          avgResponseTime: 0,
        },
      };
    }
    
    const response = await aiEngineClient.get('/health');
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      healthy: false,
      error: `AI Engine health check failed: ${message}`,
    };
  }
}

/**
 * Validate video data before processing
 * 
 * @param videoData The video data to validate
 * @returns Object with validation result and optional error message
 */
export function validateVideoData(videoData: any): { 
  isValid: boolean; 
  errors?: string[] 
} {
  const errors: string[] = [];
  
  // Check if video data exists
  if (!videoData) {
    errors.push('No video data provided');
    return { isValid: false, errors };
  }
  
  // Check for required fields
  if (!videoData.videoId) {
    errors.push('Missing required field: videoId');
  }
  
  if (!videoData.filePath && !videoData.fileUrl) {
    errors.push('Either filePath or fileUrl is required');
  }
  
  // Check sport type if provided
  if (videoData.sport && typeof videoData.sport !== 'string') {
    errors.push('Invalid sport type: must be a string');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}