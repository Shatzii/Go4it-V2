import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { campaigns, prospects } from '@/shared/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
// Email service simulation (replace with actual service like SendGrid/Twilio)
class EmailAutomationService {
  async sendBulkEmail(prospects: any[], template: string, subject: string): Promise<any> {
    // Simulate email sending with realistic timing
    const results = {
      sent: 0,
      failed: 0,
      details: [],
    };

    for (const prospect of prospects) {
      try {
        // Simulate API call timing
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 95% success rate simulation
        if (Math.random() > 0.05) {
          results.sent++;
          results.details.push({
            email: prospect.email,
            status: 'sent',
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          });
        } else {
          results.failed++;
          results.details.push({
            email: prospect.email,
            status: 'failed',
            error: 'Invalid email address',
          });
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          email: prospect.email,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return results;
  }

  async sendSingleEmail(prospect: any, template: string, subject: string): Promise<any> {
    // Personalize the template
    const personalizedTemplate = template
      .replace(/\{name\}/g, prospect.name)
      .replace(/\{sport\}/g, prospect.sport)
      .replace(/\{position\}/g, prospect.position || 'athlete')
      .replace(/\{school\}/g, prospect.school || 'your school')
      .replace(/\{state\}/g, prospect.state || 'your state');

    // Simulate email sending
    return {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent',
      personalizedContent: personalizedTemplate,
    };
  }
}

// Social media automation service
class SocialMediaAutomationService {
  async sendInstagramDM(handle: string, message: string): Promise<any> {
    // Simulate Instagram DM sending
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      platform: 'instagram',
      handle,
      status: 'sent',
      messageId: `ig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  async sendTwitterDM(handle: string, message: string): Promise<any> {
    // Simulate Twitter DM sending
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      platform: 'twitter',
      handle,
      status: 'sent',
      messageId: `tw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
}

// POST - Launch campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, targetProspects, testMode = false } = body;

    // Get campaign details
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId));

    if (!campaign) {
      return NextResponse.json({ success: false, message: 'Campaign not found' }, { status: 404 });
    }

    // Get target prospects
    let prospectQuery = db.select().from(prospects);

    if (targetProspects && targetProspects.length > 0) {
      prospectQuery = prospectQuery.where(inArray(prospects.id, targetProspects));
    } else {
      // Apply campaign filters
      const conditions = [];
      if (campaign.sport) conditions.push(eq(prospects.sport, campaign.sport));
      if (campaign.states) conditions.push(inArray(prospects.state, campaign.states));
      if (campaign.minFollowers)
        conditions.push(sql`${prospects.followers} >= ${campaign.minFollowers}`);
      if (campaign.maxFollowers)
        conditions.push(sql`${prospects.followers} <= ${campaign.maxFollowers}`);

      // Exclude unsubscribed and already contacted
      conditions.push(eq(prospects.unsubscribed, false));
      conditions.push(
        sql`${prospects.campaignId} IS NULL OR ${prospects.campaignId} != ${campaignId}`,
      );

      if (conditions.length > 0) {
        prospectQuery = prospectQuery.where(and(...conditions));
      }
    }

    const targetedProspects = await prospectQuery;

    if (targetedProspects.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No prospects found matching campaign criteria' },
        { status: 400 },
      );
    }

    // Limit prospects in test mode
    const prospectsToContact = testMode ? targetedProspects.slice(0, 5) : targetedProspects;

    const results = {
      campaign: campaign.name,
      type: campaign.type,
      testMode,
      totalTargeted: prospectsToContact.length,
      successful: 0,
      failed: 0,
      details: [],
    };

    // Launch campaign based on type
    if (campaign.type === 'email') {
      const emailService = new EmailAutomationService();

      for (const prospect of prospectsToContact) {
        if (!prospect.email) continue;

        try {
          const result = await emailService.sendSingleEmail(
            prospect,
            campaign.emailTemplate || 'Default template',
            campaign.subject || 'Unlock Your Athletic Potential with Go4It Sports',
          );

          // Update prospect record
          await db
            .update(prospects)
            .set({
              campaignId: campaignId,
              emailStatus: 'sent',
              contactAttempts: sql`${prospects.contactAttempts} + 1`,
              lastContactDate: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(prospects.id, prospect.id));

          results.successful++;
          results.details.push({
            prospectId: prospect.id,
            name: prospect.name,
            email: prospect.email,
            status: 'sent',
            messageId: result.messageId,
          });

          // Add delay between sends (respect rate limits)
          if (campaign.sendDelay && campaign.sendDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, campaign.sendDelay * 1000));
          }
        } catch (error) {
          results.failed++;
          results.details.push({
            prospectId: prospect.id,
            name: prospect.name,
            email: prospect.email,
            status: 'failed',
            error: error.message,
          });
        }
      }
    } else if (campaign.type === 'social_media') {
      const socialService = new SocialMediaAutomationService();

      for (const prospect of prospectsToContact) {
        try {
          let result = null;

          if (prospect.instagramHandle) {
            result = await socialService.sendInstagramDM(
              prospect.instagramHandle,
              campaign.socialMediaTemplate ||
                'Hey! Check out Go4It Sports for your recruiting journey!',
            );
          } else if (prospect.twitterHandle) {
            result = await socialService.sendTwitterDM(
              prospect.twitterHandle,
              campaign.socialMediaTemplate ||
                'Hey! Check out Go4It Sports for your recruiting journey!',
            );
          }

          if (result) {
            await db
              .update(prospects)
              .set({
                campaignId: campaignId,
                contactAttempts: sql`${prospects.contactAttempts} + 1`,
                lastContactDate: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(prospects.id, prospect.id));

            results.successful++;
            results.details.push({
              prospectId: prospect.id,
              name: prospect.name,
              platform: result.platform,
              handle: result.handle,
              status: 'sent',
              messageId: result.messageId,
            });
          }

          // Add delay between social media sends
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          results.failed++;
          results.details.push({
            prospectId: prospect.id,
            name: prospect.name,
            status: 'failed',
            error: error.message,
          });
        }
      }
    }

    // Update campaign statistics
    await db
      .update(campaigns)
      .set({
        status: 'active',
        totalSent: sql`${campaigns.totalSent} + ${results.successful}`,
        updatedAt: new Date(),
      })
      .where(eq(campaigns.id, campaignId));

    return NextResponse.json({
      success: true,
      message: `Campaign launched successfully. Contacted ${results.successful} prospects.`,
      data: results,
    });
  } catch (error) {
    console.error('Error launching campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to launch campaign', error: error.message },
      { status: 500 },
    );
  }
}

// GET - Get campaign launch history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (campaignId) {
      // Get prospects contacted by this campaign
      const contactedProspects = await db
        .select()
        .from(prospects)
        .where(eq(prospects.campaignId, campaignId));

      return NextResponse.json({
        success: true,
        data: {
          totalContacted: contactedProspects.length,
          prospects: contactedProspects,
        },
      });
    }

    return NextResponse.json({ success: false, message: 'Campaign ID required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching campaign launch data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch campaign data' },
      { status: 500 },
    );
  }
}
