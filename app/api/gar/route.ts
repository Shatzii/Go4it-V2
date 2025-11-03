import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../server/db';
import { garScores, students } from '../../../shared/comprehensive-schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const GarScoreSchema = z.object({
  studentId: z.string().uuid(),
  testDate: z.string(),
  overallScore: z.number().int().min(0).max(100),
  stars: z.number().int().min(1).max(5),
  // Physical
  speed: z.number().int().min(0).max(100).optional(),
  agility: z.number().int().min(0).max(100).optional(),
  power: z.number().int().min(0).max(100).optional(),
  endurance: z.number().int().min(0).max(100).optional(),
  // Cognitive
  reactionTime: z.number().int().min(0).optional(),
  decisionMaking: z.number().int().min(0).max(100).optional(),
  spatialAwareness: z.number().int().min(0).max(100).optional(),
  // Mental
  mentalToughness: z.number().int().min(0).max(100).optional(),
  focus: z.number().int().min(0).max(100).optional(),
  composure: z.number().int().min(0).max(100).optional(),
  // Metadata
  testLocation: z.string().max(100).optional(),
  testType: z.enum(['combine', 'individual', 'virtual']).optional(),
  notes: z.string().optional()
});

/**
 * GET /api/gar?studentId=xxx
 * Get all GAR scores for a student
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

    // Fetch all scores
    const scores = await db
      .select()
      .from(garScores)
      .where(eq(garScores.studentId, studentId))
      .orderBy(desc(garScores.testDate));

    return NextResponse.json({
      success: true,
      scores,
      count: scores.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch GAR scores', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gar
 * Create a new GAR score
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = GarScoreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify student exists
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, data.studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create score
    const [newScore] = await db
      .insert(garScores)
      .values({
        studentId: data.studentId,
        testDate: data.testDate,
        overallScore: data.overallScore,
        stars: data.stars,
        speed: data.speed || null,
        agility: data.agility || null,
        power: data.power || null,
        endurance: data.endurance || null,
        reactionTime: data.reactionTime || null,
        decisionMaking: data.decisionMaking || null,
        spatialAwareness: data.spatialAwareness || null,
        mentalToughness: data.mentalToughness || null,
        focus: data.focus || null,
        composure: data.composure || null,
        testLocation: data.testLocation || null,
        testType: data.testType || 'individual',
        notes: data.notes || null,
        verified: true
      })
      .returning();

    return NextResponse.json({
      success: true,
      score: newScore,
      message: 'GAR score created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create GAR score', details: (error as Error).message },
      { status: 500 }
    );
  }
}
