import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const grades = {
      studentId: user.id,
      academicYear: '2024-2025',
      semester: 'Spring',
      currentGPA: 3.8,
      cumulativeGPA: 3.7,
      totalCredits: 45,
      qualityPoints: 166.5,
      courses: [
        {
          id: 'sports-science',
          course: 'Sports Science & Performance',
          instructor: 'Dr. Martinez',
          credits: 3,
          currentGrade: 'A-',
          gradePoints: 3.7,
          qualityPoints: 11.1,
          assignments: [
            {
              name: 'Biomechanical Analysis Project',
              type: 'Project',
              points: 92,
              maxPoints: 100,
              weight: 40,
              dueDate: '2024-03-15',
              submitted: true
            },
            {
              name: 'Midterm Exam',
              type: 'Exam',
              points: 88,
              maxPoints: 100,
              weight: 30,
              dueDate: '2024-03-01',
              submitted: true
            },
            {
              name: 'Lab Reports',
              type: 'Lab',
              points: 85,
              maxPoints: 100,
              weight: 20,
              dueDate: 'Ongoing',
              submitted: true
            },
            {
              name: 'Participation',
              type: 'Participation',
              points: 95,
              maxPoints: 100,
              weight: 10,
              dueDate: 'Ongoing',
              submitted: true
            }
          ]
        },
        {
          id: 'athletic-development',
          course: 'Athletic Development & Training',
          instructor: 'Coach Thompson',
          credits: 4,
          currentGrade: 'A',
          gradePoints: 4.0,
          qualityPoints: 16.0,
          assignments: [
            {
              name: 'Training Program Design',
              type: 'Project',
              points: 95,
              maxPoints: 100,
              weight: 35,
              dueDate: '2024-03-20',
              submitted: true
            },
            {
              name: 'Practical Skills Assessment',
              type: 'Practical',
              points: 93,
              maxPoints: 100,
              weight: 40,
              dueDate: '2024-03-10',
              submitted: true
            },
            {
              name: 'Performance Analysis',
              type: 'Analysis',
              points: 90,
              maxPoints: 100,
              weight: 25,
              dueDate: '2024-03-25',
              submitted: true
            }
          ]
        },
        {
          id: 'ncaa-compliance',
          course: 'NCAA Compliance & Eligibility',
          instructor: 'Prof. NCAA',
          credits: 2,
          currentGrade: 'B+',
          gradePoints: 3.3,
          qualityPoints: 6.6,
          assignments: [
            {
              name: 'Compliance Case Study',
              type: 'Case Study',
              points: 85,
              maxPoints: 100,
              weight: 50,
              dueDate: '2024-03-25',
              submitted: false
            },
            {
              name: 'Eligibility Quiz',
              type: 'Quiz',
              points: 88,
              maxPoints: 100,
              weight: 30,
              dueDate: '2024-03-05',
              submitted: true
            },
            {
              name: 'Participation',
              type: 'Participation',
              points: 90,
              maxPoints: 100,
              weight: 20,
              dueDate: 'Ongoing',
              submitted: true
            }
          ]
        },
        {
          id: 'mental-performance',
          course: 'Mental Performance & Psychology',
          instructor: 'Dr. Mind',
          credits: 3,
          currentGrade: 'A-',
          gradePoints: 3.7,
          qualityPoints: 11.1,
          assignments: [
            {
              name: 'Mental Performance Journal',
              type: 'Journal',
              points: 92,
              maxPoints: 100,
              weight: 40,
              dueDate: 'Ongoing',
              submitted: true
            },
            {
              name: 'Visualization Techniques',
              type: 'Practical',
              points: 88,
              maxPoints: 100,
              weight: 35,
              dueDate: '2024-03-15',
              submitted: true
            },
            {
              name: 'Goal Setting Plan',
              type: 'Plan',
              points: 90,
              maxPoints: 100,
              weight: 25,
              dueDate: '2024-03-20',
              submitted: true
            }
          ]
        },
        {
          id: 'nutrition-recovery',
          course: 'Sports Nutrition & Recovery',
          instructor: 'Dr. Nutrition',
          credits: 2,
          currentGrade: 'B+',
          gradePoints: 3.3,
          qualityPoints: 6.6,
          assignments: [
            {
              name: 'Personal Nutrition Plan',
              type: 'Plan',
              points: 82,
              maxPoints: 100,
              weight: 45,
              dueDate: '2024-03-20',
              submitted: false
            },
            {
              name: 'Recovery Protocols',
              type: 'Protocol',
              points: 87,
              maxPoints: 100,
              weight: 35,
              dueDate: '2024-03-12',
              submitted: true
            },
            {
              name: 'Nutrition Log',
              type: 'Log',
              points: 85,
              maxPoints: 100,
              weight: 20,
              dueDate: 'Ongoing',
              submitted: true
            }
          ]
        },
        {
          id: 'academic-support',
          course: 'Academic Support for Athletes',
          instructor: 'Ms. Academic',
          credits: 1,
          currentGrade: 'A',
          gradePoints: 4.0,
          qualityPoints: 4.0,
          assignments: [
            {
              name: 'Time Management Plan',
              type: 'Plan',
              points: 95,
              maxPoints: 100,
              weight: 50,
              dueDate: '2024-03-10',
              submitted: true
            },
            {
              name: 'Study Skills Assessment',
              type: 'Assessment',
              points: 92,
              maxPoints: 100,
              weight: 30,
              dueDate: '2024-03-15',
              submitted: true
            },
            {
              name: 'Participation',
              type: 'Participation',
              points: 98,
              maxPoints: 100,
              weight: 20,
              dueDate: 'Ongoing',
              submitted: true
            }
          ]
        }
      ],
      gradingScale: {
        'A': { min: 93, max: 100, points: 4.0 },
        'A-': { min: 90, max: 92, points: 3.7 },
        'B+': { min: 87, max: 89, points: 3.3 },
        'B': { min: 83, max: 86, points: 3.0 },
        'B-': { min: 80, max: 82, points: 2.7 },
        'C+': { min: 77, max: 79, points: 2.3 },
        'C': { min: 73, max: 76, points: 2.0 },
        'C-': { min: 70, max: 72, points: 1.7 },
        'D': { min: 60, max: 69, points: 1.0 },
        'F': { min: 0, max: 59, points: 0.0 }
      }
    };

    return NextResponse.json({
      success: true,
      grades
    });

  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}