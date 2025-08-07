import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // List of possible locations for uploaded files
    const possiblePaths = [
      join(process.cwd(), filename), // Root directory
      join(process.cwd(), 'public', filename), // Public directory
      join(process.cwd(), 'uploads', filename), // Uploads directory
      join(process.cwd(), 'attached_assets', filename), // Attached assets
    ];
    
    let filePath = null;
    let fileBuffer = null;
    
    // Try to find the file in possible locations
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        filePath = path;
        fileBuffer = readFileSync(path);
        break;
      }
    }
    
    if (!fileBuffer) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Determine content type based on file extension
    const getContentType = (filename: string): string => {
      const ext = filename.toLowerCase().split('.').pop();
      switch (ext) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'gif':
          return 'image/gif';
        case 'webp':
          return 'image/webp';
        case 'svg':
          return 'image/svg+xml';
        case 'mp4':
          return 'video/mp4';
        case 'mov':
          return 'video/quicktime';
        case 'avi':
          return 'video/x-msvideo';
        default:
          return 'application/octet-stream';
      }
    };
    
    const contentType = getContentType(filename);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Error serving media file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}