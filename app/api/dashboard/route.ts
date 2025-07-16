import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mock dashboard data
    const dashboardData = {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        sport: user.sport || 'Multi-Sport',
        position: user.position || 'Athlete',
        garScore: 85,
        xpPoints: 2450,
        level: 12,
        achievements: 8
      },
      recentActivities: [
        {
          id: 1,
          type: 'video_analysis',
          title: 'GAR Analysis Complete',
          timestamp: new Date().toISOString(),
          score: 87
        },
        {
          id: 2,
          type: 'achievement',
          title: 'New Level Reached',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          level: 12
        }
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Training Session',
          date: new Date(Date.now() + 86400000).toISOString(),
          type: 'training'
        }
      ]
    }
    
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}