import { NextResponse } from 'next/server';
import { AdvancedSocialMediaEngine } from '@/lib/advanced-social-media-engine';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      features = ['gar-analysis', 'starpath'],
      platforms = ['instagram', 'twitter', 'facebook'],
      contentType = 'mixed', // 'image', 'video', 'carousel', 'mixed'
      count = 5,
      athleteIds = [],
      includeScreenshots = true,
      autoCaption = true,
      hashtags = true,
    } = body;

    // Initialize social media engine
    const engine = new AdvancedSocialMediaEngine();

    const generatedContent = [];
    const screenshots = [];
    const errors = [];

    // Generate content for each platform
    for (const platform of platforms) {
      try {
        // Generate AI captions and content
        const content = await engine.generateContent({
          platform,
          features,
          contentType,
          athleteIds,
          autoCaption,
          includeHashtags: hashtags,
        });

        generatedContent.push({
          platform,
          ...content,
        });

        // Generate screenshots if requested
        if (includeScreenshots) {
          const screenshot = await engine.generateScreenshot({
            feature: features[0],
            platform,
            athleteId: athleteIds[0],
          });

          screenshots.push({
            platform,
            url: screenshot.url,
            feature: features[0],
          });
        }
      } catch (error: any) {
        errors.push({
          platform,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent,
        screenshots,
        count: generatedContent.length,
        timestamp: new Date().toISOString(),
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to generate social media content',
      },
      { status: 500 }
    );
  }
}

// Preview generated content without saving
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature') || 'gar-analysis';
    const platform = searchParams.get('platform') || 'instagram';

    const engine = new AdvancedSocialMediaEngine();

    // Generate sample content
    const preview = await engine.generatePreview({
      feature,
      platform,
    });

    return NextResponse.json({
      success: true,
      data: preview,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
