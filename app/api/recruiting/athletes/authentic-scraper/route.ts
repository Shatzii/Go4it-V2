import { NextResponse } from 'next/server';
import RealAthleteScraper from '@/lib/real-scraper';

export async function POST(request: Request) {
  try {
    const {
      sports = ['basketball', 'football', 'track'],
      states = ['CA', 'TX', 'FL', 'NY', 'GA', 'IL'],
      maxResults = 75,
      includeVideo = true,
      includeStats = true,
    } = await request.json();

    console.log('=== STARTING AUTHENTIC ATHLETE DATA SCRAPING ===');
    console.log(`Target sports: ${sports.join(', ')}`);
    console.log(`Target states: ${states.join(', ')}`);
    console.log(`Max results: ${maxResults}`);

    const scraper = new RealAthleteScraper();
    const startTime = Date.now();

    // Scrape authentic athlete data from multiple real sources
    const authenticAthletes = await scraper.scrapeAllSources({
      sports,
      states: states.slice(0, 5), // Limit states to avoid overwhelming requests
      maxResults,
    });

    const scrapingTime = Date.now() - startTime;

    // Group athletes by source for analysis
    const sourceBreakdown = authenticAthletes.reduce(
      (acc, athlete) => {
        acc[athlete.source] = (acc[athlete.source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Calculate average confidence score
    const avgConfidence =
      authenticAthletes.length > 0
        ? authenticAthletes.reduce((sum, a) => sum + a.confidence, 0) / authenticAthletes.length
        : 0;

    console.log('=== SCRAPING RESULTS ===');
    console.log(`Total authentic athletes found: ${authenticAthletes.length}`);
    console.log(`Sources used:`, sourceBreakdown);
    console.log(`Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`Scraping completed in ${scrapingTime}ms`);

    // Sort by confidence score (highest first)
    const sortedAthletes = authenticAthletes.sort((a, b) => b.confidence - a.confidence);

    return NextResponse.json({
      success: true,
      athletes: sortedAthletes,
      metadata: {
        totalFound: sortedAthletes.length,
        scrapingTimeMs: scrapingTime,
        sourceBreakdown,
        averageConfidence: avgConfidence,
        dataAuthenticityLevel:
          avgConfidence > 0.8 ? 'HIGH' : avgConfidence > 0.6 ? 'MEDIUM' : 'LOW',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Authentic scraping error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape authentic athlete data',
        message: error.message,
        athletes: [], // Return empty array instead of mock data
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  // Quick test endpoint
  try {
    const scraper = new RealAthleteScraper();
    const testResults = await scraper.scrapeMaxPreps('basketball');

    return NextResponse.json({
      status: 'Authentic scraper operational',
      testResults: testResults.slice(0, 5),
      totalFound: testResults.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'Scraper error',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
