import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { videos, users, teams, achievements, videoAnalysis } from '@/shared/schema'
import { eq, and, or, ilike, sql } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { query, filters } = await request.json()
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = `%${query.trim()}%`
    let results: any[] = []

    // Search videos
    if (filters.type === 'all' || filters.type === 'video') {
      const videoResults = await db
        .select({
          id: videos.id,
          title: videos.fileName,
          description: videos.feedback,
          sport: videos.sport,
          garScore: videos.garScore,
          createdAt: videos.createdAt,
          type: sql<string>`'video'`
        })
        .from(videos)
        .where(
          and(
            or(
              ilike(videos.fileName, searchTerm),
              ilike(videos.feedback, searchTerm)
            ),
            filters.sport !== 'all' ? eq(videos.sport, filters.sport) : undefined,
            filters.garScore !== 'all' ? sql`${videos.garScore} >= ${parseFloat(filters.garScore.split('-')[0])} AND ${videos.garScore} <= ${parseFloat(filters.garScore.split('-')[1])}` : undefined
          )
        )
        .limit(10)

      results.push(...videoResults.map(video => ({
        id: video.id.toString(),
        type: 'video',
        title: video.title,
        description: video.description || 'Performance analysis video',
        url: `/videos/${video.id}`,
        metadata: {
          sport: video.sport,
          garScore: video.garScore,
          createdAt: video.createdAt
        }
      })))
    }

    // Search athletes
    if (filters.type === 'all' || filters.type === 'athlete') {
      const athleteResults = await db
        .select({
          id: users.id,
          name: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
          sport: users.sport,
          graduationYear: users.graduationYear,
          type: sql<string>`'athlete'`
        })
        .from(users)
        .where(
          and(
            eq(users.role, 'athlete'),
            or(
              ilike(users.firstName, searchTerm),
              ilike(users.lastName, searchTerm),
              ilike(users.username, searchTerm)
            ),
            filters.sport !== 'all' ? eq(users.sport, filters.sport) : undefined,
            filters.graduationYear !== 'all' ? eq(users.graduationYear, parseInt(filters.graduationYear)) : undefined
          )
        )
        .limit(10)

      results.push(...athleteResults.map(athlete => ({
        id: athlete.id.toString(),
        type: 'athlete',
        title: athlete.name,
        description: `${athlete.sport} athlete • Class of ${athlete.graduationYear}`,
        url: `/athletes/${athlete.id}`,
        metadata: {
          sport: athlete.sport,
          graduationYear: athlete.graduationYear
        }
      })))
    }

    // Search teams
    if (filters.type === 'all' || filters.type === 'team') {
      const teamResults = await db
        .select({
          id: teams.id,
          name: teams.name,
          sport: teams.sport,
          level: teams.level,
          type: sql<string>`'team'`
        })
        .from(teams)
        .where(
          and(
            or(
              ilike(teams.name, searchTerm),
              ilike(teams.description, searchTerm)
            ),
            filters.sport !== 'all' ? eq(teams.sport, filters.sport) : undefined
          )
        )
        .limit(10)

      results.push(...teamResults.map(team => ({
        id: team.id.toString(),
        type: 'team',
        title: team.name,
        description: `${team.sport} team • ${team.level} level`,
        url: `/teams/${team.id}`,
        metadata: {
          sport: team.sport,
          level: team.level
        }
      })))
    }

    // Search achievements
    if (filters.type === 'all' || filters.type === 'achievement') {
      const achievementResults = await db
        .select({
          id: achievements.id,
          title: achievements.title,
          description: achievements.description,
          type: sql<string>`'achievement'`
        })
        .from(achievements)
        .where(
          or(
            ilike(achievements.title, searchTerm),
            ilike(achievements.description, searchTerm)
          )
        )
        .limit(10)

      results.push(...achievementResults.map(achievement => ({
        id: achievement.id.toString(),
        type: 'achievement',
        title: achievement.title,
        description: achievement.description,
        url: `/achievements/${achievement.id}`,
        metadata: {}
      })))
    }

    // Sort results by relevance (basic scoring)
    results.sort((a, b) => {
      const aScore = a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      const bScore = b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
      return bScore - aScore
    })

    return NextResponse.json({ results: results.slice(0, 20) })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}