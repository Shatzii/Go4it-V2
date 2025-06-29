/**
 * GAR Scoring AI Service
 * 
 * This service provides AI-powered Growth and Ability Rating (GAR) scoring
 * for athlete videos, using our custom AI engine.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG } from '../config';

export interface VideoData {
  id: number;
  title: string;
  description?: string | null;
  duration?: number | null;
  sportPosition?: string | null;
}

export interface UserData {
  id: number;
  age?: number | null;
  sportType?: string | null;
}

export interface GARAttribute {
  name: string;
  score: number;
  comments: string;
}

export interface GARCategoryScore {
  category: string;
  attributes: GARAttribute[];
  overallScore: number;
}

export interface ADHDAnalysis {
  focusScore: number;
  focusStrategies: string[];
  attentionInsights: string;
  learningPatterns: string;
}

export interface GARScoreResult {
  categories: GARCategoryScore[];
  overallScore: number;
  improvementAreas: string[];
  strengths: string[];
  adhd: ADHDAnalysis;
}

export class GARScoringAIService {
  /**
   * Generate GAR scores for a video
   * 
   * @param videoId The video ID
   * @param videoData The video data
   * @param userData The user data
   * @param sportType The sport type
   */
  async generateGARScores(
    videoId: number,
    videoData: VideoData,
    userData: UserData,
    sportType: string
  ): Promise<GARScoreResult | null> {
    try {
      logAIEngineActivity('generateGARScores', { videoId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        return this.getMockGARScores(videoData, userData, sportType);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.garScore}/score`, // Using garScore endpoint 
          {
            videoId,
            videoData,
            userData,
            sportType,
            modelVersion: AI_ENGINE_CONFIG.models.garScoring
          }
        );
        
        return response.data as GARScoreResult;
      });
    } catch (error) {
      logAIEngineActivity('generateGARScores', { videoId }, null, error as Error);
      console.error('Error generating GAR scores:', error);
      return null;
    }
  }
  
  /**
   * For development only - get mock GAR scores
   * This will be replaced by the actual AI Engine integration
   */
  private getMockGARScores(
    videoData: VideoData,
    userData: UserData,
    sportType: string
  ): GARScoreResult {
    // Define sport-specific categories and attributes
    const categories: Record<string, string[]> = {
      basketball: {
        "Physical": ["Vertical leap", "Speed", "Strength", "Endurance", "Coordination"],
        "Psychological": ["Focus", "Confidence", "Decision-making", "Game pressure handling", "Team awareness"],
        "Technical": ["Shooting form", "Dribbling", "Passing accuracy", "Court vision", "Defensive footwork"]
      },
      football: {
        "Physical": ["Explosiveness", "Speed", "Strength", "Durability", "Agility"],
        "Psychological": ["Focus", "Confidence", "Situational awareness", "Pressure handling", "Team communication"],
        "Technical": ["Position fundamentals", "Play execution", "Football IQ", "Technique consistency", "Reading game situations"]
      },
      soccer: {
        "Physical": ["Stamina", "Speed", "Strength", "Agility", "Balance"],
        "Psychological": ["Focus", "Confidence", "Spatial awareness", "Game intelligence", "Competitiveness"],
        "Technical": ["Ball control", "Passing accuracy", "Shooting technique", "Defensive positioning", "First touch"]
      }
    }[sportType.toLowerCase()] || {
      "Physical": ["Speed", "Strength", "Agility", "Endurance", "Coordination"],
      "Psychological": ["Focus", "Confidence", "Decision-making", "Mental toughness", "Adaptability"],
      "Technical": ["Skill execution", "Game IQ", "Technique", "Positioning", "Tactical awareness"]
    };
    
    // Generate deterministic scores based on video and user IDs
    const seed = (videoData.id || 1) + (userData.id || 1);
    
    // Generate category scores
    const garCategories: GARCategoryScore[] = Object.entries(categories).map(([category, attributes], categoryIndex) => {
      // Generate attribute scores
      const attrScores: GARAttribute[] = attributes.map((attr, attrIndex) => {
        // Generate a score between 5-9 (average to above average)
        // Use deterministic calculation based on seed, category, and attribute indices
        const score = 5 + ((seed + categoryIndex + attrIndex) % 5);
        
        return {
          name: attr,
          score,
          comments: this.getAttributeComment(attr, score, sportType)
        };
      });
      
      // Calculate category overall score (average of attribute scores)
      const overallScore = Math.round(attrScores.reduce((sum, attr) => sum + attr.score, 0) / attrScores.length * 10) / 10;
      
      return {
        category,
        attributes: attrScores,
        overallScore
      };
    });
    
    // Calculate overall GAR score
    const overallScore = Math.round(garCategories.reduce((sum, cat) => sum + cat.overallScore, 0) / garCategories.length * 10) / 10;
    
    // Identify strengths and improvement areas
    // Sort all attributes by score
    const allAttributes = garCategories.flatMap(cat => 
      cat.attributes.map(attr => ({
        category: cat.category,
        name: attr.name,
        score: attr.score
      }))
    );
    
    // Get top 3 strengths (highest scores)
    const strengths = allAttributes
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(attr => `${attr.name} (${attr.category})`);
    
    // Get top 3 improvement areas (lowest scores)
    const improvementAreas = allAttributes
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(attr => `${attr.name} (${attr.category})`);
    
    // Generate ADHD analysis
    const focusScore = 5 + (seed % 4); // 5-8 range
    const adhd: ADHDAnalysis = {
      focusScore,
      focusStrategies: [
        "Use visual cues and landmarks on the court/field to maintain spatial awareness",
        "Implement pre-performance routines to establish focus before play begins",
        "Break down complex plays into smaller, manageable segments"
      ],
      attentionInsights: "Attention patterns show stronger focus during high-intensity moments but occasional lapses during transitional play. Athlete demonstrates hyper-focus during competitive sequences that can be leveraged as a strength.",
      learningPatterns: "Shows strong visual-spatial learning with quick adaptation to new positions and scenarios when presented in a dynamic context. May benefit from kinesthetic learning approaches with immediate feedback loops."
    };
    
    return {
      categories: garCategories,
      overallScore,
      improvementAreas,
      strengths,
      adhd
    };
  }
  
  /**
   * Helper method to generate attribute comments based on score
   */
  private getAttributeComment(attribute: string, score: number, sportType: string): string {
    // Define range types for type safety
    type RangeType = 'low' | 'medium' | 'high';
    
    // Attribute-specific comments based on score ranges
    const comments: Record<string, Record<RangeType, string[]>> = {
      "Speed": {
        low: ["Shows hesitation when accelerating", "Needs improvement in first-step explosiveness", "Struggles to maintain top speed"],
        medium: ["Average acceleration with room for improvement", "Shows good burst in open space", "Speed is adequate for position"],
        high: ["Exceptional acceleration and top-end speed", "Uses speed effectively to create advantages", "Shows elite quickness in tight spaces"]
      },
      "Strength": {
        low: ["Needs to develop core and functional strength", "Gets overpowered in contact situations", "Limited power generation"],
        medium: ["Shows adequate strength for position", "Good base strength but could improve upper body", "Handles physical play reasonably well"],
        high: ["Exceptional strength for age group", "Uses leverage effectively", "Dominates physical confrontations"]
      },
      "Focus": {
        low: ["Easily distracted by external factors", "Inconsistent attention during less active periods", "Needs structured focus strategies"],
        medium: ["Maintains focus during key moments", "Occasional lapses in extended sequences", "Good recovery after distractions"],
        high: ["Excellent sustained attention throughout play", "Effectively filters out distractions", "Uses hyperfocus advantageously in critical situations"]
      }
    };
    
    // Default comments if specific attribute not found
    const defaultComments: Record<RangeType, string[]> = {
      low: ["Shows potential but needs significant development", "Basic foundations present but consistency lacking", "Requires focused training to improve"],
      medium: ["Solid performance at age-appropriate level", "Demonstrates good fundamentals", "Consistent execution with room for refinement"],
      high: ["Exceptional skill execution", "Advanced technical proficiency", "Elite performance well above age level"]
    };
    
    // Determine score range
    let range: RangeType = "medium";
    if (score <= 4) range = "low";
    if (score >= 8) range = "high";
    
    // Get attribute-specific comments or default to general comments
    // Fix type issue by checking if the attribute exists as a key
    const hasComments = Object.prototype.hasOwnProperty.call(comments, attribute);
    const commentOptions = hasComments ? comments[attribute][range] : defaultComments[range];
    
    // Select a comment based on a deterministic calculation
    const commentIndex = (score + attribute.length + sportType.length) % commentOptions.length;
    return commentOptions[commentIndex];
  }
}

export const garScoringAIService = new GARScoringAIService();