/**
 * POST /api/screenshot
 * Generate marketing screenshots via Puppeteer
 * Auth: Optional (use SCREENSHOT_SECRET for n8n automation)
 * 
 * Use Case: Auto-generate social preview images for blog posts, landing pages
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Lazy-load Puppeteer to avoid bundling issues
let puppeteer: typeof import("puppeteer") | null = null;

async function getPuppeteer() {
  if (!puppeteer) {
    puppeteer = await import("puppeteer");
  }
  return puppeteer;
}

interface ScreenshotRequest {
  url: string;
  width?: number;
  height?: number;
  fullPage?: boolean;
  selector?: string;
  waitForSelector?: string;
  delay?: number;
}

export async function POST(req: NextRequest) {
  try {
    // Check auth: Clerk session OR shared secret
    const { userId } = await auth();
    const authHeader = req.headers.get("authorization");
    const screenshotSecret = process.env.SCREENSHOT_SECRET;

    const isAuthorized =
      userId ||
      (screenshotSecret && authHeader === `Bearer ${screenshotSecret}`);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ScreenshotRequest = await req.json();
    const {
      url,
      width = 1200,
      height = 630,
      fullPage = false,
      selector,
      waitForSelector,
      delay = 0,
    } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Missing required field: url" },
        { status: 400 }
      );
    }

    // Initialize Puppeteer
    const pptr = await getPuppeteer();
    const browser = await pptr.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width, height });

    // Navigate to URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for specific selector if provided
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { timeout: 10000 });
    }

    // Optional delay for dynamic content
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Take screenshot
    let screenshotBuffer: Buffer;

    if (selector) {
      // Screenshot specific element
      const element = await page.$(selector);
      if (!element) {
        await browser.close();
        return NextResponse.json(
          { error: `Selector not found: ${selector}` },
          { status: 404 }
        );
      }
      screenshotBuffer = (await element.screenshot()) as Buffer;
    } else {
      // Screenshot full page or viewport
      screenshotBuffer = (await page.screenshot({ fullPage })) as Buffer;
    }

    await browser.close();

    // Return image as base64
    const base64Image = screenshotBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      width,
      height,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Screenshot failed", message: error?.message },
      { status: 500 }
    );
  }
}
