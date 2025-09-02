import { NextResponse } from 'next/server';

interface EnhancedAthleteData {
  id: string;
  name: string;
  sport: string;
  position?: string;
  school?: string;
  state?: string;
  classYear?: string;
  stats?: Record<string, any>;
  source: string;
  confidence: number;
  garScore?: number;
  garBreakdown?: {
    technique: number; // Technical skill execution
    athleticism: number; // Physical capabilities
    gameIQ: number; // Tactical understanding
    consistency: number; // Performance reliability
    potential: number; // Growth trajectory
  };
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  lastUpdated: string;
}

interface GARCalculationParams {
  sport: string;
  position?: string;
  stats?: Record<string, any>;
  school?: string;
  classYear?: string;
  confidence: number;
}

export async function POST(request: Request) {
  try {
    const {
      sport = 'all',
      minConfidence = 0.7,
      maxResults = 100,
      includeUnverified = false,
      calculateAdvancedMetrics = true,
    } = await request.json();

    console.log('=== IMPROVED GAR RANKING SYSTEM ===');
    console.log(`Sport filter: ${sport}`);
    console.log(`Minimum confidence: ${minConfidence}`);
    console.log(`Max results: ${maxResults}`);

    // Step 1: Get authentic athlete data from multiple sources
    const dataSource = await fetch(
      `${request.url.replace('/improved-gar', '')}/recruiting/athletes/authentic-scraper`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sports: sport === 'all' ? ['basketball', 'football', 'track', 'soccer'] : [sport],
          states: ['CA', 'TX', 'FL', 'NY', 'GA', 'IL', 'PA', 'OH', 'NC'],
          maxResults: maxResults * 2, // Get more data to filter from
          includeVideo: true,
          includeStats: true,
        }),
      },
    );

    let rawAthletes: any[] = [];

    if (dataSource.ok) {
      const data = await dataSource.json();
      rawAthletes = data.athletes || [];
    } else {
      console.warn('Failed to fetch authentic data, GAR ranking requires real athlete data');
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to access authentic athlete database',
          message:
            'GAR ranking requires verified athlete data. Please check data source connectivity.',
          athletes: [],
        },
        { status: 503 },
      );
    }

    console.log(`Processing ${rawAthletes.length} authentic athlete profiles...`);

    // Step 2: Filter by confidence threshold
    const highConfidenceAthletes = rawAthletes.filter(
      (athlete) => athlete.confidence >= minConfidence,
    );

    console.log(
      `${highConfidenceAthletes.length} athletes meet confidence threshold (${minConfidence})`,
    );

    // Step 3: Calculate enhanced GAR scores
    const rankedAthletes: EnhancedAthleteData[] = highConfidenceAthletes.map((athlete) => {
      const garCalculation = calculateEnhancedGAR({
        sport: athlete.sport,
        position: athlete.position,
        stats: athlete.stats,
        school: athlete.school,
        classYear: athlete.classYear,
        confidence: athlete.confidence,
      });

      return {
        id: athlete.id,
        name: athlete.name,
        sport: athlete.sport,
        position: athlete.position,
        school: athlete.school,
        state: athlete.state,
        classYear: athlete.classYear,
        stats: athlete.stats,
        source: athlete.source,
        confidence: athlete.confidence,
        garScore: garCalculation.totalScore,
        garBreakdown: garCalculation.breakdown,
        verificationStatus:
          athlete.confidence > 0.85
            ? 'verified'
            : athlete.confidence > 0.7
              ? 'pending'
              : 'unverified',
        lastUpdated: athlete.lastUpdated,
      };
    });

    // Step 4: Apply sport filter
    let filteredAthletes = rankedAthletes;
    if (sport && sport !== 'all') {
      filteredAthletes = rankedAthletes.filter((athlete) => {
        const athleteSport = athlete.sport?.toLowerCase();
        const filterSport = sport.toLowerCase();
        return athleteSport?.includes(filterSport);
      });
    }

    // Step 5: Sort by GAR score (highest first)
    filteredAthletes.sort((a, b) => (b.garScore || 0) - (a.garScore || 0));

    // Step 6: Apply verification filter
    if (!includeUnverified) {
      filteredAthletes = filteredAthletes.filter(
        (athlete) => athlete.verificationStatus !== 'unverified',
      );
    }

    // Step 7: Calculate ranking statistics
    const topAthletes = filteredAthletes.slice(0, maxResults);
    const averageGAR =
      topAthletes.length > 0
        ? topAthletes.reduce((sum, a) => sum + (a.garScore || 0), 0) / topAthletes.length
        : 0;

    const sportBreakdown = topAthletes.reduce(
      (acc, athlete) => {
        acc[athlete.sport] = (acc[athlete.sport] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const verificationBreakdown = topAthletes.reduce(
      (acc, athlete) => {
        acc[athlete.verificationStatus || 'unverified'] =
          (acc[athlete.verificationStatus || 'unverified'] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log('=== GAR RANKING RESULTS ===');
    console.log(`Ranked athletes: ${topAthletes.length}`);
    console.log(`Average GAR score: ${averageGAR.toFixed(2)}`);
    console.log(`Sport distribution:`, sportBreakdown);
    console.log(`Verification status:`, verificationBreakdown);

    return NextResponse.json({
      success: true,
      athletes: topAthletes,
      metadata: {
        totalRanked: topAthletes.length,
        averageGARScore: averageGAR,
        sportBreakdown,
        verificationBreakdown,
        dataSource: 'Authentic athlete databases',
        rankingAlgorithm: 'Enhanced GAR v2.0',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Enhanced GAR ranking error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'GAR ranking system unavailable',
        message: 'Unable to calculate rankings without authentic athlete data',
        athletes: [],
      },
      { status: 500 },
    );
  }
}

function calculateEnhancedGAR(params: GARCalculationParams): {
  totalScore: number;
  breakdown: {
    technique: number;
    athleticism: number;
    gameIQ: number;
    consistency: number;
    potential: number;
  };
} {
  const { sport, position, stats, school, classYear, confidence } = params;

  // Base scores (0-100 scale)
  let technique = 50;
  let athleticism = 50;
  let gameIQ = 50;
  let consistency = 50;
  let potential = 50;

  // Adjust based on data confidence
  const confidenceMultiplier = confidence;

  // Sport-specific adjustments
  if (sport?.toLowerCase().includes('basketball')) {
    // Basketball specific GAR calculation
    if (stats?.points) technique += Math.min(stats.points / 2, 25);
    if (stats?.assists) gameIQ += Math.min(stats.assists * 3, 30);
    if (stats?.rebounds) athleticism += Math.min(stats.rebounds * 2, 25);
    if (stats?.fieldGoalPercentage) consistency += Math.min(stats.fieldGoalPercentage * 50, 30);

    // Position adjustments for basketball
    if (position?.toLowerCase().includes('guard')) {
      gameIQ += 10;
      technique += 5;
    } else if (position?.toLowerCase().includes('forward')) {
      athleticism += 10;
      technique += 5;
    } else if (position?.toLowerCase().includes('center')) {
      athleticism += 15;
      consistency += 5;
    }
  } else if (sport?.toLowerCase().includes('football')) {
    // Football specific GAR calculation
    if (stats?.yards) athleticism += Math.min(stats.yards / 100, 20);
    if (stats?.touchdowns) technique += Math.min(stats.touchdowns * 5, 25);
    if (stats?.completionPercentage) consistency += Math.min(stats.completionPercentage * 30, 30);

    // Position adjustments for football
    if (position?.toLowerCase().includes('quarterback')) {
      gameIQ += 15;
      technique += 10;
    } else if (position?.toLowerCase().includes('receiver')) {
      athleticism += 10;
      technique += 10;
    } else if (position?.toLowerCase().includes('back')) {
      athleticism += 15;
      consistency += 5;
    }
  } else if (sport?.toLowerCase().includes('track')) {
    // Track & Field GAR calculation
    if (stats?.personalBest) {
      // Performance-based scoring for track
      technique += 20;
      athleticism += 25;
      consistency += 15;
    }
  }

  // School prestige factor
  const prestigiousSchools = ['IMG Academy', 'Montverde Academy', 'Oak Hill Academy'];
  if (school && prestigiousSchools.some((ps) => school.includes(ps))) {
    technique += 10;
    potential += 10;
  }

  // Class year adjustments (younger = more potential)
  if (classYear) {
    const year = parseInt(classYear);
    if (year >= 2025) {
      potential += Math.min((year - 2024) * 5, 20);
    }
  }

  // Apply confidence multiplier
  technique *= confidenceMultiplier;
  athleticism *= confidenceMultiplier;
  gameIQ *= confidenceMultiplier;
  consistency *= confidenceMultiplier;
  potential *= confidenceMultiplier;

  // Ensure scores are within 0-100 range
  technique = Math.max(0, Math.min(100, technique));
  athleticism = Math.max(0, Math.min(100, athleticism));
  gameIQ = Math.max(0, Math.min(100, gameIQ));
  consistency = Math.max(0, Math.min(100, consistency));
  potential = Math.max(0, Math.min(100, potential));

  // Calculate weighted total score
  const totalScore = Math.round(
    technique * 0.25 + athleticism * 0.25 + gameIQ * 0.2 + consistency * 0.2 + potential * 0.1,
  );

  return {
    totalScore: Math.max(0, Math.min(100, totalScore)),
    breakdown: {
      technique: Math.round(technique),
      athleticism: Math.round(athleticism),
      gameIQ: Math.round(gameIQ),
      consistency: Math.round(consistency),
      potential: Math.round(potential),
    },
  };
}

export async function GET(request: Request) {
  return NextResponse.json({
    status: 'Enhanced GAR Ranking System',
    version: '2.0',
    features: [
      'Authentic data requirement',
      'Confidence-based filtering',
      'Sport-specific calculations',
      'Enhanced verification',
      'Multi-source integration',
    ],
    dataIntegrity: 'HIGH - No synthetic data used',
  });
}
