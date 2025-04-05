import { OpenAI } from 'openai';
import { db } from '../db';
import { apiKeys } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Service to manage OpenAI API interactions
 * This centralizes all OpenAI functionality to ensure API key validation
 * and consistent error handling
 */
class OpenAIService {
  private client: OpenAI | null = null;
  private apiKey: string | null = null;
  
  constructor() {
    console.log('Using OpenAI service for all OpenAI API calls');
  }
  
  /**
   * Check if a valid OpenAI API key is available
   * @returns Promise resolving to true if valid key is available
   * @throws Error if no valid key is found
   */
  async hasValidApiKey(): Promise<boolean> {
    // Try to get a client, which will validate the key
    await this.getClient();
    return true;
  }
  
  /**
   * Get or create an OpenAI client with a valid API key
   * @returns Promise resolving to an OpenAI client
   * @throws Error if no valid key is found
   */
  async getClient(): Promise<OpenAI> {
    // Return existing client if we have one
    if (this.client) {
      return this.client;
    }
    
    // Try to get API key from database
    const apiKey = await this.getApiKeyFromDatabase();
    
    if (!apiKey) {
      throw new Error('No OpenAI API key found in the database or environment');
    }
    
    // Create and verify the client
    try {
      this.client = new OpenAI({
        apiKey,
      });
      
      // Verify the key works with a simple models list request
      await this.client.models.list();
      
      // Update last used timestamp
      this.updateApiKeyLastUsed('openai').catch(err => {
        console.error('Error updating API key last used timestamp:', err);
      });
      
      // Store the key
      this.apiKey = apiKey;
      
      return this.client;
    } catch (error) {
      console.error('Error validating OpenAI API key:', error);
      this.client = null;
      throw new Error('Invalid OpenAI API key');
    }
  }
  
  /**
   * Get the OpenAI API key from the database
   * @returns Promise resolving to the API key or null if not found
   */
  private async getApiKeyFromDatabase(): Promise<string | null> {
    try {
      const result = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.keyType, 'openai'))
        .where(eq(apiKeys.isActive, true))
        .limit(1);
      
      if (result && result.length > 0) {
        return result[0].keyValue;
      }
      
      // Fallback to environment variable
      return process.env.OPENAI_API_KEY || null;
    } catch (error) {
      console.error('Error getting API key from database:', error);
      // Fallback to environment variable
      return process.env.OPENAI_API_KEY || null;
    }
  }
  
  /**
   * Update the last used timestamp for an API key
   * @param keyType The type of API key to update
   */
  private async updateApiKeyLastUsed(keyType: string): Promise<void> {
    try {
      await db
        .update(apiKeys)
        .set({ lastUsed: new Date() })
        .where(eq(apiKeys.keyType, keyType));
    } catch (error) {
      console.error('Error updating API key last used timestamp:', error);
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();