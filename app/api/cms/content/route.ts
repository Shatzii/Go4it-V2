import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'article' | 'announcement' | 'training' | 'news';
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  lastModified: string;
  tags: string[];
  category: string;
  featured: boolean;
  viewCount: number;
  readTime: number;
}

// Mock data store - in production, this would be a database
let contentStore: ContentItem[] = [
  {
    id: '1',
    title: 'Advanced Basketball Training Techniques',
    type: 'blog',
    content:
      'Comprehensive guide to advanced basketball training methods including proper form, drills, and conditioning exercises specifically designed for student athletes.',
    excerpt: 'Learn advanced basketball techniques from professional coaches',
    author: 'Coach Martinez',
    status: 'published',
    publishDate: '2025-01-10',
    lastModified: '2025-01-12',
    tags: ['basketball', 'training', 'advanced'],
    category: 'Training',
    featured: true,
    viewCount: 1248,
    readTime: 8,
  },
  {
    id: '2',
    title: 'NCAA Recruitment Timeline Guide',
    type: 'article',
    content:
      'Essential timeline for NCAA recruitment process including key dates, required documents, and communication strategies for student athletes.',
    excerpt: 'Navigate the NCAA recruitment process with our comprehensive timeline',
    author: 'Recruitment Team',
    status: 'published',
    publishDate: '2025-01-08',
    lastModified: '2025-01-08',
    tags: ['ncaa', 'recruitment', 'timeline'],
    category: 'Recruitment',
    featured: false,
    viewCount: 892,
    readTime: 12,
  },
  {
    id: '3',
    title: 'Platform Maintenance Notice',
    type: 'announcement',
    content:
      'Scheduled maintenance on January 20th from 2:00 AM to 4:00 AM EST. Platform will be temporarily unavailable during this time.',
    excerpt: 'Important system maintenance scheduled for this weekend',
    author: 'System Admin',
    status: 'scheduled',
    publishDate: '2025-01-18',
    lastModified: '2025-01-15',
    tags: ['maintenance', 'system'],
    category: 'System',
    featured: false,
    viewCount: 0,
    readTime: 2,
  },
  {
    id: '4',
    title: 'Neurodivergent Athletes: Special Considerations',
    type: 'training',
    content:
      'Training strategies and accommodations for neurodivergent student athletes, including ADHD, autism, and learning differences.',
    excerpt: 'Specialized training approaches for neurodivergent athletes',
    author: 'Dr. Sarah Chen',
    status: 'published',
    publishDate: '2025-01-05',
    lastModified: '2025-01-05',
    tags: ['neurodivergent', 'training', 'special-needs'],
    category: 'Training',
    featured: true,
    viewCount: 1567,
    readTime: 15,
  },
  {
    id: '5',
    title: 'StarPath System Update v2.1',
    type: 'news',
    content:
      'New features in StarPath including enhanced skill tracking, improved XP calculations, and new achievement unlocks.',
    excerpt: 'Latest updates to the StarPath progression system',
    author: 'Development Team',
    status: 'published',
    publishDate: '2025-01-12',
    lastModified: '2025-01-12',
    tags: ['starpath', 'update', 'features'],
    category: 'Platform',
    featured: false,
    viewCount: 743,
    readTime: 6,
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
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let filteredContent = [...contentStore];

    // Filter by type
    if (type && type !== 'all') {
      filteredContent = filteredContent.filter((item) => item.type === type);
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredContent = filteredContent.filter((item) => item.status === status);
    }

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredContent = filteredContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.content.toLowerCase().includes(searchTerm) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    // Sort by last modified (newest first)
    filteredContent.sort(
      (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
    );

    // Pagination
    const paginatedContent = filteredContent.slice(offset, offset + limit);
    const totalCount = filteredContent.length;

    return NextResponse.json({
      content: paginatedContent,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch content',
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

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json(
        {
          error: 'Missing required fields: title, content, type',
        },
        { status: 400 },
      );
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = body.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: body.title,
      type: body.type,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 200) + '...',
      author: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
      status: body.status || 'draft',
      publishDate: body.publishDate || new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      tags: body.tags || [],
      category: body.category || 'General',
      featured: body.featured || false,
      viewCount: 0,
      readTime,
    };

    contentStore.push(newContent);

    return NextResponse.json({
      success: true,
      content: newContent,
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      {
        error: 'Failed to create content',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error: 'Content ID is required',
        },
        { status: 400 },
      );
    }

    const contentIndex = contentStore.findIndex((item) => item.id === body.id);

    if (contentIndex === -1) {
      return NextResponse.json(
        {
          error: 'Content not found',
        },
        { status: 404 },
      );
    }

    // Calculate read time
    const wordCount = body.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const updatedContent: ContentItem = {
      ...contentStore[contentIndex],
      ...body,
      lastModified: new Date().toISOString().split('T')[0],
      readTime,
    };

    contentStore[contentIndex] = updatedContent;

    return NextResponse.json({
      success: true,
      content: updatedContent,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      {
        error: 'Failed to update content',
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
          error: 'Content ID is required',
        },
        { status: 400 },
      );
    }

    const contentIndex = contentStore.findIndex((item) => item.id === id);

    if (contentIndex === -1) {
      return NextResponse.json(
        {
          error: 'Content not found',
        },
        { status: 404 },
      );
    }

    contentStore.splice(contentIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete content',
      },
      { status: 500 },
    );
  }
}
