import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { marketingItems } from "@/lib/db/schema/funnel";
import { z } from "zod";

/**
 * Validation schema for marketing items
 */
const marketingItemSchema = z.object({
  weekOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  channel: z.enum(["site", "ig", "li", "x", "tiktok", "email", "sms"]),
  slot: z.enum(["hero_banner", "events_card", "post", "email", "sms"]),
  publishAt: z.string().datetime(), // ISO 8601
  title: z.string().optional(),
  copy: z.string().optional(),
  html: z.string().optional(),
  plainText: z.string().optional(),
  alt: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().url().optional(),
  status: z.enum(["scheduled", "published", "archived"]).default("scheduled"),
});

const bulkSchema = z.array(marketingItemSchema);

/**
 * POST /api/marketing/schedule
 * Ingest content_plan items into marketing schedule
 * 
 * Called by: n8n orchestrator workflow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const items = bulkSchema.parse(body);

    const created = [];
    const skipped = [];

    for (const item of items) {
      try {
        // Insert with onConflictDoNothing to avoid duplicates
        await db.insert(marketingItems).values(item).onConflictDoNothing();
        created.push(item);
      } catch (err) {
        // Already exists or validation error
        skipped.push(item);
      }
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      skipped: skipped.length,
      total: items.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to schedule marketing items" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/marketing/schedule
 * Fetch scheduled marketing items for a given week
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekOf = searchParams.get("weekOf");
    const channel = searchParams.get("channel");

    // TODO: Add where clauses based on params (weekOf, channel filters)
    const results = await db.select().from(marketingItems).limit(100);

    return NextResponse.json({
      success: true,
      items: results,
      count: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch marketing items" },
      { status: 500 }
    );
  }
}
