import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return student enrollment data
    const enrollment = {
      studentId: 'demo-student',
      enrollmentDate: '2024-01-15',
      academicYear: '2024-2025',
      gradeLevel: '11',
      gpa: 3.85,
      totalCredits: 24.5,
      completedCredits: 18.0,
      enrolledCourses: 3,
      academicStanding: 'Good Standing',
      ncaaEligible: true,
      graduationTrack: 'On Track',
      advisorNotes: 'Excellent progress in core subjects',
      nextSemesterCredits: 6.5,
    };

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('Academy enrollment API error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollment' }, { status: 500 });
  }
}
