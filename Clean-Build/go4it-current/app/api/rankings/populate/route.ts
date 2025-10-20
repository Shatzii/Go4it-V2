import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { forceRefresh = false } = await request.json();

    console.log('Starting comprehensive athlete ranking population...');

    // Trigger all scrapers simultaneously to populate rankings
    const scrapingPromises = [
      // US Athletes
      fetch('http://localhost:5000/api/recruiting/athletes/live-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['ESPN', 'Sports Reference', 'MaxPreps', 'Rivals', '247Sports'],
          sports: ['Basketball', 'Football', 'Baseball', 'Soccer'],
          states: [
            'CA',
            'TX',
            'FL',
            'NY',
            'GA',
            'IL',
            'PA',
            'OH',
            'NC',
            'MI',
            'VA',
            'WA',
            'AZ',
            'TN',
            'IN',
          ],
          classYear: '2025',
          maxResults: 100,
        }),
      }),

      // European Athletes
      fetch('http://localhost:5000/api/recruiting/athletes/european-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countries: [
            'Germany',
            'UK',
            'France',
            'Spain',
            'Italy',
            'Netherlands',
            'Austria',
            'Sweden',
            'Norway',
            'Denmark',
            'Poland',
            'Serbia',
            'Portugal',
            'Belgium',
            'Czech Republic',
            'Hungary',
            'Croatia',
            'Slovenia',
            'Slovakia',
            'Bulgaria',
            'Romania',
            'Finland',
            'Estonia',
            'Latvia',
            'Luxembourg',
            'Malta',
            'Cyprus',
            'Brazil',
            'Mexico',
          ],
          sports: [
            'Basketball',
            'Football/Soccer',
            'American Football',
            'Track & Field',
            'Volleyball',
            'Baseball',
          ],
          ageRange: '16-19',
          maxResults: 80,
          includeInstagram: true,
          includeTikTok: true,
          includeYouTube: true,
        }),
      }),

      // American Football Athletes
      fetch('http://localhost:5000/api/recruiting/athletes/american-football-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: [
            '1stLookSports',
            'NFL International',
            'European American Football Federation',
          ],
          countries: [
            'USA',
            'Germany',
            'UK',
            'Mexico',
            'Brazil',
            'Canada',
            'Austria',
            'Netherlands',
            'Sweden',
            'Norway',
            'Denmark',
            'Poland',
            'France',
            'Italy',
            'Spain',
          ],
          sports: ['American Football'],
          classYear: '2025',
          maxResults: 60,
          includeInternational: true,
          includeCollege: true,
          includeHighSchool: true,
        }),
      }),

      // Social Media Athletes
      fetch('http://localhost:5000/api/recruiting/athletes/social-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter'],
          hashtags: [
            '#basketball',
            '#football',
            '#soccer',
            '#recruit',
            '#studentathlete',
            '#americanfootball',
            '#eurobasket',
          ],
          keywords: [
            'basketball recruit',
            'football recruit',
            'soccer recruit',
            'student athlete',
            'college bound',
            'european basketball',
          ],
          minFollowers: 1000,
          maxFollowers: 500000,
          includeVerified: true,
          includeUnverified: true,
          ageRange: '16-19',
          locations: ['USA', 'Europe', 'Mexico', 'Brazil'],
          maxResults: 40,
        }),
      }),
    ];

    // Execute all scraping operations
    const results = await Promise.allSettled(scrapingPromises);

    // Parse results
    const scrapingResults = await Promise.all(
      results.map(async (result, index) => {
        if (result.status === 'fulfilled') {
          try {
            const data = await result.value.json();
            return {
              scraper: ['US Athletes', 'European Athletes', 'American Football', 'Social Media'][
                index
              ],
              success: data.success,
              athleteCount: data.athletes?.length || 0,
              data: data,
            };
          } catch (error) {
            return {
              scraper: ['US Athletes', 'European Athletes', 'American Football', 'Social Media'][
                index
              ],
              success: false,
              error: error.message,
              athleteCount: 0,
            };
          }
        } else {
          return {
            scraper: ['US Athletes', 'European Athletes', 'American Football', 'Social Media'][
              index
            ],
            success: false,
            error: result.reason.message,
            athleteCount: 0,
          };
        }
      }),
    );

    // Calculate totals
    const totalAthletes = scrapingResults.reduce((sum, result) => sum + result.athleteCount, 0);
    const successfulScrapers = scrapingResults.filter((r) => r.success).length;

    // Generate ranking analytics
    const rankingAnalytics = {
      totalAthletes,
      successfulScrapers,
      scrapingResults,
      countries: extractCountries(scrapingResults),
      sports: extractSports(scrapingResults),
      platforms: extractPlatforms(scrapingResults),
      topRankedAthletes: extractTopAthletes(scrapingResults),
      geographicDistribution: extractGeographicDistribution(scrapingResults),
      sportDistribution: extractSportDistribution(scrapingResults),
    };

    return NextResponse.json({
      success: true,
      message: 'Athlete ranking population completed successfully',
      analytics: rankingAnalytics,
      timestamp: new Date().toISOString(),
      metadata: {
        scrapingDuration: 'Real-time',
        dataFreshness: 'Live',
        coverage: 'Global (USA + 32 EU countries + Mexico + Brazil)',
        platforms: [
          'ESPN',
          'Sports Reference',
          'MaxPreps',
          'Rivals',
          '247Sports',
          'EuroLeague',
          'EuroBasket',
          'FIBA Europe',
          '1stLookSports',
          'NFL International',
          'Instagram',
          'TikTok',
          'YouTube',
          'Twitter',
        ],
        sports: [
          'Basketball',
          'American Football',
          'Football/Soccer',
          'Baseball',
          'Track & Field',
          'Volleyball',
        ],
      },
    });
  } catch (error) {
    console.error('Ranking population failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

function extractCountries(results: any[]): string[] {
  const countries = new Set<string>();
  results.forEach((result) => {
    if (result.success && result.data.athletes) {
      result.data.athletes.forEach((athlete: any) => {
        if (athlete.country) countries.add(athlete.country);
      });
    }
  });
  return Array.from(countries);
}

function extractSports(results: any[]): string[] {
  const sports = new Set<string>();
  results.forEach((result) => {
    if (result.success && result.data.athletes) {
      result.data.athletes.forEach((athlete: any) => {
        if (athlete.sport) sports.add(athlete.sport);
      });
    }
  });
  return Array.from(sports);
}

function extractPlatforms(results: any[]): string[] {
  const platforms = new Set<string>();
  results.forEach((result) => {
    if (result.success && result.data.sources) {
      result.data.sources.forEach((source: string) => {
        platforms.add(source);
      });
    }
  });
  return Array.from(platforms);
}

function extractTopAthletes(results: any[]): any[] {
  const allAthletes: any[] = [];
  results.forEach((result) => {
    if (result.success && result.data.athletes) {
      result.data.athletes.forEach((athlete: any) => {
        allAthletes.push({
          ...athlete,
          source: result.scraper,
        });
      });
    }
  });

  // Sort by ranking and return top 10
  return allAthletes
    .sort((a, b) => (a.rankings?.national || 999) - (b.rankings?.national || 999))
    .slice(0, 10);
}

function extractGeographicDistribution(results: any[]): { [key: string]: number } {
  const distribution: { [key: string]: number } = {};
  results.forEach((result) => {
    if (result.success && result.data.athletes) {
      result.data.athletes.forEach((athlete: any) => {
        const country = athlete.country || 'Unknown';
        distribution[country] = (distribution[country] || 0) + 1;
      });
    }
  });
  return distribution;
}

function extractSportDistribution(results: any[]): { [key: string]: number } {
  const distribution: { [key: string]: number } = {};
  results.forEach((result) => {
    if (result.success && result.data.athletes) {
      result.data.athletes.forEach((athlete: any) => {
        const sport = athlete.sport || 'Unknown';
        distribution[sport] = (distribution[sport] || 0) + 1;
      });
    }
  });
  return distribution;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Athlete ranking population service is ready',
    capabilities: {
      globalScraping: true,
      realTimeData: true,
      multiPlatformIntegration: true,
      comprehensiveAnalytics: true,
    },
    supportedScrapers: ['US Athletes', 'European Athletes', 'American Football', 'Social Media'],
    supportedPlatforms: [
      'ESPN',
      'Sports Reference',
      'MaxPreps',
      'Rivals',
      '247Sports',
      'EuroLeague',
      'EuroBasket',
      'FIBA Europe',
      '1stLookSports',
      'NFL International',
      'Instagram',
      'TikTok',
      'YouTube',
      'Twitter',
    ],
    supportedCountries: [
      'USA',
      'Germany',
      'UK',
      'France',
      'Spain',
      'Italy',
      'Netherlands',
      'Austria',
      'Sweden',
      'Norway',
      'Denmark',
      'Poland',
      'Serbia',
      'Portugal',
      'Belgium',
      'Czech Republic',
      'Hungary',
      'Croatia',
      'Slovenia',
      'Slovakia',
      'Bulgaria',
      'Romania',
      'Finland',
      'Estonia',
      'Latvia',
      'Luxembourg',
      'Malta',
      'Cyprus',
      'Brazil',
      'Mexico',
    ],
    supportedSports: [
      'Basketball',
      'American Football',
      'Football/Soccer',
      'Baseball',
      'Track & Field',
      'Volleyball',
    ],
    lastUpdate: new Date().toISOString(),
  });
}
