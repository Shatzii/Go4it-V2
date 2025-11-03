import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, rsvps, events } from "@/lib/db/schema/funnel";
import { eq, and, sql } from "drizzle-orm";

/**
 * POST /api/cal/webhook
 * Handle Cal.com booking webhooks
 * 
 * Webhook events: BOOKING_CREATED, BOOKING_RESCHEDULED, BOOKING_CANCELLED
 * 
 * TODO: Verify webhook signature using CAL_WEBHOOK_SECRET
 * See: https://cal.com/docs/core-features/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // TODO: Verify signature
    // const signature = request.headers.get("x-cal-signature");
    // if (!verifySignature(payload, signature)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const { triggerEvent, payload: bookingData } = payload;

    // Only handle booking creation for now
    if (triggerEvent !== "BOOKING_CREATED") {
      return NextResponse.json({ success: true, message: "Event ignored" });
    }

    // Extract booking details
    const {
      eventTypeSlug,
      startTime,
      attendees,
      responses, // Custom form responses
      metadata,
    } = bookingData;

    // Map attendee (assume first attendee is the parent)
    const attendee = attendees?.[0];
    if (!attendee) {
      return NextResponse.json(
        { error: "No attendee found" },
        { status: 400 }
      );
    }

    // Upsert lead
    const leadData = {
      role: "parent" as const,
      firstName: attendee.name?.split(" ")[0] || "Unknown",
      lastName: attendee.name?.split(" ").slice(1).join(" ") || "",
      email: attendee.email,
      phone: responses?.phone || attendee.phoneNumber || null,
      location: responses?.location || metadata?.location || null,
      sport: responses?.sport || metadata?.sport || null,
      gradYear: responses?.gradYear ? parseInt(responses.gradYear) : null,
      stage: "site_visit", // Will be updated below based on event type
      updatedAt: new Date(),
    };

    // Check if lead exists
    const existingLead = await db
      .select()
      .from(leads)
      .where(eq(leads.email, leadData.email))
      .limit(1);

    let leadId: number;

    if (existingLead.length > 0) {
      // Update existing lead
      leadId = existingLead[0].id;
      await db
        .update(leads)
        .set(leadData)
        .where(eq(leads.id, leadId));
    } else {
      // Insert new lead
      const result = await db.insert(leads).values(leadData).returning();
      leadId = result[0].id;
    }

    // Determine event kind and stage from eventTypeSlug or startTime
    let eventKind: "parent_night_info" | "parent_night_decision" | "onboarding" = "parent_night_info";
    let newStage = "rsvp_tuesday";

    if (eventTypeSlug?.includes("decision") || eventTypeSlug?.includes("thursday")) {
      eventKind = "parent_night_decision";
      newStage = "rsvp_thursday";
    } else if (eventTypeSlug?.includes("onboarding") || eventTypeSlug?.includes("monday")) {
      eventKind = "onboarding";
      newStage = "enrolled";
    }

    // Find matching event in our database
    const startIso = new Date(startTime).toISOString();
    const matchingEvent = await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.kind, eventKind),
          sql`${events.startIso} = ${startIso}`
        )
      )
      .limit(1);

    let eventId: number;

    if (matchingEvent.length > 0) {
      eventId = matchingEvent[0].id;
    } else {
      // Create event if it doesn't exist (fallback)
      const endIso = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();
      const region = eventTypeSlug?.includes("eu") ? "eu" : "us";
      const tz = region === "eu" ? "Europe/Vienna" : "America/Chicago";
      
      const newEvent = await db.insert(events).values({
        kind: eventKind,
        region,
        tz,
        startIso,
        endIso,
        joinUrl: metadata?.joinUrl || process.env.PN_US_URL || "",
      }).returning();
      
      eventId = newEvent[0].id;
    }

    // Create RSVP
    await db.insert(rsvps).values({
      leadId,
      eventId,
      status: "registered",
    });

    // Update lead stage
    await db
      .update(leads)
      .set({ stage: newStage, updatedAt: new Date() })
      .where(eq(leads.id, leadId));

    return NextResponse.json({
      success: true,
      leadId,
      eventId,
      stage: newStage,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
