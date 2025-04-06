/**
 * Helper function to get active API keys from the database
 */
import { db } from './db';
import { apiKeys } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function getAllActiveApiKeys() {
  try {
    const activeKeys = await db.select()
      .from(apiKeys)
      .where(eq(apiKeys.isActive, true));
    
    return activeKeys;
  } catch (error) {
    console.error('Database error in getAllActiveApiKeys:', error);
    return [];
  }
}