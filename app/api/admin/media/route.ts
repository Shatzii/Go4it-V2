import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Media library API endpoints
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    // Define media directory
    const mediaDir = join(process.cwd(), 'public', 'assets', 'media');
    
    // Ensure media directory exists
    if (!existsSync(mediaDir)) {
      await mkdir(mediaDir, { recursive: true });
    }

    // Read all files from media directory
    const files = await readdir(mediaDir);
    const mediaItems = [];

    for (const file of files) {
      const filePath = join(mediaDir, file);
      const stats = await stat(filePath);
      
      if (stats.isFile()) {
        const fileExt = file.split('.').pop()?.toLowerCase();
        let type: 'image' | 'video' | 'document' = 'document';
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt || '')) {
          type = 'image';
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(fileExt || '')) {
          type = 'video';
        }

        const mediaItem = {
          id: file,
          name: file,
          type,
          url: `/assets/media/${file}`,
          size: formatFileSize(stats.size),
          uploadDate: stats.birthtime.toISOString().split('T')[0],
          category: inferCategory(file),
          tags: generateTags(file)
        };

        // Apply filters
        const matchesCategory = category === 'all' || mediaItem.category === category;
        const matchesSearch = search === '' || 
                             mediaItem.name.toLowerCase().includes(search.toLowerCase()) ||
                             mediaItem.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

        if (matchesCategory && matchesSearch) {
          mediaItems.push(mediaItem);
        }
      }
    }

    // Sort by upload date (newest first)
    mediaItems.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return NextResponse.json({
      success: true,
      items: mediaItems,
      total: mediaItems.length
    });

  } catch (error) {
    console.error('Media library fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media library' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'uncategorized';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const mediaDir = join(process.cwd(), 'public', 'assets', 'media');
    
    // Ensure media directory exists
    if (!existsSync(mediaDir)) {
      await mkdir(mediaDir, { recursive: true });
    }

    const uploadedItems = [];

    for (const file of files) {
      if (file instanceof File) {
        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const fileExt = file.name.split('.').pop();
        const fileName = `${file.name.replace(/\.[^/.]+$/, '')}_${timestamp}_${random}.${fileExt}`;
        
        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = join(mediaDir, fileName);
        await writeFile(filePath, buffer);

        // Determine file type
        let type: 'image' | 'video' | 'document' = 'document';
        const fileExtLower = fileExt?.toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtLower || '')) {
          type = 'image';
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(fileExtLower || '')) {
          type = 'video';
        }

        const mediaItem = {
          id: fileName,
          name: fileName,
          originalName: file.name,
          type,
          url: `/assets/media/${fileName}`,
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          category: category,
          tags: generateTags(file.name)
        };

        uploadedItems.push(mediaItem);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedItems.length} file(s)`,
      items: uploadedItems
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json({ error: 'File name required' }, { status: 400 });
    }

    const mediaDir = join(process.cwd(), 'public', 'assets', 'media');
    const filePath = join(mediaDir, fileName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete file
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function inferCategory(fileName: string): string {
  const nameLower = fileName.toLowerCase();
  
  if (nameLower.includes('gar') || nameLower.includes('rating')) return 'marketing';
  if (nameLower.includes('combine') || nameLower.includes('tour')) return 'events';
  if (nameLower.includes('athlete') || nameLower.includes('verified')) return 'athletes';
  if (nameLower.includes('logo') || nameLower.includes('brand')) return 'branding';
  if (nameLower.includes('camp') || nameLower.includes('program')) return 'programs';
  if (nameLower.includes('flyer') || nameLower.includes('promo')) return 'marketing';
  
  return 'general';
}

function generateTags(fileName: string): string[] {
  const tags: string[] = [];
  const nameLower = fileName.toLowerCase();
  
  // Common keywords
  const keywords = [
    'gar', 'rating', 'system', 'combine', 'tour', 'athlete', 'verified',
    'logo', 'brand', 'camp', 'program', 'flyer', 'promo', 'marketing',
    '2025', '2024', 'sports', 'go4it', 'elite', 'training'
  ];
  
  keywords.forEach(keyword => {
    if (nameLower.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return tags;
}