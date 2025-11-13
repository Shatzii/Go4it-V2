import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: number;
  uploadDate: string;
  description: string;
  uploadedBy: string;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

// Mock data store - in production, this would be a database
const mediaStore: MediaItem[] = [
  {
    id: '1',
    name: 'basketball-training-hero.jpg',
    type: 'image',
    url: '/media/basketball-training-hero.jpg',
    size: 245760,
    uploadDate: '2025-01-10',
    description: 'Hero image for basketball training article',
    uploadedBy: 'Coach Martinez',
    mimeType: 'image/jpeg',
    dimensions: { width: 1200, height: 800 },
  },
  {
    id: '2',
    name: 'recruitment-process-video.mp4',
    type: 'video',
    url: '/media/recruitment-process-video.mp4',
    size: 15728640,
    uploadDate: '2025-01-08',
    description: 'Video explaining NCAA recruitment process',
    uploadedBy: 'Recruitment Team',
    mimeType: 'video/mp4',
  },
  {
    id: '3',
    name: 'training-guide.pdf',
    type: 'document',
    url: '/media/training-guide.pdf',
    size: 1048576,
    uploadDate: '2025-01-05',
    description: 'Comprehensive training guide for student athletes',
    uploadedBy: 'Dr. Sarah Chen',
    mimeType: 'application/pdf',
  },
  {
    id: '4',
    name: 'starpath-diagram.png',
    type: 'image',
    url: '/media/starpath-diagram.png',
    size: 512000,
    uploadDate: '2025-01-12',
    description: 'Diagram showing StarPath progression system',
    uploadedBy: 'Development Team',
    mimeType: 'image/png',
    dimensions: { width: 800, height: 600 },
  },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let filteredMedia = [...mediaStore];

    // Filter by type
    if (type && type !== 'all') {
      filteredMedia = filteredMedia.filter((item) => item.type === type);
    }

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredMedia = filteredMedia.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm),
      );
    }

    // Sort by upload date (newest first)
    filteredMedia.sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );

    // Pagination
    const paginatedMedia = filteredMedia.slice(offset, offset + limit);
    const totalCount = filteredMedia.length;

    return NextResponse.json({
      media: paginatedMedia,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      stats: {
        totalFiles: mediaStore.length,
        totalSize: mediaStore.reduce((sum, item) => sum + item.size, 0),
        typeBreakdown: {
          image: mediaStore.filter((item) => item.type === 'image').length,
          video: mediaStore.filter((item) => item.type === 'video').length,
          document: mediaStore.filter((item) => item.type === 'document').length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch media',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, this would handle file uploads
    // For now, we'll return a mock response
    return NextResponse.json(
      {
        error: 'File upload not implemented in demo version',
      },
      { status: 501 },
    );
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload media',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          error: 'Media ID is required',
        },
        { status: 400 },
      );
    }

    const mediaIndex = mediaStore.findIndex((item) => item.id === id);

    if (mediaIndex === -1) {
      return NextResponse.json(
        {
          error: 'Media not found',
        },
        { status: 404 },
      );
    }

    mediaStore.splice(mediaIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete media',
      },
      { status: 500 },
    );
  }
}
