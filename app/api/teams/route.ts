import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/storage';
import { teams, teamRosters, users } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = searchParams.get('sport');

    // Get teams with roster counts
    let query = db
      .select({
        id: teams.id,
        name: teams.name,
        sport: teams.sport,
        division: teams.division,
        season: teams.season,
        year: teams.year,
        homeVenue: teams.homeVenue,
        teamColors: teams.teamColors,
        maxRosterSize: teams.maxRosterSize,
        isActive: teams.isActive,
        createdAt: teams.createdAt,
      })
      .from(teams);

    if (sport && sport !== 'all') {
      query = query.where(eq(teams.sport, sport));
    }

    const teamsData = await query;

    // Get roster counts for each team
    const teamsWithCounts = await Promise.all(
      teamsData.map(async (team) => {
        const rosterCount = await db
          .select({ count: teamRosters.id })
          .from(teamRosters)
          .where(eq(teamRosters.teamId, team.id));

        return {
          ...team,
          rosterCount: rosterCount.length,
          availableSpots: team.maxRosterSize - rosterCount.length,
        };
      })
    );

    return NextResponse.json(teamsWithCounts);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}