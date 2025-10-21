import { NextRequest, NextResponse } from 'next/server';
import { OpenSourceEmailSystem } from '@/lib/email-automation';
import { db } from '@/server/db';
import { prospects, campaigns } from '@/shared/schema';
import { eq, inArray, and, sql } from 'drizzle-orm';

// POST - Send automated email campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, prospectIds = [], testMode = false, customTemplate = null } = body;

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
      if (campaign.minFollowers) {
        conditions.push(sql`${prospects.followers} >= ${campaign.minFollowers}`);
      }
      if (campaign.maxFollowers) {
        conditions.push(sql`${prospects.followers} <= ${campaign.maxFollowers}`);
      }

      targetProspects = await db
        .select()
        .from(prospects)
        .where(and(...conditions));
    }

    // Filter out prospects without email
    const prospectsWithEmail = targetProspects.filter((p) => p.email);

    if (prospectsWithEmail.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No prospects with valid email addresses found' },
        { status: 400 },
      );
    }

    // Limit for test mode
    const finalProspects = testMode ? prospectsWithEmail.slice(0, 5) : prospectsWithEmail;

    // Initialize email system
    const emailSystem = new OpenSourceEmailSystem();

    // Test connection first
    const connectionTest = await emailSystem.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { success: false, message: `Email system error: ${connectionTest.message}` },
        { status: 500 },
      );
    }

    // Get email template
    const template =
      customTemplate || OpenSourceEmailSystem.getRecruitmentTemplates().garIntroduction;

    // Override template with campaign content if available
    if (campaign.subject) {
      template.subject = campaign.subject;
    }
    if (campaign.emailTemplate) {
      template.htmlBody = campaign.emailTemplate;
      template.textBody = campaign.emailTemplate.replace(/<[^>]*>/g, ''); // Strip HTML for text version
    }

    // Send bulk emails
    const result = await emailSystem.sendBulkEmails(finalProspects, template, campaignId, {
      rateLimit: testMode ? 60 : 30, // Emails per minute
      batchSize: testMode ? 2 : 5,
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
      message: `Email campaign launched successfully`,
      data: {
        campaignName: campaign.name,
        totalTargeted: finalProspects.length,
        emailsSent: result.sent,
        emailsFailed: result.failed,
        testMode,
        results: testMode ? result.results : undefined,
      },
    });
  } catch (error) {
    console.error('Error sending email campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email campaign', error: error.message },
      { status: 500 },
    );
  }
}

// GET - Get email system status and configuration
export async function GET(request: NextRequest) {
  try {
    const emailSystem = new OpenSourceEmailSystem();
    const connectionTest = await emailSystem.testConnection();

    return NextResponse.json({
      success: true,
      data: {
        connectionStatus: connectionTest.success,
        message: connectionTest.message,
        templates: Object.keys(OpenSourceEmailSystem.getRecruitmentTemplates()),
        configuration: {
          provider: 'SMTP',
          trackingEnabled: true,
          rateLimit: '30 emails/minute',
          features: [
            'Open tracking',
            'Click tracking',
            'Unsubscribe handling',
            'Personalization',
            'HTML & Text versions',
            'Professional templates',
          ],
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get email system status' },
      { status: 500 },
    );
  }
}
