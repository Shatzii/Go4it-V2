import { NextResponse } from 'next/server';

// Reverse recruiting - coaches finding players who fit their systems
const coachProfiles = [
  {
    id: 'mick-cronin-ucla',
    name: 'Mick Cronin',
    school: 'UCLA',
    sport: 'Basketball',
    position: 'Head Coach',
    coachingProfile: {
      style: 'Defensive-minded, motion offense',
      philosophy: 'Tough defense, smart offense, character over talent',
      systemType: 'motion-offense',
      recruitingPriorities: [
        'Character',
        'Basketball IQ',
        'Defensive mindset',
        'Academic excellence',
      ],
      playerTypes: {
        PG: ['High IQ', 'Leader', 'Tough defender', 'Good shooter'],
        SG: ['Versatile', 'Athletic', 'Can guard multiple positions'],
        SF: ['Length', 'Versatility', 'Basketball IQ'],
        PF: ['Skilled', 'Can step out', 'Rebounding'],
        C: ['Rim protector', 'Can pass', 'Fundamental'],
      },
    },
    currentNeeds: {
      PG: { priority: 'high', timeline: 'immediate', role: 'starter' },
      SG: { priority: 'medium', timeline: 'future', role: 'depth' },
      SF: { priority: 'low', timeline: 'future', role: 'depth' },
      PF: { priority: 'high', timeline: 'immediate', role: 'starter' },
      C: { priority: 'medium', timeline: 'immediate', role: 'backup' },
    },
    searchCriteria: {
      academics: { minGPA: 3.5, minSAT: 1200 },
      athletics: { minGAR: 85, positions: ['PG', 'PF'] },
      character: { leadership: true, coachable: true },
      geographic: { preference: 'West Coast', willingToTravel: true },
    },
  },
  {
    id: 'jon-scheyer-duke',
    name: 'Jon Scheyer',
    school: 'Duke University',
    sport: 'Basketball',
    position: 'Head Coach',
    coachingProfile: {
      style: 'Aggressive defense, skilled offense',
      philosophy: 'Elite talent, high character, academic excellence',
      systemType: 'motion-offense',
      recruitingPriorities: ['Elite talent', 'Character', 'Leadership', 'Academic fit'],
      playerTypes: {
        PG: ['Elite playmaker', 'Leader', 'Clutch performer'],
        SG: ['Skilled scorer', 'Athletic', 'Versatile'],
        SF: ['Length', 'Skill', 'Basketball IQ'],
        PF: ['Skilled big', 'Can stretch floor', 'Athletic'],
        C: ['Rim protector', 'Skilled', 'Can play both ends'],
      },
    },
    currentNeeds: {
      PG: { priority: 'low', timeline: 'future', role: 'depth' },
      SG: { priority: 'high', timeline: 'immediate', role: 'starter' },
      SF: { priority: 'medium', timeline: 'immediate', role: 'backup' },
      PF: { priority: 'high', timeline: 'immediate', role: 'starter' },
      C: { priority: 'medium', timeline: 'future', role: 'backup' },
    },
    searchCriteria: {
      academics: { minGPA: 3.7, minSAT: 1350 },
      athletics: { minGAR: 90, positions: ['SG', 'PF'] },
      character: { leadership: true, coachable: true },
      geographic: { preference: 'National', willingToTravel: true },
    },
  },
  {
    id: 'dusty-may-michigan',
    name: 'Dusty May',
    school: 'University of Michigan',
    sport: 'Basketball',
    position: 'Head Coach',
    coachingProfile: {
      style: 'Up-tempo, skilled offense',
      philosophy: 'High basketball IQ, team chemistry, versatility',
      systemType: 'motion-offense',
      recruitingPriorities: ['Basketball IQ', 'Team chemistry', 'Versatility', 'Character'],
      playerTypes: {
        PG: ['High IQ', 'Versatile', 'Team-first'],
        SG: ['Skilled', 'Can play multiple positions', 'Smart'],
        SF: ['Versatile', 'High IQ', 'Team player'],
        PF: ['Skilled', 'Can step out', 'Team-oriented'],
        C: ['Skilled', 'Can pass', 'Team player'],
      },
    },
    currentNeeds: {
      PG: { priority: 'medium', timeline: 'immediate', role: 'backup' },
      SG: { priority: 'high', timeline: 'immediate', role: 'starter' },
      SF: { priority: 'medium', timeline: 'future', role: 'depth' },
      PF: { priority: 'high', timeline: 'immediate', role: 'starter' },
      C: { priority: 'low', timeline: 'future', role: 'depth' },
    },
    searchCriteria: {
      academics: { minGPA: 3.3, minSAT: 1100 },
      athletics: { minGAR: 82, positions: ['SG', 'PF'] },
      character: { teamFirst: true, coachable: true },
      geographic: { preference: 'Midwest', willingToTravel: true },
    },
  },
];

const athleteDatabase = [
  {
    id: 'athlete-001',
    name: 'Marcus Thompson',
    position: 'PG',
    year: 'Senior',
    location: 'Los Angeles, CA',
    profile: {
      academics: { gpa: 3.8, sat: 1280, act: 28 },
      athletics: { gar: 89, height: '6\'2"', weight: '180 lbs' },
      skills: {
        ballHandling: 92,
        shooting: 87,
        passing: 95,
        defense: 84,
        leadership: 91,
        basketballIQ: 94,
      },
      character: {
        leadership: true,
        coachable: true,
        teamFirst: true,
        workEthic: 'Exceptional',
      },
      highlights: {
        pointsPerGame: 18.5,
        assistsPerGame: 8.2,
        stealsPerGame: 2.1,
        fieldGoalPercentage: 0.472,
        threePointPercentage: 0.389,
      },
    },
    availability: {
      committed: false,
      interests: ['UCLA', 'Duke', 'Stanford'],
      timeline: 'Spring 2025',
      visitSchedule: [],
    },
  },
  {
    id: 'athlete-002',
    name: 'Jordan Davis',
    position: 'PF',
    year: 'Senior',
    location: 'Dallas, TX',
    profile: {
      academics: { gpa: 3.6, sat: 1240, act: 27 },
      athletics: { gar: 91, height: '6\'8"', weight: '215 lbs' },
      skills: {
        postMoves: 88,
        shooting: 89,
        rebounding: 94,
        defense: 87,
        versatility: 93,
        basketballIQ: 86,
      },
      character: {
        leadership: true,
        coachable: true,
        teamFirst: true,
        workEthic: 'High',
      },
      highlights: {
        pointsPerGame: 22.3,
        reboundsPerGame: 11.7,
        blocksPerGame: 2.4,
        fieldGoalPercentage: 0.548,
        threePointPercentage: 0.367,
      },
    },
    availability: {
      committed: false,
      interests: ['Texas', 'Duke', 'Michigan'],
      timeline: 'Spring 2025',
      visitSchedule: [],
    },
  },
  {
    id: 'athlete-003',
    name: 'Alex Rivera',
    position: 'SG',
    year: 'Junior',
    location: 'Phoenix, AZ',
    profile: {
      academics: { gpa: 3.9, sat: 1420, act: 32 },
      athletics: { gar: 87, height: '6\'4"', weight: '190 lbs' },
      skills: {
        shooting: 96,
        ballHandling: 84,
        defense: 89,
        athleticism: 91,
        versatility: 87,
        basketballIQ: 90,
      },
      character: {
        leadership: true,
        coachable: true,
        teamFirst: true,
        workEthic: 'Exceptional',
      },
      highlights: {
        pointsPerGame: 24.8,
        assistsPerGame: 4.2,
        stealsPerGame: 1.8,
        fieldGoalPercentage: 0.501,
        threePointPercentage: 0.412,
      },
    },
    availability: {
      committed: false,
      interests: ['Stanford', 'Duke', 'UCLA'],
      timeline: 'Spring 2026',
      visitSchedule: [],
    },
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      coaches: coachProfiles,
      athletes: athleteDatabase,
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalCoaches: coachProfiles.length,
        totalAthletes: athleteDatabase.length,
        aiVersion: 'CoachDiscovery v2.0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch coach discovery data',
      },
      { status: 500 },
    );
  }
}

// Coach searches for players
export async function POST(request: Request) {
  try {
    const { coachId, searchFilters, systemRequirements } = await request.json();

    const coach = coachProfiles.find((c) => c.id === coachId);
    if (!coach) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coach not found',
        },
        { status: 404 },
      );
    }

    // Filter athletes based on coach's criteria
    const matches = athleteDatabase
      .filter((athlete) => {
        return matchesCoachCriteria(athlete, coach, searchFilters);
      })
      .map((athlete) => {
        const matchScore = calculateCoachMatchScore(athlete, coach, systemRequirements);
        return {
          ...athlete,
          matchScore,
          systemFit: calculateSystemFit(athlete, coach.coachingProfile.systemType),
          characterFit: calculateCharacterFit(athlete, coach.coachingProfile.recruitingPriorities),
          academicFit: calculateAcademicFit(athlete, coach.searchCriteria.academics),
          availability: athlete.availability,
          projectedRole: projectRole(athlete, coach.currentNeeds[athlete.position]),
          timeline: coach.currentNeeds[athlete.position]?.timeline || 'Future',
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      coach: coach.name,
      school: coach.school,
      matches: matches,
      totalMatches: matches.length,
      topMatches: matches.filter((m) => m.matchScore >= 85).length,
      analysis: {
        bestFit: matches[0] || null,
        systemMatches: matches.filter((m) => m.systemFit >= 80).length,
        immediateNeeds: matches.filter((m) => m.timeline === 'immediate').length,
        characterFits: matches.filter((m) => m.characterFit >= 85).length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process coach search',
      },
      { status: 500 },
    );
  }
}

function matchesCoachCriteria(athlete: any, coach: any, filters: any): boolean {
  // Check basic position match
  if (coach.currentNeeds[athlete.position]?.priority === 'none') {
    return false;
  }

  // Check academic requirements
  if (athlete.profile.academics.gpa < coach.searchCriteria.academics.minGPA) {
    return false;
  }

  if (athlete.profile.academics.sat < coach.searchCriteria.academics.minSAT) {
    return false;
  }

  // Check athletic requirements
  if (athlete.profile.athletics.gar < coach.searchCriteria.athletics.minGAR) {
    return false;
  }

  // Check availability
  if (athlete.availability.committed) {
    return false;
  }

  // Apply additional filters if provided
  if (filters) {
    if (filters.minHeight && parseInt(athlete.profile.athletics.height) < filters.minHeight) {
      return false;
    }

    if (filters.maxWeight && parseInt(athlete.profile.athletics.weight) > filters.maxWeight) {
      return false;
    }

    if (filters.year && athlete.year !== filters.year) {
      return false;
    }
  }

  return true;
}

function calculateCoachMatchScore(athlete: any, coach: any, systemRequirements: any): number {
  let score = 0;

  // System fit (40%)
  const systemFit = calculateSystemFit(athlete, coach.coachingProfile.systemType);
  score += systemFit * 0.4;

  // Character fit (30%)
  const characterFit = calculateCharacterFit(athlete, coach.coachingProfile.recruitingPriorities);
  score += characterFit * 0.3;

  // Academic fit (20%)
  const academicFit = calculateAcademicFit(athlete, coach.searchCriteria.academics);
  score += academicFit * 0.2;

  // Need priority (10%)
  const needPriority = coach.currentNeeds[athlete.position]?.priority || 'low';
  if (needPriority === 'high') score += 10;
  else if (needPriority === 'medium') score += 5;

  return Math.round(score);
}

function calculateSystemFit(athlete: any, systemType: string): number {
  const skills = athlete.profile.skills;

  switch (systemType) {
    case 'motion-offense':
      return Math.round(
        skills.basketballIQ * 0.3 +
          skills.passing * 0.25 +
          skills.shooting * 0.25 +
          skills.versatility * 0.2,
      );
    case 'spread-offense':
      return Math.round(
        skills.shooting * 0.4 + skills.ballHandling * 0.3 + skills.basketballIQ * 0.3,
      );
    case 'high-low-post':
      return Math.round(skills.postMoves * 0.4 + skills.passing * 0.3 + skills.rebounding * 0.3);
    default:
      return Math.round((skills.basketballIQ + skills.shooting + skills.defense) / 3);
  }
}

function calculateCharacterFit(athlete: any, priorities: string[]): number {
  let score = 0;
  const character = athlete.profile.character;

  priorities.forEach((priority) => {
    switch (priority.toLowerCase()) {
      case 'character':
        score += character.teamFirst ? 25 : 0;
        break;
      case 'leadership':
        score += character.leadership ? 25 : 0;
        break;
      case 'basketball iq':
        score += athlete.profile.skills.basketballIQ * 0.25;
        break;
      case 'academic excellence':
        score += athlete.profile.academics.gpa >= 3.5 ? 25 : 0;
        break;
      default:
        score += 15;
    }
  });

  return Math.min(100, score);
}

function calculateAcademicFit(athlete: any, requirements: any): number {
  let score = 0;

  // GPA score
  if (athlete.profile.academics.gpa >= requirements.minGPA) {
    score += 50;
    // Bonus for exceeding minimum
    score += Math.min(25, (athlete.profile.academics.gpa - requirements.minGPA) * 10);
  }

  // SAT score
  if (athlete.profile.academics.sat >= requirements.minSAT) {
    score += 50;
    // Bonus for exceeding minimum
    score += Math.min(25, (athlete.profile.academics.sat - requirements.minSAT) / 10);
  }

  return Math.min(100, score);
}

function projectRole(athlete: any, need: any): string {
  if (!need) return 'Future prospect';

  const priority = need.priority;
  const timeline = need.timeline;

  if (priority === 'high' && timeline === 'immediate') {
    return 'Immediate starter';
  } else if (priority === 'medium' && timeline === 'immediate') {
    return 'Rotation player';
  } else if (priority === 'high' && timeline === 'future') {
    return 'Future starter';
  } else {
    return 'Depth/Development';
  }
}
