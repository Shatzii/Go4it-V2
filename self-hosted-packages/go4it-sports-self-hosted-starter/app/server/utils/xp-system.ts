import { db } from '../db';
import { eq } from 'drizzle-orm';
import { playerProgress, xpTransactions } from '@shared/schema';

// Different XP sources with their multipliers
export const XP_SOURCES = {
  CHALLENGE: 'challenge',
  WORKOUT: 'workout',
  LOGIN: 'login',
  ASSESSMENT: 'assessment',
  STREAK: 'streak',
  VIDEO_ANALYSIS: 'video_analysis',
  AI_COACH: 'ai_coach',
};

// Rank thresholds
export const RANKS = {
  ROOKIE: { name: 'Rookie', minLevel: 1 },
  PROSPECT: { name: 'Prospect', minLevel: 5 },
  RISING_STAR: { name: 'Rising Star', minLevel: 10 },
  ALL_STAR: { name: 'All-Star', minLevel: 20 },
  MVP: { name: 'MVP', minLevel: 30 },
  LEGEND: { name: 'Legend', minLevel: 50 },
};

// Streak multipliers
export const STREAK_MULTIPLIERS = {
  3: 1.1,  // 3-day streak: 10% bonus
  7: 1.25, // 7-day streak: 25% bonus
  14: 1.5, // 14-day streak: 50% bonus
  30: 2.0, // 30-day streak: 100% bonus
};

// XP requirements for each level (increases by 25% each level)
export function getXpRequiredForLevel(level: number): number {
  // Base XP required to reach level 2
  const baseXp = 100;
  // XP required for levels 1-50 (level 1 requires 0 XP)
  const levelRequirements = [0];
  
  for (let i = 1; i <= 50; i++) {
    // Increase by 25% each level
    levelRequirements[i] = Math.floor(baseXp * Math.pow(1.25, i - 1));
  }
  
  return level <= 50 ? levelRequirements[level - 1] : levelRequirements[50];
}

// Get the appropriate rank based on level
export function getRankForLevel(level: number): string {
  // Start from highest rank and work down
  if (level >= RANKS.LEGEND.minLevel) return RANKS.LEGEND.name;
  if (level >= RANKS.MVP.minLevel) return RANKS.MVP.name;
  if (level >= RANKS.ALL_STAR.minLevel) return RANKS.ALL_STAR.name;
  if (level >= RANKS.RISING_STAR.minLevel) return RANKS.RISING_STAR.name;
  if (level >= RANKS.PROSPECT.minLevel) return RANKS.PROSPECT.name;
  return RANKS.ROOKIE.name;
}

// Get streak multiplier based on streak days
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return STREAK_MULTIPLIERS[30];
  if (streakDays >= 14) return STREAK_MULTIPLIERS[14];
  if (streakDays >= 7) return STREAK_MULTIPLIERS[7];
  if (streakDays >= 3) return STREAK_MULTIPLIERS[3];
  return 1.0; // No multiplier
}

// Add XP to a player with level progression logic
export async function addXpToPlayer(
  userId: number, 
  amount: number, 
  transactionType: string, 
  description: string, 
  sourceId?: string
): Promise<{
  newXp: number,
  leveledUp: boolean,
  levelsGained: number,
  newLevel?: number,
  prevLevel?: number,
  newRank?: string,
  prevRank?: string,
  levelUps?: Array<{ level: number, rank: string, isRankUp: boolean }>
}> {
  try {
    // Get current player progress
    const playerData = await db.query.playerProgress.findFirst({
      where: eq(playerProgress.userId, userId)
    });
    
    if (!playerData) {
      // Create new player progress if it doesn't exist
      await db.insert(playerProgress).values({
        userId,
        currentLevel: 1,
        totalXp: amount,
        levelXp: amount,
        xpToNextLevel: getXpRequiredForLevel(2), // XP required for level 2
        streakDays: 0,
        lastActive: new Date(),
        completedChallenges: 0,
        rank: RANKS.ROOKIE.name
      });
      
      // Record XP transaction
      await db.insert(xpTransactions).values({
        userId,
        amount,
        transaction_type: transactionType,
        description,
        source_id: sourceId,
        multiplier: 1.0
      });
      
      return {
        newXp: amount,
        leveledUp: false,
        levelsGained: 0
      };
    }
    
    // Apply streak multiplier if available
    const multiplier = getStreakMultiplier(playerData.streakDays);
    const multipliedAmount = Math.floor(amount * multiplier);
    
    // Calculate new XP values
    const newTotalXp = playerData.totalXp + multipliedAmount;
    let newLevelXp = playerData.levelXp + multipliedAmount;
    let newLevel = playerData.currentLevel;
    let leveledUp = false;
    let levelsGained = 0;
    const prevLevel = newLevel;
    const prevRank = playerData.rank;
    let newRank = prevRank;
    
    // Track individual level ups for detailed feedback
    const levelUps: Array<{ level: number, rank: string, isRankUp: boolean }> = [];
    
    // Check for multiple level ups (large XP gains)
    while (true) {
      const xpRequiredForNextLevel = getXpRequiredForLevel(newLevel + 1);
      
      if (newLevelXp >= xpRequiredForNextLevel) {
        // Level up!
        newLevel++;
        newLevelXp -= xpRequiredForNextLevel;
        leveledUp = true;
        levelsGained++;
        
        // Check if rank changed
        const updatedRank = getRankForLevel(newLevel);
        const isRankUp = updatedRank !== newRank;
        
        if (isRankUp) {
          newRank = updatedRank;
        }
        
        // Add to level up history
        levelUps.push({
          level: newLevel,
          rank: updatedRank,
          isRankUp
        });
      } else {
        // No more level ups
        break;
      }
    }
    
    // Record XP transaction
    await db.insert(xpTransactions).values({
      userId,
      amount: multipliedAmount,
      transaction_type: transactionType,
      description,
      source_id: sourceId,
      multiplier
    });
    
    // Update player progress
    await db.update(playerProgress)
      .set({
        totalXp: newTotalXp,
        levelXp: newLevelXp,
        xpToNextLevel: getXpRequiredForLevel(newLevel + 1),
        currentLevel: newLevel,
        rank: newRank,
        lastActive: new Date(),
        updatedAt: new Date()
      })
      .where(eq(playerProgress.userId, userId));
    
    return {
      newXp: multipliedAmount,
      leveledUp,
      levelsGained,
      newLevel: leveledUp ? newLevel : undefined,
      prevLevel: leveledUp ? prevLevel : undefined,
      newRank: newRank !== prevRank ? newRank : undefined,
      prevRank: newRank !== prevRank ? prevRank : undefined,
      levelUps: levelUps.length > 0 ? levelUps : undefined
    };
    
  } catch (error) {
    console.error('Error adding XP to player:', error);
    throw error;
  }
}