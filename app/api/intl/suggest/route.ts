/**
 * POST /api/intl/suggest
 * Match courses to NCAA categories
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { suggestCourseMatches } from "@/lib/intl/evaluator-mvp";
import { z } from "zod";

const SuggestSchema = z.object({
  transcriptId: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transcriptId } = SuggestSchema.parse(body);

    // Process course matches
    const result = await suggestCourseMatches(transcriptId);

    return NextResponse.json({
      success: true,
      transcriptId: result.transcriptId,
      coursesProcessed: result.coursesProcessed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Suggest error:", error);
    return NextResponse.json(
      { error: "Failed to suggest course matches" },
      { status: 500 }
    );
  }
}
