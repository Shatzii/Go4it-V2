import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Screenshot endpoints disabled.
 * Puppeteer removed to prevent build failures in constrained environments.
 * Re-enable a screenshot provider or re-install puppeteer if you need this API.
 */
export async function POST(request: Request) {
  return NextResponse.json(
    {
      success: false,
      error:
        'Screenshot service disabled: puppeteer not installed. Re-enable a screenshot provider to use this endpoint.',
    },
    { status: 503 }
  );
}

export async function GET(request: Request) {
  try {
    const supportedFeatures = [
      'gar-analysis',
      'starpath',
      'recruiting-hub',
      'college-search',
      'highlight-reel',
      'leaderboard',
    ];
    return NextResponse.json({ success: true, data: { supportedFeatures } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || err }, { status: 500 });
  }
}
