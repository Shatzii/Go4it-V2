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
    const generatePerformanceData = (months: number) => {
      const data = []
      const now = new Date()
      
      for (let i = months * 30; i >= 0; i -= 3) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        data.push({
          date: date.toISOString().split('T')[0],
          garScore: Math.random() * 20 + 75 + Math.sin(i / 10) * 5,
          speed: Math.random() * 15 + 80 + Math.cos(i / 8) * 3,
          agility: Math.random() * 12 + 82 + Math.sin(i / 6) * 4,
          strength: Math.random() * 18 + 77 + Math.cos(i / 12) * 6,
          endurance: Math.random() * 16 + 79 + Math.sin(i / 15) * 5,
          technique: Math.random() * 14 + 83 + Math.cos(i / 9) * 4
        })
      }
      return data
    }

    const rangeMap = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12
    }

    const performance = generatePerformanceData(rangeMap[range as keyof typeof rangeMap] || 3)
    
    const comparison = [
      { athlete: 'You', garScore: 87.3, position: 'QB', sport: 'Football' },
      { athlete: 'Marcus J.', garScore: 89.1, position: 'QB', sport: 'Football' },
      { athlete: 'Tyler R.', garScore: 85.7, position: 'QB', sport: 'Football' },
      { athlete: 'Jordan M.', garScore: 91.2, position: 'QB', sport: 'Football' },
      { athlete: 'Alex P.', garScore: 84.9, position: 'QB', sport: 'Football' },
      { athlete: 'Sam W.', garScore: 88.5, position: 'QB', sport: 'Football' }
    ]

    return NextResponse.json({ performance, comparison })
  } catch (error) {
    console.error('Failed to fetch performance metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch performance metrics' }, { status: 500 })
  }
}