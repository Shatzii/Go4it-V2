import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mock academy courses data
    const courses = [
      {
        id: '1',
        title: 'Advanced Mathematics',
        subject: 'Mathematics',
        grade: '11th',
        credits: 4,
        instructor: 'Dr. Smith',
        schedule: 'Mon/Wed/Fri 10:00-11:00',
        isNCAAEligible: true,
        description: 'Advanced mathematical concepts including calculus and statistics.',
        prerequisites: ['Algebra II', 'Trigonometry'],
        enrolled: 24,
        capacity: 30
      },
      {
        id: '2',
        title: 'English Literature',
        subject: 'English',
        grade: '11th',
        credits: 3,
        instructor: 'Ms. Johnson',
        schedule: 'Tue/Thu 9:00-10:30',
        isNCAAEligible: true,
        description: 'Study of classic and modern literature with emphasis on critical analysis.',
        prerequisites: ['English 10'],
        enrolled: 28,
        capacity: 30
      },
      {
        id: '3',
        title: 'Sports Science',
        subject: 'Science',
        grade: '11th',
        credits: 3,
        instructor: 'Coach Wilson',
        schedule: 'Mon/Wed 2:00-3:30',
        isNCAAEligible: false,
        description: 'Scientific principles applied to athletic performance and training.',
        prerequisites: ['Biology', 'Physics'],
        enrolled: 18,
        capacity: 25
      },
      {
        id: '4',
        title: 'AP Biology',
        subject: 'Science',
        grade: '11th',
        credits: 4,
        instructor: 'Dr. Martinez',
        schedule: 'Tue/Thu 1:00-2:30',
        isNCAAEligible: true,
        description: 'College-level biology course covering molecular biology and genetics.',
        prerequisites: ['Chemistry', 'Biology'],
        enrolled: 22,
        capacity: 25
      }
    ]
    
    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}