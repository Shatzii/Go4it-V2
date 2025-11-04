/**
 * POST /api/intl/ingest
 * Upload international transcript for evaluation
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ingestTranscript } from "@/lib/intl/evaluator-mvp";
import { z } from "zod";

const IngestSchema = z.object({
  countryId: z.string().min(2).max(2), // ISO 3166-1 alpha-2
  systemId: z.string(),
  schoolName: z.string().optional(),
  schoolType: z.enum(["public", "private", "international"]).optional(),
  curriculum: z.string().optional(),
  language: z.string().min(2).max(2), // ISO 639-1
  courses: z.array(
    z.object({
      year: z.number().int().min(2000).max(2100),
      term: z.string().optional(),
      subject: z.string(),
      level: z.string().optional(),
      localGrade: z.string(),
      hoursPerWeek: z.number().int().min(1).max(40).optional(),
      weeksPerYear: z.number().int().min(1).max(52).optional(),
      isCompleted: z.boolean().optional(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = IngestSchema.parse(body);

    // Ingest transcript
    const transcript = await ingestTranscript({
      userId,
      ...validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        transcriptId: transcript.id,
        status: transcript.status,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Ingest error:", error);
    return NextResponse.json(
      { error: "Failed to ingest transcript" },
      { status: 500 }
    );
  }
}
