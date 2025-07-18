import { NextResponse } from 'next/server';

interface AthleteData {
  id: string;
  name: string;
  sport: string;
  position: string;
  country: string;
  age: number;
  stats: any;
  highlights: string[];
  socialMedia: any;
  garScore?: number;
  garBreakdown?: {
    technical: number;
    physical: number;
    tactical: number;
    mental: number;
    consistency: number;
  };
}

export async function POST(request: Request) {
  try {
    const { sport, region, maxResults = 50 } = await request.json();
    
    console.log('Starting GAR-based ranking calculation...');
    
    // First, trigger fresh scraping to populate data
    const scrapingPromises = [
      fetch('http://localhost:5000/api/recruiting/athletes/live-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['ESPN', 'Sports Reference', 'MaxPreps', 'Rivals', '247Sports'],
          sports: ['Basketball', 'Football', 'Baseball', 'Soccer'],
          states: ['CA', 'TX', 'FL', 'NY', 'GA', 'IL', 'PA', 'OH', 'NC', 'MI'],
          classYear: '2025',
          maxResults: 25
        })
      }),
      fetch('http://localhost:5000/api/recruiting/athletes/european-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countries: ['Germany', 'UK', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Poland', 'Austria', 'Brazil', 'Mexico'],
          sports: ['Basketball', 'Football/Soccer', 'American Football', 'Track & Field', 'Volleyball'],
          ageRange: '16-19',
          maxResults: 20
        })
      }),
      fetch('http://localhost:5000/api/recruiting/athletes/american-football-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['1stLookSports', 'NFL International'],
          countries: ['USA', 'Germany', 'UK', 'Mexico', 'Brazil', 'Canada'],
          sports: ['American Football'],
          maxResults: 15
        })
      }),
      fetch('http://localhost:5000/api/recruiting/athletes/social-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter'],
          hashtags: ['#basketball', '#football', '#soccer', '#recruit', '#studentathlete'],
          minFollowers: 1000,
          maxResults: 15
        })
      })
    ];
    
    const results = await Promise.allSettled(scrapingPromises);
    
    // Combine all athlete data
    const allAthletes: AthleteData[] = [];
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        try {
          const data = await result.value.json();
          if (data.athletes && Array.isArray(data.athletes)) {
            allAthletes.push(...data.athletes);
          }
        } catch (error) {
          console.error('Error parsing scraper data:', error);
        }
      }
    }
    
    console.log(`Processing ${allAthletes.length} athletes for GAR ranking...`);
    
    // Calculate GAR scores for each athlete
    const rankedAthletes = allAthletes.map(athlete => {
      const garScore = calculateGARScore(athlete);
      return {
        ...athlete,
        garScore: garScore.total,
        garBreakdown: garScore.breakdown,
        id: athlete.id || `${athlete.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
      };
    });
    
    // Sort by GAR score (highest first)
    rankedAthletes.sort((a, b) => (b.garScore || 0) - (a.garScore || 0));
    
    // Apply filters
    let filteredAthletes = rankedAthletes;
    
    if (sport && sport !== 'all') {
      filteredAthletes = filteredAthletes.filter(athlete => {
        const athleteSport = athlete.sport?.toLowerCase();
        const filterSport = sport.toLowerCase();
        
        // Handle sport name variations
        if (filterSport === 'football' || filterSport === 'american football') {
          return athleteSport?.includes('football') || athleteSport?.includes('american football');
        } else if (filterSport === 'basketball') {
          return athleteSport?.includes('basketball');
        } else if (filterSport === 'soccer') {
          return athleteSport?.includes('soccer') || (athleteSport?.includes('football') && !athleteSport?.includes('american'));
        } else {
          return athleteSport?.includes(filterSport);
        }
      });
    }
    
    if (region && region !== 'all') {
      filteredAthletes = filteredAthletes.filter(athlete => {
        const athleteCountry = athlete.country?.toLowerCase();
        const regionFilter = region.toLowerCase();
        
        if (regionFilter === 'usa') {
          return athleteCountry === 'usa' || athleteCountry === 'united states';
        } else if (regionFilter === 'europe') {
          // European countries list
          const europeanCountries = [
            'germany', 'france', 'italy', 'spain', 'uk', 'united kingdom', 'england',
            'netherlands', 'poland', 'greece', 'portugal', 'belgium', 'czech republic',
            'hungary', 'sweden', 'austria', 'switzerland', 'denmark', 'norway',
            'finland', 'ireland', 'croatia', 'serbia', 'slovakia', 'slovenia',
            'bulgaria', 'romania', 'lithuania', 'latvia', 'estonia', 'luxembourg',
            'malta', 'cyprus'
          ];
          return europeanCountries.some(country => athleteCountry?.includes(country));
        } else {
          return athleteCountry?.includes(regionFilter) || athlete.region?.toLowerCase().includes(regionFilter);
        }
      });
    }
    
    // Limit results to top 100 for comprehensive ranking
    const finalAthletes = filteredAthletes.slice(0, Math.min(maxResults, 100));
    
    // Generate ranking analytics
    const analytics = generateRankingAnalytics(finalAthletes);
    
    return NextResponse.json({
      success: true,
      athletes: finalAthletes,
      analytics,
      metadata: {
        totalProcessed: allAthletes.length,
        totalRanked: rankedAthletes.length,
        filteredResults: finalAthletes.length,
        rankingMethod: 'GAR-based',
        lastUpdated: new Date().toISOString(),
        sources: ['ESPN', '247Sports', 'EuroLeague', '1stLookSports', 'Social Media']
      }
    });
    
  } catch (error) {
    console.error('GAR ranking error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function calculateGARScore(athlete: AthleteData): { total: number; breakdown: any } {
  // GAR Score components (0-100 scale)
  const technical = calculateTechnicalScore(athlete);
  const physical = calculatePhysicalScore(athlete);
  const tactical = calculateTacticalScore(athlete);
  const mental = calculateMentalScore(athlete);
  const consistency = calculateConsistencyScore(athlete);
  
  // Weighted GAR calculation
  const weights = {
    technical: 0.25,
    physical: 0.20,
    tactical: 0.20,
    mental: 0.20,
    consistency: 0.15
  };
  
  const total = Math.round(
    (technical * weights.technical) +
    (physical * weights.physical) +
    (tactical * weights.tactical) +
    (mental * weights.mental) +
    (consistency * weights.consistency)
  );
  
  return {
    total,
    breakdown: {
      technical: Math.round(technical),
      physical: Math.round(physical),
      tactical: Math.round(tactical),
      mental: Math.round(mental),
      consistency: Math.round(consistency)
    }
  };
}

function calculateTechnicalScore(athlete: AthleteData): number {
  let score = 70; // Base score
  
  // Position-specific technical skills
  if (athlete.position) {
    const position = athlete.position.toLowerCase();
    if (position.includes('guard') || position.includes('pg') || position.includes('sg')) {
      score += athlete.stats?.assists ? Math.min(athlete.stats.assists * 2, 15) : 0;
      score += athlete.stats?.steals ? Math.min(athlete.stats.steals * 3, 10) : 0;
    }
    if (position.includes('forward') || position.includes('center')) {
      score += athlete.stats?.rebounds ? Math.min(athlete.stats.rebounds * 1.5, 15) : 0;
      score += athlete.stats?.blocks ? Math.min(athlete.stats.blocks * 4, 10) : 0;
    }
  }
  
  // Sport-specific adjustments
  if (athlete.sport) {
    const sport = athlete.sport.toLowerCase();
    if (sport.includes('football') || sport.includes('soccer')) {
      score += athlete.stats?.goals ? Math.min(athlete.stats.goals * 2, 10) : 0;
      score += athlete.stats?.assists ? Math.min(athlete.stats.assists * 2, 10) : 0;
    }
    if (sport.includes('american football')) {
      score += athlete.stats?.touchdowns ? Math.min(athlete.stats.touchdowns * 3, 15) : 0;
      score += athlete.stats?.yards ? Math.min(athlete.stats.yards / 100, 10) : 0;
    }
  }
  
  // Highlight reel bonus
  if (athlete.highlights && athlete.highlights.length > 0) {
    score += Math.min(athlete.highlights.length * 2, 10);
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculatePhysicalScore(athlete: AthleteData): number {
  let score = 75; // Base score
  
  // Age factor (peak physical age 18-22)
  if (athlete.age) {
    if (athlete.age >= 18 && athlete.age <= 22) {
      score += 10;
    } else if (athlete.age >= 16 && athlete.age <= 25) {
      score += 5;
    }
  }
  
  // Statistical performance indicators
  if (athlete.stats) {
    // Basketball physical indicators
    if (athlete.sport?.toLowerCase().includes('basketball')) {
      score += athlete.stats.rebounds ? Math.min(athlete.stats.rebounds * 1.5, 15) : 0;
      score += athlete.stats.blocks ? Math.min(athlete.stats.blocks * 3, 10) : 0;
    }
    
    // Football physical indicators
    if (athlete.sport?.toLowerCase().includes('football')) {
      score += athlete.stats.tackles ? Math.min(athlete.stats.tackles * 0.5, 10) : 0;
      score += athlete.stats.yards ? Math.min(athlete.stats.yards / 200, 10) : 0;
    }
  }
  
  // Social media engagement as physical presence indicator
  if (athlete.socialMedia) {
    const totalFollowers = (athlete.socialMedia.instagram?.followers || 0) + 
                          (athlete.socialMedia.tiktok?.followers || 0);
    score += Math.min(totalFollowers / 10000, 5);
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateTacticalScore(athlete: AthleteData): number {
  let score = 72; // Base score
  
  // Position understanding bonus
  if (athlete.position && athlete.sport) {
    score += 8; // Bonus for having defined position
  }
  
  // Team success indicators
  if (athlete.stats) {
    // Assist-to-turnover ratio
    if (athlete.stats.assists && athlete.stats.turnovers) {
      const ratio = athlete.stats.assists / Math.max(athlete.stats.turnovers, 1);
      score += Math.min(ratio * 5, 15);
    }
    
    // Field goal percentage (shooting efficiency)
    if (athlete.stats.fieldGoalPercentage) {
      score += Math.min((athlete.stats.fieldGoalPercentage - 40) * 0.5, 10);
    }
  }
  
  // Experience factor (international/multi-platform presence)
  let platformCount = 0;
  if (athlete.socialMedia) {
    if (athlete.socialMedia.instagram) platformCount++;
    if (athlete.socialMedia.tiktok) platformCount++;
    if (athlete.socialMedia.youtube) platformCount++;
    if (athlete.socialMedia.twitter) platformCount++;
  }
  score += platformCount * 2;
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateMentalScore(athlete: AthleteData): number {
  let score = 68; // Base score
  
  // Social media presence as mental fortitude indicator
  if (athlete.socialMedia) {
    const totalFollowers = (athlete.socialMedia.instagram?.followers || 0) + 
                          (athlete.socialMedia.tiktok?.followers || 0) + 
                          (athlete.socialMedia.youtube?.subscribers || 0);
    
    // Higher social media presence indicates mental resilience
    score += Math.min(totalFollowers / 5000, 15);
    
    // Engagement quality
    if (athlete.socialMedia.instagram?.engagement > 0.05) score += 5;
    if (athlete.socialMedia.tiktok?.engagement > 0.08) score += 5;
  }
  
  // International experience bonus
  if (athlete.country && athlete.country !== 'USA') {
    score += 10; // International players often have higher mental toughness
  }
  
  // Leadership potential from position
  if (athlete.position) {
    const position = athlete.position.toLowerCase();
    if (position.includes('captain') || position.includes('point guard') || 
        position.includes('quarterback') || position.includes('center')) {
      score += 8;
    }
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function calculateConsistencyScore(athlete: AthleteData): number {
  let score = 65; // Base score
  
  // Multi-platform presence indicates consistency
  if (athlete.socialMedia) {
    let platformCount = 0;
    if (athlete.socialMedia.instagram) platformCount++;
    if (athlete.socialMedia.tiktok) platformCount++;
    if (athlete.socialMedia.youtube) platformCount++;
    if (athlete.socialMedia.twitter) platformCount++;
    
    score += platformCount * 5;
  }
  
  // Statistical consistency indicators
  if (athlete.stats) {
    // Field goal percentage consistency
    if (athlete.stats.fieldGoalPercentage && athlete.stats.fieldGoalPercentage > 45) {
      score += 15;
    }
    
    // Games played consistency
    if (athlete.stats.gamesPlayed && athlete.stats.gamesPlayed > 20) {
      score += 10;
    }
  }
  
  // Age consistency factor
  if (athlete.age && athlete.age >= 17 && athlete.age <= 19) {
    score += 10; // Prime development age
  }
  
  // Highlight consistency
  if (athlete.highlights && athlete.highlights.length >= 3) {
    score += Math.min(athlete.highlights.length * 2, 10);
  }
  
  return Math.min(Math.max(score, 0), 100);
}

function generateRankingAnalytics(athletes: AthleteData[]) {
  if (athletes.length === 0) return {};
  
  const avgGAR = athletes.reduce((sum, athlete) => sum + (athlete.garScore || 0), 0) / athletes.length;
  const topGAR = Math.max(...athletes.map(a => a.garScore || 0));
  const sportDistribution = athletes.reduce((dist: any, athlete) => {
    const sport = athlete.sport || 'Unknown';
    dist[sport] = (dist[sport] || 0) + 1;
    return dist;
  }, {});
  
  const countryDistribution = athletes.reduce((dist: any, athlete) => {
    const country = athlete.country || 'Unknown';
    dist[country] = (dist[country] || 0) + 1;
    return dist;
  }, {});
  
  return {
    averageGAR: Math.round(avgGAR),
    topGAR: Math.round(topGAR),
    sportDistribution,
    countryDistribution,
    eliteAthletes: athletes.filter(a => (a.garScore || 0) >= 85).length,
    risingStars: athletes.filter(a => (a.garScore || 0) >= 75 && (a.garScore || 0) < 85).length,
    prospects: athletes.filter(a => (a.garScore || 0) >= 65 && (a.garScore || 0) < 75).length
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'GAR ranking system ready',
    capabilities: {
      garScoring: true,
      multiSourceData: true,
      realTimeRanking: true,
      sportSpecific: true,
      internationalCoverage: true
    },
    scoringComponents: {
      technical: '25% weight',
      physical: '20% weight',
      tactical: '20% weight',
      mental: '20% weight',
      consistency: '15% weight'
    },
    lastUpdate: new Date().toISOString()
  });
}