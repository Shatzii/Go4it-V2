/**
 * GET /api/event/summary?eventId=CO-2025-11-16
 * 
 * Purpose: Event operations dashboard (staff view)
 * Returns: Attendance, revenue, audit attach rate, top performers
 * Auth: Clerk required (staff/admin role)
 * 
 * Use Case: Real-time event monitoring, post-event reporting
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  starpathEvents,
  starpathEventRegistrations,
  starpathGARSessions,
  starpathGARMetrics 
} from "@/lib/db/schema-starpath-v2";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const QuerySchema = z.object({
  eventId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const { eventId } = QuerySchema.parse({
      eventId: searchParams.get("eventId"),
    });

    // Get event details
    const [event] = await db
      .select()
      .from(starpathEvents)
      .where(eq(starpathEvents.id, eventId))
      .limit(1);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Registration stats
    const registrations = await db
      .select({
        total: sql<number>`count(*)`,
        checkedIn: sql<number>`count(*) filter (where status = 'checked_in')`,
        noShow: sql<number>`count(*) filter (where status = 'no_show')`,
        proPack: sql<number>`count(*) filter (where pro_pack = true)`,
        auditAddon: sql<number>`count(*) filter (where audit_addon = true)`,
        totalRevenue: sql<number>`sum(amount_paid)`,
      })
      .from(starpathEventRegistrations)
      .where(eq(starpathEventRegistrations.eventId, eventId));

    const stats = registrations[0] || {
      total: 0,
      checkedIn: 0,
      noShow: 0,
      proPack: 0,
      auditAddon: 0,
      totalRevenue: 0,
    };

    // GAR sessions completed
    const sessionsCompleted = await db
      .select({ count: sql<number>`count(distinct ${starpathGARSessions.id})` })
      .from(starpathGARSessions)
      .innerJoin(
        starpathEventRegistrations,
        and(
          eq(starpathGARSessions.studentId, starpathEventRegistrations.userId),
          eq(starpathEventRegistrations.eventId, eventId)
        )
      )
      .where(sql`${starpathGARSessions.duration} > 0`);

    // Top 5 performers (by vertical jump)
    const topPerformers = await db
      .select({
        userId: starpathEventRegistrations.userId,
        metric: starpathGARMetrics.metric,
        value: starpathGARMetrics.value,
        units: starpathGARMetrics.units,
      })
      .from(starpathGARMetrics)
      .innerJoin(
        starpathGARSessions,
        eq(starpathGARMetrics.sessionId, starpathGARSessions.id)
      )
      .innerJoin(
        starpathEventRegistrations,
        and(
          eq(starpathGARSessions.studentId, starpathEventRegistrations.userId),
          eq(starpathEventRegistrations.eventId, eventId)
        )
      )
      .where(eq(starpathGARMetrics.metric, "vertical"))
      .orderBy(sql`${starpathGARMetrics.value} DESC`)
      .limit(5);

    // Calculate attach rates
    const auditAttachRate =
      stats.total > 0 ? (stats.auditAddon / stats.total) * 100 : 0;
    const proPackAttachRate =
      stats.total > 0 ? (stats.proPack / stats.total) * 100 : 0;

    return NextResponse.json({
      event: {
        id: event.id,
        slug: event.slug,
        name: event.name,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        status: event.status,
        capacity: event.capacity,
      },
      stats: {
        totalRegistrations: stats.total,
        checkedIn: stats.checkedIn,
        noShow: stats.noShow,
        sessionsCompleted: sessionsCompleted[0]?.count || 0,
        completionRate:
          stats.checkedIn > 0
            ? ((sessionsCompleted[0]?.count || 0) / stats.checkedIn) * 100
            : 0,
      },
      revenue: {
        total: stats.totalRevenue || 0,
        proPack: stats.proPack,
        auditAddon: stats.auditAddon,
        auditAttachRate: Math.round(auditAttachRate * 10) / 10,
        proPackAttachRate: Math.round(proPackAttachRate * 10) / 10,
      },
      topPerformers,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[Event Summary Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch event summary" },
      { status: 500 }
    );
  }
}
