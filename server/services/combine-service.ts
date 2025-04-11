import { db } from '../db';
import { storage } from '../storage';
import {
  combineRatingTemplates,
  combineAthleteRatings,
  combineAnalysisResults,
  users,
  videos,
  CombineAthleteRating,
  CombineAnalysisResult,
  CombineRatingTemplate,
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export class CombineService {
  /**
   * Get all templates with optional filtering
   */
  async getAllTemplates(filters: { sport?: string, position?: string, starLevel?: number } = {}): Promise<CombineRatingTemplate[]> {
    try {
      let query = db.select().from(combineRatingTemplates);
      
      if (filters.sport) {
        query = query.where(eq(combineRatingTemplates.sport, filters.sport));
      }
      
      if (filters.position) {
        query = query.where(eq(combineRatingTemplates.position, filters.position));
      }
      
      if (filters.starLevel) {
        query = query.where(eq(combineRatingTemplates.star_level, filters.starLevel));
      }
      
      return await query;
    } catch (error) {
      console.error('Error fetching combine rating templates:', error);
      return [];
    }
  }
  
  /**
   * Get a specific template by ID
   */
  async getTemplateById(templateId: string): Promise<CombineRatingTemplate | undefined> {
    try {
      const [template] = await db
        .select()
        .from(combineRatingTemplates)
        .where(eq(combineRatingTemplates.template_id, templateId));
      
      return template;
    } catch (error) {
      console.error('Error fetching combine rating template:', error);
      return undefined;
    }
  }
  
  /**
   * Create a new rating template
   */
  async createTemplate(templateData: any): Promise<CombineRatingTemplate | undefined> {
    try {
      const [template] = await db
        .insert(combineRatingTemplates)
        .values(templateData)
        .returning();
      
      return template;
    } catch (error) {
      console.error('Error creating combine rating template:', error);
      return undefined;
    }
  }
  
  /**
   * Update an existing template
   */
  async updateTemplate(templateId: string, templateData: any): Promise<CombineRatingTemplate | undefined> {
    try {
      const [template] = await db
        .update(combineRatingTemplates)
        .set(templateData)
        .where(eq(combineRatingTemplates.template_id, templateId))
        .returning();
      
      return template;
    } catch (error) {
      console.error('Error updating combine rating template:', error);
      return undefined;
    }
  }
  
  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(combineRatingTemplates)
        .where(eq(combineRatingTemplates.template_id, templateId))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting combine rating template:', error);
      return false;
    }
  }
  
  /**
   * Save analysis results (create or update)
   */
  async saveAnalysisResults(analysisData: any): Promise<CombineAnalysisResult | undefined> {
    try {
      if (analysisData.id) {
        // Update existing analysis
        const [analysis] = await db
          .update(combineAnalysisResults)
          .set(analysisData)
          .where(eq(combineAnalysisResults.id, analysisData.id))
          .returning();
        
        return analysis;
      } else {
        // Create new analysis
        const [analysis] = await db
          .insert(combineAnalysisResults)
          .values(analysisData)
          .returning();
        
        return analysis;
      }
    } catch (error) {
      console.error('Error saving analysis results:', error);
      return undefined;
    }
  }
  
  /**
   * Get combine statistics
   */
  async getCombineStats(): Promise<any> {
    try {
      // Count total templates
      const [templateCount] = await db
        .select({ count: db.fn.count() })
        .from(combineRatingTemplates);
      
      // Count total athlete ratings
      const [ratingCount] = await db
        .select({ count: db.fn.count() })
        .from(combineAthleteRatings);
      
      // Count total analysis results
      const [analysisCount] = await db
        .select({ count: db.fn.count() })
        .from(combineAnalysisResults);
      
      // Get most common sports
      const sports = await db
        .select({ 
          sport: combineRatingTemplates.sport,
          count: db.fn.count()
        })
        .from(combineRatingTemplates)
        .groupBy(combineRatingTemplates.sport)
        .orderBy(db.sql`count DESC`)
        .limit(5);
      
      return {
        totalTemplates: Number(templateCount.count),
        totalRatings: Number(ratingCount.count),
        totalAnalysis: Number(analysisCount.count),
        topSports: sports.map(s => ({ 
          name: s.sport, 
          count: Number(s.count) 
        }))
      };
    } catch (error) {
      console.error('Error getting combine stats:', error);
      return {
        totalTemplates: 0,
        totalRatings: 0,
        totalAnalysis: 0,
        topSports: []
      };
    }
  }
  
  /**
   * Compare athlete metrics to a template
   */
  async compareToTemplate(templateId: string, metrics: Record<string, number>): Promise<any> {
    try {
      const template = await this.getTemplateById(templateId);
      
      if (!template || !template.metrics) {
        throw new Error('Template not found or has no metrics');
      }
      
      const templateMetrics = template.metrics as Record<string, number>;
      const comparison: Record<string, any> = {};
      
      // Calculate percentages and differences
      Object.keys(templateMetrics).forEach(key => {
        if (metrics[key] !== undefined) {
          const templateValue = templateMetrics[key];
          const athleteValue = metrics[key];
          
          comparison[key] = {
            template: templateValue,
            athlete: athleteValue,
            difference: athleteValue - templateValue,
            percentage: templateValue > 0 ? (athleteValue / templateValue) * 100 : 0
          };
        }
      });
      
      // Calculate overall match percentage
      let totalPercentage = 0;
      let metrics_count = Object.keys(comparison).length;
      
      if (metrics_count > 0) {
        Object.values(comparison).forEach(item => {
          totalPercentage += item.percentage;
        });
        
        return {
          templateId,
          templateName: template.name,
          sport: template.sport,
          position: template.position,
          starLevel: template.star_level,
          metrics: comparison,
          overallMatch: totalPercentage / metrics_count
        };
      } else {
        return {
          templateId,
          templateName: template.name,
          sport: template.sport,
          position: template.position,
          starLevel: template.star_level,
          metrics: {},
          overallMatch: 0
        };
      }
    } catch (error) {
      console.error('Error comparing to template:', error);
      return undefined;
    }
  }
  /**
   * Get all rating templates for a sport and position
   */
  async getRatingTemplates(sport?: string, position?: string): Promise<CombineRatingTemplate[]> {
    try {
      let query = db.select().from(combineRatingTemplates);
      
      if (sport) {
        query = query.where(eq(combineRatingTemplates.sport, sport));
      }
      
      if (position) {
        query = query.where(eq(combineRatingTemplates.position, position));
      }
      
      return await query;
    } catch (error) {
      console.error('Error fetching combine rating templates:', error);
      return [];
    }
  }
  
  /**
   * Get rating template by ID
   */
  async getRatingTemplate(templateId: string): Promise<CombineRatingTemplate | undefined> {
    try {
      const [template] = await db
        .select()
        .from(combineRatingTemplates)
        .where(eq(combineRatingTemplates.template_id, templateId));
      
      return template;
    } catch (error) {
      console.error('Error fetching combine rating template:', error);
      return undefined;
    }
  }
  
  /**
   * Get all ratings for an athlete
   */
  async getAthleteRatings(userId: number): Promise<CombineAthleteRating[]> {
    try {
      const ratings = await db
        .select()
        .from(combineAthleteRatings)
        .where(eq(combineAthleteRatings.user_id, userId));
      
      // Enhance with rated_by name
      const enhancedRatings = await Promise.all(
        ratings.map(async (rating) => {
          if (rating.rated_by) {
            const rater = await storage.getUser(rating.rated_by);
            return {
              ...rating,
              user_name: (await storage.getUser(rating.user_id))?.name,
              rater_name: rater?.name
            };
          }
          
          return {
            ...rating,
            user_name: (await storage.getUser(rating.user_id))?.name
          };
        })
      );
      
      return enhancedRatings as CombineAthleteRating[];
    } catch (error) {
      console.error('Error fetching athlete ratings:', error);
      return [];
    }
  }
  
  /**
   * Get all ratings for an event
   */
  async getEventRatings(eventId: number): Promise<CombineAthleteRating[]> {
    try {
      const ratings = await db
        .select()
        .from(combineAthleteRatings)
        .where(eq(combineAthleteRatings.event_id, eventId));
      
      // Enhance with user names
      const enhancedRatings = await Promise.all(
        ratings.map(async (rating) => {
          return {
            ...rating,
            user_name: (await storage.getUser(rating.user_id))?.name
          };
        })
      );
      
      return enhancedRatings as CombineAthleteRating[];
    } catch (error) {
      console.error('Error fetching event ratings:', error);
      return [];
    }
  }
  
  /**
   * Create a rating for an athlete
   */
  async createAthleteRating(ratingData: any): Promise<CombineAthleteRating | undefined> {
    try {
      // Validate the template exists if provided
      if (ratingData.template_id) {
        const template = await this.getRatingTemplate(ratingData.template_id);
        if (!template) {
          throw new Error('Rating template not found');
        }
      }
      
      // Validate the user exists
      const user = await storage.getUser(ratingData.user_id);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Insert the rating
      const [rating] = await db
        .insert(combineAthleteRatings)
        .values(ratingData)
        .returning();
      
      return rating;
    } catch (error) {
      console.error('Error creating athlete rating:', error);
      return undefined;
    }
  }
  
  /**
   * Get analysis results for an athlete
   */
  async getAthleteAnalysisResults(userId: number): Promise<CombineAnalysisResult[]> {
    try {
      const results = await db
        .select()
        .from(combineAnalysisResults)
        .where(eq(combineAnalysisResults.user_id, userId));
      
      return results;
    } catch (error) {
      console.error('Error fetching athlete analysis results:', error);
      return [];
    }
  }
  
  /**
   * Create analysis result for an athlete
   */
  async createAnalysisResult(analysisData: any): Promise<CombineAnalysisResult | undefined> {
    try {
      // Validate the user exists
      const user = await storage.getUser(analysisData.user_id);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Insert the analysis result
      const [result] = await db
        .insert(combineAnalysisResults)
        .values(analysisData)
        .returning();
      
      return result;
    } catch (error) {
      console.error('Error creating analysis result:', error);
      return undefined;
    }
  }
  
  /**
   * Get event registrations with status
   */
  async getEventRegistrations(eventId: number): Promise<any[]> {
    try {
      // Get the event
      const event = await storage.getCombineTourEvent(eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Get registrations from storage
      const registrations = await storage.getRegistrationsByEvent(eventId);
      
      // Enhance with user information
      const enhancedRegistrations = await Promise.all(
        registrations.map(async (registration) => {
          const user = await storage.getUser(registration.userId);
          return {
            ...registration,
            userName: user?.name,
            userEmail: user?.email,
            eventName: event.name,
            eventDate: event.startDate
          };
        })
      );
      
      return enhancedRegistrations;
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      return [];
    }
  }
  
  /**
   * Calculate GAR score from combine ratings
   */
  async calculateAthleteGarScore(userId: number): Promise<Record<string, number>> {
    try {
      // Get the athlete's combine ratings
      const ratings = await this.getAthleteRatings(userId);
      
      if (ratings.length === 0) {
        return {
          overall: 0,
          physical: 0,
          mental: 0,
          technical: 0
        };
      }
      
      // Extract metrics and traits from ratings
      const allMetrics: Record<string, number[]> = {};
      const allTraits: Record<string, Record<string, number[]>> = {};
      
      ratings.forEach(rating => {
        // Process metrics
        if (rating.metrics) {
          const metrics = rating.metrics as Record<string, number>;
          Object.entries(metrics).forEach(([key, value]) => {
            if (typeof value === 'number') {
              if (!allMetrics[key]) {
                allMetrics[key] = [];
              }
              allMetrics[key].push(value);
            }
          });
        }
        
        // Process traits
        if (rating.traits) {
          const traits = rating.traits as Record<string, Record<string, number>>;
          Object.entries(traits).forEach(([category, categoryTraits]) => {
            if (!allTraits[category]) {
              allTraits[category] = {};
            }
            
            Object.entries(categoryTraits).forEach(([trait, value]) => {
              if (typeof value === 'number') {
                if (!allTraits[category][trait]) {
                  allTraits[category][trait] = [];
                }
                allTraits[category][trait].push(value);
              }
            });
          });
        }
      });
      
      // Calculate average scores
      const averageMetrics: Record<string, number> = {};
      Object.entries(allMetrics).forEach(([key, values]) => {
        const sum = values.reduce((acc, val) => acc + val, 0);
        averageMetrics[key] = sum / values.length;
      });
      
      const averageTraits: Record<string, Record<string, number>> = {};
      Object.entries(allTraits).forEach(([category, categoryTraits]) => {
        averageTraits[category] = {};
        
        Object.entries(categoryTraits).forEach(([trait, values]) => {
          const sum = values.reduce((acc, val) => acc + val, 0);
          averageTraits[category][trait] = sum / values.length;
        });
      });
      
      // Calculate GAR scores
      const physicalMetrics = ['speed', 'strength', 'agility', 'endurance', 'vertical_jump'];
      const technicalMetrics = ['technique', 'ball_control', 'accuracy', 'game_iq'];
      
      let physicalScore = 0;
      let physicalCount = 0;
      
      let technicalScore = 0;
      let technicalCount = 0;
      
      Object.entries(averageMetrics).forEach(([key, value]) => {
        if (physicalMetrics.includes(key)) {
          physicalScore += value;
          physicalCount++;
        } else if (technicalMetrics.includes(key)) {
          technicalScore += value;
          technicalCount++;
        }
      });
      
      // Mental score from traits
      let mentalScore = 0;
      let mentalCount = 0;
      
      if (averageTraits.mental) {
        Object.values(averageTraits.mental).forEach(value => {
          mentalScore += value;
          mentalCount++;
        });
      }
      
      // Calculate final scores (normalized to 0-100)
      const normalizedPhysical = physicalCount > 0 ? (physicalScore / physicalCount) * 10 : 0;
      const normalizedTechnical = technicalCount > 0 ? (technicalScore / technicalCount) * 10 : 0;
      const normalizedMental = mentalCount > 0 ? (mentalScore / mentalCount) * 10 : 0;
      
      // Overall GAR is weighted average
      const overallGar = (
        (normalizedPhysical * 0.4) + 
        (normalizedTechnical * 0.4) + 
        (normalizedMental * 0.2)
      );
      
      return {
        overall: Math.round(overallGar),
        physical: Math.round(normalizedPhysical),
        mental: Math.round(normalizedMental),
        technical: Math.round(normalizedTechnical)
      };
    } catch (error) {
      console.error('Error calculating athlete GAR score:', error);
      return {
        overall: 0,
        physical: 0,
        mental: 0,
        technical: 0
      };
    }
  }
}

// Export the service as a singleton instance
export const combineService = new CombineService();