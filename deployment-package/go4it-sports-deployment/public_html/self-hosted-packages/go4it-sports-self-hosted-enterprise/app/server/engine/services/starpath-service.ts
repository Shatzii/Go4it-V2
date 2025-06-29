/**
 * StarPath Service
 * 
 * Handles the StarPath progression system - a PlayStation 5-quality experience
 * for neurodivergent athletes to track and visualize their development.
 * This service will eventually connect to the AI engine hosted on a private VPS.
 */

import { withRetry, logAIEngineActivity, aiEngineClient } from '../utils';
import { AI_ENGINE_CONFIG } from '../config';

export interface StarPathSkill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNextLevel: number;
  category: string;
  icon?: string;
  videoIds?: string[];
  relatedSkills?: string[];
}

export interface StarPathMission {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  xpReward: number;
  requirements?: {
    skillId: string;
    minLevel?: number;
  }[];
  objectives: {
    id: string;
    description: string;
    completed: boolean;
    progress?: number;
    total?: number;
  }[];
  unlocks?: string[];
}

export interface StarPathBadge {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  imageUrl?: string;
  earnedAt?: Date;
  progress?: number;
  total?: number;
}

export interface StarPathProfile {
  userId: string;
  starLevel: number;
  totalXp: number;
  xpToNextLevel: number;
  skills: StarPathSkill[];
  missions: StarPathMission[];
  badges: StarPathBadge[];
  activeMissions: string[];
  activeSkillFocus: string[];
  lastUpdated: Date;
}

export interface StarPathActivity {
  id: string;
  userId: string;
  type: 'skill_progress' | 'mission_progress' | 'badge_earned' | 'level_up';
  timestamp: Date;
  xpGained: number;
  details: Record<string, any>;
}

export class StarPathService {
  /**
   * Get the StarPath profile for a user
   * 
   * @param userId The ID of the user
   */
  async getStarPathProfile(userId: string): Promise<StarPathProfile | null> {
    try {
      logAIEngineActivity('getStarPathProfile', { userId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockStarPathProfile(userId);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.starPath}/profile/${userId}`
        );
        
        return response.data as StarPathProfile;
      });
    } catch (error) {
      logAIEngineActivity('getStarPathProfile', { userId }, null, error as Error);
      console.error('Error getting StarPath profile:', error);
      return null;
    }
  }
  
  /**
   * Update a user's StarPath profile based on new activity
   * 
   * @param userId The ID of the user
   * @param activityData The activity data to update with
   */
  async updateStarPathProfile(
    userId: string,
    activityData: {
      activityType: 'video_upload' | 'practice' | 'combine' | 'game' | 'drill';
      relatedSkills?: string[];
      performance?: number;
      videoId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<StarPathActivity | null> {
    try {
      logAIEngineActivity('updateStarPathProfile', { userId, ...activityData });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockStarPathActivity(userId, activityData.activityType);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.post(
          `${AI_ENGINE_CONFIG.endpoints.starPath}/update/${userId}`,
          activityData
        );
        
        return response.data as StarPathActivity;
      });
    } catch (error) {
      logAIEngineActivity('updateStarPathProfile', { userId, ...activityData }, null, error as Error);
      console.error('Error updating StarPath profile:', error);
      return null;
    }
  }
  
  /**
   * Get available missions for a user
   * 
   * @param userId The ID of the user
   */
  async getAvailableMissions(userId: string): Promise<StarPathMission[]> {
    try {
      logAIEngineActivity('getAvailableMissions', { userId });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockMissions(userId, 'available');
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.starPath}/missions/${userId}/available`
        );
        
        return response.data as StarPathMission[];
      });
    } catch (error) {
      logAIEngineActivity('getAvailableMissions', { userId }, null, error as Error);
      console.error('Error getting available missions:', error);
      return [];
    }
  }
  
  /**
   * Get activity history for a user
   * 
   * @param userId The ID of the user
   * @param limit The maximum number of activities to return
   */
  async getActivityHistory(userId: string, limit: number = 20): Promise<StarPathActivity[]> {
    try {
      logAIEngineActivity('getActivityHistory', { userId, limit });
      
      if (AI_ENGINE_CONFIG.useMockData) {
        // For development, return mock data
        // TODO: Connect to AI Engine when available
        return this.getMockActivityHistory(userId, limit);
      }
      
      // This is the actual implementation that will be used when the AI Engine is available
      return await withRetry(async () => {
        const response = await aiEngineClient.get(
          `${AI_ENGINE_CONFIG.endpoints.starPath}/activity/${userId}`,
          {
            params: { limit }
          }
        );
        
        return response.data as StarPathActivity[];
      });
    } catch (error) {
      logAIEngineActivity('getActivityHistory', { userId, limit }, null, error as Error);
      console.error('Error getting activity history:', error);
      return [];
    }
  }
  
  /**
   * For development only - get mock StarPath profile
   * This will be replaced by the actual AI Engine integration
   */
  private getMockStarPathProfile(userId: string): StarPathProfile {
    // Generate deterministic but realistic-looking sample data
    const seed = parseInt(userId.replace(/\D/g, '') || '1', 10);
    
    const skillCategories = [
      'Offensive',
      'Defensive',
      'Physical',
      'Mental',
      'Technical'
    ];
    
    const skillNames = {
      Offensive: ['Shooting', 'Passing', 'Ball Handling', 'Finishing', 'Playmaking'],
      Defensive: ['On-Ball Defense', 'Help Defense', 'Rebounding', 'Shot Blocking', 'Steals'],
      Physical: ['Speed', 'Strength', 'Vertical', 'Agility', 'Endurance'],
      Mental: ['Basketball IQ', 'Court Vision', 'Focus', 'Resilience', 'Leadership'],
      Technical: ['Footwork', 'Post Moves', 'Dribbling', 'Free Throws', 'Positioning']
    };
    
    // Generate skills
    const skills: StarPathSkill[] = [];
    
    for (const category of skillCategories) {
      const categorySkills = skillNames[category as keyof typeof skillNames];
      
      for (const name of categorySkills) {
        const skillSeed = (seed + name.length + category.length) % 100;
        const level = Math.max(1, Math.min(10, Math.floor((skillSeed % 10) + 1)));
        
        skills.push({
          id: `skill_${category.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}`,
          name,
          description: `${name} skill in the ${category} category`,
          level,
          maxLevel: 10,
          xp: level * 100 + (skillSeed % 100),
          xpToNextLevel: (level + 1) * 100,
          category,
          relatedSkills: categorySkills
            .filter(s => s !== name)
            .slice(0, 2)
            .map(s => `skill_${category.toLowerCase()}_${s.toLowerCase().replace(/\s+/g, '_')}`)
        });
      }
    }
    
    // Generate missions
    const missions = this.getMockMissions(userId, null);
    
    // Generate badges
    const badges = this.getMockBadges(userId);
    
    // Set a couple of active missions and skill focus areas
    const activeMissions = missions
      .filter(m => m.status === 'in_progress')
      .slice(0, 3)
      .map(m => m.id);
    
    const activeSkillFocus = skills
      .sort((a, b) => a.level - b.level)
      .slice(0, 3)
      .map(s => s.id);
    
    return {
      userId,
      starLevel: 5 + Math.floor(seed % 20),
      totalXp: 5000 + (seed * 100),
      xpToNextLevel: 1000,
      skills,
      missions,
      badges,
      activeMissions,
      activeSkillFocus,
      lastUpdated: new Date()
    };
  }
  
  /**
   * For development only - get mock missions
   * This will be replaced by the actual AI Engine integration
   */
  private getMockMissions(userId: string, status: 'locked' | 'available' | 'in_progress' | 'completed' | null = null): StarPathMission[] {
    // Generate deterministic but realistic-looking sample data
    const seed = parseInt(userId.replace(/\D/g, '') || '1', 10);
    
    const missionTemplates = [
      {
        title: 'Perfect Your Jumper',
        description: 'Upload 3 videos of your jump shot for analysis',
        xpReward: 300,
        objectives: [
          { description: 'Upload jump shot video from the front', total: 1 },
          { description: 'Upload jump shot video from the side', total: 1 },
          { description: 'Upload jump shot video from 45-degree angle', total: 1 }
        ]
      },
      {
        title: 'Dribble Master',
        description: 'Complete the advanced dribbling drill challenge',
        xpReward: 250,
        objectives: [
          { description: 'Record time for figure-8 drill', total: 1 },
          { description: 'Complete crossover drill', total: 20 },
          { description: 'Upload video of between-legs combo', total: 1 }
        ]
      },
      {
        title: 'Defense Specialist',
        description: 'Demonstrate defensive skills in game situations',
        xpReward: 400,
        objectives: [
          { description: 'Record defensive stance drill', total: 1 },
          { description: 'Upload video showing help defense', total: 1 },
          { description: 'Complete defensive slides drill', total: 1 }
        ]
      },
      {
        title: 'Free Throw Ace',
        description: 'Perfect your free throw technique',
        xpReward: 200,
        objectives: [
          { description: 'Make consecutive free throws', total: 10 },
          { description: 'Upload video of free throw form', total: 1 },
          { description: 'Complete free throw practice session', total: 5 }
        ]
      },
      {
        title: 'Basketball IQ Challenge',
        description: 'Demonstrate your understanding of the game',
        xpReward: 350,
        objectives: [
          { description: 'Complete basketball situation quiz', total: 1 },
          { description: 'Analyze game footage', total: 1 },
          { description: 'Create a play diagram', total: 1 }
        ]
      }
    ];
    
    const statuses: Array<'locked' | 'available' | 'in_progress' | 'completed'> = [
      'locked', 'available', 'in_progress', 'completed'
    ];
    
    const missions: StarPathMission[] = [];
    
    for (let i = 0; i < 10; i++) {
      const template = missionTemplates[i % missionTemplates.length];
      const missionSeed = seed + i;
      const missionStatus = status || statuses[missionSeed % statuses.length];
      
      const objectives = template.objectives.map((obj, index) => {
        let completed = false;
        let progress = 0;
        
        if (missionStatus === 'completed') {
          completed = true;
          progress = obj.total || 1;
        } else if (missionStatus === 'in_progress') {
          // For in_progress, randomly complete some objectives
          if ((missionSeed + index) % 3 === 0) {
            completed = true;
            progress = obj.total || 1;
          } else {
            progress = Math.floor(((missionSeed + index) % (obj.total || 1)) + 1);
            completed = progress >= (obj.total || 1);
          }
        }
        
        return {
          id: `objective_${i}_${index}`,
          description: obj.description,
          completed,
          progress,
          total: obj.total
        };
      });
      
      missions.push({
        id: `mission_${i + 1}`,
        title: `${template.title} ${i + 1}`,
        description: template.description,
        status: missionStatus,
        xpReward: template.xpReward,
        objectives,
        unlocks: i < 8 ? [`mission_${i + 2}`] : undefined
      });
    }
    
    if (status) {
      return missions.filter(m => m.status === status);
    }
    
    return missions;
  }
  
  /**
   * For development only - get mock badges
   * This will be replaced by the actual AI Engine integration
   */
  private getMockBadges(userId: string): StarPathBadge[] {
    // Generate deterministic but realistic-looking sample data
    const seed = parseInt(userId.replace(/\D/g, '') || '1', 10);
    
    const badgeTemplates = [
      {
        name: 'Sharpshooter',
        description: 'Exceptional shooting accuracy from various positions',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Floor General',
        description: 'Leadership and decision making on the court',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Defensive Anchor',
        description: 'Elite defensive skills and presence',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Playmaker',
        description: 'Creating opportunities for yourself and teammates',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Athletic Finisher',
        description: 'Ability to finish plays with athletic moves',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Basketball IQ',
        description: 'Understanding of game situations and strategies',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Clutch Performer',
        description: 'Excellence in high-pressure situations',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Team Player',
        description: 'Supporting teammates and putting team first',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Consistency',
        description: 'Maintaining high level of performance consistently',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      },
      {
        name: 'Versatility',
        description: 'Ability to perform well in multiple positions and roles',
        tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond']
      }
    ];
    
    const badges: StarPathBadge[] = [];
    
    for (let i = 0; i < badgeTemplates.length; i++) {
      const template = badgeTemplates[i];
      const badgeSeed = (seed + i) % 20;
      
      // Determine how far the user has progressed on this badge line
      const earnedTierIndex = badgeSeed % 6; // 0-5, with 5 meaning no badge earned yet
      const hasBadge = earnedTierIndex < template.tiers.length;
      
      if (hasBadge) {
        const tier = template.tiers[earnedTierIndex] as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
        
        badges.push({
          id: `badge_${template.name.toLowerCase().replace(/\s+/g, '_')}_${tier}`,
          name: `${template.name} ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
          description: template.description,
          tier,
          earnedAt: new Date(Date.now() - (badgeSeed * 24 * 60 * 60 * 1000)),
          imageUrl: `/assets/badges/${template.name.toLowerCase().replace(/\s+/g, '_')}_${tier}.png`
        });
      }
      
      // Add the next tier as in progress if not at diamond
      if (earnedTierIndex < template.tiers.length - 1) {
        const nextTierIndex = earnedTierIndex + 1;
        const nextTier = template.tiers[nextTierIndex] as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
        const progress = (badgeSeed * 7) % 100;
        
        badges.push({
          id: `badge_${template.name.toLowerCase().replace(/\s+/g, '_')}_${nextTier}`,
          name: `${template.name} ${nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}`,
          description: template.description,
          tier: nextTier,
          progress,
          total: 100,
          imageUrl: `/assets/badges/${template.name.toLowerCase().replace(/\s+/g, '_')}_${nextTier}.png`
        });
      }
    }
    
    return badges;
  }
  
  /**
   * For development only - get mock StarPath activity
   * This will be replaced by the actual AI Engine integration
   */
  private getMockStarPathActivity(
    userId: string,
    activityType: 'video_upload' | 'practice' | 'combine' | 'game' | 'drill'
  ): StarPathActivity {
    // Generate deterministic but realistic-looking sample data
    const seed = parseInt(userId.replace(/\D/g, '') || '1', 10);
    
    const activityTypes: Array<'skill_progress' | 'mission_progress' | 'badge_earned' | 'level_up'> = [
      'skill_progress',
      'mission_progress',
      'badge_earned',
      'level_up'
    ];
    
    const type = activityTypes[seed % activityTypes.length];
    const xpGained = 50 + (seed % 200);
    let details: Record<string, any> = {};
    
    switch (type) {
      case 'skill_progress':
        details = {
          skillId: `skill_offensive_shooting`,
          skillName: 'Shooting',
          oldLevel: 3,
          newLevel: 4,
          oldXp: 300,
          newXp: 400,
          sourceActivity: activityType
        };
        break;
      case 'mission_progress':
        details = {
          missionId: 'mission_3',
          missionTitle: 'Dribble Master 3',
          objectiveCompleted: 'Upload video of between-legs combo',
          objectivesCompleted: 2,
          objectivesTotal: 3,
          sourceActivity: activityType
        };
        break;
      case 'badge_earned':
        details = {
          badgeId: 'badge_sharpshooter_silver',
          badgeName: 'Sharpshooter Silver',
          previousTier: 'bronze',
          newTier: 'silver',
          sourceActivity: activityType
        };
        break;
      case 'level_up':
        details = {
          oldLevel: 12,
          newLevel: 13,
          totalXp: 5000 + xpGained,
          sourceActivity: activityType
        };
        break;
    }
    
    return {
      id: `activity_${Date.now()}`,
      userId,
      type,
      timestamp: new Date(),
      xpGained,
      details
    };
  }
  
  /**
   * For development only - get mock activity history
   * This will be replaced by the actual AI Engine integration
   */
  private getMockActivityHistory(userId: string, limit: number): StarPathActivity[] {
    // Generate deterministic but realistic-looking sample data
    const activities: StarPathActivity[] = [];
    
    for (let i = 0; i < limit; i++) {
      const activityTypes = ['video_upload', 'practice', 'combine', 'game', 'drill'] as const;
      const activityType = activityTypes[i % activityTypes.length];
      
      // Create an activity from a few days ago (newer items first)
      const activity = this.getMockStarPathActivity(userId, activityType);
      activity.id = `activity_${Date.now() - (i * 86400000)}`;
      activity.timestamp = new Date(Date.now() - (i * 86400000));
      
      activities.push(activity);
    }
    
    return activities;
  }
}