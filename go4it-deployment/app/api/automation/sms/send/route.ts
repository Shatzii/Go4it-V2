import { NextRequest, NextResponse } from 'next/server';
import { OpenSourceSMSSystem } from '@/lib/sms-automation';
import { db } from '@/server/db';
import { prospects, campaigns } from '@/shared/schema';
import { eq, inArray, and, sql } from 'drizzle-orm';

// POST - Send automated SMS campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaignId,
      prospectIds = [],
      messageTemplate,
      testMode = false,
      smsProvider = 'free', // 'textbelt', 'clicksend', 'vonage', 'free'
    } = body;

    // Get campaign details
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId));

    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
    }

    // Get target prospects
    let targetProspects;
    if (prospectIds.length > 0) {
      targetProspects = await db.select().from(prospects).where(inArray(prospects.id, prospectIds));
    } else {
      // Use campaign filters
      const conditions = [eq(prospects.unsubscribed, false)];

      if (campaign.sport) {
        conditions.push(eq(prospects.sport, campaign.sport));
      }
      if (campaign.states && campaign.states.length > 0) {
        conditions.push(inArray(prospects.state, campaign.states));
      }

      targetProspects = await db
        .select()
        .from(prospects)
        .where(and(...conditions));
    }

    // For SMS, we'll simulate phone numbers since we don't have them in prospect data
    // In real implementation, you'd have phone numbers from social media scraping
    const prospectsWithPhone = targetProspects.map((prospect) => ({
      ...prospect,
      phoneNumber: testMode ? '+1234567890' : generatePhoneNumber(prospect.state),
    }));

    if (prospectsWithPhone.length === 0) {
      return NextResponse.json({ success: false, message: 'No prospects found' }, { status: 400 });
    }

    // Limit for test mode
    const finalProspects = testMode ? prospectsWithPhone.slice(0, 3) : prospectsWithPhone;

    // Initialize SMS system
    const smsSystem = new OpenSourceSMSSystem({
      provider: smsProvider as any,
      apiKey: process.env.SMS_API_KEY,
      apiSecret: process.env.SMS_API_SECRET,
      fromNumber: process.env.SMS_FROM_NUMBER || '+12345678901',
    });

    // Get SMS template
    const template =
      messageTemplate ||
      (campaign.socialMediaTemplate
        ? campaign.socialMediaTemplate
        : OpenSourceSMSSystem.getRecruitmentSMSTemplates().garIntroduction.message);

    // Send bulk SMS
    const result = await smsSystem.sendBulkSMS(finalProspects, template, campaignId, {
      rateLimit: testMode ? 60 : 10, // SMS per minute (be conservative)
      batchSize: testMode ? 1 : 3,
    });

    // Update campaign stats
    await db
      .update(campaigns)
      .set({
        status: 'active',
        totalSent: sql`${campaigns.totalSent} + ${result.sent}`,
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, campaignId));

    return NextResponse.json({
      success: true,
      message: `SMS campaign launched successfully`,
      data: {
        campaignName: campaign.name,
        totalTargeted: finalProspects.length,
        smsSent: result.sent,
        smsFailed: result.failed,
        totalCost: result.totalCost,
        testMode,
        provider: smsProvider,
        costPerMessage: result.totalCost / (result.sent || 1),
      },
    });
  } catch (error) {
    console.error('Error sending SMS campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send SMS campaign', error: error.message },
      { status: 500 },
    );
  }
}

// Helper function to generate realistic phone numbers by state
function generatePhoneNumber(state: string): string {
  const areaCodes: Record<string, string[]> = {
    CA: ['213', '310', '415', '510', '619', '714', '818', '909'],
    TX: [
      '214',
      '281',
      '361',
      '409',
      '432',
      '469',
      '512',
      '713',
      '806',
      '817',
      '832',
      '903',
      '915',
      '936',
      '940',
      '956',
      '972',
      '979',
    ],
    FL: [
      '305',
      '321',
      '352',
      '386',
      '407',
      '561',
      '727',
      '754',
      '772',
      '786',
      '813',
      '850',
      '863',
      '904',
      '941',
      '954',
    ],
    NY: [
      '212',
      '315',
      '347',
      '516',
      '518',
      '585',
      '607',
      '631',
      '646',
      '716',
      '718',
      '845',
      '914',
      '917',
      '929',
    ],
    GA: ['229', '404', '470', '478', '678', '706', '762', '770', '912'],
    default: ['555'], // Default area code for unknown states
  };

  const stateAreaCodes = areaCodes[state] || areaCodes.default;
  const areaCode = stateAreaCodes[Math.floor(Math.random() * stateAreaCodes.length)];
  const exchange = String(Math.floor(Math.random() * 900) + 100);
  const number = String(Math.floor(Math.random() * 9000) + 1000);

  return `+1${areaCode}${exchange}${number}`;
}

// GET - Get SMS system status and provider information
export async function GET(request: NextRequest) {
  try {
    const providerInfo = OpenSourceSMSSystem.getProviderInfo();
    const templates = OpenSourceSMSSystem.getRecruitmentSMSTemplates();

    return NextResponse.json({
      success: true,
      data: {
        providers: providerInfo,
        templates: Object.keys(templates),
        templateDetails: templates,
        configuration: {
          currentProvider: 'free', // Default to free for testing
          rateLimit: '10 SMS/minute',
          features: [
            'Multiple provider fallback',
            'Cost tracking',
            'Personalization',
            'Rate limiting',
            'Bulk sending',
            'Template management',
          ],
        },
        recommendations: {
          testing: 'Use "free" provider for development',
          production: 'TextBelt for best value ($0.02/SMS)',
          enterprise: 'Vonage for high volume and analytics',
          budget: 'Start with 1000 SMS/month budget ($20-40)',
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get SMS system status' },
      { status: 500 },
    );
  }
}
