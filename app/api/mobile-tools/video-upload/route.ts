import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { videoRecordingSessions } from '@/shared/enhanced-schema';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const sport = formData.get('sport') as string;
    const technique = formData.get('technique') as string;
    const qualityScore = parseInt(formData.get('qualityScore') as string) || 0;

    if (!videoFile || !sport || !technique) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `mobile_${user.id}_${timestamp}.webm`;
    const uploadDir = join(process.cwd(), 'uploads', 'mobile-videos');
    const filePath = join(uploadDir, filename);

    // Ensure upload directory exists
    const { mkdir } = await import('fs/promises');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save video file
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save recording session to database
    const [recordingSession] = await db
      .insert(videoRecordingSessions)
      .values({
        userId: user.id,
        sport,
        technique,
        guidanceUsed: true,
        qualityScore,
        filePath: `/uploads/mobile-videos/${filename}`,
        syncStatus: 'synced'
      })
      .returning();

    return NextResponse.json({
      success: true,
      sessionId: recordingSession.id,
      qualityScore,
      message: 'Video uploaded successfully and ready for GAR analysis'
    });

  } catch (error) {
    console.error('Mobile video upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}