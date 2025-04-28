import { Request, Response, Router } from 'express';
import { db } from '../db';
import { eq, and, sql } from 'drizzle-orm';
import { skills, skillTreeNodes, skillTreeRelationships, trainingDrills, users } from '@shared/schema';

const router = Router();

// Get user's skills
router.get('/user', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      // For non-authenticated users, return an empty array
      // This allows the visualization to still render without skills
      return res.json([]);
    }

    const userSkills = await db.select()
      .from(skills)
      .where(eq(skills.userId, req.user.id));

    res.json(userSkills);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});

// Get skill tree nodes for specific sport/position
router.get('/nodes', async (req: Request, res: Response) => {
  try {
    const { sport, position } = req.query;
    
    if (!sport) {
      return res.status(400).json({ error: 'Sport type is required' });
    }

    // Start with base query
    let nodes;
    
    if (position) {
      nodes = await db.select()
        .from(skillTreeNodes)
        .where(
          and(
            eq(skillTreeNodes.sport_type, sport as string),
            eq(skillTreeNodes.position, position as string)
          )
        );
    } else {
      nodes = await db.select()
        .from(skillTreeNodes)
        .where(eq(skillTreeNodes.sport_type, sport as string));
    }

    const relationships = await db.select()
      .from(skillTreeRelationships);

    res.json({ nodes, relationships });
  } catch (error) {
    console.error('Error fetching skill tree:', error);
    res.status(500).json({ error: 'Failed to fetch skill tree' });
  }
});

// Unlock a skill
router.post('/unlock/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const skillId = parseInt(req.params.id, 10);
    
    // Check if skill exists
    const [skillNode] = await db.select()
      .from(skillTreeNodes)
      .where(eq(skillTreeNodes.id, skillId));
    
    if (!skillNode) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check if user already has this skill
    const [existingSkill] = await db.select()
      .from(skills)
      .where(
        and(
          eq(skills.userId, req.user.id),
          eq(skills.skillNodeId, skillId)
        )
      );

    if (existingSkill && existingSkill.unlocked) {
      return res.status(400).json({ error: 'Skill already unlocked' });
    }

    // Check prerequisites
    const prerequisites = await db.select({
      parentId: skillTreeRelationships.parent_id
    })
    .from(skillTreeRelationships)
    .where(eq(skillTreeRelationships.child_id, skillId));

    if (prerequisites.length > 0) {
      // Get user's unlocked skills for prerequisites
      const prereqSkills = await db.select()
        .from(skills)
        .where(
          and(
            eq(skills.userId, req.user.id),
            eq(skills.unlocked, true)
          )
        );
      
      const unlockedSkillIds = prereqSkills.map(s => s.skillNodeId);
      
      // Filter out any null parent IDs and check if all remaining prerequisites are unlocked
      // Extract valid parent IDs first to avoid type issues
      const validParentIds = prerequisites
        .map(p => p.parentId)
        .filter((id): id is number => id !== null);
        
      const allPrereqsMet = validParentIds.every(parentId => 
        unlockedSkillIds.includes(parentId)
      );
      
      if (!allPrereqsMet) {
        return res.status(400).json({ error: 'Not all prerequisites are unlocked' });
      }
    }

    // XP check (if required)
    if (skillNode.xp_to_unlock && skillNode.xp_to_unlock > 0) {
      // Get user's total XP (implement this based on your XP system)
      // For now, we'll just assume the user has enough XP
    }

    // Create or update the skill
    let createdSkill;
    
    if (existingSkill) {
      [createdSkill] = await db.update(skills)
        .set({
          unlocked: true,
          unlockedAt: new Date(),
          level: 1,
          xp: 0
        })
        .where(
          and(
            eq(skills.userId, req.user.id),
            eq(skills.skillNodeId, skillId)
          )
        )
        .returning();
    } else {
      [createdSkill] = await db.insert(skills)
        .values({
          userId: req.user.id,
          skillNodeId: skillId,
          unlocked: true,
          unlockedAt: new Date(),
          level: 1,
          xp: 0
        })
        .returning();
    }

    res.status(200).json({
      message: 'Skill unlocked successfully',
      skill: createdSkill
    });
  } catch (error) {
    console.error('Error unlocking skill:', error);
    res.status(500).json({ error: 'Failed to unlock skill' });
  }
});

// Train a skill
router.post('/train', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { skillId, drillId } = req.body;
    
    if (!skillId) {
      return res.status(400).json({ error: 'Skill ID is required' });
    }

    // Check if user has this skill unlocked
    const [userSkill] = await db.select()
      .from(skills)
      .where(
        and(
          eq(skills.userId, req.user.id),
          eq(skills.skillNodeId, skillId)
        )
      );

    if (!userSkill || !userSkill.unlocked) {
      return res.status(400).json({ error: 'Skill not unlocked yet' });
    }

    // Calculate XP gain
    let xpGained = 10; // Default XP gain
    
    // If a specific drill was completed, use its XP reward
    if (drillId) {
      const [drill] = await db.select()
        .from(trainingDrills)
        .where(eq(trainingDrills.id, drillId));
      
      if (drill && drill.xpReward !== null) {
        xpGained = drill.xpReward;
      }
    }

    // Calculate new XP and check for level up
    const currentXp = userSkill.xp || 0;
    const currentLevel = userSkill.level || 1;
    let newXp = currentXp + xpGained;
    let newLevel = currentLevel;
    let leveledUp = false;
    
    // Check for level up (simple formula: 100 * level XP needed for next level)
    const xpForNextLevel = currentLevel * 100;
    if (newXp >= xpForNextLevel && currentLevel < 5) { // Max level is 5
      newLevel = currentLevel + 1;
      newXp = newXp - xpForNextLevel; // Carry over excess XP
      leveledUp = true;
    }

    // Update the skill
    const [updatedSkill] = await db.update(skills)
      .set({
        xp: newXp,
        level: newLevel,
        lastTrainedAt: new Date()
      })
      .where(
        and(
          eq(skills.userId, req.user.id),
          eq(skills.skillNodeId, skillId)
        )
      )
      .returning();

    res.status(200).json({
      message: leveledUp ? 'Skill leveled up!' : 'Training complete!',
      skill: updatedSkill,
      xpGained,
      leveledUp,
      newLevel
    });
  } catch (error) {
    console.error('Error training skill:', error);
    res.status(500).json({ error: 'Failed to train skill' });
  }
});

// Get user's skill stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { sport } = req.query;
    
    if (!req.user) {
      // For non-authenticated users, return default stats
      return res.json({
        totalSkills: 0,
        unlockedSkills: 0,
        masteredSkills: 0,
        totalXp: 0,
        skillsByCategory: []
      });
    }
    
    if (!sport) {
      return res.status(400).json({ error: 'Sport type is required' });
    }

    // Get all skill nodes for this sport
    const allSkillNodes = await db.select()
      .from(skillTreeNodes)
      .where(eq(skillTreeNodes.sport_type, sport as string));
    
    const totalSkills = allSkillNodes.length;
    
    // Get user's skills for this sport
    const userSkills = await db.select({
      skill: skills,
      node: skillTreeNodes
    })
    .from(skills)
    .innerJoin(
      skillTreeNodes,
      eq(skills.skillNodeId, skillTreeNodes.id)
    )
    .where(
      and(
        eq(skills.userId, req.user.id),
        eq(skillTreeNodes.sport_type, sport as string)
      )
    );
    
    const unlockedSkills = userSkills.filter(s => s.skill.unlocked).length;
    const masteredSkills = userSkills.filter(s => (s.skill.level || 0) >= 5).length;
    
    // Calculate total XP
    const totalXp = userSkills.reduce((sum, s) => sum + (s.skill.xp || 0), 0);
    
    // Group skills by category
    const categories: Record<string, { 
      category: string, 
      totalCount: number, 
      unlockedCount: number, 
      masteredCount: number,
      averageLevel: number 
    }> = {};
    
    allSkillNodes.forEach(node => {
      // Default to 'Uncategorized' if parent_category is null
      const category = node.parent_category || 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = {
          category: category,
          totalCount: 0,
          unlockedCount: 0,
          masteredCount: 0,
          averageLevel: 0
        };
      }
      
      categories[category].totalCount++;
    });
    
    userSkills.forEach(s => {
      // Default to 'Uncategorized' if parent_category is null
      const category = s.node.parent_category || 'Uncategorized';
      if (s.skill.unlocked) {
        categories[category].unlockedCount++;
      }
      if ((s.skill.level || 0) >= 5) {
        categories[category].masteredCount++;
      }
      categories[category].averageLevel += (s.skill.level || 0);
    });
    
    // Calculate average levels
    Object.keys(categories).forEach(cat => {
      if (categories[cat].unlockedCount > 0) {
        categories[cat].averageLevel /= categories[cat].unlockedCount;
      }
    });
    
    // Convert to array and sort by mastered count
    const skillsByCategory = Object.values(categories).sort(
      (a, b) => b.masteredCount - a.masteredCount || b.unlockedCount - a.unlockedCount
    );
    
    res.status(200).json({
      totalSkills,
      unlockedSkills,
      masteredSkills,
      totalXp,
      skillsByCategory
    });
  } catch (error) {
    console.error('Error fetching skill stats:', error);
    res.status(500).json({ error: 'Failed to fetch skill stats' });
  }
});

// Get drills for a specific skill
router.get('/drills/:skillId', async (req: Request, res: Response) => {
  try {
    const skillId = parseInt(req.params.skillId, 10);
    
    const drills = await db.select()
      .from(trainingDrills)
      .where(eq(trainingDrills.skillNodeId, skillId));
    
    res.json(drills);
  } catch (error) {
    console.error('Error fetching drills:', error);
    res.status(500).json({ error: 'Failed to fetch drills' });
  }
});

// Generate a custom drill using AI
router.post('/generate-drill', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { skillNodeId, difficulty = 'intermediate' } = req.body;
    
    if (!skillNodeId) {
      return res.status(400).json({ error: 'Skill node ID is required' });
    }

    // Get skill node details
    const [skillNode] = await db.select()
      .from(skillTreeNodes)
      .where(eq(skillTreeNodes.id, skillNodeId));
    
    if (!skillNode) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Get user details for personalization
    const [userDetails] = await db.select()
      .from(users)
      .where(eq(users.id, req.user.id));

    // In a real implementation, this would call an AI service
    // For now, we'll create a mock drill
    const generatedDrill = {
      name: `Custom ${skillNode.name} Drill`,
      description: `A personalized drill to improve your ${skillNode.name} skill.`,
      skillNodeId,
      difficulty,
      duration: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      instructions: "1. Warm up for 5 minutes\n2. Complete the main exercise\n3. Cool down",
      tips: ["Focus on proper form", "Maintain consistent pace", "Breathe properly"],
      xpReward: Math.floor(Math.random() * 20) + 10, // 10-30 XP
      isAiGenerated: true
    };

    // Save the generated drill
    const [createdDrill] = await db.insert(trainingDrills)
      .values({
        name: generatedDrill.name,
        description: generatedDrill.description,
        sport: skillNode.sport_type,
        position: skillNode.position,
        difficulty: generatedDrill.difficulty,
        estimatedDuration: generatedDrill.duration,
        equipmentNeeded: [],
        instructions: [generatedDrill.instructions],
        tips: generatedDrill.tips,
        skillNodeId,
        xpReward: generatedDrill.xpReward,
        active: true
      })
      .returning();

    res.status(201).json(createdDrill);
  } catch (error) {
    console.error('Error generating drill:', error);
    res.status(500).json({ error: 'Failed to generate drill' });
  }
});

export default router;