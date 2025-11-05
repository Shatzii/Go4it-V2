import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/transcript-audits
 * 
 * Creates a new transcript audit record and updates:
 * - Athlete ARI score
 * - NCAA eligibility status
 * - Triggers followup automation
 * 
 * Body: {
 *   athleteId: string,
 *   coreGpa: number,
 *   coreCoursesCompleted: number,
 *   coreCoursesRequired: number,
 *   subjectGaps?: object,
 *   internationalInfo?: object,
 *   notes?: string
 * }
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      athleteId,
      coreGpa,
      coreCoursesCompleted,
      coreCoursesRequired,
      subjectGaps,
      internationalInfo,
      notes,
    } = body;

    // Validate required fields
    if (!athleteId || coreGpa === undefined || !coreCoursesCompleted || !coreCoursesRequired) {
      return NextResponse.json(
        {
          success: false,
          error: 'athleteId, coreGpa, coreCoursesCompleted, and coreCoursesRequired are required',
        },
        { status: 400 }
      );
    }

    // Calculate Academic Rigor Index (ARI)
    const ari = calculateARI({
      coreGpa,
      coreCoursesCompleted,
      coreCoursesRequired,
      subjectGaps,
    });

    // Determine NCAA risk level
    const ncaaRiskLevel = determineNCAARiskLevel(ari, coreCoursesCompleted, coreCoursesRequired);

    // TODO: Replace with actual database operations
    const mockAuditRecord = {
      id: `audit-${Date.now()}`,
      athleteId,
      coreGpa,
      coreCoursesCompleted,
      coreCoursesRequired,
      academicRigorScore: Math.floor((ari / 100) * 150), // Raw score before normalization
      ari,
      ncaaRiskLevel,
      subjectGapsJson: subjectGaps ? JSON.stringify(subjectGaps) : null,
      internationalInfoJson: internationalInfo ? JSON.stringify(internationalInfo) : null,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    };

    // Mock NCAA status update
    const mockNcaaStatus = {
      coreCreditsCompleted: coreCoursesCompleted,
      coreCreditsRequired: coreCoursesRequired,
      eligibilityStatus: ncaaRiskLevel === 'low' ? 'on-track' : ncaaRiskLevel === 'medium' ? 'at-risk' : 'needs-review',
    };

    return NextResponse.json({
      success: true,
      data: {
        audit: mockAuditRecord,
        ncaaStatus: mockNcaaStatus,
        message: 'Database not connected - audit calculated but not saved',
        nextSteps: [
          'Connect database to save audit records',
          'Trigger StarPath followup automation',
          'Send parent notification email/SMS',
        ],
      },
    });

    /* PRODUCTION CODE - Uncomment when database is ready:
    
    const { db } = await import('@/lib/db');
    const { athletes, transcriptAudits, ncaaTrackerStatus } = await import('@/drizzle/schema/starpath');
    const { eq } = await import('drizzle-orm');

    // 1. Create audit record
    const [newAudit] = await db
      .insert(transcriptAudits)
      .values({
        athleteId,
        coreGpa,
        coreCoursesCompleted,
        coreCoursesRequired,
        academicRigorScore: Math.floor((ari / 100) * 150),
        ari,
        ncaaRiskLevel,
        subjectGapsJson: subjectGaps ? JSON.stringify(subjectGaps) : null,
        internationalInfoJson: internationalInfo ? JSON.stringify(internationalInfo) : null,
        notes,
      })
      .returning();

    // 2. Update athlete ARI and NCAA status
    const ncaaStatus = ncaaRiskLevel === 'low' ? 'on-track' : 
                       ncaaRiskLevel === 'medium' ? 'at-risk' : 'needs-review';
    
    await db
      .update(athletes)
      .set({
        ari,
        coreGpa,
        ncaaStatus,
        updatedAt: new Date(),
      })
      .where(eq(athletes.id, athleteId));

    // 3. Update NCAA tracker
    const eligibilityStatus = determineEligibilityStatus(coreCoursesCompleted, coreCoursesRequired);
    
    await db
      .insert(ncaaTrackerStatus)
      .values({
        athleteId,
        coreCreditsCompleted: coreCoursesCompleted,
        coreCreditsRequired: coreCoursesRequired,
        eligibilityStatus,
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: ncaaTrackerStatus.athleteId,
        set: {
          coreCreditsCompleted: coreCoursesCompleted,
          coreCreditsRequired: coreCoursesRequired,
          eligibilityStatus,
          lastUpdated: new Date(),
        },
      });

    // 4. Trigger followup automation
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/automation/starpath-followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId,
          triggerType: 'audit-complete',
          recipientType: 'both',
          deliveryMethod: 'email',
        }),
      });
    } catch (error) {
      console.error('Failed to trigger followup automation:', error);
      // Don't fail the audit save if automation fails
    }

    return NextResponse.json({
      success: true,
      data: {
        audit: newAudit,
        ari,
        ncaaRiskLevel,
        ncaaStatus,
        eligibilityStatus,
      },
      message: 'Transcript audit completed successfully',
    });
    */

  } catch (error) {
    console.error('Transcript audit error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete audit',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/transcript-audits?athleteId=xxx
 * 
 * Retrieves audit history for an athlete
 */
export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const athleteId = searchParams.get('athleteId');

    if (!athleteId) {
      return NextResponse.json(
        { success: false, error: 'athleteId is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database query
    const mockAudits = [
      {
        id: 'audit-1',
        athleteId,
        coreGpa: 3.75,
        coreCoursesCompleted: 12,
        coreCoursesRequired: 16,
        ari: 85,
        ncaaRiskLevel: 'low',
        createdAt: '2025-10-15T10:00:00Z',
      },
      {
        id: 'audit-2',
        athleteId,
        coreGpa: 3.65,
        coreCoursesCompleted: 10,
        coreCoursesRequired: 16,
        ari: 78,
        ncaaRiskLevel: 'low',
        createdAt: '2025-06-01T10:00:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockAudits,
      message: 'Database not connected - returning mock audits',
    });

    /* PRODUCTION CODE - Uncomment when database is ready:
    
    const { db } = await import('@/lib/db');
    const { transcriptAudits } = await import('@/drizzle/schema/starpath');
    const { eq, desc } = await import('drizzle-orm');

    const audits = await db
      .select()
      .from(transcriptAudits)
      .where(eq(transcriptAudits.athleteId, athleteId))
      .orderBy(desc(transcriptAudits.createdAt));

    return NextResponse.json({
      success: true,
      data: audits,
    });
    */

  } catch (error) {
    console.error('Get audits error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch audits',
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate Academic Rigor Index (ARI)
function calculateARI(data: {
  coreGpa: number;
  coreCoursesCompleted: number;
  coreCoursesRequired: number;
  subjectGaps?: any;
}): number {
  const { coreGpa, coreCoursesCompleted, coreCoursesRequired, subjectGaps } = data;

  // GPA component (40% weight) - normalized to 0-40
  const gpaScore = (coreGpa / 4.0) * 40;

  // Course completion component (40% weight) - normalized to 0-40
  const completionRate = coreCoursesCompleted / coreCoursesRequired;
  const completionScore = Math.min(completionRate, 1.0) * 40;

  // Subject gap penalty (20% weight) - deduct points for gaps
  let gapPenalty = 0;
  if (subjectGaps) {
    const totalGaps = Object.values(subjectGaps).flat().length;
    gapPenalty = Math.min(totalGaps * 2, 20); // Max 20 point penalty
  }

  // Calculate final ARI (0-100 scale)
  const ari = Math.round(gpaScore + completionScore + (20 - gapPenalty));

  return Math.max(0, Math.min(100, ari)); // Clamp to 0-100
}

// Helper function to determine NCAA risk level
function determineNCAARiskLevel(
  ari: number,
  completed: number,
  required: number
): 'low' | 'medium' | 'high' {
  const completionRate = completed / required;

  if (ari >= 80 && completionRate >= 0.75) return 'low';
  if (ari >= 65 && completionRate >= 0.50) return 'medium';
  return 'high';
}

// Helper function to determine eligibility status
function determineEligibilityStatus(completed: number, required: number): string {
  const completionRate = completed / required;

  if (completionRate >= 1.0) return 'eligible';
  if (completionRate >= 0.75) return 'on-track';
  if (completionRate >= 0.50) return 'at-risk';
  return 'ineligible';
}
