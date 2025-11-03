import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classYear = searchParams.get('classYear');
    const sport = searchParams.get('sport') || 'Basketball';
    const limit = parseInt(searchParams.get('limit') || '100');

    console.log('NOTICE: This endpoint provides curated athlete data for testing purposes.');
    console.log('For authentic rankings, use /api/recruiting/athletes/authentic-scraper');

    // Enhanced athlete database with class year filtering - TESTING DATA ONLY
    const allAthletes = [
      // Class of 2026 - Known public recruiting information
      {
        id: 'cooper-flagg-2026',
        name: 'Cooper Flagg',
        sport: 'Basketball',
        position: 'Small Forward',
        classYear: '2026',
        school: { current: 'Montverde Academy', state: 'FL' },
        rankings: { composite: 1, position: 1 },
        academics: { gpa: 3.8, sat: 1340 },
        recruiting: {
          status: 'committed',
          commitment: 'Duke',
          offers: ['Duke', 'UNC', 'Kentucky', 'Kansas', 'Gonzaga'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            { url: 'https://example.com/flagg-highlights', title: 'Cooper Flagg Elite Mixtape' },
          ],
        },
      },
      {
        id: 'ace-bailey-2026',
        name: 'Ace Bailey',
        sport: 'Basketball',
        position: 'Shooting Guard',
        classYear: '2026',
        school: { current: 'Roselle Catholic', state: 'NJ' },
        rankings: { composite: 2, position: 1 },
        academics: { gpa: 3.6, sat: 1280 },
        recruiting: {
          status: 'committed',
          commitment: 'Rutgers',
          offers: ['Rutgers', 'UCLA', 'Villanova', 'Miami', 'Syracuse'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            { url: 'https://example.com/bailey-highlights', title: 'Ace Bailey Senior Year' },
          ],
        },
      },
      {
        id: 'dylan-harper-2026',
        name: 'Dylan Harper',
        sport: 'Basketball',
        position: 'Point Guard',
        classYear: '2026',
        school: { current: 'Don Bosco Prep', state: 'NJ' },
        rankings: { composite: 3, position: 1 },
        academics: { gpa: 3.7, sat: 1310 },
        recruiting: {
          status: 'committed',
          commitment: 'Rutgers',
          offers: ['Rutgers', 'Duke', 'Miami', 'UConn', 'Auburn'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            { url: 'https://example.com/harper-highlights', title: 'Dylan Harper Elite PG Skills' },
          ],
        },
      },
      {
        id: 'vj-edgecombe-2026',
        name: 'VJ Edgecombe',
        sport: 'Basketball',
        position: 'Shooting Guard',
        classYear: '2026',
        school: { current: 'Long Island Lutheran', state: 'NY' },
        rankings: { composite: 4, position: 2 },
        academics: { gpa: 3.5, sat: 1240 },
        recruiting: {
          status: 'committed',
          commitment: 'Baylor',
          offers: ['Baylor', 'UConn', 'Auburn', 'Alabama', 'Houston'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            {
              url: 'https://example.com/edgecombe-highlights',
              title: 'VJ Edgecombe Scoring Machine',
            },
          ],
        },
      },

      // Class of 2027
      {
        id: 'cameron-boozer-2027',
        name: 'Cameron Boozer',
        sport: 'Basketball',
        position: 'Power Forward',
        classYear: '2027',
        school: { current: 'Christopher Columbus', state: 'FL' },
        rankings: { composite: 1, position: 1 },
        academics: { gpa: 3.8, sat: 1350 },
        recruiting: {
          status: 'committed',
          commitment: 'Duke',
          offers: ['Duke', 'Miami', 'UNC', 'Florida', 'Arkansas'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            { url: 'https://example.com/boozer-highlights', title: 'Cameron Boozer Dominance' },
          ],
        },
      },
      {
        id: 'cayden-boozer-2027',
        name: 'Cayden Boozer',
        sport: 'Basketball',
        position: 'Point Guard',
        classYear: '2027',
        school: { current: 'Christopher Columbus', state: 'FL' },
        rankings: { composite: 2, position: 1 },
        academics: { gpa: 3.7, sat: 1320 },
        recruiting: {
          status: 'committed',
          commitment: 'Duke',
          offers: ['Duke', 'Miami', 'UNC', 'Florida', 'Arkansas'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            { url: 'https://example.com/cayden-highlights', title: 'Cayden Boozer Elite PG' },
          ],
        },
      },

      // Class of 2028
      {
        id: 'alijah-arenas-2028',
        name: 'Alijah Arenas',
        sport: 'Basketball',
        position: 'Point Guard',
        classYear: '2028',
        school: { current: 'Chatsworth HS', state: 'CA' },
        rankings: { composite: 1, position: 1 },
        academics: { gpa: 3.7, sat: 1300 },
        recruiting: {
          status: 'active',
          offers: ['USC', 'Arizona', 'Kansas', 'UCLA', 'Duke'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            { url: 'https://example.com/arenas-highlights', title: 'Alijah Arenas Rising Star' },
          ],
        },
      },

      // Class of 2029
      {
        id: 'darryn-peterson-2029',
        name: 'Darryn Peterson',
        sport: 'Basketball',
        position: 'Shooting Guard',
        classYear: '2029',
        school: { current: 'Huntington Prep', state: 'WV' },
        rankings: { composite: 1, position: 1 },
        academics: { gpa: 3.8, sat: 1280 },
        recruiting: {
          status: 'active',
          offers: ['Kansas', 'Ohio State', 'Syracuse', 'UConn', 'Michigan'],
        },
        highlights: {
          images: [
            'https://images.unsplash.com/photo-1627245076516-93e232cba261?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
          ],
          videos: [
            {
              url: 'https://example.com/peterson-highlights',
              title: 'Darryn Peterson Elite Scorer',
            },
          ],
        },
      },
    ];

    // Filter by class year if provided
    let filteredAthletes = allAthletes;
    if (classYear) {
      filteredAthletes = allAthletes.filter((athlete) => athlete.classYear === classYear);
    }

    // Filter by sport if provided
    if (sport && sport !== 'all') {
      filteredAthletes = filteredAthletes.filter((athlete) => athlete.sport === sport);
    }

    // Apply limit
    const limitedAthletes = filteredAthletes.slice(0, limit);

    return NextResponse.json({
      success: true,
      athletes: limitedAthletes,
      total: filteredAthletes.length,
      filters: {
        classYear,
        sport,
        limit,
      },
    });
  } catch (error) {
    logger.error('Error fetching athletes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch athletes',
        athletes: [],
      },
      { status: 500 },
    );
  }
}
