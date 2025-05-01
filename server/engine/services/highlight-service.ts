/**
 * Highlight Service
 * 
 * Generates highlight reels from analyzed videos.
 * This service will eventually connect to the AI engine hosted on a private VPS.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG } from '../config';
import { VideoAction } from './video-analysis-service';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface HighlightSegment {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  action: string;
  confidence: number;
  title?: string;
}

export interface HighlightReel {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoId: string;
  segments: HighlightSegment[];
  url?: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export class HighlightService {
  /**
   * Generate a highlight reel from a video
   * 
   * @param videoId The ID of the analyzed video
   * @param options Options for highlight generation
   */
  async generateHighlights(
    videoId: string,
    options: {
      maxDuration?: number;
      includeActions?: string[];
      title?: string;
      description?: string;
    } = {}
  ): Promise<HighlightReel | null> {
    try {
      logAIEngineActivity('generateHighlights', { videoId, ...options });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockHighlightReel(videoId, options);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          AI_ENGINE_CONFIG.endpoints.highlights,
          {
            videoId,
            ...options
          }
        );
        
        return response.data as HighlightReel;
      });
    } catch (error) {
      logAIEngineActivity('generateHighlights', { videoId, ...options }, null, error as Error);
      console.error('Error generating highlights:', error);
      return null;
    }
  }
  
  /**
   * Get a previously generated highlight reel
   * 
   * @param highlightId The ID of the highlight reel
   */
  async getHighlightReel(highlightId: string): Promise<HighlightReel | null> {
    try {
      logAIEngineActivity('getHighlightReel', { highlightId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockHighlightReel(highlightId);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.highlights}/${highlightId}`
        );
        
        return response.data as HighlightReel;
      });
    } catch (error) {
      logAIEngineActivity('getHighlightReel', { highlightId }, null, error as Error);
      console.error('Error getting highlight reel:', error);
      return null;
    }
  }
  
  /**
   * Get all highlight reels for a user
   * 
   * @param userId The ID of the user
   */
  async getUserHighlightReels(userId: string): Promise<HighlightReel[]> {
    try {
      logAIEngineActivity('getUserHighlightReels', { userId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return [
          this.getMockHighlightReel(`${userId}_1`),
          this.getMockHighlightReel(`${userId}_2`),
          this.getMockHighlightReel(`${userId}_3`)
        ];
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.highlights}/user/${userId}`
        );
        
        return response.data as HighlightReel[];
      });
    } catch (error) {
      logAIEngineActivity('getUserHighlightReels', { userId }, null, error as Error);
      console.error('Error getting user highlight reels:', error);
      return [];
    }
  }
  
  /**
   * For development only - get mock highlight reel data
   * This will be replaced by the actual AI Engine integration
   */
  private getMockHighlightReel(
    id: string,
    options: {
      maxDuration?: number;
      includeActions?: string[];
      title?: string;
      description?: string;
    } = {}
  ): HighlightReel {
    // Generate deterministic but realistic-looking sample data
    const seed = parseInt(id.replace(/\D/g, '') || '1', 10);
    const segmentCount = (seed % 4) + 3; // 3-6 segments
    
    const segments: HighlightSegment[] = [];
    let totalDuration = 0;
    
    for (let i = 0; i < segmentCount; i++) {
      const startTime = (i * 15) + (seed % 10);
      const endTime = startTime + 4 + (i % 4);
      const duration = endTime - startTime;
      
      totalDuration += duration;
      
      segments.push({
        id: `segment_${id}_${i + 1}`,
        videoId: id,
        startTime,
        endTime,
        action: this.getRandomAction(seed + i),
        confidence: 0.75 + ((seed + i) % 25) / 100,
        title: `Highlight #${i + 1}`
      });
    }
    
    // Create the highlight reel
    return {
      id: `highlight_${id}`,
      title: options.title || `Highlight Reel ${id}`,
      description: options.description || 'Automatically generated highlight reel',
      duration: totalDuration,
      videoId: id,
      segments,
      url: `/api/highlights/highlight_${id}/video`,
      thumbnailUrl: `/api/highlights/highlight_${id}/thumbnail`,
      createdAt: new Date()
    };
  }
  
  /**
   * Helper method to get random action names for mock data
   */
  private getRandomAction(seed: number): string {
    const actions = [
      'Jump Shot', 'Layup', 'Dunk', 'Three Pointer', 'Steal',
      'Block', 'Assist', 'Rebound', 'Crossover', 'Behind-the-back Pass'
    ];
    
    return actions[seed % actions.length];
  }
}