import { NextResponse } from 'next/server';

// Highlight tape analysis and comparison system
const highlightAnalysis = [
  {
    id: 'highlight-1',
    athleteId: 'athlete-1',
    videoId: 'video-123',
    sport: 'Basketball',
    position: 'PG',
    analysis: {
      technical: {
        ballHandling: 88,
        shooting: 85,
        passing: 92,
        defense: 78,
        rebounding: 65,
        overall: 82,
      },
      physical: {
        speed: 86,
        agility: 89,
        strength: 72,
        endurance: 84,
        explosiveness: 87,
        overall: 84,
      },
      tactical: {
        decisionMaking: 91,
        courtVision: 93,
        gameManagement: 87,
        leadership: 85,
        adaptation: 82,
        overall: 88,
      },
      highlights: [
        { timestamp: '0:15', description: 'Behind-the-back assist in traffic', rating: 94 },
        { timestamp: '0:32', description: 'Step-back three-pointer', rating: 88 },
        { timestamp: '0:47', description: 'Steal and fast-break finish', rating: 91 },
        { timestamp: '1:03', description: 'No-look pass for assist', rating: 96 },
        { timestamp: '1:18', description: 'Clutch three-pointer', rating: 92 },
      ],
    },
    comparison: {
      peakPerformance: 96,
      consistency: 87,
      clutchFactor: 92,
      improvementTrend: 'Upward',
      competitionLevel: 'High School Elite',
    },
    coachingSchemesFit: {
      'motion-offense': 94,
      'spread-offense': 91,
      'high-low-post': 83,
      'pressing-defense': 86,
    },
  },
  {
    id: 'highlight-2',
    athleteId: 'athlete-2',
    videoId: 'video-124',
    sport: 'Soccer',
    position: 'CM',
    analysis: {
      technical: {
        ballControl: 91,
        passing: 94,
        shooting: 79,
        crossing: 85,
        tackling: 82,
        overall: 86,
      },
      physical: {
        speed: 83,
        agility: 87,
        strength: 78,
        endurance: 92,
        explosiveness: 81,
        overall: 84,
      },
      tactical: {
        positioning: 93,
        vision: 95,
        pressing: 84,
        leadership: 88,
        adaptation: 90,
        overall: 90,
      },
      highlights: [
        { timestamp: '0:22', description: 'Through ball for assist', rating: 95 },
        { timestamp: '0:38', description: 'Long-range goal', rating: 89 },
        { timestamp: '0:54', description: 'Defensive interception', rating: 86 },
        { timestamp: '1:12', description: 'Skill move past defender', rating: 92 },
        { timestamp: '1:28', description: 'Corner kick assist', rating: 88 },
      ],
    },
    comparison: {
      peakPerformance: 95,
      consistency: 89,
      clutchFactor: 87,
      improvementTrend: 'Steady',
      competitionLevel: 'Club Elite',
    },
    coachingSchemesFit: {
      'possession-based': 96,
      'counter-attacking': 84,
      'high-pressing': 88,
      defensive: 79,
    },
  },
];

const comparisonMetrics = [
  {
    category: 'Technical Skills',
    benchmarks: {
      Elite: { min: 90, max: 100, color: 'green' },
      High: { min: 80, max: 89, color: 'blue' },
      Medium: { min: 70, max: 79, color: 'yellow' },
      Developing: { min: 0, max: 69, color: 'orange' },
    },
  },
  {
    category: 'Physical Attributes',
    benchmarks: {
      Elite: { min: 88, max: 100, color: 'green' },
      High: { min: 78, max: 87, color: 'blue' },
      Medium: { min: 68, max: 77, color: 'yellow' },
      Developing: { min: 0, max: 67, color: 'orange' },
    },
  },
  {
    category: 'Tactical Awareness',
    benchmarks: {
      Elite: { min: 85, max: 100, color: 'green' },
      High: { min: 75, max: 84, color: 'blue' },
      Medium: { min: 65, max: 74, color: 'yellow' },
      Developing: { min: 0, max: 64, color: 'orange' },
    },
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      highlights: highlightAnalysis,
      comparisonMetrics: comparisonMetrics,
      metadata: {
        lastUpdated: new Date().toISOString(),
        aiVersion: 'HighlightAnalysis v2.0',
        analysisPoints: [
          'Technical skills',
          'Physical attributes',
          'Tactical awareness',
          'Peak performance',
          'Consistency',
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch highlight analysis',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { videoUrl, athleteId, sport, position } = await request.json();

    // Simulate AI video analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate analysis based on sport and position
    const analysis = await generateHighlightAnalysis(videoUrl, sport, position);

    return NextResponse.json({
      success: true,
      analysis: analysis,
      processingTime: '2.3 seconds',
      confidenceLevel: 'High',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze highlight video',
      },
      { status: 500 },
    );
  }
}

// Compare multiple highlight reels
export async function PUT(request: Request) {
  try {
    const { athleteIds, comparisonType } = await request.json();

    // Get highlight analyses for comparison
    const analyses = highlightAnalysis.filter((h) => athleteIds.includes(h.athleteId));

    if (analyses.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least 2 athletes required for comparison',
        },
        { status: 400 },
      );
    }

    // Generate comparison
    const comparison = generateComparison(analyses, comparisonType);

    return NextResponse.json({
      success: true,
      comparison: comparison,
      athletes: analyses.length,
      comparisonType: comparisonType,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to compare highlight reels',
      },
      { status: 500 },
    );
  }
}

async function generateHighlightAnalysis(videoUrl: string, sport: string, position: string) {
  // Simulate AI processing of video content
  const baseAnalysis = {
    technical: Math.floor(Math.random() * 30) + 70,
    physical: Math.floor(Math.random() * 30) + 70,
    tactical: Math.floor(Math.random() * 30) + 70,
  };

  // Sport-specific adjustments
  if (sport === 'Basketball') {
    if (position === 'PG') {
      baseAnalysis.tactical += 10;
    } else if (position === 'C') {
      baseAnalysis.physical += 10;
    }
  } else if (sport === 'Soccer') {
    if (position === 'GK') {
      baseAnalysis.technical += 8;
    } else if (position === 'CM') {
      baseAnalysis.tactical += 8;
    }
  }

  // Normalize scores
  Object.keys(baseAnalysis).forEach((key) => {
    baseAnalysis[key] = Math.min(100, baseAnalysis[key]);
  });

  return {
    ...baseAnalysis,
    overall: Math.round(
      (baseAnalysis.technical + baseAnalysis.physical + baseAnalysis.tactical) / 3,
    ),
    highlights: generateHighlights(sport, position),
    recommendations: generateRecommendations(baseAnalysis, sport, position),
  };
}

function generateHighlights(sport: string, position: string) {
  const highlights = [];
  const count = Math.floor(Math.random() * 3) + 3; // 3-5 highlights

  for (let i = 0; i < count; i++) {
    const timestamp = `${Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    const rating = Math.floor(Math.random() * 20) + 80;

    let description = 'Great play';
    if (sport === 'Basketball') {
      const basketballPlays = ['Three-point shot', 'Assist', 'Steal', 'Dunk', 'Defensive stop'];
      description = basketballPlays[Math.floor(Math.random() * basketballPlays.length)];
    } else if (sport === 'Soccer') {
      const soccerPlays = ['Goal', 'Assist', 'Tackle', 'Skill move', 'Cross'];
      description = soccerPlays[Math.floor(Math.random() * soccerPlays.length)];
    }

    highlights.push({ timestamp, description, rating });
  }

  return highlights;
}

function generateRecommendations(analysis: any, sport: string, position: string) {
  const recommendations = [];

  if (analysis.technical < 80) {
    recommendations.push('Focus on technical skill development');
  }
  if (analysis.physical < 80) {
    recommendations.push('Improve physical conditioning');
  }
  if (analysis.tactical < 80) {
    recommendations.push('Enhance tactical understanding');
  }

  return recommendations;
}

function generateComparison(analyses: any[], comparisonType: string) {
  const comparison = {
    summary: {
      totalAthletes: analyses.length,
      averageOverall: Math.round(
        analyses.reduce((sum, a) => sum + a.analysis.technical.overall, 0) / analyses.length,
      ),
      topPerformer: analyses.reduce((top, current) =>
        current.analysis.technical.overall > top.analysis.technical.overall ? current : top,
      ),
    },
    categoryComparison: {
      technical: analyses.map((a) => ({
        athleteId: a.athleteId,
        score: a.analysis.technical.overall,
        rank: 1,
      })),
      physical: analyses.map((a) => ({
        athleteId: a.athleteId,
        score: a.analysis.physical.overall,
        rank: 1,
      })),
      tactical: analyses.map((a) => ({
        athleteId: a.athleteId,
        score: a.analysis.tactical.overall,
        rank: 1,
      })),
    },
    strengths: analyses.map((a) => ({
      athleteId: a.athleteId,
      topStrength: getTopStrength(a.analysis),
      areas: getStrengthAreas(a.analysis),
    })),
    recommendations: analyses.map((a) => ({
      athleteId: a.athleteId,
      priority: getPriorityDevelopment(a.analysis),
      timeline: 'Next 6 months',
    })),
  };

  // Rank athletes in each category
  ['technical', 'physical', 'tactical'].forEach((category) => {
    comparison.categoryComparison[category].sort((a, b) => b.score - a.score);
    comparison.categoryComparison[category].forEach((item, index) => {
      item.rank = index + 1;
    });
  });

  return comparison;
}

function getTopStrength(analysis: any) {
  const categories = ['technical', 'physical', 'tactical'];
  return categories.reduce((top, current) =>
    analysis[current].overall > analysis[top].overall ? current : top,
  );
}

function getStrengthAreas(analysis: any) {
  const areas = [];
  if (analysis.technical.overall >= 85) areas.push('Technical Excellence');
  if (analysis.physical.overall >= 85) areas.push('Physical Attributes');
  if (analysis.tactical.overall >= 85) areas.push('Tactical Awareness');
  return areas;
}

function getPriorityDevelopment(analysis: any) {
  const categories = ['technical', 'physical', 'tactical'];
  return categories.reduce((lowest, current) =>
    analysis[current].overall < analysis[lowest].overall ? current : lowest,
  );
}
