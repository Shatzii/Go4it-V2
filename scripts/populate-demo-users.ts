import { db } from '../lib/db'
import { users, videoAnalysis, starPathProgress } from '../shared/schema'
import { eq, like } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const realUsers = [
  // Test Athletes - Real functional accounts
  {
    username: 'athlete_test',
    email: 'athlete@test.com',
    password: 'athlete123',
    role: 'athlete',
    firstName: 'Alex',
    lastName: 'Thompson',
    dateOfBirth: new Date('2007-03-15'),
    sport: 'Basketball',
    position: 'Point Guard',
    graduationYear: 2026,
    gpa: '3.75',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  {
    username: 'soccer_player',
    email: 'soccer@test.com',
    password: 'soccer123',
    role: 'athlete',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    dateOfBirth: new Date('2006-08-22'),
    sport: 'Soccer',
    position: 'Midfielder',
    graduationYear: 2025,
    gpa: '3.92',
    subscriptionPlan: 'elite',
    subscriptionStatus: 'active'
  },
  {
    username: 'football_qb',
    email: 'football@test.com',
    password: 'football123',
    role: 'athlete',
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: new Date('2006-11-05'),
    sport: 'Football',
    position: 'Quarterback',
    graduationYear: 2025,
    gpa: '3.68',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  {
    username: 'dylan_harper',
    email: 'dylan.harper@demo.com',
    password: 'demo123',
    role: 'athlete',
    firstName: 'Dylan',
    lastName: 'Harper',
    dateOfBirth: new Date('2006-07-31'),
    sport: 'Basketball',
    position: 'Guard',
    graduationYear: 2026,
    gpa: '3.92',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  {
    username: 'ace_bailey',
    email: 'ace.bailey@demo.com',
    password: 'demo123',
    role: 'athlete',
    firstName: 'Ace',
    lastName: 'Bailey',
    dateOfBirth: new Date('2006-10-12'),
    sport: 'Basketball',
    position: 'Forward',
    graduationYear: 2026,
    gpa: '3.78',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  {
    username: 'sarah_martinez',
    email: 'sarah.martinez@demo.com',
    password: 'demo123',
    role: 'athlete',
    firstName: 'Sarah',
    lastName: 'Martinez',
    dateOfBirth: new Date('2007-03-15'),
    sport: 'Soccer',
    position: 'Midfielder',
    graduationYear: 2027,
    gpa: '4.12',
    subscriptionPlan: 'starter',
    subscriptionStatus: 'active'
  },
  {
    username: 'marcus_johnson',
    email: 'marcus.johnson@demo.com',
    password: 'demo123',
    role: 'athlete',
    firstName: 'Marcus',
    lastName: 'Johnson',
    dateOfBirth: new Date('2006-09-08'),
    sport: 'Football',
    position: 'Quarterback',
    graduationYear: 2026,
    gpa: '3.67',
    subscriptionPlan: 'elite',
    subscriptionStatus: 'active'
  },
  {
    username: 'emily_chen',
    email: 'emily.chen@demo.com',
    password: 'demo123',
    role: 'athlete',
    firstName: 'Emily',
    lastName: 'Chen',
    dateOfBirth: new Date('2007-11-22'),
    sport: 'Tennis',
    position: 'Singles',
    graduationYear: 2027,
    gpa: '4.25',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  
  // Test Coach - Real functional account
  {
    username: 'coach_test',
    email: 'coach@test.com',
    password: 'coach123',
    role: 'coach',
    firstName: 'Sarah',
    lastName: 'Williams',
    dateOfBirth: new Date('1985-06-12'),
    sport: 'Basketball',
    position: 'Head Coach',
    subscriptionPlan: 'elite',
    subscriptionStatus: 'active'
  },
  {
    username: 'coach_rodriguez',
    email: 'maria.rodriguez@demo.com',
    password: 'demo123',
    role: 'coach',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    dateOfBirth: new Date('1982-08-30'),
    sport: 'Soccer',
    position: 'Head Coach',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  
  // Test Parent - Real functional account
  {
    username: 'parent_test',
    email: 'parent@test.com',
    password: 'parent123',
    role: 'parent',
    firstName: 'David',
    lastName: 'Thompson',
    dateOfBirth: new Date('1978-04-20'),
    subscriptionPlan: 'starter',
    subscriptionStatus: 'active'
  },
  {
    username: 'parent_martinez',
    email: 'carlos.martinez@demo.com',
    password: 'demo123',
    role: 'parent',
    firstName: 'Carlos',
    lastName: 'Martinez',
    dateOfBirth: new Date('1973-12-05'),
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  
  // Test Admin - Real functional account
  {
    username: 'admin_test',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    dateOfBirth: new Date('1980-01-15'),
    subscriptionPlan: 'elite',
    subscriptionStatus: 'active'
  },
  
  // Additional User Types
  {
    username: 'recruiter_test',
    email: 'recruiter@test.com',
    password: 'recruiter123',
    role: 'recruiter',
    firstName: 'Jennifer',
    lastName: 'Davis',
    dateOfBirth: new Date('1982-09-30'),
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  
  // Free tier athlete for testing subscription flows
  {
    username: 'free_athlete',
    email: 'free@test.com',
    password: 'free123',
    role: 'athlete',
    firstName: 'Jake',
    lastName: 'Wilson',
    dateOfBirth: new Date('2007-12-10'),
    sport: 'Track',
    position: 'Sprinter',
    graduationYear: 2026,
    gpa: '3.45',
    subscriptionPlan: 'free',
    subscriptionStatus: 'active'
  }
]

const realVideoAnalysis = [
  {
    fileName: 'athlete_basketball_analysis.mp4',
    filePath: '/uploads/athlete_basketball_analysis.mp4',
    sport: 'Basketball',
    garScore: '87.5',
    analysisData: {
      technical: { score: 95, areas: ['Shot Form', 'Ball Handling', 'Footwork'] },
      physical: { score: 93, areas: ['Athleticism', 'Speed', 'Strength'] },
      tactical: { score: 96, areas: ['Court Vision', 'Decision Making', 'Defense'] },
      mental: { score: 94, areas: ['Focus', 'Confidence', 'Composure'] },
      overall: { score: 94.7, grade: 'A+' }
    },
    feedback: 'Strong basketball fundamentals with good court awareness. Recommended focus areas: shooting consistency and defensive positioning.'
  },
  {
    fileName: 'soccer_skills_analysis.mp4',
    filePath: '/uploads/soccer_skills_analysis.mp4',
    sport: 'Soccer',
    garScore: '91.2',
    analysisData: {
      technical: { score: 91, areas: ['First Touch', 'Passing', 'Dribbling'] },
      physical: { score: 87, areas: ['Endurance', 'Agility', 'Speed'] },
      tactical: { score: 90, areas: ['Positioning', 'Field Awareness', 'Pressing'] },
      mental: { score: 89, areas: ['Decision Making', 'Leadership', 'Resilience'] },
      overall: { score: 89.3, grade: 'A' }
    },
    feedback: 'Excellent midfielder with strong technical skills and field vision. Great potential for collegiate soccer.'
  },
  {
    fileName: 'football_qb_analysis.mp4',
    filePath: '/uploads/football_qb_analysis.mp4',
    sport: 'Football',
    garScore: '85.9',
    analysisData: {
      technical: { score: 92, areas: ['Throwing Accuracy', 'Release Time', 'Mechanics'] },
      physical: { score: 90, areas: ['Arm Strength', 'Mobility', 'Size'] },
      tactical: { score: 93, areas: ['Pre-Snap Reads', 'Progression', 'Leadership'] },
      mental: { score: 92, areas: ['Pressure Handling', 'Quick Decisions', 'Focus'] },
      overall: { score: 91.8, grade: 'A+' }
    },
    feedback: 'Good quarterback mechanics with solid decision-making skills. Focus on pocket awareness and reading defenses.'
  }
]

const realStarPathProgress = [
  // Basketball athlete's progress
  {
    skillId: 'basketball_shooting',
    skillName: 'Three-Point Shooting',
    currentLevel: 6,
    totalXP: 1800,
    xpToNext: 350,
    completedDrills: 28,
    achievements: ['Consistent Shooter', 'Range Finder']
  },
  {
    skillId: 'basketball_defense',
    skillName: 'Defensive Positioning',
    currentLevel: 5,
    totalXP: 1250,
    xpToNext: 400,
    completedDrills: 22,
    achievements: ['Defender', 'Court Awareness']
  },
  
  // Soccer athlete's progress
  {
    skillId: 'soccer_passing',
    skillName: 'Through Ball Accuracy',
    currentLevel: 7,
    totalXP: 1950,
    xpToNext: 300,
    completedDrills: 35,
    achievements: ['Playmaker', 'Vision Master']
  },
  {
    skillId: 'soccer_dribbling',
    skillName: 'Close Control',
    currentLevel: 6,
    totalXP: 1650,
    xpToNext: 450,
    completedDrills: 31,
    achievements: ['Ball Control', 'Footwork']
  },
  
  // Football athlete's progress
  {
    skillId: 'football_passing',
    skillName: 'Pocket Awareness',
    currentLevel: 4,
    totalXP: 980,
    xpToNext: 520,
    completedDrills: 18,
    achievements: ['Quick Release']
  }
]

export async function populateRealUsers() {
  console.log('Creating real functional user accounts...')
  
  try {
    // Clear existing test users
    await db.delete(users).where(like(users.email, '%@test.com'))
    
    // Create real user accounts
    const createdUsers = []
    for (const userData of realUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      const [user] = await db.insert(users).values({
        ...userData,
        password: hashedPassword,
        gpa: userData.gpa ? userData.gpa : null
      }).returning()
      
      createdUsers.push(user)
      console.log(`Created user: ${user.username}`)
    }
    
    // Add video analysis for athletes
    let userIndex = 0
    for (const analysis of realVideoAnalysis) {
      const athlete = createdUsers.find(u => 
        (u.username === 'athlete_test' && analysis.fileName.includes('basketball')) ||
        (u.username === 'soccer_player' && analysis.fileName.includes('soccer')) ||
        (u.username === 'football_qb' && analysis.fileName.includes('football'))
      )
      
      if (athlete) {
        await db.insert(videoAnalysis).values({
          userId: athlete.id,
          ...analysis
        })
        console.log(`Added video analysis for ${athlete.username}`)
      }
    }
    
    // Add StarPath progress for athletes
    const athleteUsers = createdUsers.filter(u => u.role === 'athlete')
    for (let i = 0; i < realStarPathProgress.length; i++) {
      const progress = realStarPathProgress[i]
      const athlete = athleteUsers[Math.floor(i / 2)] // Distribute progress among athletes
      
      if (athlete) {
        await db.insert(starPathProgress).values({
          userId: athlete.id,
          ...progress
        })
        console.log(`Added StarPath progress for ${athlete.username}`)
      }
    }
    
    console.log('Real user account creation completed successfully!')
    return {
      success: true,
      message: `Created ${createdUsers.length} real functional user accounts`,
      users: createdUsers.map(u => ({ id: u.id, username: u.username, role: u.role, email: u.email }))
    }
    
  } catch (error) {
    console.error('Error creating real users:', error)
    return {
      success: false,
      message: `Failed to create real users: ${error.message}`
    }
  }
}

// Make it runnable as a script
if (require.main === module) {
  populateRealUsers().then(result => {
    console.log(JSON.stringify(result, null, 2))
    process.exit(result.success ? 0 : 1)
  })
}