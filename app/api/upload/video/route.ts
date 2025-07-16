import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;
    const sport = formData.get('sport') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    if (!sport) {
      return NextResponse.json({ error: 'Sport is required' }, { status: 400 });
    }

    // More flexible file validation
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime'];
    const validExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.m4v'];
    
    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidType && !hasValidExtension) {
      // Try to determine file type by content
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Check file signature (magic numbers)
      const isValidVideo = isVideoFile(buffer);
      
      if (!isValidVideo) {
        return NextResponse.json(
          { error: 'Invalid video file. Please upload MP4, AVI, MOV, or WMV files.' },
          { status: 400 }
        );
      }
    }

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 500MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads', 'videos');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${user.id}-${sanitizedName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // Return file information
    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        sport: sport,
        description: description,
        uploadedAt: new Date().toISOString(),
        userId: user.id
      },
      message: 'Video uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

function isVideoFile(buffer: Buffer): boolean {
  // Check for common video file signatures
  const signatures = [
    // MP4
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
    // AVI
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x41, 0x56, 0x49, 0x20],
    // MOV/QuickTime
    [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74],
    // WMV
    [0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11]
  ];

  return signatures.some(signature => {
    if (buffer.length < signature.length) return false;
    
    return signature.every((byte, index) => {
      return byte === null || buffer[index] === byte;
    });
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      limits: {
        maxFileSize: '500MB',
        supportedFormats: ['MP4', 'AVI', 'MOV', 'WMV', 'M4V'],
        maxDuration: '30 minutes'
      },
      uploadPath: '/api/upload/video'
    });

  } catch (error) {
    console.error('Error getting upload info:', error);
    return NextResponse.json(
      { error: 'Failed to get upload information' },
      { status: 500 }
    );
  }
}