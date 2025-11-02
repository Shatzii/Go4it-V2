import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { ncaaSchools } from '@/ai-engine/lib/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const division = searchParams.get('division');
    const state = searchParams.get('state');
    const sport = searchParams.get('sport');

    const query = db.select().from(ncaaSchools).where(eq(ncaaSchools.isActive, true));

    // Apply filters
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(ncaaSchools.schoolName, `%${search}%`),
          like(ncaaSchools.city, `%${search}%`),
          like(ncaaSchools.conference, `%${search}%`)
        )
      );
    }

    if (division) {
      conditions.push(eq(ncaaSchools.division, division));
    }

    if (state) {
      conditions.push(eq(ncaaSchools.state, state));
    }

    // Execute query
    const schools = await query;

    // Filter by sport if provided (sport is in JSONB programs field)
    let filteredSchools = schools;
    if (sport) {
      filteredSchools = schools.filter(school => {
        if (!school.programs) return false;
        const programs = Array.isArray(school.programs) ? school.programs : [];
        return programs.some((p: any) => 
          typeof p === 'string' 
            ? p.toLowerCase().includes(sport.toLowerCase())
            : p?.name?.toLowerCase().includes(sport.toLowerCase())
        );
      });
    }

    return NextResponse.json({
      success: true,
      schools: filteredSchools,
      count: filteredSchools.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}
