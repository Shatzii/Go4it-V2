import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users, studentAthleteProfiles, studentEnrollments, academyCourses } from '@/shared/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeEnrollments = searchParams.get('includeEnrollments') === 'true';

    if (userId) {
      // Get specific student athlete
      const studentData = await db
        .select({
          user: users,
          profile: studentAthleteProfiles,
        })
        .from(users)
        .leftJoin(studentAthleteProfiles, eq(users.id, studentAthleteProfiles.userId))
        .where(eq(users.id, userId))
        .limit(1);

      if (studentData.length === 0) {
        return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
      }

      const { user, profile } = studentData[0];

      let enrollments = [];
      if (includeEnrollments) {
        enrollments = await db
          .select({
            enrollment: studentEnrollments,
            course: academyCourses,
          })
          .from(studentEnrollments)
          .leftJoin(academyCourses, eq(studentEnrollments.courseId, academyCourses.id))
          .where(and(eq(studentEnrollments.userId, userId), eq(studentEnrollments.isActive, true)));
      }

      const studentAthlete = {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Student',
        email: user.email,
        sport: user.sport || profile?.positions?.[0] || 'Not specified',
        position: profile?.positions?.[0] || 'Not specified',
        grade:
          user.grade ||
          (profile?.graduationYear ? `Class of ${profile.graduationYear}` : 'Not specified'),
        garScore: user.garScore || 0,
        isVerified: user.isVerified || false,
        subscriptionTier: user.subscriptionTier || 'free',

        // Athletic Information
        height: profile?.height || 'Not specified',
        weight: profile?.weight || 0,
        dominantHand: profile?.dominantHand || 'Not specified',
        positions: profile?.positions || [],
        teamAffiliation: profile?.teamAffiliation || 'Independent',
        coachName: profile?.coachName || 'Not assigned',
        coachEmail: profile?.coachEmail || '',
        coachPhone: profile?.coachPhone || '',

        // Academic Information
        school: profile?.school || 'Not specified',
        graduationYear: profile?.graduationYear || new Date().getFullYear() + 1,
        currentGpa: profile?.currentGpa || 0,
        satScore: profile?.satScore || 0,
        actScore: profile?.actScore || 0,

        // Athletic Performance
        seasonStats: profile?.seasonStats || {},
        athleticAchievements: profile?.athleticAchievements || [],
        injuryHistory: profile?.injuryHistory || {},

        // Recruiting Information
        recruitingStatus: profile?.recruitingStatus || 'exploring',
        interestedColleges: profile?.interestedColleges || [],
        collegeVisits: profile?.collegeVisits || {},
        scholarshipOffers: profile?.scholarshipOffers || {},

        // Wellness & Development
        wellnessGoals: profile?.wellnessGoals || [],
        trainingSchedule: profile?.trainingSchedule || {},

        // Course Enrollments
        enrollments: enrollments.map(({ enrollment, course }) => ({
          courseId: course?.id,
          courseTitle: course?.title,
          courseCode: course?.code,
          instructor: course?.instructor,
          credits: course?.credits,
          progress: enrollment.progress,
          currentGrade: enrollment.currentGrade,
          enrolledAt: enrollment.enrolledAt,
          status: enrollment.isActive ? 'active' : 'inactive',
        })),

        createdAt: user.createdAt,
        updatedAt: profile?.updatedAt || user.updatedAt,
      };

      return NextResponse.json({
        success: true,
        studentAthlete,
      });
    }

    // Get all student athletes
    const allStudents = await db
      .select({
        user: users,
        profile: studentAthleteProfiles,
      })
      .from(users)
      .leftJoin(studentAthleteProfiles, eq(users.id, studentAthleteProfiles.userId))
      .where(eq(users.sport, 'football')); // Filter for athletes

    const studentAthletes = allStudents.map(({ user, profile }) => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Student',
      email: user.email,
      sport: user.sport || profile?.positions?.[0] || 'Not specified',
      position: profile?.positions?.[0] || 'Not specified',
      grade:
        user.grade ||
        (profile?.graduationYear ? `Class of ${profile.graduationYear}` : 'Not specified'),
      gpa: profile?.currentGpa || 0,
      garScore: user.garScore || 0,
      height: profile?.height || 'Not specified',
      weight: profile?.weight || 0,
      teamAffiliation: profile?.teamAffiliation || 'Independent',
      recruitingStatus: profile?.recruitingStatus || 'exploring',
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      studentAthletes,
      totalCount: studentAthletes.length,
    });
  } catch (error) {
    console.error('Error fetching student athletes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student athletes' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, profileData } = body;

    // Update or create student athlete profile
    const existingProfile = await db
      .select()
      .from(studentAthleteProfiles)
      .where(eq(studentAthleteProfiles.userId, userId))
      .limit(1);

    let result;
    if (existingProfile.length > 0) {
      // Update existing profile
      result = await db
        .update(studentAthleteProfiles)
        .set({
          ...profileData,
          updatedAt: new Date(),
        })
        .where(eq(studentAthleteProfiles.userId, userId))
        .returning();
    } else {
      // Create new profile
      result = await db
        .insert(studentAthleteProfiles)
        .values({
          userId,
          ...profileData,
          isActive: true,
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      profile: result[0],
      message: 'Student athlete profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating student athlete profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 },
    );
  }
}
