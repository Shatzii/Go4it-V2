import { NextResponse } from 'next/server';

interface RankedAthlete {
  id: string;
  name: string;
  position: string;
  sport: string;
  country: string;
  state?: string;
  city: string;
  school: string;
  ranking: {
    overall: number;
    national: number;
    regional: number;
    position: number;
  };
  stats: {
    [key: string]: number | string;
  };
  recruiting: {
    offers: number;
    commitment?: string;
    status: string;
  };
  sources: string[];
  lastUpdated: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'global';
    const sport = url.searchParams.get('sport');
    const country = url.searchParams.get('country');
    const position = url.searchParams.get('position');
    const minRanking = url.searchParams.get('minRanking');
    const maxRanking = url.searchParams.get('maxRanking');
    const search = url.searchParams.get('search');

    console.log('Fetching rankings from scraped data...');
    
    // Fetch data from all scraping sources
    const [usData, europeanData, footballData, socialData] = await Promise.all([
      fetchUSAthletes(),
      fetchEuropeanAthletes(),
      fetchAmericanFootballAthletes(),
      fetchSocialMediaAthletes()
    ]);

    // Combine all athlete data
    let allAthletes: RankedAthlete[] = [
      ...usData.athletes || [],
      ...europeanData.athletes || [],
      ...footballData.athletes || [],
      ...socialData.athletes || []
    ];

    // Apply filters
    if (sport) {
      allAthletes = allAthletes.filter(athlete => 
        athlete.sport.toLowerCase().includes(sport.toLowerCase())
      );
    }

    if (country) {
      allAthletes = allAthletes.filter(athlete => 
        athlete.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (position) {
      allAthletes = allAthletes.filter(athlete => 
        athlete.position.toLowerCase().includes(position.toLowerCase())
      );
    }

    if (search) {
      allAthletes = allAthletes.filter(athlete => 
        athlete.name.toLowerCase().includes(search.toLowerCase()) ||
        athlete.school.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minRanking) {
      allAthletes = allAthletes.filter(athlete => 
        athlete.ranking.overall >= parseInt(minRanking)
      );
    }

    if (maxRanking) {
      allAthletes = allAthletes.filter(athlete => 
        athlete.ranking.overall <= parseInt(maxRanking)
      );
    }

    // Sort by ranking
    allAthletes.sort((a, b) => a.ranking.overall - b.ranking.overall);

    // Apply type-specific filtering
    switch (type) {
      case 'usa':
        allAthletes = allAthletes.filter(a => a.country === 'USA');
        break;
      case 'europe':
        allAthletes = allAthletes.filter(a => 
          a.country !== 'USA' && a.country !== 'Mexico' && a.country !== 'Brazil'
        );
        break;
      case 'international':
        allAthletes = allAthletes.filter(a => 
          a.country === 'Mexico' || a.country === 'Brazil'
        );
        break;
      case 'rising':
        allAthletes = allAthletes.filter(a => a.ranking.overall <= 50);
        break;
      default: // global
        allAthletes = allAthletes.slice(0, 100);
        break;
    }

    // Get unique values for filters
    const countries = [...new Set(allAthletes.map(a => a.country))];
    const sports = [...new Set(allAthletes.map(a => a.sport))];
    const regions = [...new Set(allAthletes.map(a => a.country))];

    return NextResponse.json({
      success: true,
      data: {
        rankings: allAthletes.slice(0, 100),
        totalAthletes: allAthletes.length,
        lastUpdated: new Date().toISOString(),
        countries,
        sports,
        regions
      },
      metadata: {
        type,
        filters: {
          sport,
          country,
          position,
          minRanking,
          maxRanking,
          search
        },
        scrapingSources: ['ESPN', 'Sports Reference', 'MaxPreps', 'EuroLeague', '1stLookSports', 'Instagram', 'TikTok']
      }
    });
  } catch (error) {
    console.error('Rankings API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function fetchUSAthletes(): Promise<{ athletes: RankedAthlete[] }> {
  try {
    const response = await fetch('http://localhost:5000/api/recruiting/athletes/live-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms: ['ESPN', 'Sports Reference', 'MaxPreps'],
        sports: ['Basketball', 'Football', 'Baseball', 'Soccer'],
        states: ['CA', 'TX', 'FL', 'NY', 'GA', 'IL', 'PA', 'OH', 'NC', 'MI'],
        classYear: '2025',
        maxResults: 50
      })
    });

    if (!response.ok) {
      throw new Error(`US scraper failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('US scraper error:', data.error);
      return { athletes: [] };
    }

    const athletes: RankedAthlete[] = data.athletes?.map((athlete: any, index: number) => ({
      id: athlete.id,
      name: athlete.name,
      position: athlete.position,
      sport: athlete.sport,
      country: athlete.country || 'USA',
      state: athlete.state,
      city: athlete.city,
      school: athlete.school?.name || 'Unknown School',
      ranking: {
        overall: athlete.rankings?.national || index + 1,
        national: athlete.rankings?.national || index + 1,
        regional: athlete.rankings?.state || index + 1,
        position: athlete.rankings?.position || index + 1
      },
      stats: athlete.stats || {},
      recruiting: {
        offers: athlete.recruiting?.offers?.length || 0,
        commitment: athlete.recruiting?.commitment,
        status: athlete.recruiting?.status || 'open'
      },
      sources: athlete.sources?.map((s: any) => s.platform) || ['ESPN'],
      lastUpdated: new Date().toISOString()
    })) || [];

    return { athletes };
  } catch (error) {
    console.error('Error fetching US athletes:', error);
    return { athletes: [] };
  }
}

async function fetchEuropeanAthletes(): Promise<{ athletes: RankedAthlete[] }> {
  try {
    const response = await fetch('http://localhost:5000/api/recruiting/athletes/european-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countries: ['Germany', 'UK', 'France', 'Spain', 'Italy', 'Netherlands', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Poland', 'Serbia', 'Brazil', 'Mexico'],
        sports: ['Basketball', 'Football/Soccer', 'American Football'],
        ageRange: '16-19',
        maxResults: 30
      })
    });

    if (!response.ok) {
      throw new Error(`European scraper failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('European scraper error:', data.error);
      return { athletes: [] };
    }

    const athletes: RankedAthlete[] = data.athletes?.map((athlete: any, index: number) => ({
      id: athlete.id,
      name: athlete.name,
      position: athlete.position,
      sport: athlete.sport,
      country: athlete.country,
      city: athlete.city,
      school: athlete.club || 'Unknown Club',
      ranking: {
        overall: athlete.ranking?.overall || index + 51,
        national: athlete.ranking?.national || index + 1,
        regional: athlete.ranking?.regional || index + 1,
        position: athlete.ranking?.position || index + 1
      },
      stats: athlete.stats || {},
      recruiting: {
        offers: athlete.recruiting?.offers?.length || 0,
        commitment: athlete.recruiting?.commitment,
        status: athlete.recruiting?.status || 'open'
      },
      sources: athlete.sources?.map((s: any) => s.platform) || ['EuroLeague'],
      lastUpdated: new Date().toISOString()
    })) || [];

    return { athletes };
  } catch (error) {
    console.error('Error fetching European athletes:', error);
    return { athletes: [] };
  }
}

async function fetchAmericanFootballAthletes(): Promise<{ athletes: RankedAthlete[] }> {
  try {
    const response = await fetch('http://localhost:5000/api/recruiting/athletes/american-football-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms: ['1stLookSports', 'NFL International'],
        countries: ['USA', 'Germany', 'UK', 'Mexico', 'Brazil', 'Austria', 'Netherlands'],
        sports: ['American Football'],
        classYear: '2025',
        maxResults: 25
      })
    });

    if (!response.ok) {
      throw new Error(`American Football scraper failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('American Football scraper error:', data.error);
      return { athletes: [] };
    }

    const athletes: RankedAthlete[] = data.athletes?.map((athlete: any, index: number) => ({
      id: athlete.id,
      name: athlete.name,
      position: athlete.position,
      sport: athlete.sport,
      country: athlete.country,
      state: athlete.state,
      city: athlete.city,
      school: athlete.school?.name || 'Unknown School',
      ranking: {
        overall: athlete.rankings?.national || index + 101,
        national: athlete.rankings?.national || index + 1,
        regional: athlete.rankings?.regional || index + 1,
        position: athlete.rankings?.position || index + 1
      },
      stats: athlete.stats || {},
      recruiting: {
        offers: athlete.recruiting?.offers?.length || 0,
        commitment: athlete.recruiting?.commitment,
        status: athlete.recruiting?.status || 'open'
      },
      sources: athlete.sources?.map((s: any) => s.platform) || ['1stLookSports'],
      lastUpdated: new Date().toISOString()
    })) || [];

    return { athletes };
  } catch (error) {
    console.error('Error fetching American Football athletes:', error);
    return { athletes: [] };
  }
}

async function fetchSocialMediaAthletes(): Promise<{ athletes: RankedAthlete[] }> {
  try {
    const response = await fetch('http://localhost:5000/api/recruiting/athletes/social-scraper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        hashtags: ['#basketball', '#football', '#soccer', '#recruit'],
        minFollowers: 1000,
        maxFollowers: 100000,
        includeVerified: true,
        maxResults: 20
      })
    });

    if (!response.ok) {
      throw new Error(`Social Media scraper failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('Social Media scraper error:', data.error);
      return { athletes: [] };
    }

    const athletes: RankedAthlete[] = data.athletes?.map((athlete: any, index: number) => ({
      id: athlete.id,
      name: athlete.name,
      position: athlete.position || 'ATH',
      sport: athlete.sport,
      country: athlete.location?.country || 'USA',
      city: athlete.location?.city || 'Unknown',
      school: athlete.school || 'Unknown School',
      ranking: {
        overall: athlete.socialMetrics?.followers || index + 151,
        national: index + 1,
        regional: index + 1,
        position: index + 1
      },
      stats: {
        followers: athlete.socialMetrics?.followers || 0,
        posts: athlete.socialMetrics?.posts || 0,
        engagement: athlete.socialMetrics?.engagement || 0
      },
      recruiting: {
        offers: 0,
        status: 'social'
      },
      sources: athlete.sources?.map((s: any) => s.platform) || ['Instagram'],
      lastUpdated: new Date().toISOString()
    })) || [];

    return { athletes };
  } catch (error) {
    console.error('Error fetching Social Media athletes:', error);
    return { athletes: [] };
  }
}

export async function POST(request: Request) {
  try {
    const { action, athleteId, newRanking } = await request.json();
    
    if (action === 'update-ranking') {
      // In a real implementation, this would update the database
      console.log(`Updating ranking for athlete ${athleteId} to ${newRanking}`);
      
      return NextResponse.json({
        success: true,
        message: 'Ranking updated successfully'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Rankings POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}