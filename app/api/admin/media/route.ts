import { NextRequest, NextResponse } from 'next/server';

// Enhanced media management with database integration
let mediaLibrary: any = null;

// Initialize with your uploaded media assets
const initializeMediaLibrary = () => {
  return {
    assets: [
      // BRANDING & LOGOS
      {
        id: 'go4it-logo-main',
        filename: 'Go4it Logo_1752616197577.jpeg',
        originalName: 'Go4it Logo.jpeg',
        type: 'logo',
        category: 'branding',
        description: 'Main Go4It Sports platform logo',
        url: '/api/media/Go4it Logo_1752616197577.jpeg',
        thumbnailUrl: '/api/media/Go4it Logo_1752616197577.jpeg',
        uploadDate: '2025-01-07',
        size: '456 KB',
        tags: ['logo', 'branding', 'go4it', 'primary'],
        isActive: true,
        displayOrder: 1,
      },

      // EVENT & CAMP PROMOTIONAL MATERIALS
      {
        id: 'green-soccer-camp-flyer',
        filename: 'Green Fun Soccer Camp Sport Event Flyer_1752787651058.jpeg',
        originalName: 'Green Fun Soccer Camp Sport Event Flyer.jpeg',
        type: 'image',
        category: 'camps',
        description: 'Promotional flyer for Green Fun Soccer Camp',
        url: '/api/media/Green Fun Soccer Camp Sport Event Flyer_1752787651058.jpeg',
        thumbnailUrl: '/api/media/Green Fun Soccer Camp Sport Event Flyer_1752787651058.jpeg',
        uploadDate: '2025-01-07',
        size: '1.8 MB',
        tags: ['soccer', 'camp', 'promotional', 'flyer', 'events'],
        isActive: true,
        displayOrder: 2,
      },
      {
        id: 'baseball-camp-flyer-updated',
        filename: 'Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1754370606998.png',
        originalName: 'Navy Blue and Gray Modern Baseball Camp Promotion Flyer Updated.png',
        type: 'image',
        category: 'camps',
        description: 'Updated version of baseball camp promotional flyer',
        url: '/api/media/Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1754370606998.png',
        thumbnailUrl:
          '/api/media/Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1754370606998.png',
        uploadDate: '2025-01-07',
        size: '2.1 MB',
        tags: ['baseball', 'camp', 'promotional', 'flyer', 'updated', 'current'],
        isActive: true,
        displayOrder: 3,
      },

      // EUROPEAN EVENTS & INTERNATIONAL CONTENT
      {
        id: 'europe-elite-logo',
        filename: 'Copy of Europeselite.com_1754352865747.png',
        originalName: 'Europeselite.com.png',
        type: 'image',
        category: 'events',
        description: 'Europe Elite sports program branding',
        url: '/api/media/Copy of Europeselite.com_1754352865747.png',
        thumbnailUrl: '/api/media/Copy of Europeselite.com_1754352865747.png',
        uploadDate: '2025-01-07',
        size: '1.5 MB',
        tags: ['europe', 'elite', 'international', 'branding', 'logo'],
        isActive: true,
        displayOrder: 4,
      },
      {
        id: 'ews-2025-banner',
        filename: 'EWS 2025 - 1_1754352865747.jpeg',
        originalName: 'EWS 2025 - 1.jpeg',
        type: 'image',
        category: 'events',
        description: 'EWS 2025 event banner and promotional material',
        url: '/api/media/EWS 2025 - 1_1754352865747.jpeg',
        thumbnailUrl: '/api/media/EWS 2025 - 1_1754352865747.jpeg',
        uploadDate: '2025-01-07',
        size: '890 KB',
        tags: ['ews', '2025', 'event', 'banner', 'european', 'sports'],
        isActive: true,
        displayOrder: 5,
      },
      {
        id: 'team-camp-2025',
        filename: 'TeamCamp2025_1754351477369.jpg',
        originalName: 'TeamCamp2025.jpg',
        type: 'image',
        category: 'camps',
        description: 'Team Camp 2025 promotional image',
        url: '/api/media/TeamCamp2025_1754351477369.jpg',
        thumbnailUrl: '/api/media/TeamCamp2025_1754351477369.jpg',
        uploadDate: '2025-01-07',
        size: '1.2 MB',
        tags: ['team', 'camp', '2025', 'group', 'training'],
        isActive: true,
        displayOrder: 6,
      },

      // VIDEO CONTENT
      {
        id: 'promotional-video-1',
        filename: 'IMG_0397_1752787651058.mov',
        originalName: 'IMG_0397.mov',
        type: 'video',
        category: 'promotional',
        description: 'Promotional or training video content',
        url: '/assets/IMG_0397_1752787651058.mov',
        thumbnailUrl: '/assets/video-thumbnail-1.jpg', // Generate or create thumbnail
        uploadDate: '2025-01-07',
        size: '45 MB',
        tags: ['video', 'promotional', 'training', 'content'],
        isActive: true,
        displayOrder: 7,
      },
      {
        id: 'training-video-1',
        filename: 'IMG_5141_1753940768312.mov',
        originalName: 'IMG_5141.mov',
        type: 'video',
        category: 'athlete-content',
        description: 'Training or technique demonstration video',
        url: '/assets/IMG_5141_1753940768312.mov',
        thumbnailUrl: '/assets/video-thumbnail-2.jpg', // Generate or create thumbnail
        uploadDate: '2025-01-07',
        size: '67 MB',
        tags: ['video', 'training', 'technique', 'demonstration'],
        isActive: true,
        displayOrder: 8,
      },

      // ATHLETE PHOTOS & CONTENT
      {
        id: 'athlete-photo-1',
        filename: 'IMG_3867_1754370606998.jpeg',
        originalName: 'IMG_3867.jpeg',
        type: 'image',
        category: 'athlete-content',
        description: 'Athlete training or competition photo',
        url: '/assets/IMG_3867_1754370606998.jpeg',
        thumbnailUrl: '/assets/IMG_3867_1754370606998.jpeg',
        uploadDate: '2025-01-07',
        size: '2.3 MB',
        tags: ['athlete', 'photo', 'training', 'action'],
        isActive: true,
        displayOrder: 9,
      },
      {
        id: 'athlete-photo-2',
        filename: 'IMG_5606_1754352865747.jpeg',
        originalName: 'IMG_5606.jpeg',
        type: 'image',
        category: 'athlete-content',
        description: 'Additional athlete or event photo',
        url: '/assets/IMG_5606_1754352865747.jpeg',
        thumbnailUrl: '/assets/IMG_5606_1754352865747.jpeg',
        uploadDate: '2025-01-07',
        size: '1.9 MB',
        tags: ['athlete', 'photo', 'event', 'sports'],
        isActive: true,
        displayOrder: 10,
      },

      // DESIGN ASSETS & GRAPHICS
      {
        id: 'chatgpt-design-1',
        filename: 'ChatGPT Image May 31, 2025, 05_20_35 AM_1752599683654.png',
        originalName: 'ChatGPT Image May 31 2025.png',
        type: 'image',
        category: 'promotional',
        description: 'AI-generated promotional design asset',
        url: '/assets/ChatGPT Image May 31, 2025, 05_20_35 AM_1752599683654.png',
        thumbnailUrl: '/assets/ChatGPT Image May 31, 2025, 05_20_35 AM_1752599683654.png',
        uploadDate: '2025-01-07',
        size: '1.4 MB',
        tags: ['ai-generated', 'design', 'promotional', 'graphic'],
        isActive: true,
        displayOrder: 11,
      },
      {
        id: 'untitled-design',
        filename: 'Untitled design_1754371070721.png',
        originalName: 'Untitled design.png',
        type: 'image',
        category: 'promotional',
        description: 'Custom design asset for platform use',
        url: '/assets/Untitled design_1754371070721.png',
        thumbnailUrl: '/assets/Untitled design_1754371070721.png',
        uploadDate: '2025-01-07',
        size: '1.6 MB',
        tags: ['design', 'custom', 'asset', 'graphic'],
        isActive: true,
        displayOrder: 12,
      },
    ],
    categories: ['branding', 'events', 'camps', 'documentation', 'promotional', 'athlete-content'],
    featuredAssets: ['go4it-logo-main', 'promotional-video-1', 'ews-2025-banner'],
    lastUpdated: new Date().toISOString(),
  };
};

export async function GET(req: NextRequest) {
  try {
    if (!mediaLibrary) {
      mediaLibrary = initializeMediaLibrary();
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');

    let assets = mediaLibrary.assets;

    // Apply filters
    if (category && category !== 'all') {
      assets = assets.filter((asset: any) => asset.category === category);
    }

    if (type && type !== 'all') {
      assets = assets.filter((asset: any) => asset.type === type);
    }

    if (featured === 'true') {
      assets = assets.filter((asset: any) => mediaLibrary.featuredAssets.includes(asset.id));
    }

    return NextResponse.json({
      assets,
      categories: mediaLibrary.categories,
      featuredAssets: mediaLibrary.featuredAssets,
      totalCount: mediaLibrary.assets.length,
      filteredCount: assets.length,
      lastUpdated: mediaLibrary.lastUpdated,
    });
  } catch (error) {
    console.error('Failed to fetch media library:', error);
    return NextResponse.json({ error: 'Failed to fetch media library' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, assetId, updates, featuredAssets } = body;

    if (!mediaLibrary) {
      mediaLibrary = initializeMediaLibrary();
    }

    switch (action) {
      case 'updateAsset':
        if (assetId && updates) {
          mediaLibrary.assets = mediaLibrary.assets.map((asset: any) =>
            asset.id === assetId
              ? { ...asset, ...updates, lastUpdated: new Date().toISOString() }
              : asset,
          );
        }
        break;

      case 'updateFeatured':
        if (featuredAssets) {
          mediaLibrary.featuredAssets = featuredAssets;
        }
        break;

      case 'toggleActive':
        if (assetId) {
          mediaLibrary.assets = mediaLibrary.assets.map((asset: any) =>
            asset.id === assetId
              ? { ...asset, isActive: !asset.isActive, lastUpdated: new Date().toISOString() }
              : asset,
          );
        }
        break;

      case 'reorder':
        if (body.orderedIds) {
          body.orderedIds.forEach((id: string, index: number) => {
            const assetIndex = mediaLibrary.assets.findIndex((asset: any) => asset.id === id);
            if (assetIndex !== -1) {
              mediaLibrary.assets[assetIndex].displayOrder = index + 1;
            }
          });
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    mediaLibrary.lastUpdated = new Date().toISOString();

    console.log('Media library updated:', {
      action,
      assetId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Media library updated successfully',
      timestamp: mediaLibrary.lastUpdated,
    });
  } catch (error) {
    console.error('Failed to update media library:', error);
    return NextResponse.json({ error: 'Failed to update media library' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const data = body ? JSON.parse(body) : {};
    const { action } = data;

    if (!mediaLibrary) {
      mediaLibrary = initializeMediaLibrary();
    }

    switch (action) {
      case 'getForCMS':
        // Return media assets formatted for CMS integration
        return NextResponse.json({
          assets: mediaLibrary.assets.filter((asset: any) => asset.isActive),
          featured: mediaLibrary.assets.filter(
            (asset: any) => mediaLibrary.featuredAssets.includes(asset.id) && asset.isActive,
          ),
          byCategory: mediaLibrary.categories.reduce((acc: any, category: string) => {
            acc[category] = mediaLibrary.assets.filter(
              (asset: any) => asset.category === category && asset.isActive,
            );
            return acc;
          }, {}),
          videos: mediaLibrary.assets.filter(
            (asset: any) => asset.type === 'video' && asset.isActive,
          ),
          images: mediaLibrary.assets.filter(
            (asset: any) => (asset.type === 'image' || asset.type === 'logo') && asset.isActive,
          ),
        });

      case 'getFeaturedForHomepage':
        // Return only featured assets for homepage display
        const featuredForHomepage = mediaLibrary.assets
          .filter((asset: any) => mediaLibrary.featuredAssets.includes(asset.id) && asset.isActive)
          .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

        return NextResponse.json({
          hero: {
            backgroundVideo: featuredForHomepage.find((asset: any) => asset.type === 'video'),
            backgroundImage: featuredForHomepage.find((asset: any) => asset.type === 'image'),
            logo: featuredForHomepage.find((asset: any) => asset.type === 'logo'),
          },
          gallery: featuredForHomepage.slice(0, 6),
          videos: featuredForHomepage.filter((asset: any) => asset.type === 'video'),
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Media API POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
