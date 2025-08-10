import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { teams, teamRosters, users, videoAnalysis, enrollments } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = parseInt(params.id);

    // Get team information
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team.length) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get roster with user details, performance data, and academic info
    const roster = await db
      .select({
        id: teamRosters.id,
        position: teamRosters.position,
        jerseyNumber: teamRosters.jerseyNumber,
        status: teamRosters.status,
        eligibilityStatus: teamRosters.eligibilityStatus,
        gpa: teamRosters.gpa,
        creditHours: teamRosters.creditHours,
        joinDate: teamRosters.joinDate,
        graduationDate: teamRosters.graduationDate,
        scholarshipAmount: teamRosters.scholarshipAmount,
        scholarshipType: teamRosters.scholarshipType,
        // User information
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        garScore: users.garScore,
        sport: users.sport,
        graduationYear: users.graduationYear,
        profileImage: users.profileImage,
        isVerified: users.isVerified,
      })
      .from(teamRosters)
      .innerJoin(users, eq(teamRosters.athleteId, users.id))
      .where(eq(teamRosters.teamId, teamId));

    // Get recent GAR scores for each player
    const rosterWithPerformance = await Promise.all(
      roster.map(async (player) => {
        // Get latest GAR analysis
        const latestAnalysis = await db
          .select({
            garScore: videoAnalysis.garScore,
            analysisDate: videoAnalysis.createdAt,
            strengths: videoAnalysis.strengths,
            improvements: videoAnalysis.improvements,
          })
          .from(videoAnalysis)
          .where(eq(videoAnalysis.userId, player.userId))
          .orderBy(desc(videoAnalysis.createdAt))
          .limit(1);

        // Get academic progress
        const academicProgress = await db
          .select({
            currentGrade: enrollments.currentGrade,
            progressPercentage: enrollments.progressPercentage,
            isNcaaEligible: enrollments.isNcaaEligible,
            status: enrollments.status,
          })
          .from(enrollments)
          .where(eq(enrollments.studentId, player.userId))
          .limit(3);

        return {
          ...player,
          performance: {
            latestGarScore: latestAnalysis[0]?.garScore || player.garScore,
            lastAnalysis: latestAnalysis[0]?.analysisDate,
            strengths: latestAnalysis[0]?.strengths || [],
            improvements: latestAnalysis[0]?.improvements || [],
          },
          academics: {
            courses: academicProgress,
            averageGrade: academicProgress.length > 0
              ? academicProgress.reduce((sum, course) => sum + (parseFloat(course.currentGrade?.toString() || '0')), 0) / academicProgress.length
              : null,
            ncaaEligible: academicProgress.every(course => course.isNcaaEligible),
          },
        };
      })
    );

    return NextResponse.json({
      team: team[0],
      roster: rosterWithPerformance,
      stats: {
        totalPlayers: roster.length,
        averageGpa: roster.length > 0
          ? roster.reduce((sum, p) => sum + (parseFloat(p.gpa?.toString() || '0')), 0) / roster.length
          : 0,
        eligiblePlayers: roster.filter(p => p.eligibilityStatus === 'eligible').length,
        scholarshipPlayers: roster.filter(p => p.scholarshipAmount && parseFloat(p.scholarshipAmount.toString()) > 0).length,
      },
    });
  } catch (error) {
    console.error('Error fetching team roster:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team roster' },
      { status: 500 }
    );
  }
}