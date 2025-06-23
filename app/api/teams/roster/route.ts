import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamRosters, teams, users } from '@/shared/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    // Get roster with player details
    const roster = await db
      .select({
        id: teamRosters.id,
        teamId: teamRosters.teamId,
        playerId: teamRosters.playerId,
        position: teamRosters.position,
        jerseyNumber: teamRosters.jerseyNumber,
        joinedDate: teamRosters.joinedDate,
        status: teamRosters.status,
        playerRole: teamRosters.playerRole,
        parentContactInfo: teamRosters.parentContactInfo,
        playerName: users.username,
        playerEmail: users.email
      })
      .from(teamRosters)
      .leftJoin(users, eq(teamRosters.playerId, users.id))
      .where(eq(teamRosters.teamId, teamId));

    // Group by position for better organization
    const organizedRoster = {
      captains: roster.filter(p => p.playerRole === 'captain' || p.playerRole === 'co-captain'),
      starters: roster.filter(p => p.status === 'active' && p.playerRole === 'player'),
      injured: roster.filter(p => p.status === 'injured'),
      inactive: roster.filter(p => p.status === 'inactive'),
      total: roster.length
    };

    return NextResponse.json(organizedRoster);

  } catch (error) {
    console.error('Roster fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roster' },
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

    const { teamId, playerId, position, jerseyNumber, playerRole, parentContactInfo } = await request.json();

    // Verify coach has permission to modify this team
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (team.length === 0 || team[0].coachId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if player is already on roster
    const existingPlayer = await db
      .select()
      .from(teamRosters)
      .where(and(
        eq(teamRosters.teamId, teamId),
        eq(teamRosters.playerId, playerId)
      ))
      .limit(1);

    if (existingPlayer.length > 0) {
      return NextResponse.json(
        { error: 'Player already on roster' },
        { status: 400 }
      );
    }

    // Check roster size limit
    const currentRosterSize = await db
      .select()
      .from(teamRosters)
      .where(and(
        eq(teamRosters.teamId, teamId),
        eq(teamRosters.status, 'active')
      ));

    if (currentRosterSize.length >= team[0].maxRosterSize) {
      return NextResponse.json(
        { error: 'Roster is full' },
        { status: 400 }
      );
    }

    // Add player to roster
    const [newRosterEntry] = await db
      .insert(teamRosters)
      .values({
        teamId,
        playerId,
        position,
        jerseyNumber,
        playerRole: playerRole || 'player',
        parentContactInfo,
        status: 'active'
      })
      .returning();

    return NextResponse.json(newRosterEntry, { status: 201 });

  } catch (error) {
    console.error('Add player error:', error);
    return NextResponse.json(
      { error: 'Failed to add player to roster' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { rosterId, position, jerseyNumber, status, playerRole } = await request.json();

    // Verify coach has permission
    const rosterEntry = await db
      .select({
        id: teamRosters.id,
        teamId: teamRosters.teamId,
        coachId: teams.coachId
      })
      .from(teamRosters)
      .leftJoin(teams, eq(teamRosters.teamId, teams.id))
      .where(eq(teamRosters.id, rosterId))
      .limit(1);

    if (rosterEntry.length === 0 || rosterEntry[0].coachId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update roster entry
    const [updatedEntry] = await db
      .update(teamRosters)
      .set({
        position,
        jerseyNumber,
        status,
        playerRole
      })
      .where(eq(teamRosters.id, rosterId))
      .returning();

    return NextResponse.json(updatedEntry);

  } catch (error) {
    console.error('Update roster error:', error);
    return NextResponse.json(
      { error: 'Failed to update roster entry' },
      { status: 500 }
    );
  }
}