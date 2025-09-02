import { NextRequest, NextResponse } from 'next/server';
import { socialMediaIntegration } from '@/lib/social-media-integration';
import { databaseStorage } from '@/server/database-storage';

// POST - Connect social media account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      platform,
      authCode,
      redirectUri,
      manualConnection = false,
      username,
      accountUrl,
    } = body;

    if (!userId || !platform) {
      return NextResponse.json(
        { success: false, message: 'User ID and platform are required' },
        { status: 400 },
      );
    }

    if (manualConnection) {
      // Manual connection for platforms without API access
      const accountData = {
        id: `${platform}_${userId}_${Date.now()}`,
        userId,
        platform,
        username: username || '',
        displayName: username || '',
        profileUrl: accountUrl || `https://${platform}.com/${username}`,
        followers: 0,
        isVerified: false,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
        isActive: true,
        connectionStatus: 'connected' as const,
        connectionType: 'manual' as const,
        lastSync: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to database
      const savedAccount = await databaseStorage.createSocialMediaAccount(accountData);

      return NextResponse.json({
        success: true,
        message: `${platform} account connected manually`,
        data: {
          accountId: savedAccount.id,
          platform: savedAccount.platform,
          username: savedAccount.username,
          connectionType: 'manual',
          features: {
            canPost: false,
            canSchedule: true,
            canAnalyze: false,
            note: 'Manual connection - content will be generated for manual posting',
          },
        },
      });
    }

    // API-based connection
    if (!authCode || !redirectUri) {
      return NextResponse.json(
        { success: false, message: 'Auth code and redirect URI required for API connection' },
        { status: 400 },
      );
    }

    const account = await socialMediaIntegration.connectAccount(
      userId,
      platform,
      authCode,
      redirectUri,
    );

    return NextResponse.json({
      success: true,
      message: `${platform} account connected successfully`,
      data: {
        accountId: account.id,
        platform: account.platform,
        username: account.username,
        displayName: account.displayName,
        followers: account.followers,
        isVerified: account.isVerified,
        connectionType: 'api',
        features: socialMediaIntegration.getPlatformConfig(platform)?.features,
      },
    });
  } catch (error) {
    console.error('Error connecting social media account:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect account', error: error.message },
      { status: 500 },
    );
  }
}

// GET - Get connection status and auth URLs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const userId = searchParams.get('userId');

    if (platform && !userId) {
      // Get platform configuration and auth URL
      const config = socialMediaIntegration.getPlatformConfig(platform);

      if (!config) {
        return NextResponse.json(
          { success: false, message: 'Platform not supported' },
          { status: 400 },
        );
      }

      // Generate auth URL with proper parameters
      const authParams = new URLSearchParams({
        client_id: process.env[`${platform.toUpperCase()}_CLIENT_ID`] || 'demo_client_id',
        redirect_uri: `${process.env.BASE_URL || 'http://localhost:5000'}/auth/callback/${platform}`,
        scope: config.scope.join(' '),
        response_type: 'code',
        state: `${platform}_${Date.now()}`,
      });

      const authUrl = `${config.authUrl}?${authParams.toString()}`;

      return NextResponse.json({
        success: true,
        data: {
          platform: config.name,
          authUrl,
          features: config.features,
          limits: config.limits,
          instructions: getConnectionInstructions(platform),
        },
      });
    }

    if (userId) {
      // Get user's connected accounts
      const accounts = await socialMediaIntegration.getUserAccounts(userId);

      return NextResponse.json({
        success: true,
        data: {
          connectedAccounts: accounts.length,
          accounts: accounts.map((acc) => ({
            id: acc.id,
            platform: acc.platform,
            username: acc.username,
            displayName: acc.displayName,
            followers: acc.followers,
            isVerified: acc.isVerified,
            isActive: acc.isActive,
            connectionStatus: acc.connectionStatus,
            lastSync: acc.lastSync,
          })),
          availablePlatforms: socialMediaIntegration.getSupportedPlatforms().map((config) => ({
            platform: config.name.toLowerCase().replace('/', ''),
            name: config.name,
            features: config.features,
            limits: config.limits,
            connected: accounts.some(
              (acc) => acc.platform === config.name.toLowerCase().replace('/', ''),
            ),
          })),
        },
      });
    }

    // Default: return all supported platforms
    const platforms = socialMediaIntegration.getSupportedPlatforms();

    return NextResponse.json({
      success: true,
      data: {
        supportedPlatforms: platforms.map((config) => ({
          platform: config.name.toLowerCase().replace('/', ''),
          name: config.name,
          features: config.features,
          limits: config.limits,
          connectionMethods: ['api', 'manual'],
        })),
        instructions: {
          api: 'Connect via OAuth for full automation capabilities',
          manual: 'Add account details for content generation (manual posting required)',
        },
      },
    });
  } catch (error) {
    console.error('Error getting connection info:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get connection info' },
      { status: 500 },
    );
  }
}

function getConnectionInstructions(platform: string): string[] {
  const instructions: Record<string, string[]> = {
    instagram: [
      'Click "Authorize" to connect your Instagram account',
      'Grant permissions for posting and analytics',
      "You'll be redirected back to Go4It Sports",
      'Your account will be ready for automated posting',
    ],
    twitter: [
      'Sign in to your Twitter/X account',
      'Authorize Go4It Sports to access your account',
      'Grant permissions for reading and posting tweets',
      'Return to complete the connection',
    ],
    facebook: [
      'Log in to your Facebook account',
      'Select the Page you want to connect',
      'Grant posting and analytics permissions',
      'Confirm the connection',
    ],
    tiktok: [
      'Connect your TikTok account',
      'Grant video upload permissions',
      'Note: TikTok requires manual video uploads',
      'Content will be generated for you to post manually',
    ],
    linkedin: [
      'Sign in to LinkedIn',
      'Grant permissions for profile and posting',
      'Professional content will be optimized for LinkedIn',
      'Your connection will be confirmed',
    ],
    youtube: [
      'Connect your YouTube channel',
      'Grant video upload permissions',
      'Content will be generated for video descriptions',
      'Manual video uploads required',
    ],
  };

  return (
    instructions[platform] || [
      'Follow the authorization process',
      'Grant necessary permissions',
      'Complete the connection',
    ]
  );
}
