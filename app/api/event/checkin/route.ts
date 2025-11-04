/**
 * POST /api/event/checkin
 * 
 * Purpose: Check in athlete at combine/showcase (kiosk or staff-initiated)
 * Creates: GAR session shell for results upload
 * Auth: Clerk required (staff role)
 * 
 * Event Flow:
 * 1. Staff scans QR or searches athlete name
 * 2. POST /api/event/checkin → creates session shell
 * 3. Athlete completes testing
 * 4. POST /api/event/results/upload → bulk inserts metrics
 * 5. Dashboard auto-updates via StarPath summary
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  starpathEventRegistrations, 
  starpathGARSessions,
  starpathAuditLog
} from "@/lib/db/schema-starpath-v2";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { captureServer } from "@/lib/analytics/posthog.server";

const CheckinSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1).optional(), // Staff can check in on behalf of athlete
  wave: z.enum(["AM", "PM"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId: staffId } = await auth();

    if (!staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, userId: athleteId, wave } = CheckinSchema.parse(body);

    const targetUserId = athleteId || staffId; // Kiosk mode or self-checkin

    // Find or create registration
    const [registration] = await db
      .select()
      .from(starpathEventRegistrations)
      .where(
        and(
          eq(starpathEventRegistrations.eventId, eventId),
          eq(starpathEventRegistrations.userId, targetUserId)
        )
      )
      .limit(1);

    let regId = registration?.id;

    if (!registration) {
      // Create registration on-the-fly (walk-ins)
      const newReg = {
        id: crypto.randomUUID(),
        eventId,
        userId: targetUserId,
        wave: wave || null,
        status: "checked_in" as const,
        checkinAt: new Date(),
        proPack: false,
        auditAddon: false,
      };

      await db.insert(starpathEventRegistrations).values(newReg);
      regId = newReg.id;
    } else if (registration.status !== "checked_in") {
      // Update existing registration
      await db
        .update(starpathEventRegistrations)
        .set({
          status: "checked_in",
          checkinAt: new Date(),
          wave: wave || registration.wave,
          updatedAt: new Date(),
        })
        .where(eq(starpathEventRegistrations.id, registration.id));
    }

    // Create GAR session shell (results uploaded separately)
    const sessionId = crypto.randomUUID();
    await db.insert(starpathGARSessions).values({
      id: sessionId,
      userId: targetUserId,
      sport: "multi-sport",
      sessionType: "testing",
      startTime: new Date(),
      tags: ["event", eventId],
    });

    // Audit log
    await db.insert(starpathAuditLog).values({
      id: crypto.randomUUID(),
      actorUserId: staffId,
      action: "event_checkin",
      subjectType: "event_registration",
      subjectId: regId,
      detailsJson: { eventId, athleteId: targetUserId, wave, sessionId },
      source: "event_kiosk",
    });

    // PostHog server event
    await captureServer("svr_event_checked_in", {
      distinctId: targetUserId,
      eventId,
      staffId,
      wave,
      sessionId,
    });

    return NextResponse.json({
      success: true,
      sessionId,
      registrationId: regId,
      message: "Athlete checked in successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[Event Checkin Error]:", error);
    return NextResponse.json(
      { error: "Failed to check in athlete" },
      { status: 500 }
    );
  }
}
