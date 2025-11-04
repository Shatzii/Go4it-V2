import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { alumniProfiles, coachProfiles } from '@/lib/db/alumni-network-schema';
import { eq, ilike, or, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'alumni';
    const sport = searchParams.get('sport');
    const search = searchParams.get('search');
    const mentorshipOnly = searchParams.get('mentorshipOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    if (type === 'alumni') {
      // Query alumni profiles - build conditions
      const conditions = [eq(alumniProfiles.isPublic, true)];

      if (sport) {
        conditions.push(sql`${alumniProfiles.sports} @> ${JSON.stringify([sport])}`);
      }

      if (mentorshipOnly) {
        conditions.push(eq(alumniProfiles.availableForMentorship, true));
      }

      if (search) {
        conditions.push(
          or(
            ilike(alumniProfiles.displayName, `%${search}%`),
            ilike(alumniProfiles.collegeName, `%${search}%`),
            ilike(alumniProfiles.currentOccupation, `%${search}%`)
          )!
        );
      }

      const profiles = await db
        .select({
          id: alumniProfiles.id,
          displayName: alumniProfiles.displayName,
          profileImage: alumniProfiles.profileImage,
          bio: alumniProfiles.bio,
          sports: alumniProfiles.sports,
          graduationYear: alumniProfiles.graduationYear,
          collegeName: alumniProfiles.collegeName,
          collegeLevel: alumniProfiles.collegeLevel,
          currentOccupation: alumniProfiles.currentOccupation,
          availableForMentorship: alumniProfiles.availableForMentorship,
          mentorshipAreas: alumniProfiles.mentorshipAreas,
          isPro: alumniProfiles.isPro,
        })
        .from(alumniProfiles)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);

      return NextResponse.json({ profiles, page, limit });
    } else if (type === 'coaches') {
      // Query coach profiles
      const conditions = [];

      if (sport) {
        conditions.push(sql`${coachProfiles.sports} @> ${JSON.stringify([sport])}`);
      }

      if (mentorshipOnly) {
        conditions.push(eq(coachProfiles.acceptingClients, true));
      }

      if (search) {
        conditions.push(
          or(
            ilike(coachProfiles.displayName, `%${search}%`),
            ilike(coachProfiles.currentTeam, `%${search}%`),
            ilike(coachProfiles.title, `%${search}%`)
          )!
        );
      }

      const profiles = await db
        .select({
          id: coachProfiles.id,
          displayName: coachProfiles.displayName,
          title: coachProfiles.title,
          profileImage: coachProfiles.profileImage,
          bio: coachProfiles.bio,
          sports: coachProfiles.sports,
          specializations: coachProfiles.specializations,
          yearsExperience: coachProfiles.yearsExperience,
          currentTeam: coachProfiles.currentTeam,
          acceptingClients: coachProfiles.acceptingClients,
          rating: coachProfiles.rating,
          reviewCount: coachProfiles.reviewCount,
          isVerified: coachProfiles.isVerified,
        })
        .from(coachProfiles)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);

      return NextResponse.json({ profiles, page, limit });
    }

    return NextResponse.json({ profiles: [], page, limit });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch directory' },
      { status: 500 }
    );
  }
}
