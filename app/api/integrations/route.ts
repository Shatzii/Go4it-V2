import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock integrations data - in production, this would come from database
    const integrations = [
      {
        id: '1',
        name: 'Fitbit',
        type: 'fitness',
        icon: '⌚',
        description: 'Track daily activity, heart rate, and sleep patterns',
        isConnected: true,
        lastSync: new Date('2024-07-15T10:30:00Z'),
        syncStatus: 'active',
        features: [
          'Heart rate monitoring',
          'Step counting',
          'Sleep tracking',
          'Calorie burn estimation'
        ],
        data: {
          'Steps Today': '8,432',
          'Heart Rate': '72 bpm',
          'Sleep Score': '84/100',
          'Calories Burned': '2,140'
        }
      },
      {
        id: '2',
        name: 'Apple Watch',
        type: 'fitness',
        icon: '⌚',
        description: 'Comprehensive fitness and health monitoring',
        isConnected: false,
        syncStatus: 'paused',
        features: [
          'Workout tracking',
          'ECG monitoring',
          'Blood oxygen levels',
          'Activity rings'
        ]
      },
      {
        id: '3',
        name: 'Strava',
        type: 'fitness',
        icon: '🏃',
        description: 'Track running, cycling, and training activities',
        isConnected: true,
        lastSync: new Date('2024-07-15T08:15:00Z'),
        syncStatus: 'active',
        features: [
          'GPS tracking',
          'Performance analysis',
          'Training logs',
          'Social features'
        ],
        data: {
          'Weekly Distance': '25.3 mi',
          'Avg Pace': '7:42/mi',
          'Elevation Gain': '1,240 ft',
          'Activities': '4'
        }
      },
      {
        id: '4',
        name: 'PowerSchool',
        type: 'academic',
        icon: '📚',
        description: 'Access grades, assignments, and academic records',
        isConnected: true,
        lastSync: new Date('2024-07-14T16:00:00Z'),
        syncStatus: 'active',
        features: [
          'Grade tracking',
          'Assignment monitoring',
          'Attendance records',
          'NCAA eligibility tracking'
        ]
      },
      {
        id: '5',
        name: 'Canvas LMS',
        type: 'academic',
        icon: '🎓',
        description: 'Learning management system integration',
        isConnected: false,
        syncStatus: 'error',
        features: [
          'Course materials',
          'Assignment submissions',
          'Grade book access',
          'Calendar integration'
        ]
      },
      {
        id: '6',
        name: 'Twitter',
        type: 'social',
        icon: '🐦',
        description: 'Share highlights and achievements on social media',
        isConnected: true,
        lastSync: new Date('2024-07-15T12:00:00Z'),
        syncStatus: 'active',
        features: [
          'Auto-post highlights',
          'Achievement sharing',
          'Recruitment updates',
          'Team announcements'
        ]
      },
      {
        id: '7',
        name: 'Instagram',
        type: 'social',
        icon: '📸',
        description: 'Visual content sharing and recruitment presence',
        isConnected: false,
        syncStatus: 'paused',
        features: [
          'Photo/video sharing',
          'Story highlights',
          'Recruitment posts',
          'Behind-the-scenes content'
        ]
      }
    ]

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error('Failed to fetch integrations:', error)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
}