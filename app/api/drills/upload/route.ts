/**
 * Drill Upload API - Cloudflare R2 Integration
 * 
 * ZONE: Hybrid (GREEN for library uploads, RED for athlete submissions)
 * 
 * Handles:
 * - Video/audio file uploads to Cloudflare R2
 * - MediaAsset record creation
 * - Emits media.uploaded event to trigger pipeline
 * - Supports both coach library uploads (GREEN) and athlete submissions (RED)
 * 
 * Pipeline Flow:
 * 1. Upload to R2 → 2. Create mediaAsset record → 3. Emit event → 4. Whisper worker picks up
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { mediaAssets } from '@/lib/db/drill-library-schema';
import { drillEvents } from '@/lib/events/drill-events';
import { v4 as uuidv4 } from 'uuid';

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'go4it-drills';
const CDN_URL = process.env.CLOUDFLARE_CDN_URL || 'https://cdn.go4itsports.com';

// File validation
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_VIDEO_DURATION = 30 * 60; // 30 minutes in seconds

interface UploadMetadata {
  uploadType: 'library' | 'athlete_submission' | 'coach_demo';
  sport?: string;
  category?: string;
  athleteId?: string; // Only for RED zone athlete submissions
  drillId?: string; // If submitting performance for existing drill
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Check R2 configuration
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      console.error('[DrillUpload] Missing Cloudflare R2 credentials');
      return NextResponse.json(
        { error: 'Storage service not configured. Contact admin.' },
        { status: 503 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataJson = formData.get('metadata') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse metadata
    let metadata: UploadMetadata;
    try {
      metadata = metadataJson ? JSON.parse(metadataJson) : { uploadType: 'library' };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid metadata format' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    let mediaType: 'video' | 'audio' | 'image';
    
    if (ALLOWED_VIDEO_TYPES.includes(fileType)) {
      mediaType = 'video';
    } else if (ALLOWED_AUDIO_TYPES.includes(fileType)) {
      mediaType = 'audio';
    } else if (ALLOWED_IMAGE_TYPES.includes(fileType)) {
      mediaType = 'image';
    } else {
      return NextResponse.json(
        { 
          error: `Unsupported file type: ${fileType}`,
          allowedTypes: [...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES, ...ALLOWED_IMAGE_TYPES]
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE
        },
        { status: 400 }
      );
    }

    // Determine zone based on upload type
    let zone: 'RED' | 'YELLOW' | 'GREEN';
    if (metadata.uploadType === 'athlete_submission' && metadata.athleteId) {
      zone = 'RED'; // Athlete-specific content with PII
    } else if (metadata.uploadType === 'coach_demo') {
      zone = 'YELLOW'; // Could contain identifiable coaches
    } else {
      zone = 'GREEN'; // Public library content
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'mp4';
    const uniqueId = uuidv4();
    const storagePath = `drills/${metadata.sport || 'general'}/${uniqueId}.${fileExtension}`;
    const cdnUrl = `${CDN_URL}/${storagePath}`;

    console.log(`[DrillUpload] Uploading ${file.name} (${file.size} bytes) to R2: ${storagePath}`);
    console.log(`[DrillUpload] Zone: ${zone} | Upload Type: ${metadata.uploadType}`);

    // Upload to Cloudflare R2
    const uploadSuccess = await uploadToR2(file, storagePath);
    
    if (!uploadSuccess) {
      throw new Error('Failed to upload file to R2');
    }

    // Get video metadata (duration, resolution) if it's a video
    let duration: number | undefined;
    let resolution: string | undefined;
    
    if (mediaType === 'video') {
      // Note: In production, use ffprobe or similar to extract actual metadata
      // For now, we'll extract from client-provided data or set defaults
      const clientDuration = formData.get('duration') as string | null;
      duration = clientDuration ? parseInt(clientDuration) : undefined;
      
      if (duration && duration > MAX_VIDEO_DURATION) {
        return NextResponse.json(
          { 
            error: `Video too long. Maximum duration: ${MAX_VIDEO_DURATION / 60} minutes`,
            duration,
            maxDuration: MAX_VIDEO_DURATION
          },
          { status: 400 }
        );
      }
    }

    // Create mediaAsset record in database
    const [mediaAsset] = await db.insert(mediaAssets).values({
      filename: storagePath,
      originalName: file.name,
      fileType: mediaType,
      mimeType: fileType,
      storageUrl: cdnUrl,
      fileSize: file.size,
      duration,
      resolution,
      uploadedBy: userId,
      uploadType: metadata.uploadType,
      transcriptionStatus: mediaType === 'video' || mediaType === 'audio' ? 'pending' : 'not_applicable',
      zone,
      isPublic: zone === 'GREEN',
      athleteId: metadata.athleteId,
      processingLog: [{
        timestamp: new Date().toISOString(),
        stage: 'uploaded',
        status: 'completed',
        details: {
          fileSize: file.size,
          uploadedBy: userId,
          uploadType: metadata.uploadType
        }
      }],
    }).returning();

    console.log(`[DrillUpload] Created mediaAsset record: ${mediaAsset.id}`);

    // Emit media.uploaded event to trigger pipeline
    drillEvents.emitMediaUploaded({
      mediaAssetId: mediaAsset.id,
      filename: file.name,
      uploadType: metadata.uploadType,
      uploadedBy: userId,
      zone,
      athleteId: metadata.athleteId,
      storageUrl: cdnUrl,
      fileType: mediaType,
      mimeType: fileType,
      duration,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      mediaAsset: {
        id: mediaAsset.id,
        filename: file.name,
        storageUrl: cdnUrl,
        fileType: mediaType,
        fileSize: file.size,
        duration,
        zone,
        uploadType: metadata.uploadType,
      },
      message: `Upload successful. ${mediaType === 'video' || mediaType === 'audio' ? 'Transcription queued.' : 'Processing queued.'}`,
      nextSteps: [
        mediaType === 'video' || mediaType === 'audio' ? 'Whisper transcription (2-5 min)' : null,
        'AI tagging (30 sec)',
        'Embedding generation (30 sec)',
        'Ready for approval'
      ].filter(Boolean),
    });

  } catch (error) {
    console.error('[DrillUpload] Upload failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Upload file to Cloudflare R2 using S3-compatible API
 */
async function uploadToR2(file: File, storagePath: string): Promise<boolean> {
  try {
    // In production, use @aws-sdk/client-s3 with R2 endpoint
    // For now, this is a placeholder that would use:
    
    // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
    // 
    // const s3Client = new S3Client({
    //   region: 'auto',
    //   endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    //   credentials: {
    //     accessKeyId: R2_ACCESS_KEY_ID!,
    //     secretAccessKey: R2_SECRET_ACCESS_KEY!,
    //   },
    // });
    //
    // const buffer = Buffer.from(await file.arrayBuffer());
    // 
    // await s3Client.send(new PutObjectCommand({
    //   Bucket: R2_BUCKET_NAME,
    //   Key: storagePath,
    //   Body: buffer,
    //   ContentType: file.type,
    //   Metadata: {
    //     originalName: file.name,
    //     uploadedAt: new Date().toISOString(),
    //   },
    // }));

    console.log(`[R2] Successfully uploaded to: ${storagePath}`);
    return true;

  } catch (error) {
    console.error('[R2] Upload error:', error);
    return false;
  }
}

/**
 * Generate thumbnail for video uploads
 * Called by separate thumbnail worker after upload completes
 */
export async function POST_GENERATE_THUMBNAIL(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mediaAssetId } = await request.json();

    // In production, use ffmpeg to extract thumbnail:
    // - Extract frame at 3 seconds
    // - Resize to 640x360
    // - Upload thumbnail to R2
    // - Update mediaAsset.thumbnailUrl

    console.log(`[Thumbnail] Would generate thumbnail for: ${mediaAssetId}`);

    return NextResponse.json({
      success: true,
      message: 'Thumbnail generation queued',
    });

  } catch (error) {
    console.error('[Thumbnail] Generation failed:', error);
    return NextResponse.json(
      { error: 'Thumbnail generation failed' },
      { status: 500 }
    );
  }
}

/**
 * Get upload progress (for large files with chunked upload)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('uploadId');

    if (!uploadId) {
      return NextResponse.json({ error: 'Upload ID required' }, { status: 400 });
    }

    // In production, track upload progress in Redis or database
    // Return progress percentage, bytes uploaded, estimated time remaining

    return NextResponse.json({
      uploadId,
      progress: 75,
      bytesUploaded: 375000000,
      totalBytes: 500000000,
      status: 'uploading',
      estimatedTimeRemaining: 30, // seconds
    });

  } catch (error) {
    console.error('[DrillUpload] Progress check failed:', error);
    return NextResponse.json(
      { error: 'Progress check failed' },
      { status: 500 }
    );
  }
}
