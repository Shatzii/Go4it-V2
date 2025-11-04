/**
 * GET /api/starpath/summary?studentId=xxx
 * 
 * Enhanced with:
 * - ETag caching (304 responses)
 * - Next Best Actions (NBA) recommendations
 * - Event context for personalized upsell
 * - Cache-Control headers
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  starpathStudentProfiles,
  starpathNCAEvaluations,
  starpathGARSessions,
} from "@/lib/db/schema-starpath";
import { starpathGARMetrics, starpathEventRegistrations } from "@/lib/db/schema-starpath-v2";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";

const QuerySchema = z.object({
  studentId: z.string().min(1),
  eventId: z.string().optional(), // For event-specific context
});

interface NextBestAction {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  cta: string;
  ctaUrl: string;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const { studentId, eventId } = QuerySchema.parse({
      studentId: searchParams.get("studentId"),
      eventId: searchParams.get("eventId"),
    });

    // Authorization: user can only access their own data
    if (userId !== studentId) {
      // TODO: Add role-based access for parents/coaches
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch student profile
    const [profile] = await db
      .select()
      .from(starpathStudentProfiles)
      .where(eq(starpathStudentProfiles.userId, studentId))
      .limit(1);

    // Fetch latest NCAA evaluation
    const [ncaaEval] = await db
      .select()
      .from(starpathNCAEvaluations)
      .where(eq(starpathNCAEvaluations.studentId, studentId))
      .orderBy(desc(starpathNCAEvaluations.createdAt))
      .limit(1);

        // Get latest GAR sessions (last 5)
    const garSessions = await db
      .select()
      .from(starpathGARSessions)
      .where(eq(starpathGARSessions.userId, studentId))
      .orderBy(desc(starpathGARSessions.startTime))
      .limit(5);

    // Fetch GAR metrics for latest session
    let garMetrics: any[] = [];
    if (latestSession) {
      garMetrics = await db
        .select()
        .from(starpathGARMetrics)
        .where(eq(starpathGARMetrics.sessionId, latestSession.id));
    }

    // Calculate GAR score (weighted average)
    const garScore = garMetrics.length > 0
      ? Math.round(
          garMetrics.reduce((sum, m) => sum + (m.percentile || 50), 0) /
            garMetrics.length
        )
      : null;

    // Event context (if from combine QR)
    let eventContext = null;
    if (eventId) {
      const [registration] = await db
        .select()
        .from(starpathEventRegistrations)
        .where(
          sql`${starpathEventRegistrations.eventId} = ${eventId} AND ${starpathEventRegistrations.userId} = ${studentId}`
        )
        .limit(1);

      if (registration) {
        eventContext = {
          eventId,
          registrationId: registration.id,
          checkedIn: !!registration.checkinAt,
          proPack: registration.proPack,
          auditAddon: registration.auditAddon,
        };
      }
    }

    // Generate Next Best Actions
    const nba: NextBestAction[] = [];

    if (!ncaaEval || ncaaEval.status !== "ready") {
      nba.push({
        id: "book-audit",
        priority: "high",
        title: "Get NCAA Eligibility Report",
        description: "Know exactly where you stand with Division I & II requirements",
        cta: "Book $299 Audit",
        ctaUrl: "/audit/book",
      });
    } else {
      const summary = ncaaEval.summary as any;
      if (summary.missing && summary.missing.length > 0) {
        const firstGap = summary.missing[0];
        nba.push({
          id: "complete-missing-credits",
          priority: "high",
          title: `Complete ${firstGap.bucket} Credits`,
          description: `You need ${firstGap.creditsNeeded} more ${firstGap.bucket} credit(s) for NCAA eligibility`,
          cta: "Auto-Plan Courses",
          ctaUrl: `/academy/plan?target=${firstGap.bucket}`,
        });
      }
    }

    if (!garScore || garScore < 70) {
      nba.push({
        id: "improve-gar",
        priority: "medium",
        title: "Boost Athletic Readiness",
        description: "Target 80+ GAR score to maximize recruiting visibility",
        cta: "View Training Plan",
        ctaUrl: "/gar/training",
      });
    }

    if (eventContext && !eventContext.auditAddon) {
      nba.push({
        id: "add-audit-addon",
        priority: "medium",
        title: "Add NCAA Audit to Event",
        description: "Get your eligibility report at the combine for just $299",
        cta: "Add Audit",
        ctaUrl: `/event/${eventId}/upgrade`,
      });
    }

    // Build summary payload
    const summary = {
      schemaVersion: "1.0",
      studentId,
      fullTimeStudent: profile?.fullTimeStudent || false,
      ncaa: ncaaEval
        ? {
            status: ncaaEval.status,
            coreGPA: (ncaaEval.summary as any).coreGPA,
            coreUnits: (ncaaEval.summary as any).coreUnits,
            buckets: (ncaaEval.summary as any).buckets,
            missing: (ncaaEval.summary as any).missing || [],
            lastUpdated: ncaaEval.updatedAt,
          }
        : null,
      gar: latestSession
        ? {
            garScore,
            lastTestAt: latestSession.startTime,
            metrics: garMetrics.map((m) => ({
              metric: m.metric,
              value: m.value,
              units: m.units,
              percentile: m.percentile,
            })),
            readiness: garScore,
            trainingLoad: 65, // TODO: Calculate from recent sessions
          }
        : null,
      nba,
      eventContext,
      timestamp: new Date().toISOString(),
    };

    // Generate ETag
    const etag = `"sp-${studentId}-${summary.timestamp}"`;
    const incomingEtag = req.headers.get("if-none-match");

    if (incomingEtag === etag) {
      return new Response(null, {
        status: 304,
        headers: { ETag: etag },
      });
    }

    return NextResponse.json(summary, {
      headers: {
        "Cache-Control": "private, max-age=60",
        ETag: etag,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[StarPath Summary Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch StarPath summary" },
      { status: 500 }
    );
  }
}
