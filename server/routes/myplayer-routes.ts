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
  insertPlayerProgressSchema,
  insertPlayerSkillSchema,
  insertPlayerBadgeSchema,
  insertXpTransactionSchema,
  insertPlayerChallengeSchema,
  insertPlayerActiveChallengeSchema
} from '@shared/schema';
import { z } from 'zod';

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
      await db.insert(xpTransactions).values({
        userId: activeChallenge.userId,
        amount: activeChallenge.challenge.xpReward,
        transaction_type: 'challenge',
        description: `Completed challenge: ${activeChallenge.challenge.title}`,
        source_id: String(activeChallenge.challengeId)
      });
      
      // Update player progress
      const progress = await db.query.playerProgress.findFirst({
        where: eq(playerProgress.userId, activeChallenge.userId)
      });
      
      if (progress) {
        await db
          .update(playerProgress)
          .set({ 
            totalXp: (progress.totalXp || 0) + activeChallenge.challenge.xpReward,
            completedChallenges: (progress.completedChallenges || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(playerProgress.userId, activeChallenge.userId));
      } else {
        // Create progress entry if it doesn't exist
        await db.insert(playerProgress).values({
          userId: activeChallenge.userId,
          currentLevel: 1,
          totalXp: activeChallenge.challenge.xpReward,
          levelXp: 0,
          xpToNextLevel: 100,
          streakDays: 0,
          completedChallenges: 1
        });
      }
    }
    
    return res.json({ success: true, message: 'Challenge completed successfully' });
  } catch (error) {
    console.error('Error completing challenge:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;