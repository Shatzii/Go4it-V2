import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../server/db';
import { garScores, students } from '../../../../shared/comprehensive-schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/gar/latest?studentId=xxx
 * Get the latest GAR score for a student
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Verify student exists
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Fetch latest score
    const [latestScore] = await db
      .select()
      .from(garScores)
      .where(eq(garScores.studentId, studentId))
      .orderBy(desc(garScores.testDate))
      .limit(1);

    if (!latestScore) {
      return NextResponse.json({
        success: true,
        score: null,
        message: 'No GAR scores found for this student'
      });
    }

    // Calculate component averages
    const physical = latestScore.speed && latestScore.agility && latestScore.power
      ? Math.round((latestScore.speed + latestScore.agility + latestScore.power + (latestScore.endurance || 0)) / 4)
      : null;

    const cognitive = latestScore.decisionMaking && latestScore.spatialAwareness
      ? Math.round((latestScore.decisionMaking + latestScore.spatialAwareness) / 2)
      : null;

    const mental = latestScore.mentalToughness && latestScore.focus && latestScore.composure
      ? Math.round((latestScore.mentalToughness + latestScore.focus + latestScore.composure) / 3)
      : null;

    return NextResponse.json({
      success: true,
      score: latestScore,
      breakdown: {
        physical,
        cognitive,
        mental
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch GAR score', details: (error as Error).message },
      { status: 500 }
    );
  }
}
