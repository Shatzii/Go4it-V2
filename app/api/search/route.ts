import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { query, filters } = await request.json()

    // Mock search results - in production, this would search database
    const allResults = [
      {
        id: '1',
        type: 'video',
        title: 'Football Training Session - Week 5',
        description: 'Quarterback practice session with focus on passing accuracy',
        url: '/video-analysis/1',
        metadata: {
          sport: 'Football',
          garScore: 87.3,
          createdAt: '2024-07-15T14:30:00Z'
        }
      },
      {
        id: '2',
        type: 'athlete',
        title: 'John Smith - Quarterback',
        description: 'Senior quarterback with 3.8 GPA and 87.3 GAR score',
        url: '/athletes/john-smith',
        metadata: {
          sport: 'Football',
          garScore: 87.3,
          graduationYear: 2024
        }
      },
      {
        id: '3',
        type: 'team',
        title: 'Varsity Football Team',
        description: 'Championship-winning team with 12-1 record',
        url: '/teams/varsity-football',
        metadata: {
          sport: 'Football',
          level: 'Varsity'
        }
      },
      {
        id: '4',
        type: 'achievement',
        title: 'State Championship Winner',
        description: 'Won state championship game with 21-14 victory',
        url: '/achievements/state-championship',
        metadata: {
          sport: 'Football',
          createdAt: '2024-06-15T20:00:00Z'
        }
      },
      {
        id: '5',
        type: 'course',
        title: 'Advanced Physics',
        description: 'Honors physics course with emphasis on mechanics',
        url: '/academy/courses/advanced-physics',
        metadata: {
          level: 'Advanced'
        }
      },
      {
        id: '6',
        type: 'video',
        title: 'Basketball Skills Training',
        description: 'Shooting drills and defensive techniques',
        url: '/video-analysis/6',
        metadata: {
          sport: 'Basketball',
          garScore: 82.1,
          createdAt: '2024-07-10T11:15:00Z'
        }
      }
    ]

    // Filter results based on query and filters
    let results = allResults.filter(result => {
      const matchesQuery = query ? (
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      ) : true

      const matchesType = filters.type === 'all' || result.type === filters.type
      const matchesSport = filters.sport === 'all' || result.metadata.sport?.toLowerCase() === filters.sport.toLowerCase()
      
      return matchesQuery && matchesType && matchesSport
    })

    // Apply additional filters
    if (filters.garScore !== 'all') {
      const [min, max] = filters.garScore.split('-').map(Number)
      results = results.filter(result => {
        const score = result.metadata.garScore
        return score && score >= min && score <= max
      })
    }

    if (filters.graduationYear !== 'all') {
      results = results.filter(result => 
        result.metadata.graduationYear?.toString() === filters.graduationYear
      )
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}