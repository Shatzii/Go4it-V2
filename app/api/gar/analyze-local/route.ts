import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoAnalysis } from '@/lib/schema';
import { productionAnalyzer } from '@/lib/production-analyzer';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Allow demo access for testing
    let user = await getUserFromRequest(request);
    if (!user) {
      // Create demo user for testing
      user = {
        id: 1,
        username: 'demo_user',
        email: 'demo@example.com',
        password: '',
        role: 'athlete',
        firstName: 'Demo',
        lastName: 'User',
        dateOfBirth: new Date(),
        sport: 'basketball',
        position: 'player',
        graduationYear: 2025,
        gpa: '3.5',
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
    }

    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const sport = (formData.get('sport') as string) || 'basketball';

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

    // Perform REAL computer vision analysis
    try {
      const analysis = await productionAnalyzer.analyzeVideo(filePath, sport);

      console.log('Real computer vision analysis completed:', {
        sport: sport,
        garScore: analysis.garScore,
      });

      // Save real analysis to database
      const [savedAnalysis] = await db
        .insert(videoAnalysis)
        .values({
          userId: user.id,
          fileName: file.name,
          filePath: `/uploads/${fileName}`,
          sport: sport,
          garScore: analysis.garScore.toString(),
          analysisData: analysis,
          feedback: analysis.feedback.join('. '),
        })
        .returning();

      return NextResponse.json({
        success: true,
        analysisId: savedAnalysis.id,
        garScore: analysis.garScore,
        analysis: analysis,
        message: 'Computer vision analysis completed successfully',
      });
    } catch (error: any) {
      console.error('Computer vision analysis failed:', error);

      if (error.message.includes('Computer vision analysis failed')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Computer vision analysis failed',
            message: `Failed to analyze ${sport} video: ${error.message}`,
            sport: sport,
            videoPath: filePath,
            analysisType: 'real_computer_vision',
            suggestion: 'Try with a clearer video or different sport setting',
          },
          { status: 500 },
        );
      }

      throw error;
    }
  } catch (error: any) {
    console.error('Local GAR analysis error:', error);

    if (error.message.includes('Missing required models')) {
      return NextResponse.json(
        {
          error: 'Local AI models not installed. Please download models first.',
          needsModels: true,
          missingModels: error.message,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: 'Local analysis failed. Please try again.' },
      { status: 500 },
    );
  }
}
