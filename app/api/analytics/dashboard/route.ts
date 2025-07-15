import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mock analytics dashboard data
    const dashboardData = {
      userId: user.id,
      summary: {
        totalVideos: 24,
        totalAnalyses: 18,
        avgGarScore: 85,
        improvement: 15,
        hoursAnalyzed: 12.5,
        streakDays: 7
      },
      charts: {
        performanceOverTime: [
          { date: '2024-07-01', score: 75 },
          { date: '2024-07-02', score: 78 },
          { date: '2024-07-03', score: 80 },
          { date: '2024-07-04', score: 83 },
          { date: '2024-07-05', score: 85 },
          { date: '2024-07-06', score: 87 },
          { date: '2024-07-07', score: 85 }
        ],
        skillBreakdown: [
          { skill: 'Shooting', score: 88 },
          { skill: 'Passing', score: 82 },
          { skill: 'Dribbling', score: 90 },
          { skill: 'Defense', score: 78 },
          { skill: 'Positioning', score: 85 }
        ]
      },
      recentActivity: [
        {
          type: 'analysis',
          description: 'Completed game footage analysis',
          timestamp: new Date().toISOString(),
          score: 87
        },
        {
          type: 'achievement',
          description: 'Reached Elite ranking',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          score: null
        }
      ]
    }
    
    return NextResponse.json({ dashboard: dashboardData })
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}