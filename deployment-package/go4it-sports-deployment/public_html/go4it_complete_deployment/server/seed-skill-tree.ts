import { db } from './db';
import { skillTreeNodes, skillTreeRelationships, trainingDrills } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Seeds the database with sample skill tree nodes, relationships, and training drills
 * for basketball as a sample sport.
 */
export async function seedSkillTree() {
  try {
    console.log('Starting skill tree seeding...');
    
    // Check if we already have some skill tree nodes
    const existingNodes = await db.select().from(skillTreeNodes).limit(1);
    
    if (existingNodes.length > 0) {
      console.log('Skill tree data already exists, skipping seeding');
      return;
    }
    
    // Seed Basketball Skill Tree Nodes
    const basketballCategories = [
      'Shooting',
      'Dribbling',
      'Defense',
      'Passing',
      'Physical',
      'Mental'
    ];
    
    // Nodes for each category
    const nodeData: Array<{
      name: string;
      description: string;
      category: string;
      level: number;
      difficulty: string;
      position?: string;
    }> = [
      // Shooting category
      {
        name: 'Free Throw',
        description: 'Master the fundamentals of free throw shooting',
        category: 'Shooting',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'Jump Shot',
        description: 'Develop a consistent and accurate jump shot',
        category: 'Shooting',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'Three-Point Shot',
        description: 'Extend your shooting range to beyond the arc',
        category: 'Shooting',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Fadeaway Shot',
        description: 'Create space with a fadeaway jumper',
        category: 'Shooting',
        level: 3,
        difficulty: 'advanced'
      },
      {
        name: 'Step-Back Three',
        description: 'Master the step-back three-point shot',
        category: 'Shooting',
        level: 4,
        difficulty: 'expert',
        position: 'Guard'
      },
      
      // Dribbling category
      {
        name: 'Basic Handling',
        description: 'Learn fundamental ball handling skills',
        category: 'Dribbling',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'Crossover Dribble',
        description: 'Master the crossover to change direction quickly',
        category: 'Dribbling',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Behind-the-Back',
        description: 'Learn the behind-the-back dribble move',
        category: 'Dribbling',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Hesitation Dribble',
        description: 'Freeze defenders with the hesitation move',
        category: 'Dribbling',
        level: 3,
        difficulty: 'advanced'
      },
      {
        name: 'Elite Ball Handling',
        description: 'Combine multiple dribble moves fluidly',
        category: 'Dribbling',
        level: 4,
        difficulty: 'expert',
        position: 'Guard'
      },
      
      // Defense category
      {
        name: 'Defensive Stance',
        description: 'Learn the proper defensive stance and footwork',
        category: 'Defense',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'On-Ball Defense',
        description: 'Master staying in front of your opponent',
        category: 'Defense',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Shot Blocking',
        description: 'Develop timing and technique for blocking shots',
        category: 'Defense',
        level: 3,
        difficulty: 'advanced',
        position: 'Forward'
      },
      {
        name: 'Help Defense',
        description: 'Learn proper help defense and rotations',
        category: 'Defense',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Elite Defender',
        description: 'Become a lockdown defender against any opponent',
        category: 'Defense',
        level: 4,
        difficulty: 'expert'
      },
      
      // Passing category
      {
        name: 'Chest Pass',
        description: 'Learn the fundamental chest pass technique',
        category: 'Passing',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'Bounce Pass',
        description: 'Master the bounce pass for penetrating defenses',
        category: 'Passing',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'No-Look Pass',
        description: 'Develop the ability to pass without telegraphing',
        category: 'Passing',
        level: 3,
        difficulty: 'advanced',
        position: 'Guard'
      },
      {
        name: 'Pick and Roll Passing',
        description: 'Master passing out of the pick and roll',
        category: 'Passing',
        level: 3,
        difficulty: 'advanced'
      },
      {
        name: 'Elite Playmaker',
        description: 'Become an elite playmaker with exceptional vision',
        category: 'Passing',
        level: 4,
        difficulty: 'expert',
        position: 'Guard'
      },
      
      // Physical category
      {
        name: 'Conditioning',
        description: 'Build stamina and cardiovascular endurance',
        category: 'Physical',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'Agility',
        description: 'Improve quickness and change of direction',
        category: 'Physical',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Strength',
        description: 'Develop functional strength for basketball',
        category: 'Physical',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Vertical Jump',
        description: 'Increase your vertical leap and explosiveness',
        category: 'Physical',
        level: 3,
        difficulty: 'advanced'
      },
      {
        name: 'Elite Athleticism',
        description: 'Achieve elite athletic performance on the court',
        category: 'Physical',
        level: 4,
        difficulty: 'expert'
      },
      
      // Mental category
      {
        name: 'Basketball IQ',
        description: 'Develop fundamental understanding of the game',
        category: 'Mental',
        level: 1,
        difficulty: 'beginner'
      },
      {
        name: 'Court Vision',
        description: 'Improve awareness and reading of the game',
        category: 'Mental',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Focus',
        description: 'Maintain concentration during high-pressure situations',
        category: 'Mental',
        level: 2,
        difficulty: 'intermediate'
      },
      {
        name: 'Game Strategy',
        description: 'Understand advanced game strategies and adjustments',
        category: 'Mental',
        level: 3,
        difficulty: 'advanced'
      },
      {
        name: 'Elite Mentality',
        description: 'Develop the mindset of a champion',
        category: 'Mental',
        level: 4,
        difficulty: 'expert'
      }
    ];
    
    // Insert nodes and store reference mapping
    const nodeIdMap: Record<string, number> = {};
    
    for (const node of nodeData) {
      // Insert the skill tree node using the updated schema fields
      const [insertedNode] = await db.insert(skillTreeNodes)
        .values({
          name: node.name,
          description: node.description,
          sport_type: 'basketball',
          position: node.position,
          level: node.level,
          xp_to_unlock: node.level * 50,
          parent_category: node.category,
          icon_path: 'basketball-skill.svg'
        })
        .returning({ id: skillTreeNodes.id });
      
      nodeIdMap[node.name] = insertedNode.id;
      console.log(`Created skill node: ${node.name} (ID: ${insertedNode.id})`);
    }
    
    // Define relationships
    const relationships = [
      // Shooting progression
      { parent: 'Free Throw', child: 'Jump Shot' },
      { parent: 'Jump Shot', child: 'Three-Point Shot' },
      { parent: 'Three-Point Shot', child: 'Fadeaway Shot' },
      { parent: 'Fadeaway Shot', child: 'Step-Back Three' },
      
      // Dribbling progression
      { parent: 'Basic Handling', child: 'Crossover Dribble' },
      { parent: 'Basic Handling', child: 'Behind-the-Back' },
      { parent: 'Crossover Dribble', child: 'Hesitation Dribble' },
      { parent: 'Behind-the-Back', child: 'Hesitation Dribble' },
      { parent: 'Hesitation Dribble', child: 'Elite Ball Handling' },
      
      // Defense progression
      { parent: 'Defensive Stance', child: 'On-Ball Defense' },
      { parent: 'Defensive Stance', child: 'Help Defense' },
      { parent: 'On-Ball Defense', child: 'Shot Blocking' },
      { parent: 'Help Defense', child: 'Elite Defender' },
      { parent: 'Shot Blocking', child: 'Elite Defender' },
      
      // Passing progression
      { parent: 'Chest Pass', child: 'Bounce Pass' },
      { parent: 'Bounce Pass', child: 'No-Look Pass' },
      { parent: 'Bounce Pass', child: 'Pick and Roll Passing' },
      { parent: 'No-Look Pass', child: 'Elite Playmaker' },
      { parent: 'Pick and Roll Passing', child: 'Elite Playmaker' },
      
      // Physical progression
      { parent: 'Conditioning', child: 'Agility' },
      { parent: 'Conditioning', child: 'Strength' },
      { parent: 'Agility', child: 'Vertical Jump' },
      { parent: 'Strength', child: 'Vertical Jump' },
      { parent: 'Vertical Jump', child: 'Elite Athleticism' },
      
      // Mental progression
      { parent: 'Basketball IQ', child: 'Court Vision' },
      { parent: 'Basketball IQ', child: 'Focus' },
      { parent: 'Court Vision', child: 'Game Strategy' },
      { parent: 'Focus', child: 'Game Strategy' },
      { parent: 'Game Strategy', child: 'Elite Mentality' }
    ];
    
    // Insert relationships
    for (const rel of relationships) {
      const parentId = nodeIdMap[rel.parent];
      const childId = nodeIdMap[rel.child];
      
      if (!parentId || !childId) {
        console.error(`Missing node ID for relationship: ${rel.parent} -> ${rel.child}`);
        continue;
      }
      
      await db.insert(skillTreeRelationships)
        .values({
          parent_id: parentId,
          child_id: childId,
          relationship_type: 'prerequisite'
        });
      
      console.log(`Created relationship: ${rel.parent} -> ${rel.child}`);
    }
    
    // Create sample training drills
    const drills = [
      {
        name: 'Free Throw Practice',
        description: 'Practice your free throw technique with proper form',
        skillName: 'Free Throw',
        difficulty: 'beginner',
        duration: 15,
        xpReward: 15,
        equipment: ['basketball'],
        instructions: [
          '1. Stand at the free throw line',
          '2. Position your feet shoulder-width apart',
          '3. Align the ball with your dominant eye',
          '4. Bend your knees slightly',
          '5. Shoot with a smooth release',
          '6. Follow through with your shooting hand'
        ],
        tips: [
          'Develop a consistent routine',
          'Focus on your breathing',
          'Block out distractions',
          'Aim for the back of the rim'
        ]
      },
      {
        name: 'Jump Shot Form Drill',
        description: 'Perfect your jump shot mechanics with focused repetition',
        skillName: 'Jump Shot',
        difficulty: 'beginner',
        duration: 20,
        xpReward: 20,
        equipment: ['basketball', 'cone'],
        instructions: [
          '1. Place a cone at mid-range distance',
          '2. Start in triple-threat position',
          '3. Rise up for your shot with proper form',
          '4. Hold your follow-through',
          '5. Repeat 10 times from 5 different spots'
        ],
        tips: [
          'Keep your elbow in',
          'Use your legs for power',
          'Focus on a smooth release',
          'Maintain balance throughout the shot'
        ]
      },
      {
        name: 'Three-Point Shooting Circuit',
        description: 'Improve your three-point shooting consistency with game-like scenarios',
        skillName: 'Three-Point Shot',
        difficulty: 'intermediate',
        duration: 25,
        xpReward: 25,
        equipment: ['basketball', 'cones'],
        instructions: [
          '1. Set up 5 cones around the three-point line',
          '2. Start at a cone and shoot 5 three-pointers',
          '3. Run to the next cone and repeat',
          '4. Complete the circuit twice',
          '5. Track your makes and misses'
        ],
        tips: [
          'Generate power from your legs',
          'Shoot with a higher arc for better accuracy',
          'Focus on consistent form',
          'Simulate game-speed movements'
        ]
      }
    ];
    
    // Insert drills
    for (const drill of drills) {
      const skillNodeId = nodeIdMap[drill.skillName];
      
      if (!skillNodeId) {
        console.error(`Missing node ID for drill: ${drill.name}`);
        continue;
      }
      
      await db.insert(trainingDrills)
        .values({
          name: drill.name,
          description: drill.description,
          sport: 'basketball',
          difficulty: drill.difficulty,
          estimatedDuration: drill.duration,
          equipmentNeeded: drill.equipment,
          instructions: drill.instructions,
          tips: drill.tips,
          skillNodeId,
          xpReward: drill.xpReward,
          active: true
        });
      
      console.log(`Created training drill: ${drill.name}`);
    }
    
    console.log('Skill tree seeding completed successfully');
  } catch (error) {
    console.error('Error seeding skill tree data:', error);
    throw error;
  }
}

// We're using ES modules, so this check isn't needed
// The function will only be called from server/index.ts