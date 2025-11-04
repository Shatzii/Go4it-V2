import { NextRequest, NextResponse } from "next/server";
export const runtime = 'edge';
import { db } from "@/lib/db";
import { parentNightEvents } from "@/lib/db/schema/funnel";
import { eq } from "drizzle-orm";
import { BRAND } from "@/content/brand";

/**
 * GET /api/ics/[id]
 * Generate ICS calendar file for an event
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Fetch event
    const results = await db
      .select()
      .from(parentNightEvents)
      .where(eq(parentNightEvents.id, eventId))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const event = results[0];

    // Generate ICS content
    const summary = getSummary(event.kind);
    const description = getDescription(event.kind, event.joinUrl);
    
    // Format dates for ICS (YYYYMMDDTHHMMSSZ)
    const formatIcsDate = (isoString: string) => {
      return isoString.replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startDt = formatIcsDate(event.startIso);
    const endDt = formatIcsDate(event.endIso);
    const now = formatIcsDate(new Date().toISOString());

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Go4it Sports Academy//Parent Night//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:event-${event.id}@go4itsports.org`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDt}`,
      `DTEND:${endDt}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${event.joinUrl}`,
      `ORGANIZER;CN=${BRAND.name}:mailto:${BRAND.email}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-PT30M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: 30 minutes until Parent Night",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="go4it-${event.kind}-${event.region}.ics"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate ICS file" },
      { status: 500 }
    );
  }
}

function getSummary(kind: string): string {
  switch (kind) {
    case "parent_night_info":
      return "Go4it Parent Night: Info & Discovery";
    case "parent_night_decision":
      return "Go4it Parent Night: Confirmation & Decision";
    case "onboarding":
      return "Go4it New Family Onboarding";
    default:
      return "Go4it Parent Night";
  }
}

function getDescription(kind: string, joinUrl: string): string {
  let desc = "";
  
  switch (kind) {
    case "parent_night_info":
      desc = "Join us to learn about Go4it's unique approach to combining American academics, NCAA eligibility support, and elite sports training. We'll cover our academic program, athlete development system, and training hub locations in Denver, Vienna, Dallas, and Mérida.\\n\\n";
      break;
    case "parent_night_decision":
      desc = "Ready to move forward? This session is for families who want to discuss enrollment options, review specific questions, and learn about our 48-Hour Credit Audit process.\\n\\n";
      break;
    case "onboarding":
      desc = "Welcome to Go4it! We'll help you get started with Study Hall timer, class tracker connection, and your NCAA checklist.\\n\\n";
      break;
  }

  desc += `Join Meeting: ${joinUrl}\\n\\n`;
  desc += `Questions? Contact ${BRAND.email} or call ${BRAND.phoneDisplay}\\n\\n`;
  desc += `${BRAND.compliance.guardrail}`;

  return desc;
}
