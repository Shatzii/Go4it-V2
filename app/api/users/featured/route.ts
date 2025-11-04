import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, studentAthleteProfiles } from '@/lib/db/schema';
import { eq, desc, and, isNotNull } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch featured student athlete profiles with high GAR scores
    const featuredProfiles = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        profileImage: users.profileImage,
        sport: studentAthleteProfiles.primarySport,
        position: studentAthleteProfiles.position,
        graduationYear: studentAthleteProfiles.graduationYear,
        garScore: studentAthleteProfiles.garScore,
        achievements: studentAthleteProfiles.achievements,
        collegeCommit: studentAthleteProfiles.collegeCommit,
        totalVideos: studentAthleteProfiles.totalVideos,
        garImprovement: studentAthleteProfiles.garImprovement,
        recruitersContacted: studentAthleteProfiles.recruitersContacted,
      })
      .from(users)
      .innerJoin(studentAthleteProfiles, eq(users.id, studentAthleteProfiles.userId))
      .where(
        and(
          isNotNull(studentAthleteProfiles.garScore),
          eq(studentAthleteProfiles.isFeatured, true)
        )
      )
      .orderBy(desc(studentAthleteProfiles.garScore))
      .limit(8);

    const profiles = featuredProfiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      sport: profile.sport || 'Multi-Sport',
      position: profile.position || 'Athlete',
      graduationYear: profile.graduationYear || new Date().getFullYear() + 1,
      profileImage: profile.profileImage,
      garScore: profile.garScore || 0,
      achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
      collegeCommit: profile.collegeCommit,
      stats: {
        videos: profile.totalVideos || 0,
        garImprovement: profile.garImprovement || 0,
        recruitersContacted: profile.recruitersContacted || 0,
      },
    }));

    return NextResponse.json({ profiles });
  } catch {
    // Return empty array on error
    return NextResponse.json({ profiles: [] });
  }
}
