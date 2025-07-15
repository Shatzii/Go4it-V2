import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/shared/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock student data - in production, this would come from database
    const student = {
      id: user.id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      grade: '11',
      gpa: 3.8,
      credits: 45,
      sport: user.sport || 'Football',
      ncaaEligible: true,
      courses: [
        {
          id: '1',
          title: 'Algebra II',
          subject: 'Mathematics',
          grade: '11',
          credits: 1,
          instructor: 'Professor Newton',
          schedule: 'Mon/Wed/Fri 9:00-10:30 AM',
          progress: 75,
          isNCAAEligible: true,
          assignments: [
            {
              id: '1',
              title: 'Quadratic Functions Quiz',
              type: 'quiz',
              dueDate: '2024-07-20',
              status: 'pending',
              score: 0,
              maxScore: 100
            },
            {
              id: '2',
              title: 'Factoring Polynomials',
              type: 'essay',
              dueDate: '2024-07-25',
              status: 'submitted',
              score: 0,
              maxScore: 100
            }
          ]
        },
        {
          id: '2',
          title: 'English Literature',
          subject: 'English',
          grade: '11',
          credits: 1,
          instructor: 'Ms. Shakespeare',
          schedule: 'Tue/Thu 10:00-11:30 AM',
          progress: 82,
          isNCAAEligible: true,
          assignments: [
            {
              id: '3',
              title: 'Romeo and Juliet Essay',
              type: 'essay',
              dueDate: '2024-07-18',
              status: 'graded',
              score: 92,
              maxScore: 100
            }
          ]
        },
        {
          id: '3',
          title: 'Sports Science',
          subject: 'Science',
          grade: '11',
          credits: 1,
          instructor: 'Dr. Curie',
          schedule: 'Mon/Wed 2:00-3:30 PM',
          progress: 68,
          isNCAAEligible: false,
          assignments: [
            {
              id: '4',
              title: 'Biomechanics Lab Report',
              type: 'project',
              dueDate: '2024-07-22',
              status: 'pending',
              score: 0,
              maxScore: 100
            }
          ]
        }
      ]
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error('Failed to fetch student data:', error)
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 })
  }
}