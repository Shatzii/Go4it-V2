import { db } from '../lib/db'
import { users, videoAnalysis, starPathProgress } from '../shared/schema'
import { eq, like } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const demoUsers = [
  // Athletes
  {
    username: 'cooper_flagg',
    email: 'cooper.flagg@demo.com',
    password: 'demo123',
    role: 'athlete',
    firstName: 'Cooper',
    lastName: 'Flagg',
    dateOfBirth: new Date('2006-12-21'),
    sport: 'Basketball',
    position: 'Forward',
    graduationYear: 2026,
    gpa: '3.85',
    subscriptionPlan: 'elite',
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
  
  // Coaches
  {
    username: 'coach_williams',
    email: 'mike.williams@demo.com',
    password: 'demo123',
    role: 'coach',
    firstName: 'Mike',
    lastName: 'Williams',
    dateOfBirth: new Date('1978-05-14'),
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
  
  // Parents
  {
    username: 'parent_flagg',
    email: 'richard.flagg@demo.com',
    password: 'demo123',
    role: 'parent',
    firstName: 'Richard',
    lastName: 'Flagg',
    dateOfBirth: new Date('1975-02-18'),
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
  
  // Admin
  {
    username: 'admin_demo',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Demo',
    dateOfBirth: new Date('1985-06-10'),
    subscriptionPlan: 'elite',
    subscriptionStatus: 'active'
  }
]

const demoVideoAnalysis = [
  {
    fileName: 'cooper_flagg_highlight_2024.mp4',
    filePath: '/uploads/cooper_flagg_highlight_2024.mp4',
    sport: 'Basketball',
    garScore: '94.7',
    analysisData: {
      technical: { score: 95, areas: ['Shot Form', 'Ball Handling', 'Footwork'] },
      physical: { score: 93, areas: ['Athleticism', 'Speed', 'Strength'] },
      tactical: { score: 96, areas: ['Court Vision', 'Decision Making', 'Defense'] },
      mental: { score: 94, areas: ['Focus', 'Confidence', 'Composure'] },
      overall: { score: 94.7, grade: 'A+' }
    },
    feedback: 'Exceptional all-around player with elite court vision and defensive instincts. Ready for top-tier college basketball.'
  },
  {
    fileName: 'sarah_martinez_skills_2024.mp4',
    filePath: '/uploads/sarah_martinez_skills_2024.mp4',
    sport: 'Soccer',
    garScore: '89.3',
    analysisData: {
      technical: { score: 91, areas: ['First Touch', 'Passing', 'Dribbling'] },
      physical: { score: 87, areas: ['Endurance', 'Agility', 'Speed'] },
      tactical: { score: 90, areas: ['Positioning', 'Field Awareness', 'Pressing'] },
      mental: { score: 89, areas: ['Decision Making', 'Leadership', 'Resilience'] },
      overall: { score: 89.3, grade: 'A' }
    },
    feedback: 'Outstanding midfielder with exceptional technical skills and tactical awareness. Strong college prospect.'
  },
  {
    fileName: 'marcus_johnson_qb_2024.mp4',
    filePath: '/uploads/marcus_johnson_qb_2024.mp4',
    sport: 'Football',
    garScore: '91.8',
    analysisData: {
      technical: { score: 92, areas: ['Throwing Accuracy', 'Release Time', 'Mechanics'] },
      physical: { score: 90, areas: ['Arm Strength', 'Mobility', 'Size'] },
      tactical: { score: 93, areas: ['Pre-Snap Reads', 'Progression', 'Leadership'] },
      mental: { score: 92, areas: ['Pressure Handling', 'Quick Decisions', 'Focus'] },
      overall: { score: 91.8, grade: 'A+' }
    },
    feedback: 'Elite quarterback prospect with excellent arm talent and leadership qualities. Division I ready.'
  }
]

const demoStarPathProgress = [
  // Cooper Flagg's progress
  {
    skillId: 'basketball_shooting',
    skillName: 'Three-Point Shooting',
    currentLevel: 8,
    totalXP: 2400,
    xpToNext: 200,
    completedDrills: 45,
    achievements: ['Sharpshooter', 'Range Finder', 'Clutch Shooter']
  },
  {
    skillId: 'basketball_defense',
    skillName: 'Defensive Positioning',
    currentLevel: 9,
    totalXP: 2850,
    xpToNext: 150,
    completedDrills: 52,
    achievements: ['Lockdown Defender', 'Steal Master', 'Shot Blocker']
  },
  
  // Sarah Martinez's progress
  {
    skillId: 'soccer_passing',
    skillName: 'Through Ball Accuracy',
    currentLevel: 7,
    totalXP: 1950,
    xpToNext: 300,
    completedDrills: 38,
    achievements: ['Playmaker', 'Vision Master']
  },
  {
    skillId: 'soccer_dribbling',
    skillName: 'Close Control',
    currentLevel: 8,
    totalXP: 2200,
    xpToNext: 250,
    completedDrills: 42,
    achievements: ['Skill Master', 'Ball Control Expert']
  }
]

export async function populateDemoUsers() {
  console.log('Starting demo user population...')
  
  try {
    // Clear existing demo users
    await db.delete(users).where(like(users.email, '%@demo.com'))
    
    // Create demo users
    const createdUsers = []
    for (const userData of demoUsers) {
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
    for (const analysis of demoVideoAnalysis) {
      const athlete = createdUsers.find(u => 
        (u.username === 'cooper_flagg' && analysis.fileName.includes('cooper')) ||
        (u.username === 'sarah_martinez' && analysis.fileName.includes('sarah')) ||
        (u.username === 'marcus_johnson' && analysis.fileName.includes('marcus'))
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
    for (let i = 0; i < demoStarPathProgress.length; i++) {
      const progress = demoStarPathProgress[i]
      const athlete = athleteUsers[Math.floor(i / 2)] // Distribute progress among athletes
      
      if (athlete) {
        await db.insert(starPathProgress).values({
          userId: athlete.id,
          ...progress
        })
        console.log(`Added StarPath progress for ${athlete.username}`)
      }
    }
    
    console.log('Demo user population completed successfully!')
    return {
      success: true,
      message: `Created ${createdUsers.length} demo users with realistic data`,
      users: createdUsers.map(u => ({ id: u.id, username: u.username, role: u.role }))
    }
    
  } catch (error) {
    console.error('Error populating demo users:', error)
    return {
      success: false,
      message: `Failed to populate demo users: ${error.message}`
    }
  }
}

// Make it runnable as a script
if (require.main === module) {
  populateDemoUsers().then(result => {
    console.log(JSON.stringify(result, null, 2))
    process.exit(result.success ? 0 : 1)
  })
}