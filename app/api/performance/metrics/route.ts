import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '3months'

    // Mock performance data - in production, this would come from database
    const performance = [
      {
        date: '2024-07-01',
        garScore: 82.5,
        speed: 85.2,
        agility: 78.9,
        strength: 88.1,
        endurance: 76.3,
        technique: 89.4
      },
      {
        date: '2024-07-08',
        garScore: 84.1,
        speed: 86.7,
        agility: 80.2,
        strength: 87.9,
        endurance: 78.1,
        technique: 90.2
      },
      {
        date: '2024-07-15',
        garScore: 87.3,
        speed: 88.9,
        agility: 82.4,
        strength: 89.6,
        endurance: 81.2,
        technique: 91.8
      }
    ]

    const comparison = [
      {
        athlete: 'You',
        garScore: 87.3,
        position: 'Quarterback',
        sport: 'Football'
      },
      {
        athlete: 'Mike Johnson',
        garScore: 89.1,
        position: 'Quarterback',
        sport: 'Football'
      },
      {
        athlete: 'Sarah Davis',
        garScore: 85.7,
        position: 'Quarterback',
        sport: 'Football'
      },
      {
        athlete: 'Tom Wilson',
        garScore: 84.2,
        position: 'Quarterback',
        sport: 'Football'
      }
    ]

    return NextResponse.json({ performance, comparison })
  } catch (error) {
    console.error('Failed to fetch performance metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch performance metrics' }, { status: 500 })
  }
}