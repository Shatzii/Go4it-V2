import { db } from '../db';
import { combineRatingTemplates, combineAthleteRatings, combineAnalysisResults } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

/**
 * Service for handling combine-related functions including rating templates,
 * athlete ratings, and analysis results
 */
export class CombineService {
  private initialized = false;
  private templateCount = 0;
  
  // Cache of event ratings for quick access
  private eventRatingsCache: Record<number, any[]> = {};

  /**
   * Initialize the service by loading templates if needed
   */
  async initialize() {
    try {
      // Check if templates already exist
      const existingTemplates = await db.select({
        count: { count: combineRatingTemplates.id }
      }).from(combineRatingTemplates);
      
      this.templateCount = existingTemplates[0]?.count || 0;
      
      if (this.templateCount === 0) {
        await this.loadTemplatesFromFiles();
      }
      
      console.log(`Combine Service initialized with ${this.templateCount} templates`);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Combine Service:', error);
      return false;
    }
  }

  /**
   * Load template JSON files from the temp_extract directory
   */
  private async loadTemplatesFromFiles() {
    try {
      const extractDir = path.join(process.cwd(), 'temp_extract');
      
      // Get all JSON files in the directory
      const files = fs.readdirSync(extractDir).filter(file => file.endsWith('.json'));
      
      let loadedCount = 0;
      
      // Process each JSON file
      for (const file of files) {
        try {
          const filePath = path.join(extractDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // Skip if no template ID or if not a rating template
          if (!data.id || !data.star_level || !data.sport || !data.position) {
            continue;
          }
          
          // Insert template into database
          await db.insert(combineRatingTemplates).values({
            template_id: data.id,
            name: data.name,
            star_level: data.star_level,
            sport: data.sport,
            position: data.position,
            age_group: data.age_group,
            metrics: data.metrics,
            traits: data.traits,
            film_expectations: data.film_expectations,
            training_focus: data.training_focus,
            avatar: data.avatar,
            rank: data.rank,
            xp_level: data.xp_level
          }).onConflictDoNothing();
          
          loadedCount++;
        } catch (err) {
          console.error(`Error processing template file ${file}:`, err);
        }
      }
      
      this.templateCount = loadedCount;
      console.log(`Loaded ${loadedCount} combine rating templates`);
      
    } catch (error) {
      console.error('Failed to load combine templates:', error);
      throw error;
    }
  }

  /**
   * Get all rating templates
   */
  async getAllTemplates(filters: {
    sport?: string;
    position?: string;
    starLevel?: number;
  } = {}) {
    try {
      let query = db.select().from(combineRatingTemplates);
      
      const conditions = [];
      if (filters.sport) {
        conditions.push(eq(combineRatingTemplates.sport, filters.sport));
      }
      if (filters.position) {
        conditions.push(eq(combineRatingTemplates.position, filters.position));
      }
      if (filters.starLevel) {
        conditions.push(eq(combineRatingTemplates.star_level, filters.starLevel));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      return await query;
    } catch (error) {
      console.error('Failed to get combine templates:', error);
      throw error;
    }
  }

  /**
   * Get a specific template by ID
   */
  async getTemplateById(templateId: string) {
    try {
      const [template] = await db.select()
        .from(combineRatingTemplates)
        .where(eq(combineRatingTemplates.template_id, templateId));
      
      return template;
    } catch (error) {
      console.error(`Failed to get template with ID ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Create an athlete rating based on a template
   */
  async createAthleteRating(data: {
    userId: number;
    templateId?: string;
    eventId?: number;
    sport: string;
    position: string;
    starLevel: number;
    metrics: any;
    traits: any;
    notes?: string;
    ratedBy?: number;
  }) {
    try {
      const [rating] = await db.insert(combineAthleteRatings)
        .values({
          user_id: data.userId,
          template_id: data.templateId,
          event_id: data.eventId,
          sport: data.sport,
          position: data.position,
          star_level: data.starLevel,
          metrics: data.metrics,
          traits: data.traits,
          notes: data.notes,
          rated_by: data.ratedBy
        })
        .returning();
      
      return rating;
    } catch (error) {
      console.error('Failed to create athlete rating:', error);
      throw error;
    }
  }

  /**
   * Get all ratings for a specific athlete
   */
  async getAthleteRatings(userId: number) {
    try {
      return await db.select()
        .from(combineAthleteRatings)
        .where(eq(combineAthleteRatings.user_id, userId))
        .orderBy(desc(combineAthleteRatings.created_at));
    } catch (error) {
      console.error(`Failed to get ratings for athlete ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Store analysis results for an athlete
   */
  async saveAnalysisResults(data: {
    userId: number;
    eventId?: number;
    videoId?: number;
    positionFit: string[];
    skillAnalysis: any;
    nextSteps: any;
    challenges?: string[];
    recoveryStatus?: string;
    recoveryScore?: number;
    aiCoachNotes?: string;
  }) {
    try {
      const [result] = await db.insert(combineAnalysisResults)
        .values({
          user_id: data.userId,
          event_id: data.eventId,
          video_id: data.videoId,
          position_fit: data.positionFit,
          skill_analysis: data.skillAnalysis,
          next_steps: data.nextSteps,
          challenges: data.challenges,
          recovery_status: data.recoveryStatus,
          recovery_score: data.recoveryScore,
          ai_coach_notes: data.aiCoachNotes
        })
        .returning();
      
      return result;
    } catch (error) {
      console.error('Failed to save analysis results:', error);
      throw error;
    }
  }

  /**
   * Get analysis results for a specific athlete
   */
  async getAthleteAnalysisResults(userId: number) {
    try {
      return await db.select()
        .from(combineAnalysisResults)
        .where(eq(combineAnalysisResults.user_id, userId))
        .orderBy(desc(combineAnalysisResults.ai_analysis_date));
    } catch (error) {
      console.error(`Failed to get analysis results for athlete ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get the most recent analysis result for an athlete
   */
  async getLatestAnalysisResult(userId: number) {
    try {
      const [result] = await db.select()
        .from(combineAnalysisResults)
        .where(eq(combineAnalysisResults.user_id, userId))
        .orderBy(desc(combineAnalysisResults.ai_analysis_date))
        .limit(1);
      
      return result;
    } catch (error) {
      console.error(`Failed to get latest analysis for athlete ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new rating template
   */
  async createTemplate(data: {
    templateId: string;
    name: string;
    starLevel: number;
    sport: string;
    position: string;
    ageGroup?: string;
    metrics: any;
    traits?: any;
    filmExpectations?: any;
    trainingFocus?: any;
    avatar?: string;
    rank?: number;
    xpLevel?: number;
  }) {
    try {
      const [template] = await db.insert(combineRatingTemplates)
        .values({
          template_id: data.templateId,
          name: data.name,
          star_level: data.starLevel,
          sport: data.sport,
          position: data.position,
          age_group: data.ageGroup,
          metrics: data.metrics,
          traits: data.traits,
          film_expectations: data.filmExpectations,
          training_focus: data.trainingFocus,
          avatar: data.avatar,
          rank: data.rank,
          xp_level: data.xpLevel
        })
        .returning();
      
      this.templateCount++;
      return template;
    } catch (error) {
      console.error('Failed to create rating template:', error);
      throw error;
    }
  }

  /**
   * Update an existing rating template
   */
  async updateTemplate(templateId: string, data: {
    name?: string;
    starLevel?: number;
    sport?: string;
    position?: string;
    ageGroup?: string;
    metrics?: any;
    traits?: any;
    filmExpectations?: any;
    trainingFocus?: any;
    avatar?: string;
    rank?: number;
    xpLevel?: number;
  }) {
    try {
      const [template] = await db.update(combineRatingTemplates)
        .set({
          name: data.name,
          star_level: data.starLevel,
          sport: data.sport,
          position: data.position,
          age_group: data.ageGroup,
          metrics: data.metrics,
          traits: data.traits,
          film_expectations: data.filmExpectations,
          training_focus: data.trainingFocus,
          avatar: data.avatar,
          rank: data.rank,
          xp_level: data.xpLevel
        })
        .where(eq(combineRatingTemplates.template_id, templateId))
        .returning();
      
      return template;
    } catch (error) {
      console.error(`Failed to update template with ID ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a combine rating template
   */
  async deleteTemplate(templateId: string) {
    try {
      const [deletedTemplate] = await db.delete(combineRatingTemplates)
        .where(eq(combineRatingTemplates.template_id, templateId))
        .returning();
      
      if (deletedTemplate) {
        this.templateCount--;
      }
      
      return deletedTemplate;
    } catch (error) {
      console.error(`Failed to delete template with ID ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Get all athlete ratings for a specific combine event
   */
  async getEventRatings(eventId: number) {
    try {
      // Check cache first
      if (this.eventRatingsCache[eventId]) {
        return this.eventRatingsCache[eventId];
      }
      
      const ratings = await db.select()
        .from(combineAthleteRatings)
        .where(eq(combineAthleteRatings.event_id, eventId))
        .orderBy(desc(combineAthleteRatings.created_at));
      
      // Cache the results
      this.eventRatingsCache[eventId] = ratings;
      
      return ratings;
    } catch (error) {
      console.error(`Failed to get ratings for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get combine statistics
   */
  async getCombineStats() {
    try {
      const templateCount = await db.select({
        count: { count: combineRatingTemplates.id }
      }).from(combineRatingTemplates);
      
      const ratingCount = await db.select({
        count: { count: combineAthleteRatings.id }
      }).from(combineAthleteRatings);
      
      const analysisCount = await db.select({
        count: { count: combineAnalysisResults.id }
      }).from(combineAnalysisResults);
      
      const sportBreakdown = await db.select({
        sport: combineAthleteRatings.sport,
        count: { count: combineAthleteRatings.id }
      })
      .from(combineAthleteRatings)
      .groupBy(combineAthleteRatings.sport);
      
      const positionBreakdown = await db.select({
        position: combineAthleteRatings.position,
        count: { count: combineAthleteRatings.id }
      })
      .from(combineAthleteRatings)
      .groupBy(combineAthleteRatings.position);
      
      const starLevelBreakdown = await db.select({
        starLevel: combineAthleteRatings.star_level,
        count: { count: combineAthleteRatings.id }
      })
      .from(combineAthleteRatings)
      .groupBy(combineAthleteRatings.star_level);
      
      return {
        templateCount: templateCount[0]?.count || 0,
        ratingCount: ratingCount[0]?.count || 0,
        analysisCount: analysisCount[0]?.count || 0,
        sportBreakdown,
        positionBreakdown,
        starLevelBreakdown
      };
    } catch (error) {
      console.error('Failed to get combine stats:', error);
      throw error;
    }
  }

  /**
   * Compare athlete metrics to a template
   */
  async compareToTemplate(templateId: string, metrics: any) {
    try {
      const template = await this.getTemplateById(templateId);
      
      if (!template) {
        throw new Error(`Template with ID ${templateId} not found`);
      }
      
      const templateMetrics = template.metrics || {};
      const comparisonResults: Record<string, any> = {};
      
      // Compare each metric
      for (const [key, value] of Object.entries(templateMetrics)) {
        const athleteValue = metrics[key];
        
        if (athleteValue !== undefined) {
          const diff = typeof athleteValue === 'number' && typeof value === 'number'
            ? athleteValue - (value as number)
            : 0;
          
          comparisonResults[key] = {
            templateValue: value,
            athleteValue,
            difference: diff,
            percentageDiff: typeof value === 'number' && value !== 0
              ? (diff / (value as number) * 100).toFixed(2) + '%'
              : 'N/A'
          };
        }
      }
      
      return {
        templateId,
        templateName: template.name,
        sport: template.sport,
        position: template.position,
        starLevel: template.star_level,
        metrics: comparisonResults
      };
    } catch (error) {
      console.error(`Failed to compare metrics to template ${templateId}:`, error);
      throw error;
    }
  }
}

export const combineService = new CombineService();