import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Mock NCAA schools data - in production, this would come from database
    const schools = [
      {
        id: '1',
        name: 'University of Alabama',
        division: 'D1',
        conference: 'SEC',
        location: 'Tuscaloosa, AL',
        state: 'AL',
        sport: 'Football',
        scholarships: 85,
        contactInfo: {
          headCoach: 'Coach Johnson',
          email: 'coach.johnson@alabama.edu',
          phone: '(205) 348-6084',
          recruitingCoordinator: 'Mike Smith',
        },
        requirements: {
          minGPA: 3.0,
          minSAT: 1200,
          minACT: 24,
          coreCredits: 16,
        },
        visited: false,
        interested: true,
        contacted: false,
      },
      {
        id: '2',
        name: 'Ohio State University',
        division: 'D1',
        conference: 'Big Ten',
        location: 'Columbus, OH',
        state: 'OH',
        sport: 'Football',
        scholarships: 85,
        contactInfo: {
          headCoach: 'Coach Williams',
          email: 'coach.williams@osu.edu',
          phone: '(614) 292-2704',
          recruitingCoordinator: 'Tom Davis',
        },
        requirements: {
          minGPA: 3.2,
          minSAT: 1250,
          minACT: 26,
          coreCredits: 16,
        },
        visited: true,
        interested: true,
        contacted: true,
        lastContact: new Date('2024-07-10'),
      },
      {
        id: '3',
        name: 'University of Texas',
        division: 'D1',
        conference: 'Big 12',
        location: 'Austin, TX',
        state: 'TX',
        sport: 'Football',
        scholarships: 85,
        contactInfo: {
          headCoach: 'Coach Brown',
          email: 'coach.brown@utexas.edu',
          phone: '(512) 471-7437',
          recruitingCoordinator: 'Steve Wilson',
        },
        requirements: {
          minGPA: 3.1,
          minSAT: 1220,
          minACT: 25,
          coreCredits: 16,
        },
        visited: false,
        interested: false,
        contacted: false,
      },
      {
        id: '4',
        name: 'Stanford University',
        division: 'D1',
        conference: 'Pac-12',
        location: 'Stanford, CA',
        state: 'CA',
        sport: 'Football',
        scholarships: 85,
        contactInfo: {
          headCoach: 'Coach Martinez',
          email: 'coach.martinez@stanford.edu',
          phone: '(650) 723-4591',
          recruitingCoordinator: 'Paul Anderson',
        },
        requirements: {
          minGPA: 3.8,
          minSAT: 1450,
          minACT: 32,
          coreCredits: 18,
        },
        visited: false,
        interested: true,
        contacted: false,
      },
      {
        id: '5',
        name: 'Michigan State University',
        division: 'D1',
        conference: 'Big Ten',
        location: 'East Lansing, MI',
        state: 'MI',
        sport: 'Football',
        scholarships: 85,
        contactInfo: {
          headCoach: 'Coach Thompson',
          email: 'coach.thompson@msu.edu',
          phone: '(517) 355-1610',
          recruitingCoordinator: 'Rick Jones',
        },
        requirements: {
          minGPA: 2.8,
          minSAT: 1150,
          minACT: 22,
          coreCredits: 16,
        },
        visited: false,
        interested: false,
        contacted: true,
        lastContact: new Date('2024-07-05'),
      },
    ];

    return NextResponse.json({ schools });
  } catch (error) {
    console.error('Failed to fetch schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
