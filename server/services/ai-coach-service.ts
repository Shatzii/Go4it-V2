import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db';
import { insertTrainingDrillSchema } from '@shared/schema';
import { trainingDrills, skillTreeNodes, skillTreeRelationships } from '@shared/schema';
import { eq, and, isNull, inArray } from 'drizzle-orm';
import type { TrainingDrill, InsertTrainingDrill, SkillTreeNode } from '@shared/schema';
import { z } from 'zod';

// Sport types supported by the platform
const supportedSports = [
  'basketball',
  'football',
  'soccer',
  'baseball',
  'volleyball',
  'track',
  'swimming',
  'tennis',
  'golf',
  'wrestling'
] as const;

// Skill categories
const skillCategories = [
  'speed',
  'strength',
  'agility',
  'technique',
  'endurance',
  'flexibility',
  'coordination',
  'balance',
  'power',
  'mental'
] as const;

// Define the difficulty levels
const difficultyLevels = ['beginner', 'intermediate', 'advanced'] as const;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const CLAUDE_MODEL = 'claude-3-opus-20240229';

/**
 * AI Coach Service - manages the generation and retrieval of skill tree content
 * and training drills using Anthropic's Claude API
 */
export class AICoachService {
  /**
   * Generates a new training drill for a specific skill using Anthropic
   * @param skillNodeId ID of the skill node to generate a drill for
   * @param difficulty Difficulty level of the drill
   * @returns Generated training drill
   */
  async generateDrill(
    skillNodeId: number, 
    difficulty: typeof difficultyLevels[number] = 'intermediate'
  ): Promise<TrainingDrill | null> {
    try {
      // Get the skill node to generate a drill for
      const [skillNode] = await db
        .select()
        .from(skillTreeNodes)
        .where(eq(skillTreeNodes.id, skillNodeId));

      if (!skillNode) {
        throw new Error(`Skill node with ID ${skillNodeId} not found`);
      }

      // Generate prompt for Claude
      const prompt = this.createDrillGenerationPrompt(skillNode, difficulty);

      // Call Claude API
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        temperature: 0.7,
        system: "You are an expert sports training coach with deep knowledge about all aspects of athletic development and sports-specific skills. You create effective drills that are appropriate for the given age group (12-18), skill level, and sport. Your drills are detailed, precise, and well-structured. You include practical tips, variations, and progression paths. Focus on drills that can be done in a typical school gym, field, or home setting with minimal equipment. Your response should ALWAYS be structured as valid JSON.",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
        // response_format removed as it's not supported in the current version of the @anthropic-ai/sdk
      });

      if (!response.content || response.content.length === 0) {
        throw new Error('No content received from Anthropic API');
      }

      // Parse the response - handle different content formats
      const content = typeof response.content[0] === 'string' 
        ? response.content[0] 
        : ('text' in response.content[0] 
          ? (response.content[0] as any).text 
          : JSON.stringify(response.content[0]));
      const drillData = JSON.parse(content);

      // Validate the response data
      const validatedData = this.validateDrillData(drillData, skillNode);

      // Insert the drill into the database
      const [newDrill] = await db
        .insert(trainingDrills)
        .values({
          ...validatedData,
          skillNodeId,
          isAiGenerated: true,
          aiPromptUsed: prompt
        })
        .returning();

      return newDrill || null;
    } catch (error) {
      console.error('Error generating drill:', error);
      return null;
    }
  }

  /**
   * Gets a set of training drills for a specific sport and position
   * @param sport Sport type to get drills for
   * @param position Optional position within the sport
   * @param category Optional skill category
   * @param difficulty Optional difficulty level
   * @param limit Maximum number of drills to return
   * @returns List of training drills
   */
  async getDrillsForSport(
    sport: typeof supportedSports[number],
    position?: string,
    category?: typeof skillCategories[number],
    difficulty?: typeof difficultyLevels[number],
    limit: number = 10
  ): Promise<TrainingDrill[]> {
    try {
      // Define filter conditions
      let conditions = [eq(trainingDrills.sportType, sport)];
      
      // Add optional filters
      if (position) {
        conditions.push(eq(trainingDrills.position, position));
      }

      if (category) {
        conditions.push(eq(trainingDrills.category, category));
      }

      if (difficulty) {
        conditions.push(eq(trainingDrills.difficulty, difficulty));
      }
      
      // Use all conditions in a single where clause with and()
      const query = db
        .select()
        .from(trainingDrills)
        .where(and(...conditions));

      const drills = await query.limit(limit);

      // If not enough drills found, generate new ones if needed
      if (drills.length < limit) {
        // Find skill nodes for this sport and possibly position
        const sportSkillNodes = await db
          .select()
          .from(skillTreeNodes)
          .where(
            and(
              eq(skillTreeNodes.sportType, sport),
              position ? eq(skillTreeNodes.position, position) : undefined,
              category ? eq(skillTreeNodes.category, category) : undefined
            )
          )
          .limit(3); // Limit to 3 skill nodes to generate from

        // Generate missing drills if we have skill nodes to work with
        if (sportSkillNodes.length > 0) {
          for (let i = 0; i < Math.min(limit - drills.length, sportSkillNodes.length); i++) {
            const skillNode = sportSkillNodes[i];
            const newDrill = await this.generateDrill(
              skillNode.id,
              difficulty || 'intermediate'
            );
            if (newDrill) {
              drills.push(newDrill);
            }
          }
        }
      }

      return drills;
    } catch (error) {
      console.error('Error getting drills for sport:', error);
      return [];
    }
  }

  /**
   * Generates a set of general athletic development drills not specific to any sport
   * @param category Skill category to focus on (speed, strength, etc.)
   * @param difficulty Difficulty level
   * @param limit Maximum number of drills to return
   * @returns List of training drills
   */
  async getAthleticDevelopmentDrills(
    category: typeof skillCategories[number],
    difficulty: typeof difficultyLevels[number] = 'intermediate',
    limit: number = 5
  ): Promise<TrainingDrill[]> {
    try {
      // First try to find existing drills
      const existingDrills = await db
        .select()
        .from(trainingDrills)
        .where(
          and(
            isNull(trainingDrills.sportType),
            eq(trainingDrills.category, category),
            eq(trainingDrills.difficulty, difficulty)
          )
        )
        .limit(limit);

      // If we have enough drills, return them
      if (existingDrills.length >= limit) {
        return existingDrills;
      }

      // Find general athletic skill nodes
      const [generalSkillNode] = await db
        .select()
        .from(skillTreeNodes)
        .where(
          and(
            isNull(skillTreeNodes.sportType),
            eq(skillTreeNodes.category, category)
          )
        )
        .limit(1);

      // If no general skill node exists, create one
      let skillNodeId: number;
      if (!generalSkillNode) {
        const [newNode] = await db
          .insert(skillTreeNodes)
          .values({
            name: `General ${category} development`,
            description: `Fundamental ${category} development for all athletes`,
            category,
            level: 1
          })
          .returning();
        
        if (!newNode) {
          throw new Error(`Failed to create general skill node for ${category}`);
        }
        
        skillNodeId = newNode.id;
      } else {
        skillNodeId = generalSkillNode.id;
      }

      // Generate additional drills
      const generatedDrills: TrainingDrill[] = [];
      for (let i = 0; i < limit - existingDrills.length; i++) {
        const newDrill = await this.generateDrill(skillNodeId, difficulty);
        if (newDrill) {
          generatedDrills.push(newDrill);
        }
      }

      return [...existingDrills, ...generatedDrills];
    } catch (error) {
      console.error('Error getting athletic development drills:', error);
      return [];
    }
  }

  /**
   * Creates a daily workout plan combining drills from different categories
   * @param userId User ID to create workout for
   * @param sport Primary sport focus
   * @param focus Specific area to focus on
   * @returns List of training drills in a structured workout plan
   */
  async createWorkoutPlan(
    userId: number,
    sport?: typeof supportedSports[number],
    focus?: typeof skillCategories[number]
  ): Promise<{ warmup: TrainingDrill[], main: TrainingDrill[], cooldown: TrainingDrill[] }> {
    try {
      const workout = {
        warmup: [] as TrainingDrill[],
        main: [] as TrainingDrill[],
        cooldown: [] as TrainingDrill[]
      };

      // Get 2 warmup drills (flexibility, coordination)
      workout.warmup = await this.getAthleticDevelopmentDrills('flexibility', 'beginner', 2);
      
      // Get main workout - either sport-specific or general
      if (sport) {
        // Get 3-4 sport-specific drills
        workout.main = await this.getDrillsForSport(
          sport,
          undefined,
          focus || undefined,
          'intermediate',
          4
        );
      } else if (focus) {
        // Get general athletic development drills for the focus area
        workout.main = await this.getAthleticDevelopmentDrills(focus, 'intermediate', 4);
      } else {
        // Default to strength and agility
        const strengthDrills = await this.getAthleticDevelopmentDrills('strength', 'intermediate', 2);
        const agilityDrills = await this.getAthleticDevelopmentDrills('agility', 'intermediate', 2);
        workout.main = [...strengthDrills, ...agilityDrills];
      }

      // Get 1-2 cooldown drills
      workout.cooldown = await this.getAthleticDevelopmentDrills('flexibility', 'beginner', 2);

      return workout;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      return { warmup: [], main: [], cooldown: [] };
    }
  }

  /**
   * Creates a comprehensive training program for an athlete
   * @param userId User ID to create program for
   * @param sport Primary sport focus
   * @param goals Training goals
   * @param durationWeeks Duration of the program in weeks
   * @returns Training program description and structure
   */
  async createTrainingProgram(
    userId: number,
    sport: typeof supportedSports[number],
    goals: string[],
    durationWeeks: number = 4
  ): Promise<any> {
    try {
      // This would use Claude to generate a comprehensive training program
      // For now, we'll return a simple placeholder
      return {
        userId,
        sport,
        goals,
        durationWeeks,
        program: {
          overview: "4-week progressive training program",
          weeklySchedule: [
            { day: "Monday", focus: "Strength & Speed" },
            { day: "Tuesday", focus: "Sport-specific skills" },
            { day: "Wednesday", focus: "Recovery & Flexibility" },
            { day: "Thursday", focus: "Agility & Coordination" },
            { day: "Friday", focus: "Sport-specific skills" },
            { day: "Saturday", focus: "Game simulation" },
            { day: "Sunday", focus: "Rest" }
          ],
          weeks: [
            { weekNumber: 1, theme: "Foundation", intensity: "Moderate" },
            { weekNumber: 2, theme: "Development", intensity: "Moderate-High" },
            { weekNumber: 3, theme: "Progression", intensity: "High" },
            { weekNumber: 4, theme: "Peak Performance", intensity: "Variable" }
          ]
        }
      };
    } catch (error) {
      console.error('Error creating training program:', error);
      return null;
    }
  }

  /**
   * Creates a prompt for drill generation based on a skill node
   * @param skillNode Skill node to generate drill for
   * @param difficulty Difficulty level of the drill
   * @returns Generated prompt
   */
  private createDrillGenerationPrompt(
    skillNode: SkillTreeNode,
    difficulty: typeof difficultyLevels[number]
  ): string {
    return `Generate a detailed training drill for student athletes (ages 12-18) focused on developing ${skillNode.name}.
    
Sport: ${skillNode.sportType || 'General athletic development'}
Position: ${skillNode.position || 'All positions'}
Skill Category: ${skillNode.category}
Difficulty Level: ${difficulty}

The drill should include:
1. A clear name
2. A concise but detailed description
3. Step-by-step instructions
4. Required equipment (minimal is preferred)
5. Target muscles/athletic qualities developed
6. Duration (in minutes)
7. 3-5 coaching tips for proper execution
8. 2-3 variations of increasing difficulty
9. XP reward value (between 10-25 based on difficulty and effort required)

Format your response as JSON with these fields:
{
  "name": "Drill name",
  "description": "Detailed description",
  "instructions": "Step-by-step instructions",
  "equipment": ["item1", "item2"],
  "targetMuscles": ["muscle1", "muscle2"],
  "duration": 15,
  "tips": ["tip1", "tip2", "tip3"],
  "variations": ["variation1", "variation2"],
  "xpReward": 15
}`;
  }

  /**
   * Validates and sanitizes drill data returned from AI
   * @param data Raw data from AI response
   * @param skillNode Associated skill node
   * @returns Validated drill data
   */
  private validateDrillData(data: any, skillNode: SkillTreeNode): InsertTrainingDrill {
    try {
      // Define the validation schema based on our requirements
      const drillDataSchema = z.object({
        name: z.string().min(3).max(100),
        description: z.string().min(10),
        instructions: z.string().min(10),
        equipment: z.array(z.string()).optional().default([]),
        targetMuscles: z.array(z.string()).optional().default([]),
        duration: z.number().int().min(1).max(120),
        tips: z.array(z.string()).optional().default([]),
        variations: z.array(z.string()).optional().default([]),
        xpReward: z.number().int().min(5).max(50)
      });

      // Validate the data
      const validatedData = drillDataSchema.parse(data);

      // Create the insert data
      const insertData: InsertTrainingDrill = {
        name: validatedData.name,
        description: validatedData.description,
        skillNodeId: skillNode.id,
        difficulty: z.enum(difficultyLevels).parse(skillNode.level <= 2 ? 'beginner' : skillNode.level <= 4 ? 'intermediate' : 'advanced'),
        sportType: skillNode.sportType || null,
        position: skillNode.position || null,
        category: skillNode.category,
        duration: validatedData.duration,
        equipment: validatedData.equipment,
        targetMuscles: validatedData.targetMuscles,
        instructions: validatedData.instructions,
        tips: validatedData.tips,
        variations: validatedData.variations,
        xpReward: validatedData.xpReward,
        imageUrl: null,
        videoUrl: null
      };

      return insertData;
    } catch (error) {
      console.error('Error validating drill data:', error);
      
      // Return a safe default if validation fails
      return {
        name: `${skillNode.name} Development Drill`,
        description: `A drill designed to improve ${skillNode.name} skills`,
        skillNodeId: skillNode.id,
        difficulty: 'intermediate',
        sportType: skillNode.sportType || null,
        position: skillNode.position || null,
        category: skillNode.category,
        duration: 15,
        equipment: [],
        targetMuscles: [],
        instructions: 'Please see coach for detailed instructions.',
        tips: ['Focus on proper form', 'Start slowly and gradually increase intensity'],
        variations: ['Basic version', 'Advanced version'],
        xpReward: 10,
        imageUrl: null,
        videoUrl: null
      };
    }
  }

  /**
   * Generates and initializes the default skill tree structure for a given sport
   * @param sport Sport to generate skill tree for
   * @returns Success indicator
   */
  async initializeSkillTreeForSport(sport: typeof supportedSports[number]): Promise<boolean> {
    try {
      // Check if we already have skill tree nodes for this sport
      const existingNodes = await db
        .select()
        .from(skillTreeNodes)
        .where(eq(skillTreeNodes.sportType, sport))
        .limit(1);

      if (existingNodes.length > 0) {
        console.log(`Skill tree for ${sport} already exists`);
        return true;
      }

      // Generate skill tree structure based on the sport
      const prompt = `Create a comprehensive skill tree structure for ${sport} for student athletes (ages 12-18).
      
The skill tree should include:
1. Fundamental athletic skills (speed, strength, agility, etc.)
2. Sport-specific technical skills
3. Position-specific skills (if applicable)
4. Mental and tactical development skills

For each skill node, provide:
- Name
- Brief description
- Category (speed, strength, agility, technique, etc.)
- Level in the skill tree (1 being the most fundamental)
- Sort order (for ordering skills within the same level)
- XP needed to unlock (0 for level 1 skills)

Format your response as a JSON array of skill nodes with these fields:
[
  {
    "name": "Skill name",
    "description": "Description of the skill",
    "category": "Category",
    "level": 1,
    "sortOrder": 1,
    "xpToUnlock": 0,
    "position": "Position name or null if not position-specific"
  },
  ...
]

Limit your response to 15-20 key skills that form a well-structured progression path.`;

      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        temperature: 0.7,
        system: "You are an expert sports coach with deep knowledge of skill development progressions for student athletes. You design comprehensive skill trees that show clear progression paths from fundamental to advanced skills. Your responses are always formatted as valid JSON arrays.",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
        // response_format removed as it's not supported in the current version of the @anthropic-ai/sdk
      });

      if (!response.content || response.content.length === 0) {
        throw new Error('No content received from Anthropic API');
      }

      // Parse the response - handle different content formats
      const content = typeof response.content[0] === 'string' 
        ? response.content[0] 
        : ('text' in response.content[0] 
          ? (response.content[0] as any).text 
          : JSON.stringify(response.content[0]));
      const skillNodesData = JSON.parse(content);

      if (!Array.isArray(skillNodesData)) {
        throw new Error('Expected an array of skill nodes');
      }

      // Insert the skill nodes
      const insertPromises = skillNodesData.map(async (nodeData: any) => {
        try {
          await db.insert(skillTreeNodes).values({
            name: nodeData.name,
            description: nodeData.description || `Develop your ${nodeData.name} skills`,
            sportType: sport,
            position: nodeData.position || null,
            category: nodeData.category,
            level: nodeData.level || 1,
            xpToUnlock: nodeData.xpToUnlock || 0,
            sortOrder: nodeData.sortOrder || 0,
            isActive: true
          });
        } catch (error) {
          console.error(`Error inserting skill node ${nodeData.name}:`, error);
        }
      });

      await Promise.all(insertPromises);

      // Now create the relationships between nodes
      const insertedNodes = await db
        .select()
        .from(skillTreeNodes)
        .where(eq(skillTreeNodes.sportType, sport));

      // Connect nodes based on their levels (level 1 nodes are parents of level 2 nodes in the same category, etc.)
      for (let level = 2; level <= Math.max(...insertedNodes.map(n => n.level)); level++) {
        const childNodes = insertedNodes.filter(n => n.level === level);
        const parentNodes = insertedNodes.filter(n => n.level === level - 1);

        for (const childNode of childNodes) {
          // Find parent nodes in the same category
          const compatibleParents = parentNodes.filter(
            p => p.category === childNode.category || 
                (p.position === childNode.position && p.position !== null)
          );

          if (compatibleParents.length > 0) {
            // Connect to the most relevant parent
            const parent = compatibleParents[0];
            await db.insert(skillTreeRelationships).values({
              parentId: parent.id,
              childId: childNode.id,
              requirement: `${parent.name} must be at least level 2`
            });
          }
        }
      }

      return true;
    } catch (error) {
      console.error(`Error initializing skill tree for ${sport}:`, error);
      return false;
    }
  }
}

// Create singleton instance
export const aiCoachService = new AICoachService();