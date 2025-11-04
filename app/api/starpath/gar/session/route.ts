/**
 * POST /api/starpath/gar/session
 * Start or end a GAR session with automatic StarPath XP rewards
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { garSessions, studentProfiles, starPathProgress } from "@/lib/db/schema-starpath";
import { eq } from "drizzle-orm";
import { z } from "zod";

const SessionSchema = z.object({
  action: z.enum(["start", "end"]),
  sport: z.string(),
  sessionType: z.enum(["training", "testing", "competition"]),
  
  // For end action
  duration: z.number().int().positive().optional(),
  garScore: z.number().min(0).max(100).optional(),
  physicalScore: z.number().min(0).max(100).optional(),
  cognitiveScore: z.number().min(0).max(100).optional(),
  psychologicalScore: z.number().min(0).max(100).optional(),
  readinessScore: z.number().min(0).max(10).optional(),
  trainingLoad: z.number().min(0).max(10).optional(),
  sleepScore: z.number().min(0).max(10).optional(),
  videoUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = SessionSchema.parse(body);

    if (data.action === "start") {
      // Create new session
      const [session] = await db
        .insert(garSessions)
        .values({
          userId,
          sport: data.sport,
          sessionType: data.sessionType,
          startTime: new Date(),
          tags: data.tags || [],
        })
        .returning();

      // Emit PostHog server event
      // TODO: Add PostHog server-side tracking
      
      return NextResponse.json({
        success: true,
        sessionId: session.id,
        startTime: session.startTime,
      });
    }

    // END action
    if (!data.garScore) {
      return NextResponse.json(
        { error: "garScore required for end action" },
        { status: 400 }
      );
    }

    // Find active session (most recent without endTime)
    const [activeSession] = await db
      .select()
      .from(garSessions)
      .where(eq(garSessions.userId, userId))
      .orderBy(garSessions.startTime)
      .limit(1);

    if (!activeSession || activeSession.endTime) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 404 }
      );
    }

    // Calculate deltas
    const profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId),
    });

    const deltaFromBaseline = profile?.baselineGarScore
      ? data.garScore - profile.baselineGarScore
      : 0;

    // Update session
    const [updatedSession] = await db
      .update(garSessions)
      .set({
        endTime: new Date(),
        duration: data.duration,
        garScore: data.garScore,
        physicalScore: data.physicalScore,
        cognitiveScore: data.cognitiveScore,
        psychologicalScore: data.psychologicalScore,
        readinessScore: data.readinessScore,
        trainingLoad: data.trainingLoad,
        sleepScore: data.sleepScore,
        videoUrl: data.videoUrl,
        deltaFromBaseline,
        updatedAt: new Date(),
      })
      .where(eq(garSessions.id, activeSession.id))
      .returning();

    // Award StarPath XP (10 XP per GAR point above baseline)
    if (deltaFromBaseline > 0) {
      const xpAwarded = Math.round(deltaFromBaseline * 10);
      
      // Update student profile XP
      if (profile) {
        await db
          .update(studentProfiles)
          .set({
            totalXp: (profile.totalXp || 0) + xpAwarded,
            currentGarScore: data.garScore,
            lastGarSync: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(studentProfiles.userId, userId));
      }
    }

    // Emit PostHog server event
    // TODO: Add PostHog server-side tracking with XP awarded

    return NextResponse.json({
      success: true,
      session: updatedSession,
      deltaFromBaseline,
      xpAwarded: deltaFromBaseline > 0 ? Math.round(deltaFromBaseline * 10) : 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process GAR session" },
      { status: 500 }
    );
  }
}
