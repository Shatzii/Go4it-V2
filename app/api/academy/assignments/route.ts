import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const assignments = [
      {
        id: 'assignment-1',
        title: 'Biomechanical Analysis Project',
        description: 'Analyze the biomechanics of a specific athletic movement',
        course: 'Sports Science & Performance',
        courseId: 'sports-science',
        dueDate: '2024-03-15',
        assignedDate: '2024-03-01',
        points: 100,
        status: 'In Progress',
        priority: 'High',
        type: 'Project',
        instructions: 'Choose an athletic movement and provide detailed biomechanical analysis including force vectors, joint angles, and movement efficiency.',
        rubric: [
          { criteria: 'Technical Analysis', points: 40 },
          { criteria: 'Visual Presentation', points: 30 },
          { criteria: 'Conclusions & Recommendations', points: 30 }
        ],
        submissions: [],
        resources: [
          { title: 'Biomechanics Textbook Chapter 5', type: 'reading' },
          { title: 'Video Analysis Software Tutorial', type: 'video' }
        ]
      },
      {
        id: 'assignment-2',
        title: 'Personal Nutrition Plan',
        description: 'Create a personalized nutrition plan for athletic performance',
        course: 'Sports Nutrition & Recovery',
        courseId: 'nutrition-recovery',
        dueDate: '2024-03-20',
        assignedDate: '2024-03-05',
        points: 75,
        status: 'Not Started',
        priority: 'Medium',
        type: 'Assignment',
        instructions: 'Develop a comprehensive nutrition plan tailored to your sport and training schedule.',
        rubric: [
          { criteria: 'Nutritional Science', points: 30 },
          { criteria: 'Sport-Specific Application', points: 25 },
          { criteria: 'Implementation Strategy', points: 20 }
        ],
        submissions: [],
        resources: [
          { title: 'Sports Nutrition Guidelines', type: 'reading' },
          { title: 'Meal Planning Templates', type: 'document' }
        ]
      },
      {
        id: 'assignment-3',
        title: 'NCAA Compliance Case Study',
        description: 'Analyze a real NCAA compliance case and provide recommendations',
        course: 'NCAA Compliance & Eligibility',
        courseId: 'ncaa-compliance',
        dueDate: '2024-03-25',
        assignedDate: '2024-03-10',
        points: 50,
        status: 'Not Started',
        priority: 'Medium',
        type: 'Case Study',
        instructions: 'Select a recent NCAA compliance case and provide detailed analysis of the violations and recommended preventive measures.',
        rubric: [
          { criteria: 'Case Analysis', points: 25 },
          { criteria: 'Recommendations', points: 15 },
          { criteria: 'Compliance Understanding', points: 10 }
        ],
        submissions: [],
        resources: [
          { title: 'NCAA Manual 2024', type: 'document' },
          { title: 'Recent Compliance Cases', type: 'database' }
        ]
      },
      {
        id: 'assignment-4',
        title: 'Mental Performance Journal',
        description: 'Weekly mental performance reflection and goal setting',
        course: 'Mental Performance & Psychology',
        courseId: 'mental-performance',
        dueDate: '2024-03-30',
        assignedDate: '2024-03-01',
        points: 60,
        status: 'Completed',
        priority: 'Low',
        type: 'Journal',
        instructions: 'Maintain a weekly journal documenting mental performance techniques, challenges, and progress.',
        rubric: [
          { criteria: 'Reflection Quality', points: 30 },
          { criteria: 'Goal Setting', points: 20 },
          { criteria: 'Consistency', points: 10 }
        ],
        submissions: [
          {
            id: 'submission-1',
            submittedDate: '2024-03-29',
            grade: 55,
            feedback: 'Excellent reflection and goal setting. Continue applying these techniques.'
          }
        ],
        resources: [
          { title: 'Mental Performance Techniques', type: 'video' },
          { title: 'Goal Setting Worksheets', type: 'document' }
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      assignments,
      totalAssignments: assignments.length,
      completedAssignments: assignments.filter(a => a.status === 'Completed').length,
      inProgressAssignments: assignments.filter(a => a.status === 'In Progress').length,
      notStartedAssignments: assignments.filter(a => a.status === 'Not Started').length
    });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, submission, files } = body;

    // Simulate assignment submission
    const submissionData = {
      id: `submission-${Date.now()}`,
      assignmentId,
      studentId: user.id,
      content: submission,
      files: files || [],
      submittedDate: new Date().toISOString(),
      status: 'Submitted',
      grade: null,
      feedback: null
    };

    return NextResponse.json({
      success: true,
      submission: submissionData,
      message: 'Assignment submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    );
  }
}