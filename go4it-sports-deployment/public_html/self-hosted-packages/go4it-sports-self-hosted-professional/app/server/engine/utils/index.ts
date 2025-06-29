/**
 * AI Engine Utilities
 * 
 * Common utility functions for interacting with the AI Engine.
 */

import axios from 'axios';
import { AI_ENGINE_CONFIG } from '../config';

/**
 * Creates a configured axios instance for AI Engine API requests
 */
export const aiEngineClient = axios.create({
  baseURL: AI_ENGINE_CONFIG.apiBaseUrl,
  timeout: AI_ENGINE_CONFIG.connectionTimeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Utility to handle retry logic for API calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  maxRetries: number = AI_ENGINE_CONFIG.retryAttempts
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}

/**
 * Logs AI Engine interaction for monitoring
 */
export function logAIEngineActivity(
  action: string, 
  params: Record<string, any>, 
  result?: any, 
  error?: Error
): void {
  console.log(`[AI Engine] ${action}`, {
    timestamp: new Date().toISOString(),
    params,
    success: !error,
    ...(error ? { error: error.message } : {}),
    ...(result ? { resultSummary: summarizeResult(result) } : {})
  });
  
  // TODO: Connect to actual monitoring service
}

/**
 * Summarizes result data for logging (without sensitive information)
 */
function summarizeResult(result: any): any {
  if (!result) return null;
  
  if (Array.isArray(result)) {
    return { count: result.length };
  }
  
  if (typeof result === 'object') {
    const summary: Record<string, any> = {};
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        // Skip sensitive data
        if (['videoData', 'rawData', 'frames'].includes(key)) {
          summary[key] = '[data]';
        } else if (typeof result[key] === 'object') {
          summary[key] = summarizeResult(result[key]);
        } else {
          summary[key] = result[key];
        }
      }
    }
    return summary;
  }
  
  return result;
}

/**
 * Utility to validate incoming video data
 */
export function validateVideoData(file: Express.Multer.File): { valid: boolean, message?: string } {
  // Only accept video formats
  const validMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
  if (!validMimeTypes.includes(file.mimetype)) {
    return { valid: false, message: 'Invalid file format. Only video files are accepted.' };
  }
  
  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return { valid: false, message: 'File too large. Maximum size is 100MB.' };
  }
  
  return { valid: true };
}

/**
 * Utility to format GAR scores
 */
export function formatGARScore(score: number): string {
  return score.toFixed(1);
}