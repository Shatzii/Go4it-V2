/**
 * POST /api/screenshot
 * Generate marketing screenshots via Puppeteer
 * Auth: Optional (use SCREENSHOT_SECRET for n8n automation)
 * 
 * Use Case: Auto-generate social preview images for blog posts, landing pages
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Screenshot API (stub)
 * Puppeteer has been removed from the build to avoid large binary dependencies
 * and to keep the Next.js build small/stable. If you need screenshoting in
 * production, enable an external screenshot service or re-install Puppeteer
 * and ensure platform Chrome dependencies are available.
 */
export async function POST(req: NextRequest) {
  // Auth check (same logic as previous implementation)
  try {
    const { userId } = await auth();
    const authHeader = req.headers.get("authorization");
    const screenshotSecret = process.env.SCREENSHOT_SECRET;

    const isAuthorized =
      userId ||
      (screenshotSecret && authHeader === `Bearer ${screenshotSecret}`);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Screenshot service disabled: puppeteer not installed. Enable an external screenshot service or re-add puppeteer.",
      },
      { status: 503 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || err }, { status: 500 });
  }
}
