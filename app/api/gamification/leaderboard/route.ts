import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock leaderboard data - in production, this would come from database
    const leaderboard = [
      {
        rank: 1,
        userId: '1',
        username: 'Alex Rodriguez',
        sport: 'Football',
        level: 23,
        xp: 34500,
        garScore: 94.2,
        achievements: 47,
        streak: 21
      },
      {
        rank: 2,
        userId: '2',
        username: 'Jordan Smith',
        sport: 'Basketball',
        level: 21,
        xp: 32100,
        garScore: 92.8,
        achievements: 43,
        streak: 15
      },
      {
        rank: 3,
        userId: '3',
        username: 'Taylor Johnson',
        sport: 'Soccer',
        level: 20,
        xp: 29800,
        garScore: 91.5,
        achievements: 39,
        streak: 18
      },
      {
        rank: 4,
        userId: '4',
        username: 'Morgan Davis',
        sport: 'Track & Field',
        level: 19,
        xp: 28400,
        garScore: 90.9,
        achievements: 41,
        streak: 12
      },
      {
        rank: 5,
        userId: '5',
        username: 'Casey Williams',
        sport: 'Baseball',
        level: 18,
        xp: 26900,
        garScore: 89.7,
        achievements: 37,
        streak: 9
      },
      {
        rank: 6,
        userId: '6',
        username: 'Riley Brown',
        sport: 'Football',
        level: 17,
        xp: 25200,
        garScore: 88.9,
        achievements: 35,
        streak: 14
      },
      {
        rank: 7,
        userId: '7',
        username: 'Avery Martinez',
        sport: 'Basketball',
        level: 16,
        xp: 23800,
        garScore: 87.6,
        achievements: 33,
        streak: 11
      },
      {
        rank: 8,
        userId: '8',
        username: 'Cameron Garcia',
        sport: 'Soccer',
        level: 15,
        xp: 22100,
        garScore: 86.8,
        achievements: 31,
        streak: 8
      },
      {
        rank: 9,
        userId: '9',
        username: 'Dakota Lopez',
        sport: 'Track & Field',
        level: 15,
        xp: 21700,
        garScore: 85.9,
        achievements: 29,
        streak: 13
      },
      {
        rank: 10,
        userId: '10',
        username: 'Sage Wilson',
        sport: 'Football',
        level: 14,
        xp: 20400,
        garScore: 84.7,
        achievements: 27,
        streak: 6
      }
    ]

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}