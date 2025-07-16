import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const enrollmentData = {
      studentId: user.id,
      academicYear: '2024-2025',
      semester: 'Spring',
      enrollmentStatus: 'Active',
      registrationDate: '2024-01-15',
      expectedGraduation: '2026-05-15',
      degree: 'Bachelor of Science in Sports Management',
      concentration: 'Athletic Performance',
      advisor: 'Dr. Martinez',
      creditsEarned: 45,
      creditsRequired: 120,
      currentGPA: 3.8,
      cumulativeGPA: 3.7,
      academicStanding: 'Good Standing',
      ncaaEligibility: {
        status: 'Eligible',
        lastReview: '2024-01-01',
        nextReview: '2024-07-01',
        coreCoursesCompleted: 16,
        coreCoursesRequired: 16,
        minGPA: 2.3,
        currentGPA: 3.8,
        eligibilityCenter: 'NCAA Eligibility Center',
        amateurStatus: 'Certified'
      }
    };

    return NextResponse.json({
      success: true,
      enrollment: enrollmentData
    });

  } catch (error) {
    console.error('Error fetching enrollment data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment data' },
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
    const { courseId, semester } = body;

    // Simulate course enrollment
    const enrollment = {
      id: `enrollment-${Date.now()}`,
      studentId: user.id,
      courseId,
      semester,
      enrollmentDate: new Date().toISOString(),
      status: 'Enrolled',
      grade: null,
      credits: 3
    };

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Successfully enrolled in course'
    });

  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}