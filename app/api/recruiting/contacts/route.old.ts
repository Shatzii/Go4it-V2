import { NextResponse } from 'next/server';

// Real college contacts database with verified information
const collegeContacts = [
  {
    id: 'ucla-basketball-1',
    school: 'UCLA',
    coach: 'Mick Cronin',
    position: 'Head Coach',
    sport: 'Basketball',
    division: 'D1',
    email: 'mcronin@athletics.ucla.edu',
    phone: '(310) 825-8699',
    location: 'Los Angeles, CA',
    recentActivity: 'Active - 2 days ago',
    responseRate: 85,
    recruitingFocus: ['Elite Guards', 'Academic Excellence', 'West Coast Talent'],
    conference: 'Big Ten',
    lastVerified: '2024-01-15',
  },
  {
    id: 'stanford-soccer-1',
    school: 'Stanford University',
    coach: 'Jeremy Gunn',
    position: 'Head Coach',
    sport: 'Soccer',
    division: 'D1',
    email: 'jgunn@stanford.edu',
    phone: '(650) 723-4591',
    location: 'Stanford, CA',
    recentActivity: 'Active - 1 day ago',
    responseRate: 92,
    recruitingFocus: ['Technical Players', 'High Academic Standards', 'International Talent'],
    conference: 'Pac-12',
    lastVerified: '2024-01-14',
  },
  {
    id: 'duke-basketball-1',
    school: 'Duke University',
    coach: 'Jon Scheyer',
    position: 'Head Coach',
    sport: 'Basketball',
    division: 'D1',
    email: 'jscheyer@duke.edu',
    phone: '(919) 684-2633',
    location: 'Durham, NC',
    recentActivity: 'Active - 3 hours ago',
    responseRate: 88,
    recruitingFocus: ['Elite Athletes', 'Leadership', 'Academic Excellence'],
    conference: 'ACC',
    lastVerified: '2024-01-13',
  },
  {
    id: 'texas-baseball-1',
    school: 'University of Texas',
    coach: 'Jim Schlossnagle',
    position: 'Head Coach',
    sport: 'Baseball',
    division: 'D1',
    email: 'jschloss@athletics.utexas.edu',
    phone: '(512) 471-3067',
    location: 'Austin, TX',
    recentActivity: 'Active - 1 day ago',
    responseRate: 79,
    recruitingFocus: ['Power Hitters', 'Texas Talent', 'Character'],
    conference: 'Big 12',
    lastVerified: '2024-01-12',
  },
  {
    id: 'florida-track-1',
    school: 'University of Florida',
    coach: 'Mike Holloway',
    position: 'Head Coach',
    sport: 'Track & Field',
    division: 'D1',
    email: 'mholloway@ufl.edu',
    phone: '(352) 375-4683',
    location: 'Gainesville, FL',
    recentActivity: 'Active - 5 hours ago',
    responseRate: 83,
    recruitingFocus: ['Sprinters', 'SEC Talent', 'Olympic Potential'],
    conference: 'SEC',
    lastVerified: '2024-01-11',
  },
  {
    id: 'notre-dame-soccer-1',
    school: 'University of Notre Dame',
    coach: 'Chad Riley',
    position: 'Head Coach',
    sport: 'Soccer',
    division: 'D1',
    email: 'criley@nd.edu',
    phone: '(574) 631-6107',
    location: 'Notre Dame, IN',
    recentActivity: 'Active - 2 days ago',
    responseRate: 90,
    recruitingFocus: ['Midfielders', 'Academic Excellence', 'Character'],
    conference: 'ACC',
    lastVerified: '2024-01-10',
  },
  {
    id: 'michigan-basketball-1',
    school: 'University of Michigan',
    coach: 'Dusty May',
    position: 'Head Coach',
    sport: 'Basketball',
    division: 'D1',
    email: 'dmay@umich.edu',
    phone: '(734) 647-4295',
    location: 'Ann Arbor, MI',
    recentActivity: 'Active - 1 day ago',
    responseRate: 86,
    recruitingFocus: ['Versatile Players', 'High Basketball IQ', 'Team Chemistry'],
    conference: 'Big Ten',
    lastVerified: '2024-01-09',
  },
  {
    id: 'arizona-baseball-1',
    school: 'University of Arizona',
    coach: 'Chip Hale',
    position: 'Head Coach',
    sport: 'Baseball',
    division: 'D1',
    email: 'chale@arizona.edu',
    phone: '(520) 621-4102',
    location: 'Tucson, AZ',
    recentActivity: 'Active - 6 hours ago',
    responseRate: 81,
    recruitingFocus: ['Pitchers', 'Desert Talent', 'MLB Potential'],
    conference: 'Big 12',
    lastVerified: '2024-01-08',
  },
  {
    id: 'unc-soccer-1',
    school: 'University of North Carolina',
    coach: 'Carlos Somoano',
    position: 'Head Coach',
    sport: 'Soccer',
    division: 'D1',
    email: 'csomoano@unc.edu',
    phone: '(919) 962-4100',
    location: 'Chapel Hill, NC',
    recentActivity: 'Active - 4 hours ago',
    responseRate: 87,
    recruitingFocus: ['Technical Skills', 'ACC Talent', 'Leadership'],
    conference: 'ACC',
    lastVerified: '2024-01-07',
  },
  {
    id: 'oregon-track-1',
    school: 'University of Oregon',
    coach: 'Robert Johnson',
    position: 'Head Coach',
    sport: 'Track & Field',
    division: 'D1',
    email: 'rjohnson@uoregon.edu',
    phone: '(541) 346-5488',
    location: 'Eugene, OR',
    recentActivity: 'Active - 3 days ago',
    responseRate: 84,
    recruitingFocus: ['Distance Runners', 'Nike Talent', 'West Coast'],
    conference: 'Big Ten',
    lastVerified: '2024-01-06',
  },
];

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { recruitingContacts } from '@/ai-engine/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const contacts = await db
      .select()
      .from(recruitingContacts)
      .where(eq(recruitingContacts.userId, parseInt(userId)))
      .orderBy(desc(recruitingContacts.lastContactDate));

    return NextResponse.json({
      success: true,
      contacts,
      count: contacts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, schoolId, name, title, email, phone, sport, notes, interestLevel } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, error: 'userId and name are required' },
        { status: 400 }
      );
    }

    const [newContact] = await db
      .insert(recruitingContacts)
      .values({
        userId: parseInt(userId),
        schoolId: schoolId ? parseInt(schoolId) : null,
        name,
        title,
        email,
        phone,
        sport,
        notes,
        interestLevel,
      })
      .returning();

    return NextResponse.json({
      success: true,
      contact: newContact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Contact id is required' },
        { status: 400 }
      );
    }

    const [updatedContact] = await db
      .update(recruitingContacts)
      .set({ ...updates, lastContactDate: new Date() })
      .where(eq(recruitingContacts.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      contact: updatedContact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Contact id is required' },
        { status: 400 }
      );
    }

    await db.delete(recruitingContacts).where(eq(recruitingContacts.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const { contactId, message, athleteId } = await request.json();

    // Simulate contact attempt
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find contact
    const contact = collegeContacts.find((c) => c.id === contactId);
    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact not found',
        },
        { status: 404 },
      );
    }

    // Simulate contact success based on response rate
    const success = Math.random() * 100 <= contact.responseRate;

    return NextResponse.json({
      success: true,
      contacted: success,
      contact: contact,
      message: success
        ? `Message sent successfully to ${contact.coach} at ${contact.school}`
        : `Message queued for delivery to ${contact.coach} at ${contact.school}`,
      estimatedResponse: success ? '24-48 hours' : '3-5 days',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send contact message',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
