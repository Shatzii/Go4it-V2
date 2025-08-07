import { NextResponse } from 'next/server';
import AdvancedScraper from '../../../../lib/scraper-core';
import SportsAPIManager from '../../../../lib/scraper-auth';

export async function POST(request: Request) {
  try {
    const {
      sources = ['ESPN', 'MaxPreps', 'Rivals'],
      sport = 'Basketball',
      region = 'US',
      maxResults = 50,
      useAPIs = true,
      apiKeys = {}
    } = await request.json();

    console.log(`Starting enhanced scraping for ${sport} in ${region}...`);

    const results: any[] = [];
    const errors: string[] = [];
    
    // Initialize enhanced scraper
    const scraper = new AdvancedScraper({
      rateLimit: {
        requestsPerMinute: 25,
        delayBetweenRequests: 2500
      },
      retryConfig: {
        maxRetries: 3,
        retryDelay: 3000
      }
    });

    // Initialize API manager
    const apiManager = new SportsAPIManager();

    // Use APIs first if available (more reliable)
    if (useAPIs) {
      try {
        console.log('Fetching data from authenticated APIs...');
        const apiResults = await apiManager.fetchMultipleAPIs(sport, apiKeys);
        
        for (const apiResult of apiResults) {
          if (apiResult.success && apiResult.data) {
            const processedData = processAPIData(apiResult.data, apiResult.source, sport);
            results.push(...processedData);
          }
        }
        
        console.log(`API scraping collected ${results.length} records`);
      } catch (apiError) {
        console.error('API scraping failed:', apiError.message);
        errors.push(`API Error: ${apiError.message}`);
      }
    }

    // Enhanced web scraping as backup or supplement
    try {
      console.log('Starting enhanced web scraping...');
      const scrapingResult = await scraper.scrapeMultipleSources({
        sources,
        sport,
        maxResults: maxResults - results.length,
        filters: { region }
      });

      if (scrapingResult.success) {
        results.push(...scrapingResult.data);
        console.log(`Web scraping collected ${scrapingResult.data.length} additional records`);
      }

      if (scrapingResult.errors) {
        errors.push(...scrapingResult.errors);
      }
    } catch (scrapingError) {
      console.error('Web scraping failed:', scrapingError.message);
      errors.push(`Scraping Error: ${scrapingError.message}`);
    }

    // Enhanced data processing and deduplication
    const processedResults = deduplicateAndEnhance(results);
    const finalResults = processedResults.slice(0, maxResults);

    // Generate analytics
    const analytics = generateScrapingAnalytics(finalResults, errors);

    return NextResponse.json({
      success: finalResults.length > 0,
      data: finalResults,
      analytics,
      metadata: {
        totalSources: sources.length,
        successfulSources: finalResults.length > 0 ? sources.length - errors.length : 0,
        totalRecords: finalResults.length,
        sport,
        region,
        timestamp: new Date().toISOString(),
        apiStatus: apiManager.getAPIStatus()
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Enhanced scraper error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function processAPIData(data: any, source: string, sport: string): any[] {
  const processed: any[] = [];
  
  try {
    if (source === 'ESPN API') {
      // Process ESPN API data structure
      if (data.athletes) {
        data.athletes.forEach((athlete: any) => {
          processed.push({
            id: `espn-api-${athlete.id || Date.now()}`,
            name: athlete.displayName || athlete.name,
            position: athlete.position?.displayName || 'N/A',
            sport: sport,
            team: athlete.team?.displayName || 'N/A',
            source: 'ESPN API',
            confidence: 95,
            apiData: true,
            lastUpdated: new Date().toISOString()
          });
        });
      }
    } else if (source === 'BalldontLie NBA API') {
      // Process NBA API data
      if (data.data) {
        data.data.forEach((player: any) => {
          processed.push({
            id: `nba-api-${player.id}`,
            name: `${player.first_name} ${player.last_name}`,
            position: player.position || 'N/A',
            sport: 'Basketball',
            team: player.team?.full_name || 'N/A',
            source: 'NBA API',
            confidence: 95,
            apiData: true,
            lastUpdated: new Date().toISOString()
          });
        });
      }
    } else if (source === 'The Sports DB') {
      // Process Sports DB data
      if (data.player) {
        data.player.forEach((player: any) => {
          processed.push({
            id: `sportsdb-${player.idPlayer}`,
            name: player.strPlayer,
            position: player.strPosition || 'N/A',
            sport: player.strSport || sport,
            team: player.strTeam || 'N/A',
            nationality: player.strNationality,
            source: 'The Sports DB',
            confidence: 90,
            apiData: true,
            lastUpdated: new Date().toISOString()
          });
        });
      }
    }
  } catch (error) {
    console.error(`Error processing ${source} data:`, error.message);
  }

  return processed;
}

function deduplicateAndEnhance(results: any[]): any[] {
  const seen = new Set<string>();
  const deduplicated: any[] = [];
  
  for (const result of results) {
    // Create a unique key based on name and sport
    const key = `${result.name?.toLowerCase().trim()}-${result.sport?.toLowerCase()}`;
    
    if (!seen.has(key) && result.name && result.name.length > 2) {
      seen.add(key);
      
      // Enhance with additional metadata
      const enhanced = {
        ...result,
        id: result.id || `enhanced-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        enhancedAt: new Date().toISOString(),
        dataQuality: calculateDataQuality(result),
        searchableText: createSearchableText(result)
      };
      
      deduplicated.push(enhanced);
    }
  }
  
  // Sort by confidence and data quality
  return deduplicated.sort((a, b) => {
    const scoreA = (a.confidence || 50) + (a.dataQuality || 0);
    const scoreB = (b.confidence || 50) + (b.dataQuality || 0);
    return scoreB - scoreA;
  });
}

function calculateDataQuality(data: any): number {
  let score = 0;
  
  // Basic fields
  if (data.name) score += 20;
  if (data.position) score += 10;
  if (data.sport) score += 10;
  if (data.team) score += 10;
  
  // Enhanced fields
  if (data.height) score += 5;
  if (data.weight) score += 5;
  if (data.ranking) score += 10;
  if (data.stats) score += 10;
  
  // Source reliability
  if (data.apiData) score += 15;
  if (data.confidence && data.confidence > 80) score += 5;
  
  return Math.min(score, 100);
}

function createSearchableText(data: any): string {
  const searchTerms = [
    data.name,
    data.position,
    data.sport,
    data.team,
    data.school,
    data.state,
    data.nationality
  ].filter(Boolean);
  
  return searchTerms.join(' ').toLowerCase();
}

function generateScrapingAnalytics(results: any[], errors: string[]): any {
  const sources = [...new Set(results.map(r => r.source))];
  const sports = [...new Set(results.map(r => r.sport))];
  const apiResults = results.filter(r => r.apiData);
  const scrapedResults = results.filter(r => !r.apiData);
  
  return {
    totalRecords: results.length,
    sources: {
      total: sources.length,
      successful: sources,
      apiSources: apiResults.length,
      scrapedSources: scrapedResults.length
    },
    sports: sports,
    dataQuality: {
      averageConfidence: results.reduce((acc, r) => acc + (r.confidence || 50), 0) / results.length,
      highQualityRecords: results.filter(r => (r.confidence || 50) > 80).length,
      apiRecords: apiResults.length
    },
    errors: {
      total: errors.length,
      details: errors.slice(0, 5) // Limit error details
    },
    processingTime: new Date().toISOString()
  };
}

// Health check endpoint
export async function GET() {
  const apiManager = new SportsAPIManager();
  
  return NextResponse.json({
    status: 'healthy',
    services: {
      scraper: 'operational',
      apis: apiManager.getAPIStatus()
    },
    timestamp: new Date().toISOString()
  });
}