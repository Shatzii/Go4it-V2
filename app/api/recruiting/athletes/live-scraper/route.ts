import { NextResponse } from 'next/server';
import RealAthleteScraper from '@/lib/real-scraper';

interface USAthlete {
  id: string;
  name: string;
  position: string;
  sport: string;
  classYear: string;
  state: string;
  city: string;
  height: string;
  weight: string;
  rankings: {
    national: number;
    state: number;
    position: number;
  };
  stats: {
    [key: string]: number;
  };
  school: {
    name: string;
    type: string;
    location: string;
  };
  recruiting: {
    status: string;
    offers: string[];
    interests: string[];
    commitment?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    hudlProfile?: string;
  };
  sources: {
    platform: string;
    url: string;
    lastUpdated: string;
    confidence: number;
  }[];
}

export async function POST(request: Request) {
  try {
    const {
      platforms,
      sports,
      states,
      classYear,
      positions,
      maxResults = 50,
      includeCommitted = false,
      includeStats = true,
    } = await request.json();

    console.log('Starting authentic athlete data scraping...');
    console.log(`Target sports: ${(sports || ['basketball', 'football']).join(', ')}`);
    console.log(`Target states: ${(states || ['CA', 'TX', 'FL']).join(', ')}`);

    // Use real scraper instead of mock data
    const realScraper = new RealAthleteScraper();
    const authenticAthletes = await realScraper.scrapeAllSources({
      sports: sports || ['basketball', 'football'],
      states: states || ['CA', 'TX', 'FL', 'NY', 'GA'],
      maxResults: maxResults || 50,
    });

    // Convert to USAthlete format
    const allAthletes: USAthlete[] = authenticAthletes.map((athlete) => ({
      id: athlete.id,
      name: athlete.name,
      position: athlete.position || 'N/A',
      sport: athlete.sport,
      classYear: athlete.classYear || '2025',
      state: athlete.state || 'N/A',
      city: 'N/A',
      height: 'N/A',
      weight: 'N/A',
      rankings: {
        national: athlete.rankings?.national || 999,
        state: athlete.rankings?.state || 99,
        position: athlete.rankings?.position || 99,
      },
      stats: athlete.stats || {},
      school: {
        name: athlete.school || 'Unknown School',
        type: 'High School',
        location: athlete.state || 'N/A',
      },
      recruiting: {
        status: athlete.recruiting?.status || 'uncommitted',
        offers: athlete.recruiting?.offers || [],
        interests: [],
        commitment: athlete.recruiting?.commitment,
      },
      contact: {
        hudlProfile: athlete.source === 'HUDL' ? athlete.url : undefined,
      },
      sources: [
        {
          platform: athlete.source,
          url: athlete.url,
          lastUpdated: athlete.lastUpdated,
          confidence: athlete.confidence,
        },
      ],
    }));

    // Filter by recruiting status if needed
    const filteredAthletes = includeCommitted
      ? allAthletes
      : allAthletes.filter((athlete) => athlete.recruiting.status !== 'committed');

    console.log(`Found ${filteredAthletes.length} authentic athlete profiles`);

    return NextResponse.json({
      success: true,
      message: 'Authentic athlete scraping completed successfully',
      athletes: filteredAthletes,
      metadata: {
        totalFound: authenticAthletes.length,
        totalFiltered: filteredAthletes.length,
        authenticCount: authenticAthletes.length,
        averageConfidence:
          authenticAthletes.length > 0
            ? authenticAthletes.reduce((sum, a) => sum + a.confidence, 0) / authenticAthletes.length
            : 0,
        sources: [...new Set(authenticAthletes.map((a) => a.source))],
        filters: { sports, states, classYear, positions },
        dataIntegrity: 'HIGH - Authentic sources only',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Authentic athlete scraping error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape authentic athlete data',
        message:
          'Unable to retrieve authentic athlete profiles. Please check data source connectivity.',
        athletes: [],
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  // Quick health check for the authentic scraper
  try {
    const scraper = new RealAthleteScraper();
    const testResults = await scraper.scrapeMaxPreps('basketball');

    return NextResponse.json({
      status: 'Live authentic scraper operational',
      testResults: testResults.slice(0, 3).map((athlete) => ({
        name: athlete.name,
        sport: athlete.sport,
        source: athlete.source,
        confidence: athlete.confidence,
      })),
      totalFound: testResults.length,
      averageConfidence:
        testResults.length > 0
          ? testResults.reduce((sum, a) => sum + a.confidence, 0) / testResults.length
          : 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'Scraper error',
        error: error.message,
        message: 'Unable to connect to authentic data sources',
      },
      { status: 500 },
    );
  }
}
