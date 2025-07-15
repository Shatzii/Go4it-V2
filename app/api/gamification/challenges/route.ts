import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock challenges data - in production, this would come from database
    const challenges = [
      {
        id: '1',
        title: 'Morning Warrior',
        description: 'Complete 5 morning training sessions this week',
        type: 'weekly',
        sport: 'All Sports',
        difficulty: 'easy',
        points: 500,
        xp: 200,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 3,
        maxProgress: 5,
        isActive: true,
        isCompleted: false,
        participants: 47
      },
      {
        id: '2',
        title: 'Perfect Form',
        description: 'Achieve GAR score above 90 in video analysis',
        type: 'daily',
        sport: 'Football',
        difficulty: 'hard',
        points: 1000,
        xp: 500,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        progress: 0,
        maxProgress: 1,
        isActive: false,
        isCompleted: false,
        participants: 23
      },
      {
        id: '3',
        title: 'Academic Excellence',
        description: 'Complete all assignments with 90% or higher grade',
        type: 'weekly',
        sport: 'All Sports',
        difficulty: 'medium',
        points: 750,
        xp: 300,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        progress: 2,
        maxProgress: 3,
        isActive: true,
        isCompleted: false,
        participants: 34
      },
      {
        id: '4',
        title: 'Team Builder',
        description: 'Send 10 encouraging messages to teammates',
        type: 'weekly',
        sport: 'All Sports',
        difficulty: 'easy',
        points: 300,
        xp: 150,
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        progress: 7,
        maxProgress: 10,
        isActive: true,
        isCompleted: false,
        participants: 89
      },
      {
        id: '5',
        title: 'Iron Will',
        description: 'Maintain 30-day training streak',
        type: 'monthly',
        sport: 'All Sports',
        difficulty: 'expert',
        points: 2000,
        xp: 1000,
        deadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        progress: 7,
        maxProgress: 30,
        isActive: true,
        isCompleted: false,
        participants: 12
      },
      {
        id: '6',
        title: 'Speed Demon',
        description: 'Improve 40-yard dash time by 0.2 seconds',
        type: 'monthly',
        sport: 'Football',
        difficulty: 'hard',
        points: 1500,
        xp: 750,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        progress: 0,
        maxProgress: 1,
        isActive: false,
        isCompleted: false,
        participants: 56
      }
    ]

    return NextResponse.json({ challenges })
  } catch (error) {
    console.error('Failed to fetch challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}