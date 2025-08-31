import { NextRequest, NextResponse } from 'next/server';
import { socialMediaEngine } from '@/lib/social-media-automation';

// POST - Generate social media content and images
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type = 'screenshots', // 'screenshots', 'promotional', 'content', 'video'
      features = ['gar-analysis', 'starpath'],
      platforms = ['instagram', 'twitter'],
      generateImages = true,
      generateContent = true,
    } = body;

    const results: any = {
      success: true,
      message: 'Content generated successfully',
      data: {
        screenshots: [],
        promotionalImages: [],
        content: [],
        videos: [],
      },
    };

    if (type === 'screenshots' && generateImages) {
      console.log('Generating feature screenshots...');
      const screenshots = await socialMediaEngine.captureFeatureScreenshots(features);

      const screenshotResults = [];
      for (const [feature, screenshot] of screenshots) {
        // Save screenshot for download
        const timestamp = Date.now();
        const filename = `screenshot_${feature}_${timestamp}.png`;

        screenshotResults.push({
          feature,
          filename,
          size: screenshot.length,
          downloadUrl: `/api/social-media/download/${filename}`,
        });
      }

      results.data.screenshots = screenshotResults;
    }

    if (type === 'promotional' && generateImages) {
      console.log('Generating promotional images...');
      const screenshots = await socialMediaEngine.captureFeatureScreenshots(features);
      const promoImages = [];

      for (const [feature, screenshot] of screenshots) {
        const promoImage = await socialMediaEngine.generatePromotionalImage(
          screenshot,
          feature,
          'Try Free Today!',
        );

        const timestamp = Date.now();
        const filename = `promo_${feature}_${timestamp}.png`;

        promoImages.push({
          feature,
          filename,
          size: promoImage.length,
          downloadUrl: `/api/social-media/download/${filename}`,
        });
      }

      results.data.promotionalImages = promoImages;
    }

    if (type === 'content' && generateContent) {
      console.log('Generating social media content...');
      const contentResults = [];

      for (const platform of platforms) {
        for (const feature of features) {
          const { content, hashtags } = await socialMediaEngine.generateSocialContent(
            feature,
            platform,
            'athletes_and_parents',
          );

          contentResults.push({
            platform,
            feature,
            content,
            hashtags,
            characterCount: content.length,
          });
        }
      }

      results.data.content = contentResults;
    }

    if (type === 'video') {
      console.log('Generating video content...');
      const videos = [];

      for (const feature of features) {
        const video = await socialMediaEngine.generateVideoContent(feature);
        if (video) {
          const timestamp = Date.now();
          const filename = `video_${feature}_${timestamp}.mp4`;

          videos.push({
            feature,
            filename,
            size: video.length,
            downloadUrl: `/api/social-media/download/${filename}`,
          });
        }
      }

      results.data.videos = videos;
    }

    if (type === 'complete-campaign') {
      console.log('Generating complete campaign package...');

      // Generate everything for a complete campaign
      const screenshots = await socialMediaEngine.captureFeatureScreenshots(features);
      const campaignResults = {
        screenshots: [],
        promotionalImages: [],
        content: [],
        socialPosts: [],
      };

      for (const [feature, screenshot] of screenshots) {
        // Save screenshot
        const timestamp = Date.now();
        campaignResults.screenshots.push({
          feature,
          filename: `screenshot_${feature}_${timestamp}.png`,
          downloadUrl: `/uploads/screenshot_${feature}_${timestamp}.png`,
        });

        // Generate promotional image
        const promoImage = await socialMediaEngine.generatePromotionalImage(
          screenshot,
          feature,
          'Start Your Journey Today!',
        );

        campaignResults.promotionalImages.push({
          feature,
          filename: `promo_${feature}_${timestamp}.png`,
          downloadUrl: `/uploads/promo_${feature}_${timestamp}.png`,
        });

        // Generate content for each platform
        for (const platform of platforms) {
          const { content, hashtags } = await socialMediaEngine.generateSocialContent(
            feature,
            platform,
          );

          campaignResults.content.push({
            platform,
            feature,
            content,
            hashtags,
            suggestedPostTime: socialMediaEngine['calculateOptimalPostTime'](platform),
          });
        }
      }

      results.data = campaignResults;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error generating social media content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate content',
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// GET - Get available generation options
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        availableFeatures: [
          'gar-analysis',
          'starpath',
          'academy',
          'recruitment',
          'dashboard',
          'ai-coach',
          'video-analysis',
          'leaderboards',
        ],
        supportedPlatforms: ['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin'],
        generationTypes: [
          {
            type: 'screenshots',
            description: 'Capture feature screenshots for social media',
            estimatedTime: '30-60 seconds',
          },
          {
            type: 'promotional',
            description: 'Create branded promotional images',
            estimatedTime: '1-2 minutes',
          },
          {
            type: 'content',
            description: 'Generate AI-powered social media captions',
            estimatedTime: '10-20 seconds',
          },
          {
            type: 'video',
            description: 'Create short video content for TikTok/Reels',
            estimatedTime: '2-3 minutes',
          },
          {
            type: 'complete-campaign',
            description: 'Full campaign package with images and content',
            estimatedTime: '3-5 minutes',
          },
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get generation options' },
      { status: 500 },
    );
  }
}
