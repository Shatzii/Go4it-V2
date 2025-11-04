/**
 * POST /api/event/results/upload
 * 
 * Purpose: Bulk upload GAR test results from combine/showcase
 * Normalizes: Multiple metrics per session into starpath_gar_metrics table
 * Auth: Clerk required (staff role)
 * 
 * Payload Example:
 * {
 *   "sessionId": "session-uuid",
 *   "duration": 45,
 *   "metrics": [
 *     { "metric": "speed_40yd", "value": 4.85, "units": "s" },
 *     { "metric": "vertical", "value": 28, "units": "in", "percentile": 82 },
 *     { "metric": "pro_agility", "value": 4.32, "units": "s" }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  starpathGARSessions,
  starpathGARMetrics,
  starpathAuditLog 
} from "@/lib/db/schema-starpath-v2";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { captureServer } from "@/lib/analytics/posthog.server";

const MetricSchema = z.object({
  metric: z.enum([
    "speed_40yd",
    "speed_10yd",
    "pro_agility",
    "vertical",
    "broad",
    "strength_iso",
    "mobility_fms",
  ]),
  value: z.number(),
  units: z.string().optional(),
  percentile: z.number().min(0).max(100).optional(),
});

const UploadSchema = z.object({
  sessionId: z.string().uuid(),
  duration: z.number().int().min(0), // minutes
  metrics: z.array(MetricSchema).min(1),
  verifiedBy: z.string().optional(), // Staff ID who verified
});

export async function POST(req: NextRequest) {
  try {
    const { userId: staffId } = await auth();

    if (!staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, duration, metrics, verifiedBy } = UploadSchema.parse(body);

    // Verify session exists
    const [session] = await db
      .select()
      .from(starpathGARSessions)
      .where(eq(starpathGARSessions.id, sessionId))
      .limit(1);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Update session duration
    await db
      .update(starpathGARSessions)
      .set({ duration })
      .where(eq(starpathGARSessions.id, sessionId));

    // Bulk insert metrics
    const metricRows = metrics.map((m) => ({
      id: crypto.randomUUID(),
      sessionId,
      metric: m.metric,
      value: m.value,
      units: m.units || null,
      percentile: m.percentile || null,
      verified: !!verifiedBy,
      verifiedBy: verifiedBy || null,
      verifiedAt: verifiedBy ? new Date() : null,
    }));

    await db.insert(starpathGARMetrics).values(metricRows);

    // Audit log
    await db.insert(starpathAuditLog).values({
      id: crypto.randomUUID(),
      actorUserId: staffId,
      action: "gar_batch_uploaded",
      subjectType: "gar_session",
      subjectId: sessionId,
      detailsJson: {
        metricsCount: metrics.length,
        duration,
        verified: !!verifiedBy,
      },
      source: "event_kiosk",
    });

    // PostHog server event
    await captureServer("svr_gar_batch_uploaded", {
      distinct_id: session.studentId,
      sessionId,
      staffId,
      metricsCount: metrics.length,
      duration,
      verified: !!verifiedBy,
      source: "server",
    });

    return NextResponse.json({
      success: true,
      sessionId,
      metricsUploaded: metrics.length,
      message: "Results uploaded successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[Results Upload Error]:", error);
    return NextResponse.json(
      { error: "Failed to upload results" },
      { status: 500 }
    );
  }
}
