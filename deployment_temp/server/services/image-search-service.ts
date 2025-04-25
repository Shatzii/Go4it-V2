import axios from 'axios';
import { db } from '../db';
import { eq } from 'drizzle-orm';

/**
 * Service for searching and retrieving relevant images from web APIs
 */
class ImageSearchService {
  private unsplashApiKey: string | null = null;
  private pixabayApiKey: string | null = null;
  private pexelsApiKey: string | null = null;

  constructor() {
    this.initializeApiKeys();
  }

  /**
   * Initialize API keys from database
   */
  private async initializeApiKeys(): Promise<void> {
    try {
      // We'll use environment variables or manually configure these in the future
      // For now, we'll rely on the placeholders
      /*
      const unsplashKey = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.keyType, 'UNSPLASH_API_KEY')
      });
      
      const pixabayKey = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.keyType, 'PIXABAY_API_KEY')
      });
      
      const pexelsKey = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.keyType, 'PEXELS_API_KEY')
      });

      this.unsplashApiKey = unsplashKey?.keyValue || null;
      this.pixabayApiKey = pixabayKey?.keyValue || null;
      this.pexelsApiKey = pexelsKey?.keyValue || null;
      */
      
      // For now, we'll just use the placeholders
      this.unsplashApiKey = null;
      this.pixabayApiKey = null;
      this.pexelsApiKey = null;
    } catch (error) {
      console.error('Failed to load image API keys:', error);
    }
  }

  /**
   * Get a sports-related image URL based on search terms
   * Tries multiple free image APIs and falls back as needed
   * 
   * @param searchTerms Terms to search for (e.g. "football quarterback")
   * @returns URL of a relevant image or null if none found
   */
  async getSportsImage(searchTerms: string): Promise<string | null> {
    // Add "sports" to the search terms to improve relevance
    const sportsSearchTerms = `sports ${searchTerms}`;
    
    // Try Unsplash first if we have an API key
    if (this.unsplashApiKey) {
      try {
        const image = await this.searchUnsplash(sportsSearchTerms);
        if (image) return image;
      } catch (error) {
        console.error('Unsplash search failed:', error);
      }
    }
    
    // Try Pixabay as fallback
    if (this.pixabayApiKey) {
      try {
        const image = await this.searchPixabay(sportsSearchTerms);
        if (image) return image;
      } catch (error) {
        console.error('Pixabay search failed:', error);
      }
    }
    
    // Try Pexels as final option
    if (this.pexelsApiKey) {
      try {
        const image = await this.searchPexels(sportsSearchTerms);
        if (image) return image;
      } catch (error) {
        console.error('Pexels search failed:', error);
      }
    }
    
    // If we have no API keys or all searches failed, use a sports placeholder
    return this.getSportsPlaceholder();
  }

  /**
   * Search Unsplash for an image
   * 
   * @param query Search terms
   * @returns Image URL or null
   */
  private async searchUnsplash(query: string): Promise<string | null> {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 1,
        orientation: 'landscape'
      },
      headers: {
        Authorization: `Client-ID ${this.unsplashApiKey}`
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
    
    return null;
  }

  /**
   * Search Pixabay for an image
   * 
   * @param query Search terms
   * @returns Image URL or null
   */
  private async searchPixabay(query: string): Promise<string | null> {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: this.pixabayApiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 1
      }
    });
    
    if (response.data.hits && response.data.hits.length > 0) {
      return response.data.hits[0].webformatURL;
    }
    
    return null;
  }

  /**
   * Search Pexels for an image
   * 
   * @param query Search terms
   * @returns Image URL or null
   */
  private async searchPexels(query: string): Promise<string | null> {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query,
        per_page: 1,
        orientation: 'landscape'
      },
      headers: {
        Authorization: this.pexelsApiKey
      }
    });
    
    if (response.data.photos && response.data.photos.length > 0) {
      return response.data.photos[0].src.large;
    }
    
    return null;
  }

  /**
   * Get a generic sports placeholder image
   * Uses free sports images from public sources
   * 
   * @returns URL to a generic sports image
   */
  private getSportsPlaceholder(): string {
    // Array of generic sports-related images from public domains/open sources
    const placeholders = [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', // Stadium
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800', // Basketball
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',    // Running
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', // Football
      'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800'  // Soccer
    ];
    
    // Return a random placeholder
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
}

export const imageSearchService = new ImageSearchService();