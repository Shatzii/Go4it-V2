/**
 * Go4It Sports Star Profile Connector
 * 
 * This module connects the Star Profile system to the Admin CMS
 * for full content management capabilities
 */

import { storage } from '../storage';
import { db } from '../db';
import { 
  athleteStarProfiles, 
  athleteProfiles, 
  users,
  athleteStarPath,
  userDrillProgress,
  workoutVerifications,
  workoutVerificationCheckpoints,
  starPaths
} from '@shared/schema';
import { eq, and, desc, asc, inArray, sql } from 'drizzle-orm';

/**
 * StarProfileConnector
 * 
 * Class to handle the connection between Star Profile data and Admin CMS
 */
export class StarProfileConnector {
  /**
   * Standardize a Star profile according to the Five-Star Athlete standards
   * Ensures proper categorization and field completion for admin view
   */
  async standardizeProfile(userId: number): Promise<boolean> {
    try {
      // Get existing data
      const starProfile = await storage.getAthleteStarProfile(userId);
      const userProfile = await storage.getAthleteProfile(userId);
      const user = await storage.getUser(userId);
      const starPath = await storage.getAthleteStarPath(userId);
      
      if (!user) {
        console.error(`User ${userId} not found`);
        return false;
      }
      
      // Create or update the Star profile with proper standards using schema fields
      const standardProfile = {
        userId,
        name: starProfile?.name || `${user.name}'s Star Profile`,
        starLevel: starProfile?.starLevel || 1,
        xpLevel: starProfile?.xpLevel || 0,
        active: starProfile?.active !== undefined ? starProfile.active : true,
        avatar: starProfile?.avatar || null,
        // Store additional custom fields in the metrics JSON field
        metrics: {
          activeStreak: starProfile?.activeStreak || 0,
          longestStreak: starProfile?.longestStreak || 0,
          lastActivity: new Date(),
          goalsCompleted: 0,
          goalsInProgress: 0,
          currentRank: 'Rookie',
          badgesEarned: 0,
          achievementsUnlocked: 0,
          nextMilestone: 'Rising Prospect',
          sportSpecialty: userProfile?.sportType || 'basketball',
          currentFocus: 'Fundamentals',
          personalizedPathCreated: false,
          preferredTrainingTime: '18:00',
          weeklyTrainingMinutes: 180,
          profilePublic: true,
          starPathActive: starPath ? true : false,
          completedDrills: 0, // Will be populated from DB
          verifiedWorkouts: 0, // Will be populated from DB
          status: 'active',
          isFeatured: false
        },
        // Initialize traits JSON field as empty object
        traits: {}
      };
      
      // Count completed drills - use lastCompletedAt field as a proxy for completion
      const drillProgress = await db.query.userDrillProgress.findMany({
        where: eq(userDrillProgress.userId, userId)
      });
      
      // Store workout data in metrics
      const completedDrills = drillProgress.filter(p => p.lastCompletedAt !== null).length;
      
      // Count verified workouts - use completedAt field as a proxy for verification
      const workouts = await db.query.workoutVerifications.findMany({
        where: eq(workoutVerifications.userId, userId)
      });
      
      const verifiedWorkouts = workouts.filter(w => w.completedAt !== null).length;
      
      // Update metrics with these values
      standardProfile.metrics = {
        ...standardProfile.metrics,
        completedDrills,
        verifiedWorkouts,
        skillProgress: {},
        nextAchievements: []
      };
      
      // Save the standardized profile
      if (starProfile) {
        await storage.updateAthleteStarProfile(userId, standardProfile);
      } else {
        await storage.createAthleteStarProfile(standardProfile);
      }
      
      return true;
    } catch (error) {
      console.error('Error standardizing Star profile:', error);
      return false;
    }
  }
  
  /**
   * Get all user profiles that need standardization (missing Star profiles)
   */
  async getProfilesNeedingStandardization(): Promise<number[]> {
    try {
      // Get all athlete users
      const athletes = await storage.getAllAthletes();
      const athleteIds = athletes.map(a => a.id);
      
      // Get all athlete star profiles
      const starProfiles = await storage.getActiveAthleteStarProfiles();
      const profiledUserIds = starProfiles.map(p => p.userId);
      
      // Find athletes without star profiles
      return athleteIds.filter(id => !profiledUserIds.includes(id));
    } catch (error) {
      console.error('Error finding profiles needing standardization:', error);
      return [];
    }
  }
  
  /**
   * Bulk standardize all profiles to ensure consistency
   */
  async bulkStandardizeProfiles(): Promise<{ success: number, failed: number }> {
    try {
      const needStandardization = await this.getProfilesNeedingStandardization();
      console.log(`Found ${needStandardization.length} profiles needing standardization`);
      
      let success = 0;
      let failed = 0;
      
      for (const userId of needStandardization) {
        const result = await this.standardizeProfile(userId);
        if (result) {
          success++;
        } else {
          failed++;
        }
      }
      
      return { success, failed };
    } catch (error) {
      console.error('Error bulk standardizing profiles:', error);
      return { success: 0, failed: 0 };
    }
  }
  
  /**
   * Get list of Star standard profiles for CMS
   */
  async getStarStandardProfiles(limit: number = 20, offset: number = 0, sortBy: string = 'currentStarLevel', sortDir: 'asc' | 'desc' = 'desc'): Promise<any[]> {
    try {
      // Build sort criteria - use starLevel field which does exist in the schema
      let orderBy: any;
      
      // Default to sorting by starLevel since custom fields don't exist yet
      orderBy = sortDir === 'asc' ? asc(athleteStarProfiles.starLevel) : desc(athleteStarProfiles.starLevel);
      
      // Get profiles with user data joined
      const profiles = await db.select({
        profile: athleteStarProfiles,
        user: {
          id: users.id,
          username: users.username,
          name: users.name,
          email: users.email,
          profileImage: users.profileImage
        }
      })
      .from(athleteStarProfiles)
      .leftJoin(users, eq(athleteStarProfiles.userId, users.id))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);
      
      return profiles.map(({ profile, user }) => ({
        ...profile,
        username: user.username,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }));
    } catch (error) {
      console.error('Error getting Star standard profiles:', error);
      return [];
    }
  }
  
  /**
   * Get detailed Star standard profile for CMS editing
   */
  async getStarStandardProfileDetail(userId: number): Promise<any> {
    try {
      // Get base profile data
      const profile = await storage.getAthleteStarProfile(userId);
      if (!profile) {
        return null;
      }
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return null;
      }
      
      // Get star path data
      const starPath = await storage.getAthleteStarPath(userId);
      
      // Get drill progress
      const drillProgress = await db.query.userDrillProgress.findMany({
        where: eq(userDrillProgress.userId, userId)
      });
      
      // Get workout verifications
      const workouts = await db.query.workoutVerifications.findMany({
        where: eq(workoutVerifications.userId, userId),
        orderBy: [desc(workoutVerifications.createdAt)],
        limit: 10
      });
      
      // Initialize empty arrays for badges and achievements since tables don't exist yet
      const badges = [];
      const achievements = [];
      
      // Combine all data
      return {
        profile,
        user: {
          id: user.id,
          username: user.username,
          name: user.name, // Use name field instead of firstName/lastName which doesn't exist
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          role: user.role
        },
        starPath: starPath || null,
        drillProgress: drillProgress.map(p => ({
          id: p.id,
          drillId: p.drillId,
          isCompleted: p.lastCompletedAt !== null, // Use lastCompletedAt as a proxy for completion
          completionCount: p.completionCount,
          lastCompletedAt: p.lastCompletedAt
        })),
        workouts: workouts.map(w => ({
          id: w.id,
          exerciseType: w.exerciseType,
          status: w.status,
          completedAt: w.completedAt,
          startedAt: w.startedAt,
          feedback: w.feedback
        })),
        badges: badges.map(b => ({
          id: b.id,
          badgeId: b.badgeId,
          awardedAt: b.awardedAt
        })),
        achievements: achievements.map(a => ({
          id: a.id,
          achievementId: a.achievementId,
          progress: a.progress,
          completed: a.completed,
          completedAt: a.completedAt
        }))
      };
    } catch (error) {
      console.error('Error getting Star standard profile detail:', error);
      return null;
    }
  }
  
  /**
   * Update a Star standard profile via CMS
   */
  async updateStarStandardProfile(userId: number, data: any): Promise<boolean> {
    try {
      // Validate the data
      if (!userId || !data) {
        return false;
      }
      
      // Update the profile with fields that exist in the schema
      await storage.updateAthleteStarProfile(userId, {
        starLevel: data.starLevel || data.currentStarLevel,
        xpLevel: data.xpLevel || data.xpTotal,
        active: data.active !== undefined ? data.active : true,
        traits: data.traits || {},
        // Store additional fields in the metrics JSON field if they don't exist in the schema
        metrics: {
          activeStreak: data.activeStreak,
          longestStreak: data.longestStreak,
          currentRank: data.currentRank,
          badgesEarned: data.badgesEarned,
          achievementsUnlocked: data.achievementsUnlocked,
          nextMilestone: data.nextMilestone,
          currentFocus: data.currentFocus,
          personalizedPathCreated: data.personalizedPathCreated,
          preferredTrainingTime: data.preferredTrainingTime,
          weeklyTrainingMinutes: data.weeklyTrainingMinutes,
          profilePublic: data.profilePublic,
          isFeatured: data.isFeatured,
          status: data.status,
          ...(data.metrics || {})  // Include any existing metrics from the data object
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error updating Star standard profile:', error);
      return false;
    }
  }
  
  /**
   * Register Star profile routes in the admin CMS
   */
  registerAdminRoutes(app: any): void {
    // Get all Star standard profiles
    app.get('/api/admin/star-profiles', async (req, res) => {
      try {
        const limit = parseInt(req.query.limit as string || '20', 10);
        const offset = parseInt(req.query.offset as string || '0', 10);
        const sortBy = req.query.sortBy as string || 'currentStarLevel';
        const sortDir = req.query.sortDir as 'asc' | 'desc' || 'desc';
        
        const profiles = await this.getStarStandardProfiles(limit, offset, sortBy, sortDir);
        res.json(profiles);
      } catch (error) {
        console.error('Error getting Star profiles:', error);
        res.status(500).json({ error: 'Failed to get Star profiles' });
      }
    });
    
    // Get a specific Star standard profile
    app.get('/api/admin/star-profiles/:userId', async (req, res) => {
      try {
        const userId = parseInt(req.params.userId, 10);
        const profile = await this.getStarStandardProfileDetail(userId);
        
        if (!profile) {
          res.status(404).json({ error: 'Profile not found' });
          return;
        }
        
        res.json(profile);
      } catch (error) {
        console.error('Error getting Star profile detail:', error);
        res.status(500).json({ error: 'Failed to get Star profile detail' });
      }
    });
    
    // Update a Star standard profile
    app.put('/api/admin/star-profiles/:userId', async (req, res) => {
      try {
        const userId = parseInt(req.params.userId, 10);
        const result = await this.updateStarStandardProfile(userId, req.body);
        
        if (!result) {
          res.status(400).json({ error: 'Failed to update Star profile' });
          return;
        }
        
        res.json({ success: true });
      } catch (error) {
        console.error('Error updating Star profile:', error);
        res.status(500).json({ error: 'Failed to update Star profile' });
      }
    });
    
    // Standardize a specific profile
    app.post('/api/admin/star-profiles/:userId/standardize', async (req, res) => {
      try {
        const userId = parseInt(req.params.userId, 10);
        const result = await this.standardizeProfile(userId);
        
        if (!result) {
          res.status(400).json({ error: 'Failed to standardize profile' });
          return;
        }
        
        res.json({ success: true });
      } catch (error) {
        console.error('Error standardizing profile:', error);
        res.status(500).json({ error: 'Failed to standardize profile' });
      }
    });
    
    // Bulk standardize all profiles
    app.post('/api/admin/star-profiles/bulk-standardize', async (req, res) => {
      try {
        const result = await this.bulkStandardizeProfiles();
        res.json(result);
      } catch (error) {
        console.error('Error bulk standardizing profiles:', error);
        res.status(500).json({ error: 'Failed to bulk standardize profiles' });
      }
    });
  }
}

export const starProfileConnector = new StarProfileConnector();