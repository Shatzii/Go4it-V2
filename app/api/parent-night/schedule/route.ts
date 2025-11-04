import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parentNightEvents as events } from "@/lib/db/schema/funnel";
import { sql } from "drizzle-orm";

/**
 * Compute next occurrence of a weekday at specific time in given timezone
 */
function getNextOccurrence(
  dayOfWeek: number, // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
  hour: number,
  minute: number,
  tz: string
): Date {
  const now = new Date();
  const result = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  
  // Find next occurrence of target day
  const currentDay = result.getDay();
  let daysUntilTarget = dayOfWeek - currentDay;
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7;
  }
  
  result.setDate(result.getDate() + daysUntilTarget);
  result.setHours(hour, minute, 0, 0);
  
  return result;
}

/**
 * POST /api/parent-night/schedule
 * Create next week's event occurrences
 * 
 * Called by: Vercel cron (Sundays) or n8n workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Define event schedule
    const schedule = [
      // Tuesday Info Sessions (7 PM local)
      {
        kind: "parent_night_info" as const,
        region: "eu" as const,
        tz: "Europe/Vienna",
        dayOfWeek: 2, // Tuesday
        hour: 19,
        minute: 0,
        joinUrl: process.env.PN_EU_URL || "https://meet.go4itsports.org/parent-night-eu",
      },
      {
        kind: "parent_night_info" as const,
        region: "us" as const,
        tz: "America/Chicago",
        dayOfWeek: 2,
        hour: 19,
        minute: 0,
        joinUrl: process.env.PN_US_URL || "https://meet.go4itsports.org/parent-night-us",
      },
      // Thursday Decision Sessions (7 PM local)
      {
        kind: "parent_night_decision" as const,
        region: "eu" as const,
        tz: "Europe/Vienna",
        dayOfWeek: 4, // Thursday
        hour: 19,
        minute: 0,
        joinUrl: process.env.PN_EU_URL || "https://meet.go4itsports.org/parent-night-eu",
      },
      {
        kind: "parent_night_decision" as const,
        region: "us" as const,
        tz: "America/Chicago",
        dayOfWeek: 4,
        hour: 19,
        minute: 0,
        joinUrl: process.env.PN_US_URL || "https://meet.go4itsports.org/parent-night-us",
      },
      // Monday Onboarding (9 AM local)
      {
        kind: "onboarding" as const,
        region: "eu" as const,
        tz: "Europe/Vienna",
        dayOfWeek: 1, // Monday
        hour: 9,
        minute: 0,
        joinUrl: process.env.ONBOARD_EU_URL || "https://meet.go4itsports.org/onboarding-eu",
      },
      {
        kind: "onboarding" as const,
        region: "us" as const,
        tz: "America/Chicago",
        dayOfWeek: 1,
        hour: 9,
        minute: 0,
        joinUrl: process.env.ONBOARD_US_URL || "https://meet.go4itsports.org/onboarding-us",
      },
    ];

    const created = [];

    for (const eventConfig of schedule) {
      const startDate = getNextOccurrence(
        eventConfig.dayOfWeek,
        eventConfig.hour,
        eventConfig.minute,
        eventConfig.tz
      );
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // 1-hour sessions

      const startIso = startDate.toISOString();
      const endIso = endDate.toISOString();

      // Insert with onConflictDoNothing to avoid duplicates
      try {
        await db.insert(events).values({
          kind: eventConfig.kind,
          region: eventConfig.region,
          tz: eventConfig.tz,
          startIso,
          endIso,
          joinUrl: eventConfig.joinUrl,
        }).onConflictDoNothing();

        created.push({
          kind: eventConfig.kind,
          region: eventConfig.region,
          start: startIso,
        });
      } catch (err) {
        // Already exists or other error - continue
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      events: created,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create events" },
      { status: 500 }
    );
  }
}
