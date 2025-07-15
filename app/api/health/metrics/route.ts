import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { healthMetrics, recoveryPlans } from '@/shared/enhanced-schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const metrics = await db
      .select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, user.id))
      .orderBy(desc(healthMetrics.lastAssessment))
      .limit(10);

    const activeRecoveryPlans = await db
      .select()
      .from(recoveryPlans)
      .where(eq(recoveryPlans.userId, user.id))
      .where(eq(recoveryPlans.isActive, true));

    return NextResponse.json({
      metrics,
      activeRecoveryPlans,
      currentRisk: metrics[0]?.injuryRisk || 0,
      status: metrics[0]?.recoveryStatus || 'normal'
    });

  } catch (error) {
    console.error('Health metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health metrics' },
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

    const { performanceData, symptoms, workloadData } = await request.json();

    // Calculate injury risk based on multiple factors
    const injuryRisk = calculateInjuryRisk(performanceData, symptoms, workloadData);
    const biomechanicalAnalysis = analyzeBiomechanics(performanceData);
    const recommendations = generateHealthRecommendations(injuryRisk, symptoms);

    const [newMetrics] = await db
      .insert(healthMetrics)
      .values({
        userId: user.id,
        injuryRisk,
        recoveryStatus: determineRecoveryStatus(injuryRisk, symptoms),
        biomechanicalAnalysis,
        recommendedExercises: recommendations.exercises,
        medicalNotes: symptoms ? JSON.stringify(symptoms) : null
      })
      .returning();

    // Create recovery plan if high risk
    if (injuryRisk > 70) {
      await db.insert(recoveryPlans).values({
        userId: user.id,
        planType: 'active_recovery',
        exercises: recommendations.recoveryExercises,
        duration: 7,
        progressTracking: { dailyCheckins: true, painLevel: true }
      });
    }

    return NextResponse.json(newMetrics);

  } catch (error) {
    console.error('Health metrics creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create health metrics' },
      { status: 500 }
    );
  }
}

function calculateInjuryRisk(performance: any, symptoms: any, workload: any): number {
  let risk = 0;

  // Performance decline indicators
  if (performance?.decline > 0.15) risk += 25;
  if (performance?.consistency < 0.7) risk += 15;

  // Symptom indicators
  if (symptoms?.pain > 3) risk += 30;
  if (symptoms?.fatigue > 7) risk += 20;
  if (symptoms?.stiffness) risk += 15;

  // Workload indicators
  if (workload?.intensity > 8.5) risk += 20;
  if (workload?.frequency > 6) risk += 15;
  if (workload?.recovery < 6) risk += 25;

  return Math.min(100, risk);
}

function analyzeBiomechanics(performance: any) {
  return {
    movement_efficiency: performance?.efficiency || 0.8,
    force_distribution: performance?.force || 'balanced',
    range_of_motion: performance?.rom || 'normal',
    asymmetries: performance?.asymmetries || []
  };
}

function generateHealthRecommendations(risk: number, symptoms: any) {
  const exercises = [];
  const recoveryExercises = [];

  if (risk > 50) {
    exercises.push('Dynamic warm-up routine');
    exercises.push('Foam rolling session');
    recoveryExercises.push('Light mobility work');
    recoveryExercises.push('Rest day with gentle stretching');
  }

  if (symptoms?.pain > 2) {
    exercises.push('Pain management techniques');
    recoveryExercises.push('Ice therapy');
  }

  return { exercises, recoveryExercises };
}

function determineRecoveryStatus(risk: number, symptoms: any): string {
  if (risk > 80 || symptoms?.pain > 6) return 'needs_attention';
  if (risk > 50 || symptoms?.fatigue > 7) return 'monitoring';
  return 'normal';
}