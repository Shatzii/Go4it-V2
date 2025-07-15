import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Mock student academic data
    const student = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      grade: '11th',
      gpa: user.gpa || 3.7,
      credits: 18,
      sport: user.sport || 'Basketball',
      ncaaEligible: true,
      courses: [
        {
          id: '1',
          title: 'Advanced Mathematics',
          subject: 'Mathematics',
          grade: '11th',
          credits: 4,
          instructor: 'Dr. Smith',
          schedule: 'Mon/Wed/Fri 10:00-11:00',
          progress: 75,
          isNCAAEligible: true,
          currentGrade: 'A-',
          assignments: [
            {
              id: '1',
              title: 'Calculus Quiz 3',
              type: 'quiz',
              dueDate: '2024-07-20',
              status: 'pending',
              maxScore: 100
            },
            {
              id: '2',
              title: 'Statistics Project',
              type: 'project',
              dueDate: '2024-07-25',
              status: 'submitted',
              score: 92,
              maxScore: 100
            }
          ]
        },
        {
          id: '2',
          title: 'English Literature',
          subject: 'English',
          grade: '11th',
          credits: 3,
          instructor: 'Ms. Johnson',
          schedule: 'Tue/Thu 9:00-10:30',
          progress: 82,
          isNCAAEligible: true,
          currentGrade: 'B+',
          assignments: [
            {
              id: '3',
              title: 'Essay on Shakespeare',
              type: 'essay',
              dueDate: '2024-07-18',
              status: 'graded',
              score: 85,
              maxScore: 100
            }
          ]
        }
      ],
      upcomingAssignments: [
        {
          id: '1',
          title: 'Calculus Quiz 3',
          course: 'Advanced Mathematics',
          type: 'quiz',
          dueDate: '2024-07-20',
          status: 'pending'
        },
        {
          id: '4',
          title: 'History Essay',
          course: 'AP History',
          type: 'essay',
          dueDate: '2024-07-22',
          status: 'pending'
        }
      ],
      academicProgress: {
        totalCredits: 18,
        requiredCredits: 24,
        ncaaEligibleCredits: 16,
        currentGPA: user.gpa || 3.7,
        projectedGPA: 3.8
      }
    }
    
    return NextResponse.json({ student })
  } catch (error) {
    console.error('Error fetching student data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}