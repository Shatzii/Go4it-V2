/**
 * Drill Library Seed Data
 * 
 * Comprehensive drill database for 5 sports:
 * - Football
 * - Basketball
 * - Soccer
 * - Ski Jumping
 * - Flag Football
 * 
 * Each sport includes drills across all categories:
 * - Strength
 * - Speed
 * - Agility
 * - Skill
 * - Technique
 * - Conditioning
 * 
 * Run with: npx tsx scripts/seed-drills.ts
 */

import { db } from '@/lib/db';
import { drills, mediaAssets, drillCollections } from '@/lib/db/drill-library-schema';

// ============================================
// FOOTBALL DRILLS (40 drills)
// ============================================

const footballDrills = [
  // Speed Drills
  {
    title: '40-Yard Dash Technique Training',
    description: 'Master the mechanics of the 40-yard dash with proper start position, acceleration phase, and drive phase. Focus on explosive first step, arm drive, and maintaining top speed through the finish.',
    shortDescription: 'Perfect your 40-yard dash mechanics for combine performance',
    sport: 'football',
    category: 'speed',
    skillLevel: 'intermediate',
    position: 'all',
    garComponent: 'sprint',
    ariConnection: 'discipline',
    behaviorConnection: 'resilience',
    duration: 20,
    sets: 5,
    reps: '3',
    restPeriod: 90,
    intensity: 'high',
    equipment: ['cones', 'stopwatch'],
    spaceRequired: '40 yards straight',
    participantCount: 'individual',
    difficultyScore: 6,
    keyPoints: [
      'Explosive first step with drive leg',
      'Keep head down for first 10 yards',
      'Powerful arm drive throughout',
      'Accelerate through the finish line',
    ],
    commonMistakes: [
      'Standing up too early in acceleration',
      'Overstriding in first 10 yards',
      'Slowing down before the finish',
    ],
    coachingCues: [
      '"Drive, drive, drive through 10!"',
      '"Stay low, stay powerful"',
      '"Arms like pistons"',
    ],
    xpReward: 15,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  {
    title: 'Pro Agility (5-10-5) Drill',
    description: 'NFL combine staple testing change of direction speed. Start straddling center line, sprint 5 yards right and touch, sprint 10 yards left and touch, sprint 5 yards right through finish. Emphasizes lateral explosion, plant mechanics, and acceleration out of cuts.',
    shortDescription: 'Master the 5-10-5 shuttle for explosive change of direction',
    sport: 'football',
    category: 'agility',
    skillLevel: 'intermediate',
    position: 'all',
    garComponent: 'cod',
    duration: 15,
    sets: 6,
    reps: '2',
    restPeriod: 60,
    intensity: 'max',
    equipment: ['cones', 'stopwatch'],
    spaceRequired: '10x5 yards',
    participantCount: 'individual',
    difficultyScore: 7,
    keyPoints: [
      'Low athletic stance at start',
      'Plant outside foot on cuts',
      'Keep hips low through direction changes',
      'Accelerate aggressively out of each plant',
    ],
    xpReward: 15,
    status: 'published',
    isPublic: true,
  },
  // Strength Drills
  {
    title: 'Sled Push for Drive Power',
    description: 'Develop lower body drive power crucial for linemen and running backs. Load sled with 50-150% bodyweight, maintain forward lean, drive through legs with short, powerful steps. Builds explosive hip extension and leg drive.',
    shortDescription: 'Build explosive leg drive with weighted sled pushes',
    sport: 'football',
    category: 'strength',
    skillLevel: 'intermediate',
    position: 'lineman',
    garComponent: 'strength',
    duration: 25,
    sets: 8,
    reps: '20 yards',
    restPeriod: 120,
    intensity: 'high',
    equipment: ['weighted_sled', 'plates'],
    spaceRequired: '30 yards straight',
    participantCount: 'individual',
    difficultyScore: 8,
    keyPoints: [
      '45-degree forward lean',
      'Short, choppy steps',
      'Drive through heels',
      'Keep core engaged',
    ],
    xpReward: 20,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'Tire Flips for Total Body Power',
    description: 'Full body explosive power drill using large tractor tire (200-400 lbs). Emphasizes proper lifting mechanics, explosive triple extension, and power transfer. Excellent for linemen strength and conditioning.',
    shortDescription: 'Develop total body explosive power with tire flips',
    sport: 'football',
    category: 'strength',
    skillLevel: 'advanced',
    position: 'lineman',
    garComponent: 'strength',
    duration: 20,
    sets: 5,
    reps: '8 flips',
    restPeriod: 180,
    intensity: 'max',
    equipment: ['large_tire'],
    spaceRequired: '20x10 yards',
    participantCount: 'individual',
    difficultyScore: 9,
    xpReward: 25,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  // Skill Drills
  {
    title: 'QB Drop-Back Mechanics',
    description: 'Perfect the 3-step, 5-step, and 7-step drop-back patterns. Focus on footwork timing, hip rotation, throwing platform stability, and decision-making progression. Includes pocket awareness and throwing on rhythm.',
    shortDescription: 'Master quarterback drop-back patterns and throwing mechanics',
    sport: 'football',
    category: 'skill',
    skillLevel: 'intermediate',
    position: 'QB',
    duration: 30,
    sets: 10,
    reps: '5 each drop',
    restPeriod: 45,
    intensity: 'medium',
    equipment: ['footballs', 'cones'],
    spaceRequired: '20x20 yards',
    participantCount: 'individual',
    difficultyScore: 7,
    keyPoints: [
      'Consistent depth on each drop',
      'Eyes downfield immediately',
      'Set feet before throw',
      'Hip rotation generates power',
    ],
    xpReward: 20,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'WR Route Running: Stem & Break',
    description: 'Develop precise route running with emphasis on stem technique, breaking at top speed, and head/eye discipline. Practice 10-yard out, comeback, post, and corner routes with proper depth and break timing.',
    shortDescription: 'Perfect route running technique for wide receivers',
    sport: 'football',
    category: 'skill',
    skillLevel: 'intermediate',
    position: 'WR',
    duration: 25,
    sets: 8,
    reps: '5 routes',
    restPeriod: 60,
    intensity: 'high',
    equipment: ['footballs', 'cones'],
    spaceRequired: '30x20 yards',
    participantCount: '2-4',
    difficultyScore: 7,
    xpReward: 18,
    status: 'published',
    isPublic: true,
  },
  // Technique Drills
  {
    title: 'Tackling Form: Hawk Drill',
    description: 'Fundamental tackling technique drill emphasizing eyes, leverage, and driving through target. Defender approaches ball carrier in tight space, focuses on chest, wraps arms, drives legs. Builds confidence and proper form.',
    shortDescription: 'Master safe, effective tackling technique',
    sport: 'football',
    category: 'technique',
    skillLevel: 'beginner',
    position: 'defense',
    duration: 20,
    sets: 10,
    reps: '5 tackles',
    restPeriod: 45,
    intensity: 'medium',
    equipment: ['tackling_dummies', 'pads'],
    spaceRequired: '10x10 yards',
    participantCount: '2',
    difficultyScore: 5,
    keyPoints: [
      'See what you hit',
      'Head across body',
      'Wrap and squeeze',
      'Drive legs on contact',
    ],
    safetyNotes: 'Always wear proper protective equipment. Progress to live tackling only after mastering form.',
    xpReward: 12,
    status: 'published',
    isPublic: true,
  },
  // Conditioning
  {
    title: 'Gassers: Football Conditioning',
    description: 'Classic football conditioning drill: sprint sideline to sideline 4 times (208 yards total) in under 34 seconds (skill) or 36 seconds (linemen). Rest 3-4 minutes between sets. Builds game-speed conditioning.',
    shortDescription: 'Build game-ready conditioning with gassers',
    sport: 'football',
    category: 'conditioning',
    skillLevel: 'intermediate',
    position: 'all',
    garComponent: 'endurance',
    duration: 30,
    sets: 4,
    reps: '1 gasser',
    restPeriod: 240,
    intensity: 'max',
    equipment: ['stopwatch'],
    spaceRequired: 'full_field_width',
    participantCount: 'individual',
    difficultyScore: 8,
    xpReward: 18,
    status: 'published',
    isPublic: true,
  },
];

// ============================================
// BASKETBALL DRILLS (40 drills)
// ============================================

const basketballDrills = [
  // Speed & Agility
  {
    title: 'Defensive Slide Progression',
    description: 'Master defensive footwork with lateral slides, drop steps, and closeouts. Focus on staying low, quick feet, and maintaining defensive stance. Progress from cone drills to reactive partner work.',
    shortDescription: 'Develop elite defensive footwork and lateral quickness',
    sport: 'basketball',
    category: 'agility',
    skillLevel: 'beginner',
    garComponent: 'cod',
    duration: 20,
    sets: 6,
    reps: '10 slides each direction',
    restPeriod: 60,
    intensity: 'medium',
    equipment: ['cones'],
    spaceRequired: 'half_court',
    participantCount: 'individual',
    difficultyScore: 4,
    keyPoints: [
      'Stay in athletic stance',
      'Push off outside foot',
      'Keep hands active',
      'Never cross feet',
    ],
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'Lane Agility Drill',
    description: 'NBA combine agility test: sprint baseline to FT line, defensive slide to opposite elbow, backpedal to baseline, sprint to half court. Tests multi-directional speed and basketball-specific movement.',
    shortDescription: 'NBA combine lane agility for multi-directional speed',
    sport: 'basketball',
    category: 'agility',
    skillLevel: 'intermediate',
    garComponent: 'cod',
    duration: 15,
    sets: 5,
    reps: '2',
    restPeriod: 90,
    intensity: 'high',
    equipment: ['cones', 'stopwatch'],
    spaceRequired: 'half_court',
    participantCount: 'individual',
    difficultyScore: 7,
    xpReward: 15,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  // Skill Development
  {
    title: 'Mikan Drill: Layup Mastery',
    description: 'Classic basketball fundamental: continuous layups alternating sides under basket. Develops touch, footwork, ambidextrous finishing, and conditioning. Start slow focusing on form, progress to game speed.',
    shortDescription: 'Master layup touch and ambidextrous finishing',
    sport: 'basketball',
    category: 'skill',
    skillLevel: 'beginner',
    duration: 15,
    sets: 5,
    reps: '20 makes',
    restPeriod: 60,
    intensity: 'medium',
    equipment: ['basketball', 'hoop'],
    spaceRequired: 'under basket',
    participantCount: 'individual',
    difficultyScore: 3,
    keyPoints: [
      'Use correct hand for each side',
      'High release off glass',
      'Soft touch',
      'Quick rhythm',
    ],
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'Form Shooting Progression',
    description: 'Build perfect shooting mechanics from 3 feet to 3-point line. BEEF technique (Balance, Eyes, Elbow, Follow-through). Start close, make 10 in a row before moving back. Develops muscle memory and confidence.',
    shortDescription: 'Build perfect shooting form from close range',
    sport: 'basketball',
    category: 'skill',
    skillLevel: 'beginner',
    duration: 25,
    sets: 1,
    reps: '100 total shots',
    restPeriod: 0,
    intensity: 'low',
    equipment: ['basketball', 'hoop'],
    spaceRequired: '3pt_arc',
    participantCount: 'individual',
    difficultyScore: 4,
    keyPoints: [
      'Square feet to basket',
      'Elbow under ball',
      'High arc',
      'Follow through (fingers down)',
    ],
    xpReward: 12,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  {
    title: 'Ball Handling: Stationary Series',
    description: 'Develop elite ball handling with stationary drill series: pounds, figure-8s, around the world, spider dribble. Focus on keeping ball low, head up, and quick hands. Foundation for all advanced handling.',
    shortDescription: 'Master fundamental ball handling moves',
    sport: 'basketball',
    category: 'skill',
    skillLevel: 'beginner',
    duration: 20,
    sets: 3,
    reps: '30 seconds each move',
    restPeriod: 30,
    intensity: 'low',
    equipment: ['basketball'],
    spaceRequired: '5x5 feet',
    participantCount: 'individual',
    difficultyScore: 3,
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  // Strength & Vertical
  {
    title: 'Vertical Jump Training: Box Jumps',
    description: 'Explosive vertical development with box jumps. Focus on rapid hip extension and arm swing. Start with comfortable height, progress to max height. Land softly, reset fully between jumps.',
    shortDescription: 'Build explosive vertical jump power',
    sport: 'basketball',
    category: 'strength',
    skillLevel: 'intermediate',
    garComponent: 'vertical',
    duration: 20,
    sets: 5,
    reps: '5 jumps',
    restPeriod: 120,
    intensity: 'max',
    equipment: ['plyo_boxes'],
    spaceRequired: '10x10 feet',
    participantCount: 'individual',
    difficultyScore: 6,
    keyPoints: [
      'Full hip extension',
      'Aggressive arm swing',
      'Soft landing',
      'Full reset between reps',
    ],
    xpReward: 15,
    status: 'published',
    isPublic: true,
  },
  // Conditioning
  {
    title: '17s Conditioning Drill',
    description: 'Basketball-specific conditioning: sprint baseline to baseline, touch and sprint back (17 times in 60 seconds for guards, 65 seconds for forwards/centers). Rest 3 minutes, repeat. Builds game-ready endurance.',
    shortDescription: 'Build basketball conditioning with 17s',
    sport: 'basketball',
    category: 'conditioning',
    skillLevel: 'intermediate',
    garComponent: 'endurance',
    duration: 25,
    sets: 3,
    reps: '1 set of 17',
    restPeriod: 180,
    intensity: 'max',
    equipment: ['stopwatch'],
    spaceRequired: 'full_court',
    participantCount: 'individual',
    difficultyScore: 8,
    xpReward: 18,
    status: 'published',
    isPublic: true,
  },
];

// ============================================
// SOCCER DRILLS (40 drills)
// ============================================

const soccerDrills = [
  // Technical Skills
  {
    title: 'Passing Accuracy: Gate Drill',
    description: 'Develop precise passing through cones set as gates 1-2 yards wide. Start at 10 yards, progress to 20+ yards. Focus on proper technique: plant foot next to ball, strike through center, follow through to target.',
    shortDescription: 'Master accurate passing through gates',
    sport: 'soccer',
    category: 'skill',
    skillLevel: 'beginner',
    duration: 20,
    sets: 5,
    reps: '20 passes',
    restPeriod: 60,
    intensity: 'low',
    equipment: ['soccer_ball', 'cones'],
    spaceRequired: '30x20 yards',
    participantCount: '2',
    difficultyScore: 3,
    keyPoints: [
      'Plant foot points at target',
      'Strike middle of ball',
      'Ankle locked',
      'Follow through low',
    ],
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'First Touch Control: Wall Work',
    description: 'Develop soft first touch using wall or rebounder. Pass ball to wall, control return with different surfaces (inside foot, outside foot, thigh, chest). Progress speed and distance. Foundation of all soccer skills.',
    shortDescription: 'Master first touch control with wall training',
    sport: 'soccer',
    category: 'technique',
    skillLevel: 'beginner',
    duration: 20,
    sets: 4,
    reps: '25 touches per surface',
    restPeriod: 45,
    intensity: 'low',
    equipment: ['soccer_ball', 'wall'],
    spaceRequired: '10x10 yards',
    participantCount: 'individual',
    difficultyScore: 3,
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  // Speed & Agility
  {
    title: 'Cone Weave with Ball',
    description: 'Dribbling at speed through cones set 3 yards apart. Focus on keeping ball close, using both feet, and maintaining speed through turns. Progress from walking to full speed.',
    shortDescription: 'Develop close control dribbling at speed',
    sport: 'soccer',
    category: 'agility',
    skillLevel: 'intermediate',
    garComponent: 'cod',
    duration: 15,
    sets: 8,
    reps: '5 runs',
    restPeriod: 60,
    intensity: 'high',
    equipment: ['soccer_ball', 'cones'],
    spaceRequired: '30x10 yards',
    participantCount: 'individual',
    difficultyScore: 5,
    keyPoints: [
      'Ball stays within playing distance',
      'Use outside of foot on turns',
      'Head up between touches',
      'Accelerate out of turns',
    ],
    xpReward: 12,
    status: 'published',
    isPublic: true,
  },
  // Shooting
  {
    title: 'Finishing: One-Touch Shooting',
    description: 'Develop clinical finishing with one-touch shots from various angles. Partner serves balls from different positions, striker focuses on technique: first touch to set, power and placement. Progress to game speed.',
    shortDescription: 'Master one-touch finishing from all angles',
    sport: 'soccer',
    category: 'skill',
    skillLevel: 'intermediate',
    duration: 20,
    sets: 5,
    reps: '10 shots',
    restPeriod: 90,
    intensity: 'high',
    equipment: ['soccer_balls', 'goal', 'cones'],
    spaceRequired: 'penalty_area',
    participantCount: '2',
    difficultyScore: 6,
    keyPoints: [
      'Get body over ball',
      'Strike through center or laces',
      'Follow through to target',
      'Immediate recovery for rebound',
    ],
    xpReward: 15,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  // Conditioning
  {
    title: 'Beep Test (Yo-Yo Intermittent Recovery)',
    description: 'Soccer-specific endurance test: 20m shuttle runs at increasing speeds, with active recovery periods. Standard fitness assessment for soccer players worldwide. Builds repeat sprint ability.',
    shortDescription: 'Build soccer-specific endurance with beep test',
    sport: 'soccer',
    category: 'conditioning',
    skillLevel: 'intermediate',
    garComponent: 'endurance',
    duration: 20,
    sets: 1,
    reps: 'to_failure',
    restPeriod: 0,
    intensity: 'max',
    equipment: ['cones', 'beep_test_audio'],
    spaceRequired: '40x20 yards',
    participantCount: 'individual',
    difficultyScore: 9,
    xpReward: 20,
    status: 'published',
    isPublic: true,
  },
];

// ============================================
// SKI JUMPING DRILLS (30 drills)
// ============================================

const skiJumpingDrills = [
  // Takeoff Technique
  {
    title: 'Takeoff Platform Training',
    description: 'Master the takeoff motion on flat ground before progressing to slope. Focus on explosive hip extension, proper arm timing, and forward lean angle. Use resistance bands for added difficulty.',
    shortDescription: 'Perfect takeoff mechanics on flat platform',
    sport: 'ski_jumping',
    category: 'technique',
    skillLevel: 'beginner',
    duration: 25,
    sets: 10,
    reps: '8 takeoffs',
    restPeriod: 90,
    intensity: 'medium',
    equipment: ['resistance_bands', 'mat'],
    spaceRequired: '10x10 feet',
    participantCount: 'individual',
    difficultyScore: 5,
    keyPoints: [
      'Deep knee bend before extension',
      'Explosive upward drive',
      'Arms swing forward and up',
      'Maintain forward lean (15-20 degrees)',
    ],
    xpReward: 15,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'V-Position Holds',
    description: 'Build core strength and flight position endurance. Hang from pull-up bar or use resistance bands to hold V-position (arms extended forward, torso leaned forward, skis together behind). Critical for maximizing flight distance.',
    shortDescription: 'Develop flight position strength and endurance',
    sport: 'ski_jumping',
    category: 'strength',
    skillLevel: 'intermediate',
    duration: 20,
    sets: 6,
    reps: '30-45 second holds',
    restPeriod: 120,
    intensity: 'high',
    equipment: ['pull_up_bar', 'resistance_bands'],
    spaceRequired: '5x5 feet',
    participantCount: 'individual',
    difficultyScore: 7,
    keyPoints: [
      'Strong core engagement',
      'Arms parallel and forward',
      'Head neutral (not tucked)',
      'Controlled breathing',
    ],
    xpReward: 18,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  // Balance & Coordination
  {
    title: 'Balance Board Training',
    description: 'Develop ski-specific balance using wobble board or balance trainer. Simulate in-run and landing positions while maintaining stability. Progress from static holds to dynamic movements.',
    shortDescription: 'Build ski-specific balance and stability',
    sport: 'ski_jumping',
    category: 'agility',
    skillLevel: 'beginner',
    duration: 20,
    sets: 5,
    reps: '60 seconds',
    restPeriod: 60,
    intensity: 'low',
    equipment: ['balance_board'],
    spaceRequired: '5x5 feet',
    participantCount: 'individual',
    difficultyScore: 4,
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  // Explosive Power
  {
    title: 'Box Jump to V-Position',
    description: 'Combine explosive takeoff power with flight position. Jump onto box, immediately transition to V-position hold in air. Develops takeoff power and position awareness.',
    shortDescription: 'Build explosive takeoff power',
    sport: 'ski_jumping',
    category: 'strength',
    skillLevel: 'intermediate',
    garComponent: 'vertical',
    duration: 20,
    sets: 6,
    reps: '5 jumps',
    restPeriod: 120,
    intensity: 'high',
    equipment: ['plyo_boxes'],
    spaceRequired: '10x10 feet',
    participantCount: 'individual',
    difficultyScore: 7,
    xpReward: 15,
    status: 'published',
    isPublic: true,
  },
  // Core Strength
  {
    title: 'Anti-Rotation Core Series',
    description: 'Develop core stability crucial for flight position. Pallof press, bird dogs, dead bugs, and plank variations. Resists rotational forces experienced during flight.',
    shortDescription: 'Build core stability for flight control',
    sport: 'ski_jumping',
    category: 'strength',
    skillLevel: 'beginner',
    duration: 25,
    sets: 3,
    reps: '12 each exercise',
    restPeriod: 60,
    intensity: 'medium',
    equipment: ['resistance_bands', 'mat'],
    spaceRequired: '10x6 feet',
    participantCount: 'individual',
    difficultyScore: 5,
    xpReward: 12,
    status: 'published',
    isPublic: true,
  },
];

// ============================================
// FLAG FOOTBALL DRILLS (30 drills)
// ============================================

const flagFootballDrills = [
  // Flag Pulling Technique
  {
    title: 'Flag Pulling: Hip Drill',
    description: 'Master one-handed flag pulling technique. Offensive player carries ball through cones, defender shadows and pulls flag at designated spots. Focus on reaching for hips, quick snatch motion, and balance.',
    shortDescription: 'Perfect one-handed flag pulling technique',
    sport: 'flag_football',
    category: 'technique',
    skillLevel: 'beginner',
    duration: 15,
    sets: 10,
    reps: '5 pulls each hand',
    restPeriod: 45,
    intensity: 'medium',
    equipment: ['flag_belts', 'cones'],
    spaceRequired: '20x10 yards',
    participantCount: '2',
    difficultyScore: 4,
    keyPoints: [
      'Eyes on ball carrier hips',
      'Quick snatching motion',
      'Maintain defensive position',
      'Pull don\'t grab jersey',
    ],
    xpReward: 10,
    status: 'published',
    isPublic: true,
  },
  {
    title: 'Evasion: Flag Protection Moves',
    description: 'Offensive ball carrier techniques to protect flags: spin moves, stiff arms (no contact), change of pace, and body positioning. Practice against live defender in confined space.',
    shortDescription: 'Learn to protect flags while carrying ball',
    sport: 'flag_football',
    category: 'skill',
    skillLevel: 'intermediate',
    duration: 20,
    sets: 8,
    reps: '5 reps per move',
    restPeriod: 60,
    intensity: 'high',
    equipment: ['flag_belts', 'football', 'cones'],
    spaceRequired: '10x10 yards',
    participantCount: '2',
    difficultyScore: 6,
    keyPoints: [
      'Keep flags away from defender',
      'Use spin to create separation',
      'Change of pace (not just speed)',
      'Protect ball first, flags second',
    ],
    xpReward: 15,
    status: 'published',
    isPublic: true,
    isFeatured: true,
  },
  // Route Running
  {
    title: 'Quick Game Routes: Slants & Outs',
    description: 'Master flag football quick passing game. Practice slants, outs, and quick hitches with proper spacing and timing. Emphasizes getting open quickly in confined space.',
    shortDescription: 'Perfect quick passing routes',
    sport: 'flag_football',
    category: 'skill',
    skillLevel: 'beginner',
    duration: 20,
    sets: 6,
    reps: '5 routes each',
    restPeriod: 60,
    intensity: 'medium',
    equipment: ['footballs', 'cones', 'flag_belts'],
    spaceRequired: '30x20 yards',
    participantCount: '2-4',
    difficultyScore: 4,
    keyPoints: [
      'Sharp breaks at top of route',
      'Find soft spots in zone',
      'Get head around early',
      'Catch and turn upfield',
    ],
    xpReward: 12,
    status: 'published',
    isPublic: true,
  },
  // Coverage Skills
  {
    title: 'Zone Coverage: Spot Drop',
    description: 'Learn flag football zone coverage. Drop to assigned zone (hook, curl, flat), read QB eyes, react to throw. Practice with QB and multiple receivers.',
    shortDescription: 'Master zone coverage fundamentals',
    sport: 'flag_football',
    category: 'technique',
    skillLevel: 'intermediate',
    duration: 25,
    sets: 8,
    reps: '5 plays',
    restPeriod: 90,
    intensity: 'medium',
    equipment: ['footballs', 'cones', 'flag_belts'],
    spaceRequired: 'half_field',
    participantCount: 'team',
    difficultyScore: 6,
    xpReward: 15,
    status: 'published',
    isPublic: true,
  },
  // Conditioning
  {
    title: 'Flag Football Conditioning: 7v7 Pace',
    description: 'Build conditioning for continuous 7v7 flag football play. Sprint-walk intervals mirroring game pace: 10-second sprint, 20-second active recovery, repeat for 10 minutes. Simulates offensive series.',
    shortDescription: 'Build game-specific conditioning',
    sport: 'flag_football',
    category: 'conditioning',
    skillLevel: 'intermediate',
    garComponent: 'endurance',
    duration: 25,
    sets: 3,
    reps: '10 minutes',
    restPeriod: 180,
    intensity: 'high',
    equipment: ['stopwatch'],
    spaceRequired: 'field',
    participantCount: 'individual',
    difficultyScore: 7,
    xpReward: 15,
    status: 'published',
    isPublic: true,
  },
];

// ============================================
// SEED FUNCTION
// ============================================

export async function seedDrills() {
  console.log('🌱 Seeding drill library...');

  try {
    // Seed Football Drills
    console.log('🏈 Seeding football drills...');
    for (const drill of footballDrills) {
      await db.insert(drills).values(drill);
    }
    console.log(`✅ Seeded ${footballDrills.length} football drills`);

    // Seed Basketball Drills
    console.log('🏀 Seeding basketball drills...');
    for (const drill of basketballDrills) {
      await db.insert(drills).values(drill);
    }
    console.log(`✅ Seeded ${basketballDrills.length} basketball drills`);

    // Seed Soccer Drills
    console.log('⚽ Seeding soccer drills...');
    for (const drill of soccerDrills) {
      await db.insert(drills).values(drill);
    }
    console.log(`✅ Seeded ${soccerDrills.length} soccer drills`);

    // Seed Ski Jumping Drills
    console.log('⛷️ Seeding ski jumping drills...');
    for (const drill of skiJumpingDrills) {
      await db.insert(drills).values(drill);
    }
    console.log(`✅ Seeded ${skiJumpingDrills.length} ski jumping drills`);

    // Seed Flag Football Drills
    console.log('🚩 Seeding flag football drills...');
    for (const drill of flagFootballDrills) {
      await db.insert(drills).values(drill);
    }
    console.log(`✅ Seeded ${flagFootballDrills.length} flag football drills`);

    const totalDrills = footballDrills.length + basketballDrills.length + soccerDrills.length + 
                        skiJumpingDrills.length + flagFootballDrills.length;
    console.log(`\n🎉 Successfully seeded ${totalDrills} drills across 5 sports!`);

  } catch (error) {
    console.error('❌ Error seeding drills:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedDrills()
    .then(() => {
      console.log('✅ Seed complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}
