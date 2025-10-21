import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colleges, coachingStaff, sportsPrograms } from '@/shared/schema';
import { eq, and, ilike, sql, or } from 'drizzle-orm';

// Comprehensive coaching staff database - ALL NCAA, NAIA, and Junior College coaches
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division'); // D1, D2, D3, NAIA, NJCAA
    const state = searchParams.get('state');
    const sport = searchParams.get('sport');
    const gender = searchParams.get('gender'); // men, women, coed
    const conference = searchParams.get('conference');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build comprehensive query joining coaches with their colleges
    let queryBuilder = db
      .select({
        // Coach information
        coachId: coachingStaff.id,
        firstName: coachingStaff.firstName,
        lastName: coachingStaff.lastName,
        title: coachingStaff.title,
        sport: coachingStaff.sport,
        gender: coachingStaff.gender,
        email: coachingStaff.email,
        phone: coachingStaff.phone,
        officePhone: coachingStaff.officePhone,
        recruitingEmail: coachingStaff.recruitingEmail,
        yearsAtSchool: coachingStaff.yearsAtSchool,
        totalYearsCoaching: coachingStaff.totalYearsCoaching,
        recruitingTerritory: coachingStaff.recruitingTerritory,
        recruitingFocus: coachingStaff.recruitingFocus,
        preferredContactMethod: coachingStaff.preferredContactMethod,
        twitterHandle: coachingStaff.twitterHandle,
        linkedinProfile: coachingStaff.linkedinProfile,
        contactVerified: coachingStaff.contactVerified,
        lastVerified: coachingStaff.lastVerified,
        responseRate: coachingStaff.responseRate,

        // College information
        collegeId: colleges.id,
        collegeName: colleges.name,
        collegeShortName: colleges.shortName,
        mascot: colleges.mascot,
        division: colleges.division,
        subdivision: colleges.subdivision,
        conference: colleges.conference,
        city: colleges.city,
        state: colleges.state,
        type: colleges.type,
        enrollment: colleges.enrollment,
        website: colleges.website,
        athleticsWebsite: colleges.athleticsWebsite,
        athleticDirector: colleges.athleticDirector,
        athleticDirectorEmail: colleges.athleticDirectorEmail,
        athleticDirectorPhone: colleges.athleticDirectorPhone,
        primaryColor: colleges.primaryColor,
        secondaryColor: colleges.secondaryColor,
        contactsVerified: colleges.contactsVerified,
      })
      .from(coachingStaff)
      .leftJoin(colleges, eq(coachingStaff.collegeId, colleges.id));

    // Apply filters
    const conditions = [];

    if (division) {
      conditions.push(eq(colleges.division, division));
    }

    if (state) {
      conditions.push(eq(colleges.state, state));
    }

    if (sport) {
      conditions.push(ilike(coachingStaff.sport, `%${sport}%`));
    }

    if (gender) {
      conditions.push(eq(coachingStaff.gender, gender));
    }

    if (conference) {
      conditions.push(ilike(colleges.conference, `%${conference}%`));
    }

    if (search) {
      conditions.push(
        or(
          ilike(coachingStaff.firstName, `%${search}%`),
          ilike(coachingStaff.lastName, `%${search}%`),
          ilike(colleges.name, `%${search}%`),
          ilike(colleges.shortName, `%${search}%`),
        ),
      );
    }

    // Only show active coaches from active colleges
    conditions.push(eq(coachingStaff.isActive, true));
    conditions.push(eq(colleges.isActive, true));

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    const coaches = await queryBuilder.orderBy(colleges.name, coachingStaff.lastName).limit(limit);

    // Get summary statistics
    const stats = await getCoachingStats(division, state, sport);

    return NextResponse.json({
      success: true,
      coaches,
      count: coaches.length,
      filters: { division, state, sport, gender, conference, search },
      statistics: stats,
      metadata: {
        lastUpdated: new Date().toISOString(),
        coverage: 'All NCAA (D1, D2, D3), NAIA, and NJCAA institutions',
        note: 'Comprehensive database of college coaching contacts across all divisions',
      },
    });
  } catch (error) {
    console.error('Error fetching comprehensive coaching staff:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch coaching staff database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Add new coaching contacts to the database
export async function POST(request: Request) {
  try {
    const coaches = await request.json();

    const insertedCoaches = [];
    let errors = 0;

    for (const coach of coaches) {
      try {
        const [insertedCoach] = await db.insert(coachingStaff).values(coach).returning();
        insertedCoaches.push(insertedCoach);
      } catch (error) {
        console.error(`Error inserting coach ${coach.firstName} ${coach.lastName}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${insertedCoaches.length} coaches to database`,
      added: insertedCoaches.length,
      errors: errors,
      coaches: insertedCoaches,
    });
  } catch (error) {
    console.error('Error adding coaches:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add coaches',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

async function getCoachingStats(
  division?: string | null,
  state?: string | null,
  sport?: string | null,
) {
  try {
    // Base query conditions
    const conditions = [eq(coachingStaff.isActive, true), eq(colleges.isActive, true)];

    if (division) conditions.push(eq(colleges.division, division));
    if (state) conditions.push(eq(colleges.state, state));
    if (sport) conditions.push(ilike(coachingStaff.sport, `%${sport}%`));

    // Total coaches count
    const totalCoachesQuery = db
      .select({ count: sql`count(*)` })
      .from(coachingStaff)
      .leftJoin(colleges, eq(coachingStaff.collegeId, colleges.id))
      .where(and(...conditions));

    const totalCoaches = await totalCoachesQuery;

    // Division breakdown
    const divisionBreakdown = await db
      .select({
        division: colleges.division,
        count: sql`count(*)`,
      })
      .from(coachingStaff)
      .leftJoin(colleges, eq(coachingStaff.collegeId, colleges.id))
      .where(and(eq(coachingStaff.isActive, true), eq(colleges.isActive, true)))
      .groupBy(colleges.division);

    // Sport breakdown
    const sportBreakdown = await db
      .select({
        sport: coachingStaff.sport,
        count: sql`count(*)`,
      })
      .from(coachingStaff)
      .leftJoin(colleges, eq(coachingStaff.collegeId, colleges.id))
      .where(and(...conditions))
      .groupBy(coachingStaff.sport)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Verified contacts
    const verifiedCount = await db
      .select({ count: sql`count(*)` })
      .from(coachingStaff)
      .leftJoin(colleges, eq(coachingStaff.collegeId, colleges.id))
      .where(and(...conditions, eq(coachingStaff.contactVerified, true)));

    return {
      totalCoaches: Number(totalCoaches[0]?.count) || 0,
      verifiedContacts: Number(verifiedCount[0]?.count) || 0,
      divisions: divisionBreakdown.reduce(
        (acc, item) => {
          acc[item.division] = Number(item.count);
          return acc;
        },
        {} as Record<string, number>,
      ),
      topSports: sportBreakdown.map((item) => ({
        sport: item.sport,
        count: Number(item.count),
      })),
    };
  } catch (error) {
    console.error('Error getting coaching stats:', error);
    return {
      totalCoaches: 0,
      verifiedContacts: 0,
      divisions: {},
      topSports: [],
    };
  }
}
