import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport');
  const teamId = searchParams.get('teamId');
  const playType = searchParams.get('playType');

  try {
    // Mock playbook data - in production this would come from your database
    const allPlaybooks = [
      // Flag Football Plays
      {
        id: 1,
        teamId: 1,
        playName: 'Quick Slant',
        sport: 'flag-football',
        playType: 'offense',
        formation: '3x2',
        description: 'Quick passing play with receivers running slant routes',
        diagramData: {
          positions: [
            { id: 'qb', name: 'QB', x: 50, y: 80, role: 'quarterback' },
            { id: 'wr1', name: 'WR1', x: 30, y: 20, role: 'receiver' },
            { id: 'wr2', name: 'WR2', x: 70, y: 20, role: 'receiver' },
            { id: 'wr3', name: 'WR3', x: 50, y: 30, role: 'receiver' },
            { id: 'c', name: 'C', x: 50, y: 60, role: 'center' },
          ],
          routes: [
            { from: 'wr1', path: 'slant-right', timing: '3-step' },
            { from: 'wr2', path: 'slant-left', timing: '3-step' },
            { from: 'wr3', path: 'go', timing: '5-step' },
          ],
        },
        playerPositions: {
          quarterback: 'Take 3-step drop, read defense, throw to open receiver',
          receiver1: 'Run 5-yard slant route to the right',
          receiver2: 'Run 5-yard slant route to the left',
          receiver3: 'Run deep go route as safety valve',
          center: 'Snap ball, block rush',
        },
        isActive: true,
        createdBy: 1,
      },
      {
        id: 2,
        teamId: 1,
        playName: 'Red Zone Fade',
        sport: 'flag-football',
        playType: 'offense',
        formation: '2x3',
        description: 'Goal line fade route for touchdown',
        diagramData: {
          positions: [
            { id: 'qb', name: 'QB', x: 50, y: 85, role: 'quarterback' },
            { id: 'wr1', name: 'WR1', x: 20, y: 15, role: 'receiver' },
            { id: 'wr2', name: 'WR2', x: 80, y: 15, role: 'receiver' },
          ],
          routes: [
            { from: 'wr1', path: 'fade-corner', timing: '4-step' },
            { from: 'wr2', path: 'fade-back', timing: '4-step' },
          ],
        },
        playerPositions: {
          quarterback: 'High arcing throw to corner of end zone',
          receiver1: 'Fade route to left corner with body positioning',
          receiver2: 'Fade route to right corner as secondary option',
        },
        isActive: true,
        createdBy: 1,
      },

      // Soccer Plays
      {
        id: 3,
        teamId: 5,
        playName: 'Wing Overlap',
        sport: 'soccer',
        playType: 'offense',
        formation: '4-3-3',
        description: 'Attacking play with fullback overlap on the wing',
        diagramData: {
          positions: [
            { id: 'gk', name: 'GK', x: 50, y: 95, role: 'goalkeeper' },
            { id: 'rb', name: 'RB', x: 80, y: 75, role: 'defender' },
            { id: 'cb1', name: 'CB', x: 40, y: 80, role: 'defender' },
            { id: 'cb2', name: 'CB', x: 60, y: 80, role: 'defender' },
            { id: 'lb', name: 'LB', x: 20, y: 75, role: 'defender' },
            { id: 'cm1', name: 'CM', x: 35, y: 60, role: 'midfielder' },
            { id: 'cm2', name: 'CM', x: 65, y: 60, role: 'midfielder' },
            { id: 'cam', name: 'CAM', x: 50, y: 45, role: 'midfielder' },
            { id: 'rw', name: 'RW', x: 75, y: 30, role: 'forward' },
            { id: 'st', name: 'ST', x: 50, y: 20, role: 'forward' },
            { id: 'lw', name: 'LW', x: 25, y: 30, role: 'forward' },
          ],
          movement: [
            { player: 'rb', action: 'overlap-right-wing' },
            { player: 'rw', action: 'cut-inside' },
            { player: 'cam', action: 'support-right' },
          ],
        },
        playerPositions: {
          rightback: 'Make overlapping run down the right wing',
          rightwinger: 'Cut inside to create space for overlap',
          centerattackingmid: 'Provide passing option and support',
        },
        isActive: true,
        createdBy: 5,
      },

      // Basketball Plays
      {
        id: 4,
        teamId: 7,
        playName: 'Pick and Roll',
        sport: 'basketball',
        playType: 'offense',
        formation: '1-4 High',
        description: 'Basic pick and roll with point guard and center',
        diagramData: {
          positions: [
            { id: 'pg', name: 'PG', x: 50, y: 85, role: 'guard' },
            { id: 'sg', name: 'SG', x: 75, y: 60, role: 'guard' },
            { id: 'sf', name: 'SF', x: 25, y: 60, role: 'forward' },
            { id: 'pf', name: 'PF', x: 35, y: 40, role: 'forward' },
            { id: 'c', name: 'C', x: 50, y: 65, role: 'center' },
          ],
          screens: [{ setter: 'c', target: 'pg', type: 'ball-screen' }],
          movement: [
            { player: 'pg', action: 'drive-right' },
            { player: 'c', action: 'roll-to-basket' },
          ],
        },
        playerPositions: {
          pointguard: 'Use screen, read defense, drive or pass to rolling center',
          center: 'Set solid screen, roll to basket after screen',
          shootingguard: 'Space to corner for potential kick-out pass',
        },
        isActive: true,
        createdBy: 7,
      },
    ];

    // Filter playbooks based on query parameters
    let filteredPlaybooks = allPlaybooks;

    if (sport) {
      filteredPlaybooks = filteredPlaybooks.filter((play) => play.sport === sport);
    }

    if (teamId) {
      filteredPlaybooks = filteredPlaybooks.filter((play) => play.teamId === parseInt(teamId));
    }

    if (playType) {
      filteredPlaybooks = filteredPlaybooks.filter((play) => play.playType === playType);
    }

    return NextResponse.json({
      success: true,
      playbooks: filteredPlaybooks,
      total: filteredPlaybooks.length,
    });
  } catch (error) {
    console.error('Playbooks API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch playbooks',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const playbookData = await request.json();

    // Validate required fields
    const requiredFields = ['teamId', 'playName', 'sport', 'playType', 'formation', 'description'];
    for (const field of requiredFields) {
      if (!playbookData[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        );
      }
    }

    // Generate playbook ID (in production this would be handled by database)
    const newPlaybook = {
      id: Date.now(), // Simple ID generation for demo
      ...playbookData,
      isActive: true,
      createdBy: 1, // Would come from authenticated user
      createdAt: new Date().toISOString(),
    };

    // In production, save to database here
    console.log('New playbook created:', newPlaybook);

    return NextResponse.json({
      success: true,
      playbook: newPlaybook,
      message: `Playbook "${playbookData.playName}" created successfully`,
    });
  } catch (error) {
    console.error('Playbook creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create playbook',
      },
      { status: 500 },
    );
  }
}
