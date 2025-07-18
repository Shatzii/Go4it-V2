import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query, filters } = await request.json()
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Mock search results - in a real app, this would search the database
    const mockResults = [
      {
        id: '1',
        type: 'video',
        title: 'Basketball Training Highlights',
        description: 'High-intensity basketball training session with advanced drills',
        url: '/video-analysis/1',
        metadata: {
          sport: 'Basketball',
          garScore: 92,
          createdAt: new Date().toISOString(),
          graduationYear: 2025,
          level: 'Elite'
        }
      },
      {
        id: '2',
        type: 'athlete',
        title: 'John Smith - Point Guard',
        description: 'Elite basketball player with exceptional court vision',
        url: '/athlete/john-smith',
        metadata: {
          sport: 'Basketball',
          garScore: 88,
          graduationYear: 2024,
          level: 'Elite'
        }
      },
      {
        id: '3',
        type: 'course',
        title: 'Advanced Basketball Fundamentals',
        description: 'Complete training program for advanced basketball skills',
        url: '/academy/course/basketball-fundamentals',
        metadata: {
          sport: 'Basketball',
          level: 'Advanced',
          createdAt: new Date().toISOString()
        }
      },
      {
        id: '4',
        type: 'achievement',
        title: 'Elite Shooter Badge',
        description: 'Achieved 90%+ accuracy in shooting drills',
        url: '/achievements/elite-shooter',
        metadata: {
          sport: 'Basketball',
          garScore: 95,
          createdAt: new Date().toISOString()
        }
      }
    ]

    // Filter results based on query
    const filteredResults = mockResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                          result.description.toLowerCase().includes(query.toLowerCase())
      
      if (!matchesQuery) return false
      
      // Apply filters
      if (filters.type !== 'all' && result.type !== filters.type) return false
      if (filters.sport !== 'all' && result.metadata.sport?.toLowerCase() !== filters.sport.toLowerCase()) return false
      if (filters.garScore !== 'all' && filters.garScore.includes('-')) {
        const [min, max] = filters.garScore.split('-').map(Number)
        if (result.metadata.garScore && (result.metadata.garScore < min || result.metadata.garScore > max)) return false
      }
      
      return true
    })

    return NextResponse.json({ results: filteredResults })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}