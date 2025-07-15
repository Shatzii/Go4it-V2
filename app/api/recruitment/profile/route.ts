import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock recruitment profile - in production, this would come from database
    const profile = {
      id: '1',
      athleteId: user.id.toString(),
      sport: 'Football',
      position: 'Quarterback',
      garScore: 87.3,
      academicInfo: {
        gpa: 3.8,
        sat: 1320,
        act: 28,
        coreCredits: 16
      },
      athleticStats: {
        height: "6'2\"",
        weight: '195 lbs',
        stats: {
          passingYards: 3240,
          touchdowns: 32,
          interceptions: 8,
          completionPercentage: 68.5,
          qbRating: 142.3
        }
      },
      highlights: [
        'State Championship Winner 2023',
        'All-District First Team',
        'Region MVP Award',
        'Academic All-State'
      ],
      timeline: [
        {
          id: '1',
          type: 'contact',
          schoolId: '2',
          schoolName: 'Ohio State University',
          date: new Date('2024-07-10'),
          details: 'Initial contact from recruiting coordinator',
          followUpNeeded: true,
          nextAction: 'Send highlight reel',
          nextActionDate: new Date('2024-07-20')
        },
        {
          id: '2',
          type: 'visit',
          schoolId: '2',
          schoolName: 'Ohio State University',
          date: new Date('2024-06-15'),
          details: 'Unofficial campus visit',
          followUpNeeded: false
        },
        {
          id: '3',
          type: 'interest',
          schoolId: '1',
          schoolName: 'University of Alabama',
          date: new Date('2024-06-01'),
          details: 'Expressed interest in program',
          followUpNeeded: true,
          nextAction: 'Schedule official visit',
          nextActionDate: new Date('2024-07-25')
        }
      ],
      ncaaEligible: true,
      targetSchools: ['1', '2', '4']
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Failed to fetch recruitment profile:', error)
    return NextResponse.json({ error: 'Failed to fetch recruitment profile' }, { status: 500 })
  }
}