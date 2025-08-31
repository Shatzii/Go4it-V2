import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { storage } from '@/server/storage';
import { logAuditEvent, getClientIP } from '@/lib/security';

const enrollmentSchema = z.object({
  courseId: z.string().min(1),
  studentId: z.string().min(1),
  semester: z.string().min(1),
  priority: z.number().min(1).max(5).default(3),
});

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, studentId, semester, priority } = enrollmentSchema.parse(body);

    // Verify user can enroll student (self-enrollment or admin/parent permission)
    if (user.role === 'student' && user.userId !== studentId) {
      return NextResponse.json({ error: 'Cannot enroll other students' }, { status: 403 });
    }

    // Check if course exists
    const course = await storage.getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if student is already enrolled
    const existingEnrollment = await checkExistingEnrollment(studentId, courseId, semester);
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Student already enrolled in this course' },
        { status: 409 },
      );
    }

    // Create enrollment record
    const enrollment = await createEnrollment({
      studentId,
      courseId,
      semester,
      priority,
      enrolledAt: new Date(),
      status: 'enrolled',
    });

    // Log enrollment
    logAuditEvent({
      userId: user.userId,
      action: 'course_enrollment',
      resource: 'enrollment',
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      success: true,
      details: { courseId, studentId, semester },
    });

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Successfully enrolled in course',
    });
  } catch (error) {
    console.error('Course enrollment error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 });
  }
}

// Helper functions
async function checkExistingEnrollment(studentId: string, courseId: string, semester: string) {
  // This would query the enrollments table in a real implementation
  return null; // Placeholder
}

async function createEnrollment(enrollmentData: any) {
  // This would create an enrollment record in the database
  return {
    id: crypto.randomUUID(),
    ...enrollmentData,
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId') || user.userId;
    const semester = url.searchParams.get('semester');

    // Get student's enrollments
    const enrollments = await getStudentEnrollments(studentId, semester);

    return NextResponse.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

async function getStudentEnrollments(studentId: string, semester?: string) {
  // This would query enrollments with course details
  return []; // Placeholder
}
