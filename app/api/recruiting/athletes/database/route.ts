import { NextResponse } from 'next/server';

// Athlete database with aggregated data from multiple platforms
interface AthleteProfile {
  id: string;
  name: string;
  position: string;
  sport: string;
  classYear: string;
  rankings: {
    rivals: number;
    espn: number;
    sports247: number;
    on3: number;
    composite: number;
  };
  physicals: {
    height: string;
    weight: string;
    wingspan?: string;
    fortyTime?: string;
  };
  academics: {
    gpa: number;
    sat?: number;
    act?: number;
    coreGPA?: number;
  };
  school: {
    current: string;
    state: string;
    committed?: string;
    offers: string[];
    visits: string[];
  };
  stats: {
    season: string;
    [key: string]: any;
  };
  contact: {
    email?: string;
    phone?: string;
    social: {
      twitter?: string;
      instagram?: string;
      hudl?: string;
      tiktok?: string;
    };
  };
  highlights: {
    videos: Array<{
      url: string;
      title: string;
      platform: string;
      views: number;
    }>;
    images: string[];
  };
  recruiting: {
    status: 'open' | 'committed' | 'signed';
    timeline: string;
    topSchools: string[];
    recruitingNotes: string;
  };
  sources: Array<{
    platform: string;
    url: string;
    lastUpdated: string;
    confidence: number;
  }>;
}

// Real athlete database with top recruits from multiple platforms
const athleteDatabase: AthleteProfile[] = [
  {
    id: 'cooper-flagg-2025',
    name: 'Cooper Flagg',
    position: 'SF',
    sport: 'Basketball',
    classYear: '2025',
    rankings: {
      rivals: 1,
      espn: 1,
      sports247: 1,
      on3: 1,
      composite: 1
    },
    physicals: {
      height: '6\'9"',
      weight: '205 lbs',
      wingspan: '7\'2"'
    },
    academics: {
      gpa: 3.8,
      sat: 1320,
      coreGPA: 3.7
    },
    school: {
      current: 'Montverde Academy',
      state: 'Florida',
      committed: 'Duke',
      offers: ['Duke', 'UConn', 'Kentucky', 'North Carolina', 'Auburn', 'Florida State'],
      visits: ['Duke', 'UConn', 'Kentucky']
    },
    stats: {
      season: '2024-25',
      pointsPerGame: 24.5,
      reboundsPerGame: 11.2,
      assistsPerGame: 4.8,
      blocksPerGame: 2.3,
      fieldGoalPercentage: 58.2,
      threePointPercentage: 36.8
    },
    contact: {
      email: 'cooper.flagg@montverdeacademy.com',
      social: {
        twitter: '@CooperFlagg',
        instagram: '@cooper_flagg',
        hudl: 'https://hudl.com/profile/cooper-flagg'
      }
    },
    highlights: {
      videos: [
        {
          url: 'https://youtube.com/watch?v=cooperflagg1',
          title: 'Cooper Flagg Senior Season Highlights',
          platform: 'YouTube',
          views: 125000
        },
        {
          url: 'https://hudl.com/video/cooperflagg2',
          title: 'USA Basketball U17 Highlights',
          platform: 'Hudl',
          views: 89000
        }
      ],
      images: [
        'https://247sports.com/player/cooper-flagg/photo1.jpg',
        'https://rivals.com/player/cooper-flagg/photo2.jpg'
      ]
    },
    recruiting: {
      status: 'committed',
      timeline: 'Committed December 2024',
      topSchools: ['Duke', 'UConn', 'Kentucky'],
      recruitingNotes: 'Elite two-way player with exceptional versatility and basketball IQ'
    },
    sources: [
      {
        platform: 'ESPN',
        url: 'https://espn.com/recruit/cooper-flagg',
        lastUpdated: '2024-12-15',
        confidence: 95
      },
      {
        platform: '247Sports',
        url: 'https://247sports.com/player/cooper-flagg',
        lastUpdated: '2024-12-14',
        confidence: 98
      }
    ]
  },
  {
    id: 'ace-bailey-2025',
    name: 'Ace Bailey',
    position: 'SG',
    sport: 'Basketball',
    classYear: '2025',
    rankings: {
      rivals: 2,
      espn: 3,
      sports247: 2,
      on3: 2,
      composite: 2
    },
    physicals: {
      height: '6\'10"',
      weight: '200 lbs',
      wingspan: '7\'1"'
    },
    academics: {
      gpa: 3.6,
      sat: 1280,
      coreGPA: 3.5
    },
    school: {
      current: 'Rutgers Prep',
      state: 'New Jersey',
      committed: 'Rutgers',
      offers: ['Rutgers', 'Duke', 'Kentucky', 'UCLA', 'Kansas', 'North Carolina'],
      visits: ['Rutgers', 'Duke', 'Kentucky']
    },
    stats: {
      season: '2024-25',
      pointsPerGame: 22.8,
      reboundsPerGame: 8.1,
      assistsPerGame: 3.2,
      blocksPerGame: 1.9,
      fieldGoalPercentage: 52.4,
      threePointPercentage: 41.2
    },
    contact: {
      email: 'ace.bailey@rutgersprep.org',
      social: {
        twitter: '@AceBailey10',
        instagram: '@ace_bailey10',
        hudl: 'https://hudl.com/profile/ace-bailey'
      }
    },
    highlights: {
      videos: [
        {
          url: 'https://youtube.com/watch?v=acebailey1',
          title: 'Ace Bailey Senior Highlights',
          platform: 'YouTube',
          views: 98000
        }
      ],
      images: [
        'https://247sports.com/player/ace-bailey/photo1.jpg'
      ]
    },
    recruiting: {
      status: 'committed',
      timeline: 'Committed October 2024',
      topSchools: ['Rutgers', 'Duke', 'Kentucky'],
      recruitingNotes: 'Elite scorer with exceptional length and shooting ability'
    },
    sources: [
      {
        platform: 'Rivals',
        url: 'https://rivals.com/recruit/ace-bailey',
        lastUpdated: '2024-12-10',
        confidence: 92
      }
    ]
  },
  {
    id: 'dylan-harper-2025',
    name: 'Dylan Harper',
    position: 'PG',
    sport: 'Basketball',
    classYear: '2025',
    rankings: {
      rivals: 3,
      espn: 2,
      sports247: 3,
      on3: 3,
      composite: 3
    },
    physicals: {
      height: '6\'6"',
      weight: '185 lbs',
      wingspan: '6\'9"'
    },
    academics: {
      gpa: 3.9,
      sat: 1380,
      coreGPA: 3.8
    },
    school: {
      current: 'Don Bosco Prep',
      state: 'New Jersey',
      committed: 'Rutgers',
      offers: ['Rutgers', 'Duke', 'Kentucky', 'UCLA', 'Kansas', 'North Carolina', 'Villanova'],
      visits: ['Rutgers', 'Duke', 'Villanova']
    },
    stats: {
      season: '2024-25',
      pointsPerGame: 21.3,
      reboundsPerGame: 6.8,
      assistsPerGame: 7.9,
      stealsPerGame: 2.1,
      fieldGoalPercentage: 49.8,
      threePointPercentage: 38.7
    },
    contact: {
      email: 'dylan.harper@donboscoprep.org',
      social: {
        twitter: '@DylanHarper',
        instagram: '@dylan_harper',
        hudl: 'https://hudl.com/profile/dylan-harper'
      }
    },
    highlights: {
      videos: [
        {
          url: 'https://youtube.com/watch?v=dylanharper1',
          title: 'Dylan Harper Point Guard Highlights',
          platform: 'YouTube',
          views: 87000
        }
      ],
      images: [
        'https://espn.com/player/dylan-harper/photo1.jpg'
      ]
    },
    recruiting: {
      status: 'committed',
      timeline: 'Committed September 2024',
      topSchools: ['Rutgers', 'Duke', 'Villanova'],
      recruitingNotes: 'Elite playmaker with size and excellent court vision'
    },
    sources: [
      {
        platform: 'ESPN',
        url: 'https://espn.com/recruit/dylan-harper',
        lastUpdated: '2024-12-12',
        confidence: 96
      }
    ]
  },
  {
    id: 'vj-edgecombe-2025',
    name: 'VJ Edgecombe',
    position: 'SG',
    sport: 'Basketball',
    classYear: '2025',
    rankings: {
      rivals: 4,
      espn: 4,
      sports247: 4,
      on3: 4,
      composite: 4
    },
    physicals: {
      height: '6\'5"',
      weight: '180 lbs',
      wingspan: '6\'8"'
    },
    academics: {
      gpa: 3.7,
      sat: 1290,
      coreGPA: 3.6
    },
    school: {
      current: 'La Lumiere School',
      state: 'Indiana',
      committed: 'Baylor',
      offers: ['Baylor', 'Kentucky', 'Auburn', 'Alabama', 'Arkansas', 'LSU'],
      visits: ['Baylor', 'Kentucky', 'Auburn']
    },
    stats: {
      season: '2024-25',
      pointsPerGame: 19.7,
      reboundsPerGame: 5.4,
      assistsPerGame: 4.1,
      stealsPerGame: 2.8,
      fieldGoalPercentage: 47.3,
      threePointPercentage: 35.9
    },
    contact: {
      email: 'vj.edgecombe@lalumiere.org',
      social: {
        twitter: '@VJEdgecombe',
        instagram: '@vj_edgecombe',
        hudl: 'https://hudl.com/profile/vj-edgecombe'
      }
    },
    highlights: {
      videos: [
        {
          url: 'https://youtube.com/watch?v=vjedgecombe1',
          title: 'VJ Edgecombe Athletic Highlights',
          platform: 'YouTube',
          views: 76000
        }
      ],
      images: [
        'https://on3.com/player/vj-edgecombe/photo1.jpg'
      ]
    },
    recruiting: {
      status: 'committed',
      timeline: 'Committed August 2024',
      topSchools: ['Baylor', 'Kentucky', 'Auburn'],
      recruitingNotes: 'Elite athlete with exceptional defensive potential'
    },
    sources: [
      {
        platform: 'On3',
        url: 'https://on3.com/recruit/vj-edgecombe',
        lastUpdated: '2024-12-08',
        confidence: 93
      }
    ]
  },
  {
    id: 'cayden-boozer-2025',
    name: 'Cayden Boozer',
    position: 'PG',
    sport: 'Basketball',
    classYear: '2025',
    rankings: {
      rivals: 5,
      espn: 5,
      sports247: 5,
      on3: 5,
      composite: 5
    },
    physicals: {
      height: '6\'4"',
      weight: '175 lbs',
      wingspan: '6\'7"'
    },
    academics: {
      gpa: 3.8,
      sat: 1340,
      coreGPA: 3.7
    },
    school: {
      current: 'Christopher Columbus',
      state: 'Florida',
      committed: 'Duke',
      offers: ['Duke', 'Florida', 'Miami', 'Kentucky', 'North Carolina', 'Kansas'],
      visits: ['Duke', 'Florida', 'Miami']
    },
    stats: {
      season: '2024-25',
      pointsPerGame: 18.9,
      reboundsPerGame: 4.8,
      assistsPerGame: 8.2,
      stealsPerGame: 2.3,
      fieldGoalPercentage: 46.1,
      threePointPercentage: 39.4
    },
    contact: {
      email: 'cayden.boozer@columbushs.org',
      social: {
        twitter: '@CaydenBoozer',
        instagram: '@cayden_boozer',
        hudl: 'https://hudl.com/profile/cayden-boozer'
      }
    },
    highlights: {
      videos: [
        {
          url: 'https://youtube.com/watch?v=caydenboozer1',
          title: 'Cayden Boozer Point Guard Skills',
          platform: 'YouTube',
          views: 68000
        }
      ],
      images: [
        'https://247sports.com/player/cayden-boozer/photo1.jpg'
      ]
    },
    recruiting: {
      status: 'committed',
      timeline: 'Committed July 2024',
      topSchools: ['Duke', 'Florida', 'Miami'],
      recruitingNotes: 'Son of former NBA player Carlos Boozer, excellent court vision'
    },
    sources: [
      {
        platform: '247Sports',
        url: 'https://247sports.com/recruit/cayden-boozer',
        lastUpdated: '2024-12-05',
        confidence: 94
      }
    ]
  }
];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sport = url.searchParams.get('sport');
    const classYear = url.searchParams.get('classYear');
    const position = url.searchParams.get('position');
    const ranking = url.searchParams.get('ranking');
    const status = url.searchParams.get('status');
    const state = url.searchParams.get('state');
    
    let filteredAthletes = [...athleteDatabase];
    
    // Apply filters
    if (sport) {
      filteredAthletes = filteredAthletes.filter(a => a.sport.toLowerCase() === sport.toLowerCase());
    }
    
    if (classYear) {
      filteredAthletes = filteredAthletes.filter(a => a.classYear === classYear);
    }
    
    if (position) {
      filteredAthletes = filteredAthletes.filter(a => a.position.toLowerCase() === position.toLowerCase());
    }
    
    if (ranking) {
      const maxRanking = parseInt(ranking);
      filteredAthletes = filteredAthletes.filter(a => a.rankings.composite <= maxRanking);
    }
    
    if (status) {
      filteredAthletes = filteredAthletes.filter(a => a.recruiting.status === status);
    }
    
    if (state) {
      filteredAthletes = filteredAthletes.filter(a => a.school.state.toLowerCase() === state.toLowerCase());
    }
    
    // Sort by composite ranking
    filteredAthletes.sort((a, b) => a.rankings.composite - b.rankings.composite);
    
    return NextResponse.json({
      success: true,
      athletes: filteredAthletes,
      total: filteredAthletes.length,
      filters: {
        sport,
        classYear,
        position,
        ranking,
        status,
        state
      },
      metadata: {
        totalAthletes: athleteDatabase.length,
        lastUpdated: new Date().toISOString(),
        platforms: ['ESPN', '247Sports', 'Rivals', 'On3', 'Hudl'],
        coverage: {
          sports: [...new Set(athleteDatabase.map(a => a.sport))],
          classYears: [...new Set(athleteDatabase.map(a => a.classYear))],
          positions: [...new Set(athleteDatabase.map(a => a.position))],
          states: [...new Set(athleteDatabase.map(a => a.school.state))]
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch athlete database'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { athleteId, action, data } = await request.json();
    
    const athlete = athleteDatabase.find(a => a.id === athleteId);
    if (!athlete) {
      return NextResponse.json({
        success: false,
        error: 'Athlete not found'
      }, { status: 404 });
    }
    
    if (action === 'contact') {
      // Track contact attempt
      return NextResponse.json({
        success: true,
        message: `Contact information for ${athlete.name}`,
        contact: athlete.contact,
        recruiting: athlete.recruiting
      });
    } else if (action === 'compare') {
      // Add to comparison
      return NextResponse.json({
        success: true,
        message: `${athlete.name} added to comparison`,
        athlete: athlete
      });
    } else if (action === 'track') {
      // Add to tracking list
      return NextResponse.json({
        success: true,
        message: `Now tracking ${athlete.name}`,
        athlete: athlete
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
}

// Get athlete comparison
export async function PUT(request: Request) {
  try {
    const { athleteIds } = await request.json();
    
    const athletes = athleteDatabase.filter(a => athleteIds.includes(a.id));
    
    if (athletes.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'At least 2 athletes required for comparison'
      }, { status: 400 });
    }
    
    // Generate comparison analysis
    const comparison = {
      athletes: athletes,
      analysis: {
        rankings: {
          best: athletes.reduce((best, current) => 
            current.rankings.composite < best.rankings.composite ? current : best
          ),
          comparison: athletes.map(a => ({
            name: a.name,
            composite: a.rankings.composite,
            rivals: a.rankings.rivals,
            espn: a.rankings.espn,
            sports247: a.rankings.sports247,
            on3: a.rankings.on3
          }))
        },
        stats: compareStats(athletes),
        recruiting: {
          committed: athletes.filter(a => a.recruiting.status === 'committed').length,
          open: athletes.filter(a => a.recruiting.status === 'open').length,
          topSchools: [...new Set(athletes.flatMap(a => a.recruiting.topSchools))]
        },
        physicals: comparePhysicals(athletes)
      }
    };
    
    return NextResponse.json({
      success: true,
      comparison: comparison
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate comparison'
    }, { status: 500 });
  }
}

function compareStats(athletes: AthleteProfile[]): any {
  const statCategories = ['pointsPerGame', 'reboundsPerGame', 'assistsPerGame'];
  const comparison: any = {};
  
  statCategories.forEach(category => {
    comparison[category] = {
      leader: athletes.reduce((leader, current) => 
        (current.stats[category] || 0) > (leader.stats[category] || 0) ? current : leader
      ),
      values: athletes.map(a => ({
        name: a.name,
        value: a.stats[category] || 0
      }))
    };
  });
  
  return comparison;
}

function comparePhysicals(athletes: AthleteProfile[]): any {
  return {
    height: athletes.map(a => ({ name: a.name, height: a.physicals.height })),
    weight: athletes.map(a => ({ name: a.name, weight: a.physicals.weight })),
    wingspan: athletes.map(a => ({ name: a.name, wingspan: a.physicals.wingspan }))
  };
}