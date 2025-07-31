import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis } from '@/lib/schema';
import { localVideoAnalyzer } from '@/lib/local-models';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Allow demo access for testing
    let user = await getUserFromRequest(request);
    if (!user) {
      // Create demo user for testing
      user = { id: 1, email: 'demo@example.com', name: 'Demo User' };
    }

    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const sport = formData.get('sport') as string || 'basketball';

    if (!file) {
      return NextResponse.json({ error: 'Video file is required' }, { status: 400 });
    }

    // Save uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Save file with timestamp to avoid conflicts
    const timestamp = Date.now();
    const fileName = `${user.id}_${timestamp}_${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);

    // Perform local video analysis
    const analysis = await localVideoAnalyzer.analyzeVideoLocal(filePath, sport);

    // Save analysis to database
    const [savedAnalysis] = await db
      .insert(videoAnalysis)
      .values({
        userId: user.id,
        fileName: file.name,
        filePath: `/uploads/${fileName}`,
        sport: sport,
        garScore: analysis.overallScore.toFixed(1),
        analysisData: analysis,
        feedback: `Local GAR Analysis: ${analysis.overallScore.toFixed(1)}/100 - Analyzed using local AI models. ${analysis.breakdown.strengths.slice(0, 2).join(', ')}`
      })
      .returning();

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id,
      garScore: analysis.overallScore,
      analysis: analysis,
      message: 'Local video analysis completed successfully',
      processingTime: analysis.processingTime,
      analysisSource: 'local_models'
    });

  } catch (error: any) {
    console.error('Local GAR analysis error:', error);
    
    if (error.message.includes('Missing required models')) {
      return NextResponse.json(
        { 
          error: 'Local AI models not installed. Please download models first.',
          needsModels: true,
          missingModels: error.message
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Local analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}