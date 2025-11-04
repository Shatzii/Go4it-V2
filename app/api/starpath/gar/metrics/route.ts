/**
 * GET /api/starpath/gar/metrics
 * Retrieve GAR metrics and trends for StarPath dashboard
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { garSessions, garMetricsSnapshots, studentProfiles } from "@/lib/db/schema-starpath";
import { eq, and, gte, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "weekly"; // daily, weekly, monthly

    // Get student profile
    const profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId),
    });

    // Get recent sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = await db
      .select()
      .from(garSessions)
      .where(
        and(
          eq(garSessions.userId, userId),
          gte(garSessions.startTime, thirtyDaysAgo)
        )
      )
      .orderBy(desc(garSessions.startTime))
      .limit(50);

    // Get latest snapshot for the requested period
    const latestSnapshot = await db.query.garMetricsSnapshots.findFirst({
      where: and(
        eq(garMetricsSnapshots.userId, userId),
        eq(garMetricsSnapshots.period, period)
      ),
      orderBy: desc(garMetricsSnapshots.startDate),
    });

    // Calculate current metrics
    const completedSessions = recentSessions.filter((s) => s.endTime);
    const avgGarScore =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.garScore || 0), 0) /
          completedSessions.length
        : 0;

    const avgReadiness =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.readinessScore || 0), 0) /
          completedSessions.length
        : 0;

    const avgTrainingLoad =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.trainingLoad || 0), 0) /
          completedSessions.length
        : 0;

    // Calculate trend
    const last7Sessions = completedSessions.slice(0, 7);
    const prev7Sessions = completedSessions.slice(7, 14);
    
    const recentAvg =
      last7Sessions.length > 0
        ? last7Sessions.reduce((sum, s) => sum + (s.garScore || 0), 0) /
          last7Sessions.length
        : 0;
    
    const previousAvg =
      prev7Sessions.length > 0
        ? prev7Sessions.reduce((sum, s) => sum + (s.garScore || 0), 0) /
          prev7Sessions.length
        : 0;

    let trend = "stable";
    if (recentAvg > previousAvg + 2) trend = "improving";
    if (recentAvg < previousAvg - 2) trend = "declining";

    // Find peak session
    const peakSession = completedSessions.reduce(
      (peak, session) =>
        (session.garScore || 0) > (peak.garScore || 0) ? session : peak,
      completedSessions[0]
    );

    return NextResponse.json({
      success: true,
      profile: {
        baselineGarScore: profile?.baselineGarScore,
        currentGarScore: profile?.currentGarScore,
        garTrend: profile?.garTrend,
        totalXp: profile?.totalXp,
      },
      current: {
        avgGarScore: Math.round(avgGarScore * 10) / 10,
        avgReadiness: Math.round(avgReadiness * 10) / 10,
        avgTrainingLoad: Math.round(avgTrainingLoad * 10) / 10,
        totalSessions: completedSessions.length,
        totalMinutes: completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        trend,
      },
      peak: peakSession
        ? {
            garScore: peakSession.garScore,
            date: peakSession.startTime,
            sessionType: peakSession.sessionType,
          }
        : null,
      recentSessions: recentSessions.slice(0, 10).map((s) => ({
        id: s.id,
        startTime: s.startTime,
        duration: s.duration,
        garScore: s.garScore,
        sessionType: s.sessionType,
        readinessScore: s.readinessScore,
        trainingLoad: s.trainingLoad,
        deltaFromBaseline: s.deltaFromBaseline,
      })),
      snapshot: latestSnapshot || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GAR metrics" },
      { status: 500 }
    );
  }
}
