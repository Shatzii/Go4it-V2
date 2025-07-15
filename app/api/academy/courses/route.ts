import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock available courses - in production, this would come from database
    const courses = [
      {
        id: '4',
        title: 'Chemistry I',
        subject: 'Science',
        grade: '11',
        credits: 1,
        instructor: 'Dr. Curie',
        schedule: 'Tue/Thu 1:00-2:30 PM',
        progress: 0,
        isNCAAEligible: true,
        assignments: []
      },
      {
        id: '5',
        title: 'U.S. History',
        subject: 'Social Studies',
        grade: '11',
        credits: 1,
        instructor: 'Professor Timeline',
        schedule: 'Mon/Wed/Fri 11:00-12:00 PM',
        progress: 0,
        isNCAAEligible: true,
        assignments: []
      },
      {
        id: '6',
        title: 'Pre-Calculus',
        subject: 'Mathematics',
        grade: '11',
        credits: 1,
        instructor: 'Professor Newton',
        schedule: 'Tue/Thu 9:00-10:30 AM',
        progress: 0,
        isNCAAEligible: true,
        assignments: []
      },
      {
        id: '7',
        title: 'Creative Writing',
        subject: 'English',
        grade: '11',
        credits: 0.5,
        instructor: 'Ms. Shakespeare',
        schedule: 'Fri 2:00-3:30 PM',
        progress: 0,
        isNCAAEligible: false,
        assignments: []
      },
      {
        id: '8',
        title: 'Sports Psychology',
        subject: 'Psychology',
        grade: '11',
        credits: 0.5,
        instructor: 'Dr. Inclusive',
        schedule: 'Wed 3:00-4:30 PM',
        progress: 0,
        isNCAAEligible: false,
        assignments: []
      },
      {
        id: '9',
        title: 'Nutrition Science',
        subject: 'Health',
        grade: '11',
        credits: 0.5,
        instructor: 'Dr. Curie',
        schedule: 'Mon 1:00-2:30 PM',
        progress: 0,
        isNCAAEligible: false,
        assignments: []
      }
    ]

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}