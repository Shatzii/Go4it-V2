import { NextResponse } from 'next/server';

// Advanced AI matching with coaching schemes and roster analysis
const coachingSchemes = [
  {
    id: 'motion-offense',
    name: 'Motion Offense',
    description: 'Continuous movement, screening, and cutting',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    requirements: {
      PG: ['High Basketball IQ', 'Court Vision', 'Decision Making'],
      SG: ['Shooting', 'Movement', 'Versatility'],
      SF: ['Versatility', 'Length', 'Basketball IQ'],
      PF: ['Mobility', 'Shooting', 'Rebounding'],
      C: ['Mobility', 'Passing', 'Rim Protection'],
    },
    schools: ['UCLA', 'Stanford', 'Duke'],
  },
  {
    id: 'spread-offense',
    name: 'Spread Offense',
    description: 'Five-out spacing with drive-and-kick',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    requirements: {
      PG: ['Penetration', 'Passing', 'Three-point shooting'],
      SG: ['Three-point shooting', 'Spot-up ability', 'Movement'],
      SF: ['Three-point shooting', 'Versatility', 'Length'],
      PF: ['Stretch-four ability', 'Three-point shooting', 'Rebounding'],
      C: ['Perimeter skills', 'Three-point shooting', 'Mobility'],
    },
    schools: ['Texas', 'Arizona', 'Oregon'],
  },
  {
    id: 'high-low-post',
    name: 'High-Low Post',
    description: 'Traditional inside-out basketball',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    requirements: {
      PG: ['Entry passing', 'Court vision', 'Three-point shooting'],
      SG: ['Mid-range shooting', 'Cutting', 'Defensive intensity'],
      SF: ['Versatility', 'Rebounding', 'Mid-range game'],
      PF: ['Post skills', 'Rebounding', 'Interior presence'],
      C: ['Post moves', 'Passing', 'Rim protection'],
    },
    schools: ['Michigan', 'Notre Dame', 'North Carolina'],
  },
  {
    id: 'pressing-defense',
    name: 'Pressing Defense',
    description: 'Full-court pressure and trapping',
    positions: ['PG', 'SG', 'SF', 'PF', 'C'],
    requirements: {
      PG: ['Pressure handling', 'Speed', 'Decision making'],
      SG: ['Lateral quickness', 'Anticipation', 'Length'],
      SF: ['Versatility', 'Length', 'Athleticism'],
      PF: ['Mobility', 'Length', 'Help defense'],
      C: ['Rim protection', 'Rebounding', 'Shot blocking'],
    },
    schools: ['Florida', 'Louisville', 'Virginia'],
  },
];

const rosterAnalysis = [
  {
    schoolId: 'ucla',
    school: 'UCLA',
    currentRoster: {
      PG: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
      SG: { current: 3, scholarships: 3, graduating: 1, transfers: 1 },
      SF: { current: 2, scholarships: 2, graduating: 0, transfers: 0 },
      PF: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
      C: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
    },
    needs: {
      PG: { priority: 'high', spots: 2, type: 'starter' },
      SG: { priority: 'medium', spots: 1, type: 'depth' },
      SF: { priority: 'low', spots: 1, type: 'depth' },
      PF: { priority: 'high', spots: 1, type: 'starter' },
      C: { priority: 'medium', spots: 1, type: 'backup' },
    },
    coachingScheme: 'motion-offense',
    recruitingClass: {
      committed: 3,
      available: 2,
      targets: 8,
    },
  },
  {
    schoolId: 'duke',
    school: 'Duke University',
    currentRoster: {
      PG: { current: 2, scholarships: 2, graduating: 0, transfers: 0 },
      SG: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
      SF: { current: 3, scholarships: 3, graduating: 1, transfers: 0 },
      PF: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
      C: { current: 2, scholarships: 2, graduating: 0, transfers: 1 },
    },
    needs: {
      PG: { priority: 'low', spots: 1, type: 'depth' },
      SG: { priority: 'high', spots: 1, type: 'starter' },
      SF: { priority: 'medium', spots: 1, type: 'backup' },
      PF: { priority: 'high', spots: 1, type: 'starter' },
      C: { priority: 'medium', spots: 1, type: 'backup' },
    },
    coachingScheme: 'motion-offense',
    recruitingClass: {
      committed: 2,
      available: 3,
      targets: 6,
    },
  },
  {
    schoolId: 'texas',
    school: 'University of Texas',
    currentRoster: {
      PG: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
      SG: { current: 2, scholarships: 2, graduating: 0, transfers: 0 },
      SF: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
      PF: { current: 3, scholarships: 3, graduating: 1, transfers: 1 },
      C: { current: 2, scholarships: 2, graduating: 1, transfers: 0 },
    },
    needs: {
      PG: { priority: 'high', spots: 1, type: 'starter' },
      SG: { priority: 'medium', spots: 1, type: 'depth' },
      SF: { priority: 'high', spots: 1, type: 'starter' },
      PF: { priority: 'low', spots: 1, type: 'depth' },
      C: { priority: 'high', spots: 1, type: 'starter' },
    },
    coachingScheme: 'spread-offense',
    recruitingClass: {
      committed: 1,
      available: 4,
      targets: 10,
    },
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      coachingSchemes: coachingSchemes,
      rosterAnalysis: rosterAnalysis,
      metadata: {
        lastUpdated: new Date().toISOString(),
        aiVersion: 'AdvancedMatching v3.0',
        dataPoints: [
          'Coaching schemes',
          'Roster limits',
          'Position needs',
          'Transfer portal',
          'Graduation impact',
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch advanced matching data',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { athleteProfile, position, highlightMetrics } = await request.json();

    // Advanced AI matching based on coaching schemes and roster needs
    const matches = rosterAnalysis
      .map((school) => {
        const scheme = coachingSchemes.find((s) => s.id === school.coachingScheme);
        const positionNeed = school.needs[position];

        if (!positionNeed || !scheme) return null;

        // Calculate scheme fit
        const schemeRequirements = scheme.requirements[position] || [];
        const schemeFit = calculateSchemeFit(athleteProfile, schemeRequirements);

        // Calculate roster opportunity
        const rosterOpportunity = calculateRosterOpportunity(positionNeed, school.recruitingClass);

        // Calculate competition level
        const competition = calculateCompetition(
          school.recruitingClass.targets,
          school.recruitingClass.available,
        );

        // Overall match score
        const matchScore = Math.round(
          schemeFit * 0.4 + rosterOpportunity * 0.35 + competition * 0.25,
        );

        return {
          schoolId: school.schoolId,
          school: school.school,
          matchScore,
          schemeFit,
          rosterOpportunity,
          competition,
          positionNeed: positionNeed.priority,
          roleProjection: positionNeed.type,
          availableSpots: positionNeed.spots,
          schemeMatch: scheme.name,
          keyRequirements: schemeRequirements,
          recruitingTimeline: positionNeed.priority === 'high' ? 'Immediate' : 'Long-term',
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      matches: matches,
      analysis: {
        topMatch: matches[0],
        schemeAnalysis: analyzeSchemeCompatibility(athleteProfile, position),
        rosterOpportunities: matches.filter((m) => m.rosterOpportunity > 80).length,
        immediateNeeds: matches.filter((m) => m.positionNeed === 'high').length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process advanced matching',
      },
      { status: 500 },
    );
  }
}

function calculateSchemeFit(profile: any, requirements: string[]): number {
  // AI analysis of player skills vs scheme requirements
  const skillMatch = requirements.reduce((score, req) => {
    const skill = profile.skills?.[req.toLowerCase().replace(/\s+/g, '_')] || 0;
    return score + skill * 20;
  }, 0);

  return Math.min(100, skillMatch / requirements.length);
}

function calculateRosterOpportunity(need: any, recruitingClass: any): number {
  let score = 0;

  // Priority weight
  if (need.priority === 'high') score += 40;
  else if (need.priority === 'medium') score += 25;
  else score += 10;

  // Available spots
  score += need.spots * 15;

  // Role projection
  if (need.type === 'starter') score += 30;
  else if (need.type === 'backup') score += 20;
  else score += 10;

  // Competition factor
  const competitionLevel = recruitingClass.targets / recruitingClass.available;
  score += Math.max(0, 20 - competitionLevel * 5);

  return Math.min(100, score);
}

function calculateCompetition(targets: number, available: number): number {
  const ratio = available / targets;
  return Math.min(100, ratio * 100);
}

function analyzeSchemeCompatibility(profile: any, position: string): any {
  return {
    bestSchemes: ['motion-offense', 'spread-offense'],
    compatibility: {
      'motion-offense': 85,
      'spread-offense': 92,
      'high-low-post': 67,
      'pressing-defense': 78,
    },
    strengths: ['Three-point shooting', 'Court vision', 'Versatility'],
    development: ['Post moves', 'Defensive intensity'],
  };
}
