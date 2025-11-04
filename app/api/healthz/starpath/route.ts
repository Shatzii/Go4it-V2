/**
 * GET /api/healthz/starpath
 * StarPath-specific health check
 * Validates feature flag, database tables, and integration readiness
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Check feature flag
    const featureEnabled = process.env.NEXT_PUBLIC_FEATURE_STARPATH === "true";

    if (!featureEnabled) {
      return NextResponse.json({
        ok: false,
        status: "disabled",
        message: "StarPath feature is disabled via feature flag",
        timestamp: new Date().toISOString(),
      });
    }

    // Check database connectivity
    await db.execute(sql`SELECT 1`);

    // Verify StarPath tables exist (check one key table)
    const tableCheck = await db.execute(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name='starpath_student_profiles'`
    );

    const hasStarPathTables = tableCheck.rows && tableCheck.rows.length > 0;

    if (!hasStarPathTables) {
      return NextResponse.json(
        {
          ok: false,
          status: "schema_missing",
          message: "StarPath database tables not found. Run migrations.",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      features: {
        starpath: "enabled",
        database: "up",
        schema: "ready",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
