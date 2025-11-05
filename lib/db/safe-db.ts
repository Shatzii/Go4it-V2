/**
 * Database Helper - Safe Database Access
 * 
 * Provides safe access to the database with runtime checks.
 * Handles cases where database is not available (e.g., during build).
 */

import { db as rawDb } from './index';

export function getDb() {
  if (!rawDb) {
    throw new Error(
      'Database is not initialized. ' +
      'This usually happens during build time. ' +
      'Make sure DATABASE_URL is set and you are not trying to access the database during static generation.'
    );
  }
  return rawDb;
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return rawDb !== null && rawDb !== undefined;
}

/**
 * Safe database operation wrapper
 * Returns null if database is not available instead of throwing
 */
export async function safeDatabaseOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, skipping operation');
    return fallback ?? null;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return fallback ?? null;
  }
}

export { db } from './index';
export * from './schema';
