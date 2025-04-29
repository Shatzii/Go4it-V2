import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import multer from 'multer';
import path from 'path';
import { 
  playerProgress, 
  playerXpTransactions, 
  starPaths, 
  users,
  insertStarPathSchema
} from '@shared/schema';
import { eq } from 'drizzle-orm';

export const playerRoutes = Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.join(process.cwd(), 'uploads/videos'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

/**
 * Helper function to add XP to a player and handle level ups
 */
async function addXpToPlayer(userId: number, amount: number, source: string, description: string) {
  try {
    // Get current player progress
    const progress = await storage.getPlayerProgress(userId);
    
    if (!progress) {
      // Create initial progress record if not exists
      await storage.createPlayerProgress({
        userId,
        currentLevel: 1,
        levelXp: amount,
        xpToNextLevel: 100,
        totalXp: amount,
        streakDays: 0,
        rank: 'Rookie'
      });
      
      // Log the XP transaction
      await storage.createPlayerXpTransaction({
        userId,
        amount,
        source,
        description
      });
      
      return {
        success: true,
        xpEarned: amount,
        leveledUp: false,
        newLevel: 1,
        totalXp: amount
      };
    }
    
    // Current state
    const currentLevel = progress.currentLevel;
    const currentLevelXp = progress.levelXp;
    const currentTotalXp = progress.totalXp;
    const neededForNextLevel = progress.xpToNextLevel;
    
    // Add XP
    let newLevelXp = currentLevelXp + amount;
    let newTotalXp = currentTotalXp + amount;
    let newLevel = currentLevel;
    let leveledUp = false;
    let levelsGained = 0;
    let xpToNextLevel = neededForNextLevel;
    let rank = progress.rank;
    
    // Check if player leveled up
    if (newLevelXp >= neededForNextLevel) {
      leveledUp = true;
      
      // Handle multiple level ups in one transaction
      while (newLevelXp >= xpToNextLevel) {
        newLevelXp -= xpToNextLevel;
        newLevel++;
        levelsGained++;
        
        // Calculate XP needed for the next level (increases with each level)
        xpToNextLevel = Math.floor(100 * Math.pow(1.2, newLevel - 1));
        
        // Update rank based on new level
        if (newLevel >= 50) {
          rank = 'Legend';
        } else if (newLevel >= 30) {
          rank = 'MVP';
        } else if (newLevel >= 20) {
          rank = 'All-Star';
        } else if (newLevel >= 10) {
          rank = 'Rising Star';
        } else if (newLevel >= 5) {
          rank = 'Prospect';
        }
      }
      
      // Update player progress with new values
      await storage.updatePlayerProgress(progress.id, {
        currentLevel: newLevel,
        levelXp: newLevelXp,
        xpToNextLevel,
        totalXp: newTotalXp,
        rank
      });
    } else {
      // Just update XP, no level up
      await storage.updatePlayerProgress(progress.id, {
        levelXp: newLevelXp,
        totalXp: newTotalXp
      });
    }
    
    // Log the XP transaction
    await storage.createPlayerXpTransaction({
      userId,
      amount,
      source,
      description
    });
    
    return {
      success: true,
      xpEarned: amount,
      leveledUp,
      levelsGained,
      newLevel,
      totalXp: newTotalXp,
      rank
    };
  } catch (error) {
    console.error('Error adding XP to player:', error);
    return { success: false, error: 'Failed to add XP' };
  }
}

// Get player progress endpoint
playerRoutes.get('/progress', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const progress = await storage.getPlayerProgress(userId);
    if (!progress) {
      // Create default progress for new users
      const newProgress = await storage.createPlayerProgress({
        userId,
        currentLevel: 1,
        levelXp: 0,
        xpToNextLevel: 100,
        totalXp: 0,
        streakDays: 0,
        rank: 'Rookie'
      });
      
      return res.json(newProgress);
    }
    
    return res.json(progress);
  } catch (error) {
    console.error('Error fetching player progress:', error);
    return res.status(500).json({ message: 'Error fetching player progress' });
  }
});

// Check and update player streak
playerRoutes.post('/streak/check', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get current player progress
    const progress = await storage.getPlayerProgress(userId);
    if (!progress) {
      return res.status(404).json({ message: 'Player progress not found' });
    }
    
    const now = new Date();
    const lastActive = progress.lastActive ? new Date(progress.lastActive) : null;
    let streakDays = progress.streakDays || 0;
    let streakUpdated = false;
    let streakXpEarned = 0;
    let streakMilestoneReached = false;
    
    if (!lastActive) {
      // First login, start streak
      streakDays = 1;
      streakUpdated = true;
    } else {
      // Calculate hours since last active
      const hoursDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff >= 18 && hoursDiff <= 36) {
        // Daily check-in (between 18-36 hours), increment streak
        streakDays++;
        streakUpdated = true;
        
        // Check for streak milestones and award bonus XP
        if (streakDays === 3) {
          streakXpEarned = 50;
          streakMilestoneReached = true;
        } else if (streakDays === 7) {
          streakXpEarned = 100;
          streakMilestoneReached = true;
        } else if (streakDays === 14) {
          streakXpEarned = 200;
          streakMilestoneReached = true;
        } else if (streakDays === 30) {
          streakXpEarned = 500;
          streakMilestoneReached = true;
        }
      } else if (hoursDiff > 36) {
        // Streak broken (more than 36 hours since last login)
        streakDays = 1;
        streakUpdated = true;
      }
    }
    
    // Update player progress
    await storage.updatePlayerProgress(progress.id, {
      streakDays,
      lastActive: now
    });
    
    // If a streak milestone was reached, award bonus XP
    let xpResult = null;
    if (streakXpEarned > 0) {
      xpResult = await addXpToPlayer(
        userId, 
        streakXpEarned, 
        'streak_milestone', 
        `${streakDays}-day login streak bonus`
      );
    }
    
    return res.json({
      streakDays,
      streakUpdated,
      streakMilestoneReached,
      streakXpEarned,
      xpResult
    });
  } catch (error) {
    console.error('Error updating player streak:', error);
    return res.status(500).json({ message: 'Error updating player streak' });
  }
});

// Create or update a player's star path
playerRoutes.post('/star-path', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Validate request data
    const validatedData = insertStarPathSchema.parse({
      ...req.body,
      userId
    });
    
    // Check if player already has a star path
    const existingStarPath = await storage.getStarPathByUserId(userId);
    
    if (existingStarPath) {
      // Update existing star path
      const updatedStarPath = await storage.updateStarPath(existingStarPath.id, {
        sportType: validatedData.sportType,
        position: validatedData.position,
        attributes: validatedData.attributes,
        updatedAt: new Date()
      });
      
      return res.json(updatedStarPath);
    } else {
      // Define default attribute values for new star paths
      const defaultAttributes = {
        physical: {
          speed: 60,
          strength: 60,
          agility: 60,
          endurance: 60,
          verticalJump: 60
        },
        technical: {
          technique: 60,
          ballControl: 60,
          accuracy: 60,
          gameIQ: 60
        },
        mental: {
          focus: 60,
          confidence: 60,
          determination: 60,
          teamwork: 60
        }
      };
      
      // Create new star path with default values
      const newStarPath = await storage.createStarPath({
        userId,
        sportType: validatedData.sportType,
        position: validatedData.position || '',
        currentStarLevel: 1,
        starXp: 0,
        attributes: validatedData.attributes || defaultAttributes
      });
      
      return res.status(201).json(newStarPath);
    }
  } catch (error) {
    console.error('Error creating/updating star path:', error);
    return res.status(500).json({ message: 'Error creating/updating star path' });
  }
});

// Get a player's star path
playerRoutes.get('/star-path/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Check if the user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get the star path
    const starPath = await storage.getStarPathByUserId(userId);
    if (!starPath) {
      return res.status(404).json({ message: 'Star path not found for this user' });
    }
    
    return res.json(starPath);
  } catch (error) {
    console.error('Error fetching star path:', error);
    return res.status(500).json({ message: 'Error fetching star path' });
  }
});

// Update a player's attributes in a specific category
playerRoutes.post('/star-path/:userId/attributes', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Verify permissions - only self or coach can update
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    
    if (currentUserId !== userId && currentUserRole !== 'coach' && currentUserRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this player' });
    }
    
    // Get the star path
    const starPath = await storage.getStarPathByUserId(userId);
    if (!starPath) {
      return res.status(404).json({ message: 'Star path not found for this user' });
    }
    
    const { type, attributes } = req.body;
    
    if (!type || !attributes || typeof attributes !== 'object') {
      return res.status(400).json({ message: 'Invalid request. Type and attributes required' });
    }
    
    // Validate type
    if (!['physical', 'technical', 'mental'].includes(type)) {
      return res.status(400).json({ 
        message: 'Invalid type. Must be physical, technical, or mental' 
      });
    }
    
    // Update the attributes for the specified type
    const updatedAttributes = {
      ...starPath.attributes,
      [type]: {
        ...(starPath.attributes[type] || {}),
        ...attributes
      }
    };
    
    // Update star path
    const updatedStarPath = await storage.updateStarPath(starPath.id, {
      attributes: updatedAttributes,
      updatedAt: new Date()
    });
    
    return res.json(updatedStarPath);
  } catch (error) {
    console.error('Error updating star path attributes:', error);
    return res.status(500).json({ message: 'Error updating star path attributes' });
  }
});

// Get a player's attributes in a specific category
playerRoutes.get('/star-path/:userId/attributes/:type', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const attributeType = req.params.type; // physical, technical, mental
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    if (!['physical', 'technical', 'mental'].includes(attributeType)) {
      return res.status(400).json({ message: 'Invalid attribute type. Must be physical, technical, or mental' });
    }
    
    // Get the star path
    const starPath = await storage.getStarPathByUserId(userId);
    if (!starPath) {
      return res.status(404).json({ message: 'Star path not found for this user' });
    }
    
    // Return only the requested attribute type
    const attributes = starPath.attributes[attributeType] || {};
    
    return res.json({
      userId,
      attributeType,
      attributes
    });
  } catch (error) {
    console.error('Error fetching star path attributes:', error);
    return res.status(500).json({ message: 'Error fetching star path attributes' });
  }
});

// Level up a player's star path
playerRoutes.post('/star-path/:userId/level-up', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Verify permissions - only self or coach can update
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    
    if (currentUserId !== userId && currentUserRole !== 'coach' && currentUserRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this player' });
    }
    
    // Get the star path
    const starPath = await storage.getStarPathByUserId(userId);
    if (!starPath) {
      return res.status(404).json({ message: 'Star path not found for this user' });
    }
    
    // Check if player has enough XP to level up
    const currentStarLevel = starPath.currentStarLevel;
    const starXp = starPath.starXp;
    
    // Calculate XP required for next level based on current level
    // Higher levels require more XP
    const requiredXp = currentStarLevel * 1000;
    
    if (starXp < requiredXp) {
      return res.status(400).json({ 
        message: 'Not enough XP to level up', 
        currentXp: starXp, 
        requiredXp,
        xpNeeded: requiredXp - starXp
      });
    }
    
    // Level up the player
    const updatedStarPath = await storage.updateStarPath(starPath.id, {
      currentStarLevel: currentStarLevel + 1,
      starXp: starXp - requiredXp, // Subtract the spent XP
      updatedAt: new Date()
    });
    
    // Add XP to regular player progress as a reward for star level up
    const xpReward = currentStarLevel * 200; // Reward scales with level
    const xpResult = await addXpToPlayer(
      userId,
      xpReward,
      'star_level_up',
      `Reached Star Level ${currentStarLevel + 1}`
    );
    
    return res.json({
      success: true,
      previousLevel: currentStarLevel,
      newLevel: currentStarLevel + 1,
      remainingXp: updatedStarPath.starXp,
      xpReward,
      xpResult,
      starPath: updatedStarPath
    });
  } catch (error) {
    console.error('Error leveling up star path:', error);
    return res.status(500).json({ message: 'Error leveling up star path' });
  }
});

// Verify a workout submission
playerRoutes.post('/verify-workout', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { videoId, workoutType, duration, intensity, notes } = req.body;
    
    if (!videoId || !workoutType) {
      return res.status(400).json({ message: 'Missing required fields: videoId and workoutType' });
    }
    
    // Verify the video exists and belongs to the user
    const video = await storage.getVideo(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    if (video.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to use this video' });
    }
    
    // Create workout verification record
    const verification = await storage.createWorkoutVerification({
      userId,
      videoId,
      workoutType,
      duration: duration || 0,
      intensity: intensity || 'medium',
      status: 'pending', // Initially pending until verified
      notes: notes || '',
      createdAt: new Date()
    });
    
    // Award XP for submitting a workout (base amount)
    const baseXP = 50;
    // Additional XP based on duration (10 XP per minute, up to 10 minutes)
    const durationXP = Math.min(duration || 0, 10) * 10;
    // Total XP earned
    const xpEarned = baseXP + durationXP;
    
    const xpResult = await addXpToPlayer(
      userId,
      xpEarned,
      'workout_submission',
      `Submitted ${workoutType} workout (${duration || 0} minutes)`
    );
    
    // Update player's star path XP
    const starPath = await storage.getStarPathByUserId(userId);
    if (starPath) {
      // Star path XP is 2x regular XP
      const starXP = xpEarned * 2;
      await storage.updateStarPath(starPath.id, {
        starXp: starPath.starXp + starXP,
        updatedAt: new Date()
      });
    }
    
    return res.status(201).json({
      success: true,
      verification,
      xpEarned,
      xpResult,
      starXpEarned: xpEarned * 2
    });
  } catch (error) {
    console.error('Error verifying workout:', error);
    return res.status(500).json({ message: 'Error verifying workout' });
  }
});

export default playerRoutes;