import { NextResponse } from 'next/server';

// Mock data for verified athletes with GAR analysis
const verifiedAthletes = [
  {
    id: 1,
    name: 'Marcus Thompson',
    sport: 'Basketball',
    position: 'Point Guard',
    garScore: 89,
    verified: true,
    verificationDate: '2024-01-15',
    achievements: ['NCAA Eligible', 'State Champion', 'All-Conference'],
    stats: {
      gpa: 3.8,
      satScore: 1450,
      heightInches: 73,
      weightPounds: 180
    }
  },
  {
    id: 2,
    name: 'Sofia Martinez',
    sport: 'Soccer',
    position: 'Midfielder',
    garScore: 92,
    verified: true,
    verificationDate: '2024-01-14',
    achievements: ['NCAA Eligible', 'Regional MVP', 'Team Captain'],
    stats: {
      gpa: 3.9,
      satScore: 1520,
      heightInches: 66,
      weightPounds: 130
    }
  },
  {
    id: 3,
    name: 'James Wilson',
    sport: 'Track & Field',
    position: '400m Sprinter',
    garScore: 87,
    verified: true,
    verificationDate: '2024-01-13',
    achievements: ['NCAA Eligible', 'State Record Holder', 'All-American'],
    stats: {
      gpa: 3.7,
      satScore: 1380,
      heightInches: 71,
      weightPounds: 165
    }
  },
  {
    id: 4,
    name: 'Emily Chen',
    sport: 'Swimming',
    position: 'Freestyle',
    garScore: 94,
    verified: true,
    verificationDate: '2024-01-12',
    achievements: ['NCAA Eligible', 'Olympic Trials Qualifier', 'National Champion'],
    stats: {
      gpa: 4.0,
      satScore: 1580,
      heightInches: 68,
      weightPounds: 140
    }
  },
  {
    id: 5,
    name: 'Tyler Rodriguez',
    sport: 'Baseball',
    position: 'Pitcher',
    garScore: 85,
    verified: true,
    verificationDate: '2024-01-11',
    achievements: ['NCAA Eligible', 'Perfect Game Showcase', 'All-State'],
    stats: {
      gpa: 3.6,
      satScore: 1320,
      heightInches: 75,
      weightPounds: 190
    }
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      athletes: verifiedAthletes,
      totalVerified: verifiedAthletes.length,
      metadata: {
        lastUpdated: new Date().toISOString(),
        verificationCriteria: [
          'Official GAR Score Analysis',
          'Video Performance Review',
          'Academic Verification',
          'Athletic Achievement Validation'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch verified athletes',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { athleteId, verificationType } = await request.json();
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Find athlete
    const athlete = verifiedAthletes.find(a => a.id === athleteId);
    if (!athlete) {
      return NextResponse.json({
        success: false,
        error: 'Athlete not found'
      }, { status: 404 });
    }
    
    // Update verification status
    athlete.verified = true;
    athlete.verificationDate = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      message: 'Athlete verification updated successfully',
      athlete: athlete
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update verification status',
      details: error.message
    }, { status: 500 });
  }
}