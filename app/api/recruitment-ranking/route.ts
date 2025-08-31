import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, videoAnalysis } from '@/shared/schema';
import { eq, and, or, desc, asc } from 'drizzle-orm';

// Regional Athletic Rankings and Recruitment Analysis
interface AthleteRanking {
  id: string;
  name: string;
  sport: string;
  position: string;
  city: string;
  state: string;
  region: string;
  garScore: number;
  nationalRank: number;
  regionalRank: number;
  cityRank: number;
  stateRank: number;
  recruitmentScore: number;
  collegeInterest: number;
  scholarshipPotential: number;
  highlights: string[];
  stats: any;
}

// US Geographic Regions for Athletic Rankings
const US_REGIONS = {
  Northeast: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'],
  Southeast: [
    'DE',
    'MD',
    'DC',
    'VA',
    'WV',
    'KY',
    'TN',
    'NC',
    'SC',
    'GA',
    'FL',
    'AL',
    'MS',
    'AR',
    'LA',
  ],
  Midwest: ['OH', 'MI', 'IN', 'WI', 'IL', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
  Southwest: ['TX', 'OK', 'NM', 'AZ'],
  West: ['MT', 'WY', 'CO', 'UT', 'ID', 'WA', 'OR', 'NV', 'CA', 'AK', 'HI'],
};

// Sample Athletic Rankings Data (this would be populated from real athlete data)
const SAMPLE_RANKINGS: AthleteRanking[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    sport: 'Basketball',
    position: 'Point Guard',
    city: 'Atlanta',
    state: 'GA',
    region: 'Southeast',
    garScore: 94,
    nationalRank: 15,
    regionalRank: 3,
    cityRank: 1,
    stateRank: 2,
    recruitmentScore: 92,
    collegeInterest: 25,
    scholarshipPotential: 95,
    highlights: ['State Championship MVP', 'All-American Honors', 'Nike Elite Camp Invite'],
    stats: {
      ppg: 22.5,
      apg: 8.2,
      rpg: 4.1,
      fg: 0.485,
      threePt: 0.389,
    },
  },
  {
    id: '2',
    name: 'Sarah Williams',
    sport: 'Soccer',
    position: 'Forward',
    city: 'Dallas',
    state: 'TX',
    region: 'Southwest',
    garScore: 91,
    nationalRank: 28,
    regionalRank: 5,
    cityRank: 2,
    stateRank: 4,
    recruitmentScore: 89,
    collegeInterest: 18,
    scholarshipPotential: 88,
    highlights: [
      'Regional Player of the Year',
      'Olympic Development Program',
      'Club National Championship',
    ],
    stats: {
      goals: 31,
      assists: 15,
      minutesPlayed: 1680,
      shotsOnTarget: 0.72,
    },
  },
  {
    id: '3',
    name: 'David Chen',
    sport: 'Tennis',
    position: 'Singles',
    city: 'Los Angeles',
    state: 'CA',
    region: 'West',
    garScore: 89,
    nationalRank: 42,
    regionalRank: 8,
    cityRank: 3,
    stateRank: 6,
    recruitmentScore: 85,
    collegeInterest: 12,
    scholarshipPotential: 82,
    highlights: ['USTA National Championships', 'ITF Junior Circuit', 'State Singles Champion'],
    stats: {
      winLoss: '32-8',
      utr: 11.5,
      nationalPoints: 1250,
      sectionalRank: 3,
    },
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    sport: 'Track & Field',
    position: 'Sprinter',
    city: 'Miami',
    state: 'FL',
    region: 'Southeast',
    garScore: 92,
    nationalRank: 19,
    regionalRank: 2,
    cityRank: 1,
    stateRank: 1,
    recruitmentScore: 90,
    collegeInterest: 22,
    scholarshipPotential: 91,
    highlights: ['State Record Holder', 'Junior Olympics Champion', 'World Youth Championships'],
    stats: {
      time100m: 11.12,
      time200m: 22.85,
      personalBest: '11.08 (100m)',
      season: '2024',
    },
  },
  {
    id: '5',
    name: 'Tyler Thompson',
    sport: 'Football',
    position: 'Quarterback',
    city: 'Chicago',
    state: 'IL',
    region: 'Midwest',
    garScore: 88,
    nationalRank: 67,
    regionalRank: 12,
    cityRank: 4,
    stateRank: 8,
    recruitmentScore: 84,
    collegeInterest: 15,
    scholarshipPotential: 79,
    highlights: ['All-Conference First Team', 'State Playoff MVP', 'Elite 11 Camp'],
    stats: {
      passingYards: 3250,
      touchdowns: 31,
      interceptions: 8,
      completion: 0.652,
      rating: 142.5,
    },
  },
  {
    id: '6',
    name: 'Ashley Davis',
    sport: 'Volleyball',
    position: 'Outside Hitter',
    city: 'Seattle',
    state: 'WA',
    region: 'West',
    garScore: 87,
    nationalRank: 89,
    regionalRank: 15,
    cityRank: 2,
    stateRank: 5,
    recruitmentScore: 83,
    collegeInterest: 11,
    scholarshipPotential: 80,
    highlights: [
      'All-State Selection',
      'Club National Championships',
      'USA Volleyball High Performance',
    ],
    stats: {
      kills: 385,
      attacks: 892,
      percentage: 0.431,
      blocks: 67,
      digs: 156,
    },
  },
  {
    id: '7',
    name: 'Jordan Martinez',
    sport: 'Baseball',
    position: 'Pitcher',
    city: 'Phoenix',
    state: 'AZ',
    region: 'Southwest',
    garScore: 90,
    nationalRank: 35,
    regionalRank: 6,
    cityRank: 1,
    stateRank: 3,
    recruitmentScore: 87,
    collegeInterest: 19,
    scholarshipPotential: 85,
    highlights: ['Perfect Game All-American', 'Area Code Games', 'State Championship'],
    stats: {
      era: 1.85,
      innings: 78.2,
      strikeouts: 102,
      walks: 23,
      velocity: 92,
    },
  },
  {
    id: '8',
    name: 'Madison Lee',
    sport: 'Swimming',
    position: 'Freestyle',
    city: 'Austin',
    state: 'TX',
    region: 'Southwest',
    garScore: 93,
    nationalRank: 22,
    regionalRank: 4,
    cityRank: 1,
    stateRank: 2,
    recruitmentScore: 91,
    collegeInterest: 24,
    scholarshipPotential: 93,
    highlights: [
      'USA Swimming National Championships',
      'Olympic Trials Qualifier',
      'State Record Holder',
    ],
    stats: {
      time50Free: 22.45,
      time100Free: 49.12,
      personalBest: '48.89 (100 Free)',
      nationalTimes: 8,
    },
  },
];

// College Match Algorithm
class CollegeMatchAlgorithm {
  static calculateMatch(athlete: AthleteRanking, college: any): number {
    let matchScore = 0;

    // Academic fit (30%)
    const academicFit = this.calculateAcademicFit(athlete, college);
    matchScore += academicFit * 0.3;

    // Athletic fit (40%)
    const athleticFit = this.calculateAthleticFit(athlete, college);
    matchScore += athleticFit * 0.4;

    // Geographic preference (15%)
    const geographicFit = this.calculateGeographicFit(athlete, college);
    matchScore += geographicFit * 0.15;

    // Financial fit (15%)
    const financialFit = this.calculateFinancialFit(athlete, college);
    matchScore += financialFit * 0.15;

    return Math.round(matchScore);
  }

  private static calculateAcademicFit(athlete: any, college: any): number {
    // Mock academic fit calculation
    const baseScore = 75;
    const garBonus = (athlete.garScore - 80) * 0.5;
    return Math.min(100, Math.max(0, baseScore + garBonus));
  }

  private static calculateAthleticFit(athlete: AthleteRanking, college: any): number {
    // Calculate based on athlete's ranking vs college's typical recruit level
    let fitScore = 50;

    if (athlete.nationalRank <= 50) {
      fitScore = 95; // Top D1 schools
    } else if (athlete.nationalRank <= 150) {
      fitScore = 85; // Mid-level D1 schools
    } else if (athlete.nationalRank <= 300) {
      fitScore = 75; // Lower D1 / Top D2
    } else {
      fitScore = 65; // D2/D3 schools
    }

    return fitScore;
  }

  private static calculateGeographicFit(athlete: AthleteRanking, college: any): number {
    // Preference for regional schools
    return 80; // Mock geographic fit
  }

  private static calculateFinancialFit(athlete: AthleteRanking, college: any): number {
    // Scholarship potential vs cost
    return athlete.scholarshipPotential * 0.8;
  }
}

// Recruitment Prediction Algorithm
class RecruitmentPredictor {
  static predictRecruitmentOutcome(athlete: AthleteRanking): any {
    const predictions = {
      d1Probability: this.calculateD1Probability(athlete),
      d2Probability: this.calculateD2Probability(athlete),
      d3Probability: this.calculateD3Probability(athlete),
      scholarshipProbability: this.calculateScholarshipProbability(athlete),
      timelineEstimate: this.estimateRecruitmentTimeline(athlete),
      recommendedActions: this.generateRecommendedActions(athlete),
    };

    return predictions;
  }

  private static calculateD1Probability(athlete: AthleteRanking): number {
    if (athlete.nationalRank <= 100) return 90;
    if (athlete.nationalRank <= 200) return 75;
    if (athlete.nationalRank <= 400) return 50;
    if (athlete.nationalRank <= 600) return 25;
    return 10;
  }

  private static calculateD2Probability(athlete: AthleteRanking): number {
    if (athlete.nationalRank <= 300) return 95;
    if (athlete.nationalRank <= 500) return 85;
    if (athlete.nationalRank <= 800) return 70;
    return 45;
  }

  private static calculateD3Probability(athlete: AthleteRanking): number {
    if (athlete.garScore >= 75) return 90;
    if (athlete.garScore >= 65) return 80;
    if (athlete.garScore >= 55) return 70;
    return 50;
  }

  private static calculateScholarshipProbability(athlete: AthleteRanking): number {
    return Math.min(95, athlete.scholarshipPotential);
  }

  private static estimateRecruitmentTimeline(athlete: AthleteRanking): any {
    return {
      contactPhase: '3-6 months',
      visitPhase: '6-9 months',
      offerPhase: '9-12 months',
      commitmentPhase: '12-15 months',
    };
  }

  private static generateRecommendedActions(athlete: AthleteRanking): string[] {
    const actions = [];

    if (athlete.nationalRank <= 100) {
      actions.push('Target top-tier D1 programs');
      actions.push('Attend elite showcases and camps');
      actions.push('Maintain strong academic performance');
    } else if (athlete.nationalRank <= 300) {
      actions.push('Focus on mid-level D1 and top D2 programs');
      actions.push('Increase visibility through competitions');
      actions.push('Build strong highlight reel');
    } else {
      actions.push('Consider D2 and D3 opportunities');
      actions.push('Focus on regional and local programs');
      actions.push('Emphasize academic achievements');
    }

    return actions;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const region = searchParams.get('region');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const rankingType = searchParams.get('type') || 'national';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Filter athletes based on parameters
    let filteredAthletes = SAMPLE_RANKINGS;

    if (sport) {
      filteredAthletes = filteredAthletes.filter(
        (athlete) => athlete.sport.toLowerCase() === sport.toLowerCase(),
      );
    }

    if (region) {
      filteredAthletes = filteredAthletes.filter((athlete) => athlete.region === region);
    }

    if (state) {
      filteredAthletes = filteredAthletes.filter((athlete) => athlete.state === state);
    }

    if (city) {
      filteredAthletes = filteredAthletes.filter(
        (athlete) => athlete.city.toLowerCase() === city.toLowerCase(),
      );
    }

    // Sort by appropriate ranking
    const sortField =
      rankingType === 'national'
        ? 'nationalRank'
        : rankingType === 'regional'
          ? 'regionalRank'
          : rankingType === 'state'
            ? 'stateRank'
            : rankingType === 'city'
              ? 'cityRank'
              : 'nationalRank';

    filteredAthletes.sort((a, b) => a[sortField] - b[sortField]);

    // Limit results
    const limitedAthletes = filteredAthletes.slice(0, limit);

    // Add recruitment predictions for each athlete
    const athletesWithPredictions = limitedAthletes.map((athlete) => ({
      ...athlete,
      recruitmentPrediction: RecruitmentPredictor.predictRecruitmentOutcome(athlete),
    }));

    return NextResponse.json({
      success: true,
      athletes: athletesWithPredictions,
      total: filteredAthletes.length,
      rankings: {
        type: rankingType,
        sport,
        region,
        state,
        city,
      },
      summary: {
        totalAthletes: SAMPLE_RANKINGS.length,
        averageGARScore:
          SAMPLE_RANKINGS.reduce((sum, a) => sum + a.garScore, 0) / SAMPLE_RANKINGS.length,
        topPerformers: SAMPLE_RANKINGS.filter((a) => a.garScore >= 90).length,
        scholarshipCandidates: SAMPLE_RANKINGS.filter((a) => a.scholarshipPotential >= 85).length,
      },
    });
  } catch (error) {
    console.error('Recruitment ranking error:', error);
    return NextResponse.json({ error: 'Failed to fetch recruitment rankings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, athleteId, collegeId, preferences } = await request.json();

    if (action === 'college-match') {
      // Calculate college matches for an athlete
      const athlete = SAMPLE_RANKINGS.find((a) => a.id === athleteId);
      if (!athlete) {
        return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
      }

      // Mock college data (would come from real database)
      const colleges = [
        { id: 1, name: 'University of Alabama', division: 'D1', state: 'AL' },
        { id: 2, name: 'Ohio State University', division: 'D1', state: 'OH' },
        { id: 3, name: 'University of Texas', division: 'D1', state: 'TX' },
      ];

      const matches = colleges.map((college) => ({
        ...college,
        matchScore: CollegeMatchAlgorithm.calculateMatch(athlete, college),
        fit: {
          academic: 85,
          athletic: 78,
          geographic: 72,
          financial: 80,
        },
      }));

      matches.sort((a, b) => b.matchScore - a.matchScore);

      return NextResponse.json({
        success: true,
        athlete,
        matches,
        recommendations: RecruitmentPredictor.predictRecruitmentOutcome(athlete),
      });
    }

    if (action === 'recruitment-timeline') {
      // Generate recruitment timeline for athlete
      const athlete = SAMPLE_RANKINGS.find((a) => a.id === athleteId);
      if (!athlete) {
        return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
      }

      const timeline = RecruitmentPredictor.estimateRecruitmentTimeline(athlete);

      return NextResponse.json({
        success: true,
        athlete,
        timeline,
        milestones: [
          { phase: 'Initial Contact', timeframe: '3-6 months', status: 'pending' },
          { phase: 'Campus Visits', timeframe: '6-9 months', status: 'pending' },
          { phase: 'Scholarship Offers', timeframe: '9-12 months', status: 'pending' },
          { phase: 'Final Commitment', timeframe: '12-15 months', status: 'pending' },
        ],
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Recruitment ranking POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process recruitment ranking request' },
      { status: 500 },
    );
  }
}
