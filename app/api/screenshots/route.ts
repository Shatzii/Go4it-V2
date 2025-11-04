import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      url,
      feature = 'gar-analysis',
      athleteId,
      viewport = { width: 1080, height: 1920 }, // Instagram story size
      format = 'png',
      quality = 90,
    } = body;

    if (!url && !feature) {
      return NextResponse.json(
        { success: false, error: 'URL or feature required' },
        { status: 400 }
      );
    }

    // Determine target URL based on feature
    const targetUrl = url || getFeatureUrl(feature, athleteId);

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set viewport for social media dimensions
    await page.setViewport(viewport);

    // Navigate to page
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for content to load
    await page.waitForSelector('body', { timeout: 10000 });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: format,
      quality: format === 'jpeg' ? quality : undefined,
      fullPage: false,
    });

    await browser.close();

    // Convert to base64
    const base64Screenshot = screenshot.toString('base64');
    const dataUrl = `data:image/${format};base64,${base64Screenshot}`;

    return NextResponse.json({
      success: true,
      data: {
        screenshot: dataUrl,
        url: targetUrl,
        viewport,
        format,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to generate screenshot',
      },
      { status: 500 }
    );
  }
}

function getFeatureUrl(feature: string, athleteId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  switch (feature) {
    case 'gar-analysis':
      return `${baseUrl}/video-analysis${athleteId ? `?athlete=${athleteId}` : ''}`;
    case 'starpath':
      return `${baseUrl}/starpath${athleteId ? `?user=${athleteId}` : ''}`;
    case 'recruiting-hub':
      return `${baseUrl}/recruiting-hub${athleteId ? `?athlete=${athleteId}` : ''}`;
    case 'college-search':
      return `${baseUrl}/college-explorer`;
    case 'highlight-reel':
      return `${baseUrl}/highlight-reel${athleteId ? `?athlete=${athleteId}` : ''}`;
    case 'leaderboard':
      return `${baseUrl}/leaderboard`;
    default:
      return `${baseUrl}/${feature}`;
  }
}

// GET endpoint for quick screenshot preview
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature') || 'gar-analysis';
    const athleteId = searchParams.get('athleteId');

    const url = getFeatureUrl(feature, athleteId || undefined);

    return NextResponse.json({
      success: true,
      data: {
        url,
        supportedFeatures: [
          'gar-analysis',
          'starpath',
          'recruiting-hub',
          'college-search',
          'highlight-reel',
          'leaderboard',
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
