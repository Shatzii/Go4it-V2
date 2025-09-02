import { NextRequest, NextResponse } from 'next/server';

// Mock enrollment data
const mockEnrollments = [
  {
    id: 1,
    studentId: 'dev-user-123',
    courseId: 1,
    courseName: 'Algebra I',
    instructor: 'Dr. Sarah Johnson',
    progress: 75,
    currentGrade: 'B+',
    status: 'active',
    enrolledAt: '2024-08-15T00:00:00Z',
    nextAssignment: 'Quadratic Equations Worksheet',
    nextAssignmentDue: '2024-08-25T23:59:59Z',
  },
  {
    id: 2,
    studentId: 'dev-user-123',
    courseId: 2,
    courseName: 'Biology I',
    instructor: 'Dr. Michael Chen',
    progress: 60,
    currentGrade: 'A-',
    status: 'active',
    enrolledAt: '2024-08-15T00:00:00Z',
    nextAssignment: 'Cell Structure Lab Report',
    nextAssignmentDue: '2024-08-24T23:59:59Z',
  },
  {
    id: 3,
    studentId: 'dev-user-123',
    courseId: 4,
    courseName: 'World History',
    instructor: 'Dr. James Thompson',
    progress: 45,
    currentGrade: 'B',
    status: 'active',
    enrolledAt: '2024-08-15T00:00:00Z',
    nextAssignment: 'Ancient Civilizations Essay',
    nextAssignmentDue: '2024-08-26T23:59:59Z',
  },
];

const mockAssignments = [
  {
    id: 1,
    courseId: 1,
    courseName: 'Algebra I',
    title: 'Quadratic Equations Worksheet',
    type: 'homework',
    dueDate: '2024-08-25T23:59:59Z',
    maxPoints: 100,
    submitted: false,
    status: 'pending',
  },
  {
    id: 2,
    courseId: 2,
    courseName: 'Biology I',
    title: 'Cell Structure Lab Report',
    type: 'lab',
    dueDate: '2024-08-24T23:59:59Z',
    maxPoints: 150,
    submitted: false,
    status: 'pending',
  },
  {
    id: 3,
    courseId: 4,
    courseName: 'World History',
    title: 'Ancient Civilizations Essay',
    type: 'essay',
    dueDate: '2024-08-26T23:59:59Z',
    maxPoints: 200,
    submitted: false,
    status: 'pending',
  },
  {
    id: 4,
    courseId: 1,
    courseName: 'Algebra I',
    title: 'Linear Functions Quiz',
    type: 'quiz',
    dueDate: '2024-08-20T23:59:59Z',
    maxPoints: 50,
    submitted: true,
    score: 45,
    status: 'graded',
  },
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');
    const type = url.searchParams.get('type'); // 'enrollments' or 'assignments'

    if (!studentId) {
      return NextResponse.json({ error: 'studentId required' }, { status: 400 });
    }

    if (type === 'assignments') {
      const studentAssignments = mockAssignments.filter((assignment) =>
        mockEnrollments.some(
          (enrollment) =>
            enrollment.studentId === studentId && enrollment.courseId === assignment.courseId,
        ),
      );
      return NextResponse.json({ assignments: studentAssignments });
    }

    // Default to enrollments
    const studentEnrollments = mockEnrollments.filter((e) => e.studentId === studentId);
    return NextResponse.json({ enrollments: studentEnrollments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentId, courseId } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'studentId and courseId required' }, { status: 400 });
    }

    // Check if already enrolled
    const existingEnrollment = mockEnrollments.find(
      (e) => e.studentId === studentId && e.courseId === parseInt(courseId),
    );

    if (existingEnrollment) {
      return NextResponse.json({ enrollment: existingEnrollment });
    }

    // Create new enrollment
    const newEnrollment = {
      id: mockEnrollments.length + 1,
      studentId,
      courseId: parseInt(courseId),
      courseName: `Course ${courseId}`,
      instructor: 'TBA',
      progress: 0,
      currentGrade: 'N/A',
      status: 'active',
      enrolledAt: new Date().toISOString(),
      nextAssignment: null,
      nextAssignmentDue: null,
    };

    mockEnrollments.push(newEnrollment);
    return NextResponse.json({ enrollment: newEnrollment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to enroll student' }, { status: 500 });
  }
}
