import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const division = searchParams.get('division')
  
  try {
    // Mock team data - in production this would come from your database
    const allTeams = [
      // Flag Football Teams
      { 
        id: 1, 
        name: 'Lightning Bolts', 
        sport: 'flag-football', 
        division: '12U', 
        coach: 'Coach Martinez', 
        players: 14, 
        wins: 8, 
        losses: 2,
        isActive: true,
        season: 'Fall 2025',
        homeVenue: 'Field A',
        maxRosterSize: 15
      },
      { 
        id: 2, 
        name: 'Thunder Hawks', 
        sport: 'flag-football', 
        division: '12U', 
        coach: 'Coach Johnson', 
        players: 13, 
        wins: 7, 
        losses: 3,
        isActive: true,
        season: 'Fall 2025',
        homeVenue: 'Field B',
        maxRosterSize: 15
      },
      { 
        id: 3, 
        name: 'Storm Eagles', 
        sport: 'flag-football', 
        division: '10U', 
        coach: 'Coach Williams', 
        players: 15, 
        wins: 9, 
        losses: 1,
        isActive: true,
        season: 'Fall 2025',
        homeVenue: 'Field A',
        maxRosterSize: 16
      },
      { 
        id: 4, 
        name: 'Fire Dragons', 
        sport: 'flag-football', 
        division: '10U', 
        coach: 'Coach Davis', 
        players: 13, 
        wins: 6, 
        losses: 4,
        isActive: true,
        season: 'Fall 2025',
        homeVenue: 'Field C',
        maxRosterSize: 16
      },
      
      // Soccer Teams
      { 
        id: 5, 
        name: 'Galaxy Strikers', 
        sport: 'soccer', 
        division: 'U12', 
        coach: 'Coach Rodriguez', 
        players: 18, 
        wins: 12, 
        losses: 3,
        isActive: true,
        season: 'Spring 2025',
        homeVenue: 'Soccer Field 1',
        maxRosterSize: 20
      },
      { 
        id: 6, 
        name: 'Thunder Kicks', 
        sport: 'soccer', 
        division: 'U14', 
        coach: 'Coach Thompson', 
        players: 16, 
        wins: 8, 
        losses: 5,
        isActive: true,
        season: 'Spring 2025',
        homeVenue: 'Soccer Field 2',
        maxRosterSize: 18
      },
      
      // Basketball Teams
      { 
        id: 7, 
        name: 'Court Kings', 
        sport: 'basketball', 
        division: 'U16', 
        coach: 'Coach Jackson', 
        players: 12, 
        wins: 15, 
        losses: 4,
        isActive: true,
        season: 'Winter 2025',
        homeVenue: 'Gym A',
        maxRosterSize: 15
      },
      { 
        id: 8, 
        name: 'Slam Dunkers', 
        sport: 'basketball', 
        division: 'U14', 
        coach: 'Coach Anderson', 
        players: 11, 
        wins: 10, 
        losses: 7,
        isActive: true,
        season: 'Winter 2025',
        homeVenue: 'Gym B',
        maxRosterSize: 14
      }
    ]

    // Filter teams based on query parameters
    let filteredTeams = allTeams
    
    if (sport) {
      filteredTeams = filteredTeams.filter(team => team.sport === sport)
    }
    
    if (division) {
      filteredTeams = filteredTeams.filter(team => team.division === division)
    }

    return NextResponse.json({
      success: true,
      teams: filteredTeams,
      total: filteredTeams.length
    })

  } catch (error) {
    console.error('Teams API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teams'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const teamData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'sport', 'division', 'coach']
    for (const field of requiredFields) {
      if (!teamData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 })
      }
    }

    // Generate team ID (in production this would be handled by database)
    const newTeam = {
      id: Date.now(), // Simple ID generation for demo
      ...teamData,
      players: 0,
      wins: 0,
      losses: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    // In production, save to database here
    console.log('New team created:', newTeam)

    return NextResponse.json({
      success: true,
      team: newTeam,
      message: `Team "${teamData.name}" created successfully`
    })

  } catch (error) {
    console.error('Team creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create team'
    }, { status: 500 })
  }
}