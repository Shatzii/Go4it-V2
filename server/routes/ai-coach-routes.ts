import { Router, Request, Response } from 'express';
import { aiCoachService } from '../services/ai-coach-service';
import { db } from '../db';
import { skillTreeNodes, skillTreeRelationships, skills, trainingDrills } from '@shared/schema';
import { eq, and, isNull, inArray } from 'drizzle-orm';

const router = Router();

/**
 * Generate a training drill for a specific skill
 * POST /api/ai-coach/generate-drill
 */
router.post('/generate-drill', async (req: Request, res: Response) => {
  try {
    const { skillNodeId, difficulty } = req.body;
    
    if (!skillNodeId) {
      return res.status(400).json({ message: 'skillNodeId is required' });
    }
    
    const drill = await aiCoachService.generateDrill(skillNodeId, difficulty);
    
    if (!drill) {
      return res.status(500).json({ message: 'Failed to generate drill' });
    }
    
    res.status(200).json(drill);
  } catch (error) {
    console.error('Error generating drill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get drills for a specific sport
 * GET /api/ai-coach/drills/:sport
 */
router.get('/drills/:sport', async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    const { position, category, difficulty, limit } = req.query;
    
    const drills = await aiCoachService.getDrillsForSport(
      sport as any, // Using any as a temporary workaround for type checking
      position as string | undefined,
      category as any, // Using any as a temporary workaround for type checking
      difficulty as any, // Using any as a temporary workaround for type checking
      limit ? parseInt(limit as string) : 10
    );
    
    res.status(200).json(drills);
  } catch (error) {
    console.error('Error getting drills for sport:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get general athletic development drills
 * GET /api/ai-coach/athletic-drills/:category
 */
router.get('/athletic-drills/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { difficulty, limit } = req.query;
    
    const drills = await aiCoachService.getAthleticDevelopmentDrills(
      category as any, // Using any as a temporary workaround for type checking
      difficulty as any, // Using any as a temporary workaround for type checking
      limit ? parseInt(limit as string) : 5
    );
    
    res.status(200).json(drills);
  } catch (error) {
    console.error('Error getting athletic development drills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Create a daily workout plan
 * POST /api/ai-coach/workout-plan
 */
router.post('/workout-plan', async (req: Request, res: Response) => {
  try {
    const { userId, sport, focus } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const workoutPlan = await aiCoachService.createWorkoutPlan(userId, sport, focus);
    
    res.status(200).json(workoutPlan);
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Create a training program
 * POST /api/ai-coach/training-program
 */
router.post('/training-program', async (req: Request, res: Response) => {
  try {
    const { userId, sport, goals, durationWeeks } = req.body;
    
    if (!userId || !sport || !goals) {
      return res.status(400).json({ message: 'userId, sport, and goals are required' });
    }
    
    const program = await aiCoachService.createTrainingProgram(
      userId, 
      sport, 
      goals, 
      durationWeeks || 4
    );
    
    if (!program) {
      return res.status(500).json({ message: 'Failed to create training program' });
    }
    
    res.status(200).json(program);
  } catch (error) {
    console.error('Error creating training program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Initialize skill tree for a sport
 * POST /api/ai-coach/initialize-skill-tree
 */
router.post('/initialize-skill-tree', async (req: Request, res: Response) => {
  try {
    const { sport } = req.body;
    
    if (!sport) {
      return res.status(400).json({ message: 'sport is required' });
    }
    
    const success = await aiCoachService.initializeSkillTreeForSport(sport);
    
    if (!success) {
      return res.status(500).json({ message: `Failed to initialize skill tree for ${sport}` });
    }
    
    res.status(200).json({ message: `Successfully initialized skill tree for ${sport}` });
  } catch (error) {
    console.error('Error initializing skill tree:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get skill tree nodes for a sport
 * GET /api/ai-coach/skill-tree/:sport
 */
router.get('/skill-tree/:sport', async (req: Request, res: Response) => {
  try {
    const { sport } = req.params;
    
    // Get all skill nodes for this sport
    const nodes = await db
      .select()
      .from(skillTreeNodes)
      .where(
        sport === 'general' 
          ? isNull(skillTreeNodes.sportType) 
          : eq(skillTreeNodes.sportType, sport)
      )
      .orderBy(skillTreeNodes.level, skillTreeNodes.sortOrder);
    
    // Get all relationships
    const nodeIds = nodes.map(node => node.id);
    const relationships = await db
      .select()
      .from(skillTreeRelationships)
      .where(
        nodeIds.length > 0 
          ? inArray(skillTreeRelationships.childId, nodeIds) 
          : undefined
      );
    
    // Structure the response
    const skillTree = {
      nodes,
      relationships
    };
    
    res.status(200).json(skillTree);
  } catch (error) {
    console.error('Error getting skill tree:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get user's skill progress
 * GET /api/ai-coach/skills/:userId
 */
router.get('/skills/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Get user's skills
    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, parseInt(userId)));
    
    // Get all skill nodes related to this user's skills
    const skillNodeIds = userSkills.map(skill => skill.skillNodeId);
    const skillNodesInfo = await db
      .select()
      .from(skillTreeNodes)
      .where(
        skillNodeIds.length > 0 
          ? inArray(skillTreeNodes.id, skillNodeIds) 
          : undefined
      );
    
    // Combine the data
    const userSkillsWithInfo = userSkills.map(skill => {
      const nodeInfo = skillNodesInfo.find(node => node.id === skill.skillNodeId);
      return {
        ...skill,
        nodeInfo
      };
    });
    
    res.status(200).json(userSkillsWithInfo);
  } catch (error) {
    console.error('Error getting user skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Update user's skill progress
 * PUT /api/ai-coach/skills/:skillId
 */
router.put('/skills/:skillId', async (req: Request, res: Response) => {
  try {
    const { skillId } = req.params;
    const { xpPoints, skillLevel } = req.body;
    
    // Update the skill
    const [updatedSkill] = await db
      .update(skills)
      .set({
        xpPoints: xpPoints !== undefined ? xpPoints : undefined,
        skillLevel: skillLevel !== undefined ? skillLevel : undefined,
        updatedAt: new Date()
      })
      .where(eq(skills.id, parseInt(skillId)))
      .returning();
    
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.status(200).json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Unlock a new skill for a user
 * POST /api/ai-coach/unlock-skill
 */
router.post('/unlock-skill', async (req: Request, res: Response) => {
  try {
    const { userId, skillNodeId } = req.body;
    
    if (!userId || !skillNodeId) {
      return res.status(400).json({ message: 'userId and skillNodeId are required' });
    }
    
    // Get the skill node
    const [skillNode] = await db
      .select()
      .from(skillTreeNodes)
      .where(eq(skillTreeNodes.id, skillNodeId));
    
    if (!skillNode) {
      return res.status(404).json({ message: 'Skill node not found' });
    }
    
    // Check if the user already has this skill
    const existingSkill = await db
      .select()
      .from(skills)
      .where(
        and(
          eq(skills.userId, userId),
          eq(skills.skillNodeId, skillNodeId)
        )
      );
    
    if (existingSkill.length > 0) {
      return res.status(400).json({ message: 'User already has this skill' });
    }
    
    // Create the new skill
    const [newSkill] = await db
      .insert(skills)
      .values({
        userId,
        skillNodeId,
        skillName: skillNode.name,
        skillCategory: skillNode.category,
        skillLevel: 1,
        isUnlocked: true,
        xpPoints: 0,
        nextLevelXp: 100
      })
      .returning();
    
    if (!newSkill) {
      return res.status(500).json({ message: 'Failed to unlock skill' });
    }
    
    res.status(200).json(newSkill);
  } catch (error) {
    console.error('Error unlocking skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get training drills for a specific skill
 * GET /api/ai-coach/skill-drills/:skillNodeId
 */
router.get('/skill-drills/:skillNodeId', async (req: Request, res: Response) => {
  try {
    const { skillNodeId } = req.params;
    
    const drills = await db
      .select()
      .from(trainingDrills)
      .where(eq(trainingDrills.skillNodeId, parseInt(skillNodeId)));
    
    res.status(200).json(drills);
  } catch (error) {
    console.error('Error getting skill drills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;