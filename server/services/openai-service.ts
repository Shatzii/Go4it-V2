import { db } from '../db';
import { apiKeys } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * OpenAI Service for centralized API key management and OpenAI client creation
 */
class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI | null = null;
  private apiKey: string | undefined = undefined;
  
  private constructor() {
    // Initialize with environment variable if available
    this.apiKey = process.env.OPENAI_API_KEY;
    if (this.apiKey) {
      this.client = new OpenAI({ apiKey: this.apiKey });
      console.log('OpenAI client initialized with API key from environment');
    }
  }
  
  /**
   * Get the singleton instance of OpenAIService
   */
  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }
  
  /**
   * Get the OpenAI client, initializing or refreshing if needed
   */
  public async getClient(): Promise<OpenAI> {
    // If we already have a client with a key, use it
    if (this.client && this.apiKey) {
      return this.client;
    }
    
    // Try to get key from database
    await this.refreshApiKey();
    
    // If we still don't have a key, throw an error
    if (!this.apiKey) {
      throw new Error('No OpenAI API key available. Please update the key in the admin panel or environment.');
    }
    
    // Create a new client with the API key if needed
    if (!this.client) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
    
    return this.client;
  }
  
  /**
   * Attempt to refresh the API key from the database
   */
  public async refreshApiKey(): Promise<boolean> {
    try {
      // Get the API key from the database
      const keys = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.keyType, 'openai'));
      
      // If a key was found, use it
      if (keys.length > 0) {
        const keyValue = keys[0].keyValue;
        if (keyValue && keyValue !== this.apiKey) {
          this.apiKey = keyValue;
          this.client = new OpenAI({ apiKey: this.apiKey });
          console.log('OpenAI client refreshed with API key from database');
          // Update the last used timestamp
          await db
            .update(apiKeys)
            .set({ lastUsed: new Date() })
            .where(eq(apiKeys.id, keys[0].id));
          return true;
        }
        return !!this.apiKey; // Return true if we have an API key
      }
      
      // If not found in DB but we have environment variable, persist it to DB
      if (!keys.length && this.apiKey) {
        await db
          .insert(apiKeys)
          .values({
            keyType: 'openai',
            keyValue: this.apiKey,
            isActive: true,
            lastUsed: new Date()
          });
        console.log('Saved environment API key to database');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing OpenAI API key:', error);
      return !!this.apiKey; // Return true if we already have an API key
    }
  }
  
  /**
   * Update the OpenAI API key in the database
   */
  public async updateApiKey(newKey: string): Promise<boolean> {
    try {
      // Update the key in the database
      const result = await db
        .update(apiKeys)
        .set({ 
          keyValue: newKey,
          lastUsed: new Date(),
          isActive: true
        })
        .where(eq(apiKeys.keyType, 'openai'))
        .returning();
      
      // If no key exists, insert a new one
      if (result.length === 0) {
        const insertResult = await db
          .insert(apiKeys)
          .values({
            keyType: 'openai',
            keyValue: newKey,
            isActive: true,
            lastUsed: new Date()
          })
          .returning();
        
        if (insertResult.length === 0) {
          return false;
        }
      }
      
      // Update the current client
      this.apiKey = newKey;
      this.client = new OpenAI({ apiKey: newKey });
      console.log('OpenAI API key updated successfully');
      
      return true;
    } catch (error) {
      console.error('Error updating OpenAI API key:', error);
      return false;
    }
  }
  
  /**
   * Check if we have a valid API key
   */
  public async hasValidApiKey(): Promise<boolean> {
    // If we don't have a client or key, try to refresh
    if (!this.client || !this.apiKey) {
      const refreshed = await this.refreshApiKey();
      if (!refreshed) {
        return false;
      }
    }
    
    return !!this.apiKey;
  }
  
  /**
   * Validate an OpenAI API key by making a simple request
   */
  public async validateApiKey(keyToValidate: string): Promise<boolean> {
    try {
      // Create a temporary client with the key to validate
      const tempClient = new OpenAI({ apiKey: keyToValidate });
      
      // Make a simple models list request to validate the key
      await tempClient.models.list();
      
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
}

// Export the singleton instance
export const openAIService = OpenAIService.getInstance();