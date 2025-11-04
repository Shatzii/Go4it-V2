import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, studentAthleteProfiles } from '@/lib/db/schema';
import { eq, desc, and, isNotNull } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch featured student athlete profiles with high GAR scores
    const featured = await db
      .select({
        id: users.id,
        name: users.firstName,
        email: users.email,
        profileImage: users.profileImageUrl,
        sport: studentAthleteProfiles.teamAffiliation,
        position: studentAthleteProfiles.positions,
        grade: studentAthleteProfiles.graduationYear,
        garScore: sql<number>`75.0`, // Default placeholder
        achievements: studentAthleteProfiles.athleticAchievements,
        collegeCommit: studentAthleteProfiles.recruitingStatus,
        totalVideos: sql<number>`0`, // Placeholder
        garImprovement: sql<number>`0`, // Placeholder
        recruitersContacted: sql<number>`0`, // Placeholder
      })
      .from(users)
      .leftJoin(studentAthleteProfiles, eq(users.id, studentAthleteProfiles.userId))
      .where(
        and(
          isNotNull(studentAthleteProfiles.userId),
          eq(studentAthleteProfiles.isActive, true)
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(10);

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
