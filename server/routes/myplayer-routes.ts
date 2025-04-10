import express from 'express';
import { storage } from '../storage';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { 
  playerProgress, 
  playerSkills, 
  playerBadges, 
  xpTransactions, 
  playerChallenges, 
  playerActiveChallenges, 
  athleteStarPath,
  insertPlayerProgressSchema,
  insertPlayerSkillSchema,
  insertPlayerBadgeSchema,
  insertXpTransactionSchema,
  insertPlayerChallengeSchema,
  insertPlayerActiveChallengeSchema
} from '@shared/schema';
import { z } from 'zod';
import { 
  addXpToPlayer, 
  XP_SOURCES, 
  getXpRequiredForLevel, 
  getRankForLevel,
  getStreakMultiplier,
  RANKS,
  STREAK_MULTIPLIERS
} from '../utils/xp-system';

// Star Path level definitions
export const STAR_LEVELS = [
  { level: 1, name: "Rising Prospect", minXp: 0, color: "text-blue-400", borderColor: "border-blue-400", shadowColor: "shadow-blue-200" },
  { level: 2, name: "Emerging Talent", minXp: 5000, color: "text-sky-500", borderColor: "border-sky-500", shadowColor: "shadow-sky-300" },
  { level: 3, name: "Standout Performer", minXp: 15000, color: "text-cyan-600", borderColor: "border-cyan-600", shadowColor: "shadow-cyan-400" },
  { level: 4, name: "Elite Prospect", minXp: 30000, color: "text-teal-600", borderColor: "border-teal-600", shadowColor: "shadow-teal-400" },
  { level: 5, name: "Five-Star Athlete", minXp: 50000, color: "text-emerald-600", borderColor: "border-emerald-600", shadowColor: "shadow-emerald-400" }
];

// Default attribute values for new star path
const DEFAULT_PHYSICAL_ATTRIBUTES = {
  speed: 50,
  strength: 50,
  agility: 50,
  endurance: 50,
  verticalJump: 50
};

const DEFAULT_TECHNICAL_ATTRIBUTES = {
  technique: 50,
  ballControl: 50,
  accuracy: 50,
  gameIQ: 50
};

const DEFAULT_MENTAL_ATTRIBUTES = {
  focus: 50,
  confidence: 50,
  determination: 50,
  teamwork: 50
};

// Star Path thresholds for levels 1-5
const STAR_PATH_THRESHOLDS = [0, 5000, 15000, 30000, 50000, 75000];

const router = express.Router();

// Get player progress
router.get('/progress/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const progress = await db.query.playerProgress.findFirst({
      where: eq(playerProgress.userId, userId)
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Player progress not found' });
    }
    
    return res.json(progress);
  } catch (error) {
    console.error('Error fetching player progress:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create player progress
router.post('/progress', async (req, res) => {
  try {
    const result = insertPlayerProgressSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Check if player progress already exists
    const existingProgress = await db.query.playerProgress.findFirst({
      where: eq(playerProgress.userId, result.data.userId)
    });
    
    if (existingProgress) {
      return res.status(400).json({ error: 'Player progress already exists for this user' });
    }
    
    const newProgress = await db.insert(playerProgress).values(result.data).returning();
    
    return res.status(201).json(newProgress[0]);
  } catch (error) {
    console.error('Error creating player progress:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player progress
router.patch('/progress/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get existing progress
    const existingProgress = await db.query.playerProgress.findFirst({
      where: eq(playerProgress.userId, userId)
    });
    
    if (!existingProgress) {
      return res.status(404).json({ error: 'Player progress not found' });
    }
    
    // Validate update data (partial schema)
    const updateSchema = insertPlayerProgressSchema.partial();
    const result = updateSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Perform update
    const updatedProgress = await db
      .update(playerProgress)
      .set(result.data)
      .where(eq(playerProgress.userId, userId))
      .returning();
    
    return res.json(updatedProgress[0]);
  } catch (error) {
    console.error('Error updating player progress:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player skills
router.get('/skills/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const skills = await db.query.playerSkills.findMany({
      where: eq(playerSkills.userId, userId)
    });
    
    return res.json(skills);
  } catch (error) {
    console.error('Error fetching player skills:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a player skill
router.post('/skills', async (req, res) => {
  try {
    const result = insertPlayerSkillSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Check if skill already exists
    const existingSkill = await db.query.playerSkills.findFirst({
      where: (skills) => {
        return eq(skills.userId, result.data.userId) && 
               eq(skills.skillId, result.data.skillId);
      }
    });
    
    if (existingSkill) {
      return res.status(400).json({ error: 'Skill already exists for this user' });
    }
    
    const newSkill = await db.insert(playerSkills).values(result.data).returning();
    
    return res.status(201).json(newSkill[0]);
  } catch (error) {
    console.error('Error adding player skill:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a player skill
router.patch('/skills/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    // Get existing skill
    const existingSkill = await db.query.playerSkills.findFirst({
      where: eq(playerSkills.id, id)
    });
    
    if (!existingSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Validate update data (partial schema)
    const updateSchema = insertPlayerSkillSchema.partial();
    const result = updateSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Perform update
    const updatedSkill = await db
      .update(playerSkills)
      .set(result.data)
      .where(eq(playerSkills.id, id))
      .returning();
    
    return res.json(updatedSkill[0]);
  } catch (error) {
    console.error('Error updating player skill:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player badges
router.get('/badges/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const badges = await db.query.playerBadges.findMany({
      where: eq(playerBadges.userId, userId)
    });
    
    return res.json(badges);
  } catch (error) {
    console.error('Error fetching player badges:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a player badge
router.post('/badges', async (req, res) => {
  try {
    const result = insertPlayerBadgeSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Check if badge already exists
    const existingBadge = await db.query.playerBadges.findFirst({
      where: (badges) => {
        return eq(badges.userId, result.data.userId) && 
               eq(badges.badgeId, result.data.badgeId);
      }
    });
    
    if (existingBadge) {
      return res.status(400).json({ error: 'Badge already exists for this user' });
    }
    
    const newBadge = await db.insert(playerBadges).values(result.data).returning();
    
    return res.status(201).json(newBadge[0]);
  } catch (error) {
    console.error('Error adding player badge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get XP transactions
router.get('/xp/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const transactions = await db.query.xpTransactions.findMany({
      where: eq(xpTransactions.userId, userId),
      orderBy: (xpTransactions, { desc }) => [desc(xpTransactions.createdAt)]
    });
    
    return res.json(transactions);
  } catch (error) {
    console.error('Error fetching XP transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add XP transaction
router.post('/xp', async (req, res) => {
  try {
    const result = insertXpTransactionSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Create XP transaction
    const newTransaction = await db.insert(xpTransactions).values(result.data).returning();
    
    // Update player progress with new XP
    const userId = result.data.userId;
    const amount = result.data.amount;
    
    // Get player progress
    const progress = await db.query.playerProgress.findFirst({
      where: eq(playerProgress.userId, userId)
    });
    
    if (progress) {
      // Update total XP
      await db
        .update(playerProgress)
        .set({ 
          xpTotal: (progress.xpTotal || 0) + amount,
          lastUpdated: new Date()
        })
        .where(eq(playerProgress.userId, userId));
    }
    
    return res.status(201).json(newTransaction[0]);
  } catch (error) {
    console.error('Error adding XP transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player challenges
router.get('/challenges/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const challenges = await db.query.playerChallenges.findMany({
      where: eq(playerChallenges.userId, userId)
    });
    
    return res.json(challenges);
  } catch (error) {
    console.error('Error fetching player challenges:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active challenges
router.get('/active-challenges/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const activeChallenges = await db.query.playerActiveChallenges.findMany({
      where: eq(playerActiveChallenges.userId, userId),
      with: {
        challenge: true
      }
    });
    
    return res.json(activeChallenges);
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add active challenge
router.post('/active-challenges', async (req, res) => {
  try {
    const result = insertPlayerActiveChallengeSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Check if already active
    const existingActive = await db.query.playerActiveChallenges.findFirst({
      where: (active) => {
        return eq(active.userId, result.data.userId) && 
               eq(active.challengeId, result.data.challengeId);
      }
    });
    
    if (existingActive) {
      return res.status(400).json({ error: 'Challenge already active for this user' });
    }
    
    const newActive = await db.insert(playerActiveChallenges).values(result.data).returning();
    
    return res.status(201).json(newActive[0]);
  } catch (error) {
    console.error('Error adding active challenge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update active challenge
router.patch('/active-challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    // Get existing active challenge
    const existingActive = await db.query.playerActiveChallenges.findFirst({
      where: eq(playerActiveChallenges.id, id)
    });
    
    if (!existingActive) {
      return res.status(404).json({ error: 'Active challenge not found' });
    }
    
    // Validate update data (partial schema)
    const updateSchema = insertPlayerActiveChallengeSchema.partial();
    const result = updateSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    
    // Perform update
    const updatedActive = await db
      .update(playerActiveChallenges)
      .set(result.data)
      .where(eq(playerActiveChallenges.id, id))
      .returning();
    
    return res.json(updatedActive[0]);
  } catch (error) {
    console.error('Error updating active challenge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete challenge
router.post('/complete-challenge/:activeId', async (req, res) => {
  try {
    const activeId = parseInt(req.params.activeId);
    
    if (isNaN(activeId)) {
      return res.status(400).json({ error: 'Invalid active challenge ID' });
    }
    
    // Get active challenge
    const activeChallenge = await db.query.playerActiveChallenges.findFirst({
      where: eq(playerActiveChallenges.id, activeId),
      with: {
        challenge: true
      }
    });
    
    if (!activeChallenge) {
      return res.status(404).json({ error: 'Active challenge not found' });
    }
    
    // If challenge is already completed, return success with a note
    if (activeChallenge.isCompleted) {
      return res.json({ 
        success: true, 
        message: 'Challenge was already completed',
        alreadyCompleted: true
      });
    }
    
    // Update active challenge status
    await db
      .update(playerActiveChallenges)
      .set({ 
        isCompleted: true,
        completedAt: new Date(),
        progress: 100
      })
      .where(eq(playerActiveChallenges.id, activeId));
    
    // Award XP for completion
    if (activeChallenge.challenge && activeChallenge.challenge.xpReward) {
      // Add XP and handle leveling
      const xpResult = await addXpToPlayer(
        activeChallenge.userId,
        activeChallenge.challenge.xpReward,
        XP_SOURCES.CHALLENGE,
        `Completed challenge: ${activeChallenge.challenge.title}`,
        String(activeChallenge.challengeId)
      );
      
      // Update completed challenges count
      const progress = await db.query.playerProgress.findFirst({
        where: eq(playerProgress.userId, activeChallenge.userId)
      });
      
      if (progress) {
        await db
          .update(playerProgress)
          .set({ 
            completedChallenges: (progress.completedChallenges || 0) + 1
          })
          .where(eq(playerProgress.userId, activeChallenge.userId));
      }
      
      // Add XP result to response with detailed level up information
      return res.json({ 
        success: true, 
        message: 'Challenge completed successfully',
        challenge: {
          id: activeChallenge.challengeId,
          title: activeChallenge.challenge.title,
          description: activeChallenge.challenge.description,
          xpReward: activeChallenge.challenge.xpReward
        },
        xp: {
          earned: xpResult.newXp,
          leveledUp: xpResult.leveledUp,
          levelsGained: xpResult.levelsGained,
          prevLevel: xpResult.prevLevel,
          newLevel: xpResult.newLevel,
          prevRank: xpResult.prevRank,
          newRank: xpResult.newRank
        },
        levelUps: xpResult.levelUps,
        completedChallenges: progress ? (progress.completedChallenges || 0) + 1 : 1
      });
    }
    
    return res.json({ success: true, message: 'Challenge completed successfully' });
  } catch (error) {
    console.error('Error completing challenge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get XP level information
router.get('/xp-levels', async (req, res) => {
  try {
    // Generate level information for levels 1-50
    const levels = [];
    
    for (let level = 1; level <= 50; level++) {
      const xpRequired = getXpRequiredForLevel(level);
      const rank = getRankForLevel(level);
      
      levels.push({
        level,
        xpRequired,
        rank,
        // Include whether this level is a rank change
        isRankUp: level === RANKS.ROOKIE.minLevel || 
                  level === RANKS.PROSPECT.minLevel || 
                  level === RANKS.RISING_STAR.minLevel || 
                  level === RANKS.ALL_STAR.minLevel || 
                  level === RANKS.MVP.minLevel || 
                  level === RANKS.LEGEND.minLevel
      });
    }
    
    // Include streak information
    const streakBonuses = Object.entries(STREAK_MULTIPLIERS).map(([days, multiplier]) => ({
      days: parseInt(days),
      multiplier
    }));
    
    return res.json({
      levels,
      streakBonuses,
      xpSources: Object.values(XP_SOURCES)
    });
  } catch (error) {
    console.error('Error generating XP level information:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// Update player streak
router.post('/update-streak/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get player progress
    const progress = await db.query.playerProgress.findFirst({
      where: eq(playerProgress.userId, userId)
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Player progress not found' });
    }
    
    // Calculate if streak should be updated
    const lastActive = progress.lastActive ? new Date(progress.lastActive) : null;
    const now = new Date();
    let shouldUpdateStreak = false;
    let shouldAwardXp = false;
    
    if (!lastActive) {
      // First login ever - start streak
      shouldUpdateStreak = true;
    } else {
      // Check if last active was yesterday (consider it a streak if 18-36 hours ago)
      const hoursSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastActive >= 18 && hoursSinceLastActive <= 36) {
        // This is a consecutive day login
        shouldUpdateStreak = true;
        shouldAwardXp = true;
      } else if (hoursSinceLastActive > 36) {
        // Streak broken - reset to 1
        shouldUpdateStreak = true;
        // Still award XP for logging in today
        shouldAwardXp = true;
      } else {
        // Already logged in today, no streak update
        return res.json({ 
          success: true, 
          message: 'Already logged in today',
          streakDays: progress.streakDays,
          xpAwarded: false
        });
      }
    }
    
    if (shouldUpdateStreak) {
      // Update streak - get hoursSinceLastActive from the current context
      const hoursSinceLastActive = lastActive ? (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60) : 0;
      const newStreakDays = hoursSinceLastActive > 36 ? 1 : progress.streakDays + 1;
      
      await db.update(playerProgress)
        .set({ 
          streakDays: newStreakDays,
          lastActive: now
        })
        .where(eq(playerProgress.userId, userId));
      
      // Check if we should award XP
      if (shouldAwardXp) {
        // Award bonus XP for streaks on milestone days
        const isStreakMilestone = 
          newStreakDays === 3 || 
          newStreakDays === 7 || 
          newStreakDays === 14 || 
          newStreakDays === 30 || 
          newStreakDays === 60 || 
          newStreakDays === 90 || 
          newStreakDays === 180 || 
          newStreakDays === 365;
        
        // Base login XP
        const baseXp = 25;
        
        // Award extra XP for milestones
        const streakBonus = isStreakMilestone ? (newStreakDays >= 30 ? 100 : 50) : 0;
        const totalXp = baseXp + streakBonus;
        
        // Add XP for daily login
        const xpResult = await addXpToPlayer(
          userId,
          totalXp,
          XP_SOURCES.LOGIN,
          isStreakMilestone 
            ? `Daily login + ${newStreakDays} day streak bonus!` 
            : 'Daily login streak',
          `streak-${newStreakDays}`
        );
        
        return res.json({
          success: true,
          message: isStreakMilestone 
            ? `${newStreakDays} day streak achieved! Bonus XP awarded.` 
            : 'Streak updated and XP awarded',
          streakDays: newStreakDays,
          xpAwarded: true,
          xp: {
            earned: xpResult.newXp,
            leveledUp: xpResult.leveledUp,
            levelsGained: xpResult.levelsGained,
            prevLevel: xpResult.prevLevel,
            newLevel: xpResult.newLevel,
            prevRank: xpResult.prevRank,
            newRank: xpResult.newRank
          },
          levelUps: xpResult.levelUps
        });
      } else {
        return res.json({
          success: true,
          message: 'Streak updated',
          streakDays: newStreakDays,
          xpAwarded: false
        });
      }
    }
    
    return res.json({
      success: true,
      message: 'No streak update needed',
      streakDays: progress.streakDays,
      xpAwarded: false
    });
  } catch (error) {
    console.error('Error updating player streak:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------
// Star Path Routes
// ----------------

// Get player's star path
router.get('/star-path/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get the star path for this user
    const starPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (!starPath) {
      return res.status(404).json({ error: 'Star path not found for this user' });
    }
    
    // Format the response with star level info
    const currentStarLevel = starPath.currentStarLevel || 1;
    const starLevelInfo = STAR_LEVELS.find(level => level.level === currentStarLevel) || STAR_LEVELS[0];
    
    // Get the next level info
    const nextStarLevel = Math.min(currentStarLevel + 1, 5);
    const nextLevelInfo = STAR_LEVELS.find(level => level.level === nextStarLevel);
    
    // Calculate XP progress
    const totalXp = starPath.xpTotal || 0;
    const currentLevelXp = STAR_LEVELS.find(level => level.level === currentStarLevel)?.minXp || 0;
    const nextLevelXp = nextLevelInfo?.minXp || STAR_LEVELS[currentStarLevel]?.minXp || 5000;
    const xpProgress = Math.min(100, Math.max(0, ((totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));
    
    // Include star path along with computed information
    return res.json({
      ...starPath,
      starLevelInfo,
      nextLevelInfo,
      xpNeeded: nextLevelXp - totalXp,
      xpProgress: Math.round(xpProgress),
      isMaxLevel: currentStarLevel >= 5
    });
    
  } catch (error) {
    console.error('Error fetching star path:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create star path for a player
router.post('/star-path', async (req, res) => {
  try {
    // Validate user ID
    const { userId, sportType, position } = req.body;
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Valid user ID is required' });
    }
    
    // Check if star path already exists
    const existingStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (existingStarPath) {
      return res.status(400).json({ error: 'Star path already exists for this user' });
    }
    
    // Create new star path with defaults
    const [newStarPath] = await db.insert(athleteStarPath).values({
      userId,
      currentStarLevel: 1,
      targetStarLevel: 2,
      storylinePhase: "beginning",
      progress: 0,
      sportType: sportType || "basketball", // Default sport
      position: position || null,
      xpTotal: 0,
      levelThresholds: STAR_PATH_THRESHOLDS,
      storylineActive: true,
      completedDrills: 0,
      verifiedWorkouts: 0,
      skillTreeProgress: 0,
      physicalAttributes: DEFAULT_PHYSICAL_ATTRIBUTES,
      technicalAttributes: DEFAULT_TECHNICAL_ATTRIBUTES,
      mentalAttributes: DEFAULT_MENTAL_ATTRIBUTES,
    }).returning();
    
    return res.status(201).json(newStarPath);
  } catch (error) {
    console.error('Error creating star path:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player's star path
router.patch('/star-path/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get existing star path
    const existingStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (!existingStarPath) {
      return res.status(404).json({ error: 'Star path not found for this user' });
    }
    
    // Validate update data (we'll allow partial updates)
    // Update the path - only allow specific fields to be updated
    const allowedFields = [
      'currentStarLevel', 'targetStarLevel', 'storylinePhase', 
      'progress', 'sportType', 'position', 'physicalAttributes',
      'technicalAttributes', 'mentalAttributes', 'storylineActive',
      'completedDrills', 'verifiedWorkouts', 'skillTreeProgress'
    ];
    
    // Filter request body to only include allowed fields
    const updateData = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    
    // Add lastUpdated timestamp
    updateData.lastUpdated = new Date();
    
    // Perform update
    const [updatedStarPath] = await db
      .update(athleteStarPath)
      .set(updateData)
      .where(eq(athleteStarPath.userId, userId))
      .returning();
    
    return res.json(updatedStarPath);
  } catch (error) {
    console.error('Error updating star path:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update star level for player (level up)
router.post('/star-path/:userId/level-up', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get existing star path
    const existingStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (!existingStarPath) {
      return res.status(404).json({ error: 'Star path not found for this user' });
    }
    
    // Check current level and if leveling up is possible
    const currentLevel = existingStarPath.currentStarLevel || 1;
    if (currentLevel >= 5) {
      return res.status(400).json({ 
        error: 'Already at maximum star level',
        starPath: existingStarPath
      });
    }
    
    // Set the new level and update the target level
    const newLevel = currentLevel + 1;
    const targetLevel = Math.min(newLevel + 1, 5);
    
    // Update the star path
    const [updatedStarPath] = await db
      .update(athleteStarPath)
      .set({
        currentStarLevel: newLevel,
        targetStarLevel: targetLevel,
        storylinePhase: "advancing",
        progress: 0,
        lastUpdated: new Date()
      })
      .where(eq(athleteStarPath.userId, userId))
      .returning();
    
    return res.json({
      success: true,
      message: `Congratulations! Leveled up to ${STAR_LEVELS[newLevel - 1].name}`,
      previousLevel: currentLevel,
      newLevel: newLevel,
      starPath: updatedStarPath
    });
  } catch (error) {
    console.error('Error updating star level:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update attribute points (physical, technical, mental)
router.post('/star-path/:userId/attributes', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get existing star path
    const existingStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (!existingStarPath) {
      return res.status(404).json({ error: 'Star path not found for this user' });
    }
    
    // Get attribute updates from request
    const { attributeType, attributeName, value } = req.body;
    
    if (!attributeType || !attributeName || value === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: attributeType, attributeName, value' 
      });
    }
    
    if (!['physical', 'technical', 'mental'].includes(attributeType)) {
      return res.status(400).json({ 
        error: 'Invalid attributeType. Must be physical, technical, or mental'
      });
    }
    
    // Validate value (between 0 and 100)
    const pointValue = parseInt(value);
    if (isNaN(pointValue) || pointValue < 0 || pointValue > 100) {
      return res.status(400).json({ 
        error: 'Invalid value. Must be between 0 and 100'
      });
    }
    
    // Update the appropriate attribute
    let attributeData = {};
    if (attributeType === 'physical') {
      attributeData = {
        ...existingStarPath.physicalAttributes,
        [attributeName]: pointValue
      };
      await db.update(athleteStarPath)
        .set({ physicalAttributes: attributeData })
        .where(eq(athleteStarPath.userId, userId));
    } else if (attributeType === 'technical') {
      attributeData = {
        ...existingStarPath.technicalAttributes,
        [attributeName]: pointValue
      };
      await db.update(athleteStarPath)
        .set({ technicalAttributes: attributeData })
        .where(eq(athleteStarPath.userId, userId));
    } else if (attributeType === 'mental') {
      attributeData = {
        ...existingStarPath.mentalAttributes,
        [attributeName]: pointValue
      };
      await db.update(athleteStarPath)
        .set({ mentalAttributes: attributeData })
        .where(eq(athleteStarPath.userId, userId));
    }
    
    // Get the updated star path
    const updatedStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    return res.json({
      success: true,
      attributeType,
      attributeName,
      value: pointValue,
      starPath: updatedStarPath
    });
  } catch (error) {
    console.error('Error updating attributes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment progress on star path
router.post('/star-path/:userId/progress', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get existing star path
    const existingStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (!existingStarPath) {
      return res.status(404).json({ error: 'Star path not found for this user' });
    }
    
    // Get progress increment
    const { progressIncrement = 5 } = req.body;
    const increment = Math.max(1, Math.min(25, parseInt(progressIncrement)));
    
    // Calculate new progress value (cap at 100)
    const currentProgress = existingStarPath.progress || 0;
    const newProgress = Math.min(100, currentProgress + increment);
    
    // Update the progress
    const [updatedStarPath] = await db
      .update(athleteStarPath)
      .set({
        progress: newProgress,
        lastUpdated: new Date()
      })
      .where(eq(athleteStarPath.userId, userId))
      .returning();
    
    // Check if this completes the progress (100%)
    const isComplete = newProgress >= 100;
    
    return res.json({
      success: true,
      previousProgress: currentProgress,
      newProgress,
      isComplete,
      starPath: updatedStarPath
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific attribute of a star path
router.get('/star-path/:userId/attributes/:attributeType', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const attributeType = req.params.attributeType;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    if (!['physical', 'technical', 'mental'].includes(attributeType)) {
      return res.status(400).json({ 
        error: 'Invalid attributeType. Must be physical, technical, or mental'
      });
    }
    
    // Get existing star path
    const existingStarPath = await db.query.athleteStarPath.findFirst({
      where: eq(athleteStarPath.userId, userId)
    });
    
    if (!existingStarPath) {
      return res.status(404).json({ error: 'Star path not found for this user' });
    }
    
    // Return the requested attribute set
    let attributes = {};
    if (attributeType === 'physical') {
      attributes = existingStarPath.physicalAttributes || DEFAULT_PHYSICAL_ATTRIBUTES;
    } else if (attributeType === 'technical') {
      attributes = existingStarPath.technicalAttributes || DEFAULT_TECHNICAL_ATTRIBUTES;
    } else if (attributeType === 'mental') {
      attributes = existingStarPath.mentalAttributes || DEFAULT_MENTAL_ATTRIBUTES;
    }
    
    return res.json({
      attributeType,
      attributes,
      userId
    });
    
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;