import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../lib/auth';
import { db } from '../../../../lib/db';
import { teams, teamRosters } from '@/shared/enhanced-schema';
import { eq, and, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');
    const userRole = searchParams.get('role'); // coach, player, parent

    let teamsQuery = db.select().from(teams);
    
    if (sport) {
      teamsQuery = teamsQuery.where(eq(teams.sport, sport));
    }

    if (userRole === 'coach') {
      teamsQuery = teamsQuery.where(eq(teams.coachId, user.id));
    } else if (userRole === 'player') {
      // Get teams where user is a player
      const playerTeams = await db
        .select({ teamId: teamRosters.teamId })
        .from(teamRosters)
        .where(eq(teamRosters.playerId, user.id));
      
      const teamIds = playerTeams.map(pt => pt.teamId);
      if (teamIds.length === 0) {
        return NextResponse.json([]);
      }
      
      teamsQuery = teamsQuery.where(teams.id.in(teamIds));
    }

    const allTeams = await teamsQuery;

    // Get roster counts for each team
    const teamsWithRosterCounts = await Promise.all(
      allTeams.map(async (team) => {
        const rosterCount = await db
          .select({ count: teamRosters.id })
          .from(teamRosters)
          .where(and(
            eq(teamRosters.teamId, team.id),
            eq(teamRosters.status, 'active')
          ));

        return {
          ...team,
          rosterCount: rosterCount.length,
          availableSpots: team.maxRosterSize - rosterCount.length
        };
      })
    );

    return NextResponse.json(teamsWithRosterCounts);

  } catch (error) {
    console.error('Teams fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const teamData = await request.json();

    // Validate required fields
    if (!teamData.name || !teamData.sport || !teamData.season || !teamData.year) {
      return NextResponse.json(
        { error: 'Name, sport, season, and year are required' },
        { status: 400 }
      );
    }

    // Create new team
    const [newTeam] = await db
      .insert(teams)
      .values({
        ...teamData,
        coachId: user.id,
        assistantCoaches: teamData.assistantCoaches || [],
        teamColors: teamData.teamColors || { primary: '#1a365d', secondary: '#ffffff' },
        maxRosterSize: teamData.maxRosterSize || getDefaultRosterSize(teamData.sport)
      })
      .returning();

    return NextResponse.json(newTeam, { status: 201 });

  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}

function getDefaultRosterSize(sport: string): number {
  const defaults = {
    'flag_football': 12,
    'soccer': 18,
    'basketball': 15,
    'track_field': 25
  };
  return defaults[sport as keyof typeof defaults] || 20;
}