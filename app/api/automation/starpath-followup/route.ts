import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/automation/starpath-followup
 * 
 * Generates and sends GPT-powered follow-up communications after:
 * - Transcript audit completion
 * - GAR score update
 * - NCAA status change
 * - Milestone achievements
 * 
 * Body: {
 *   athleteId: string,
 *   triggerType: 'audit-complete' | 'gar-update' | 'ncaa-change' | 'milestone',
 *   recipientType: 'parent' | 'athlete' | 'both',
 *   deliveryMethod: 'email' | 'sms' | 'both'
 * }
 */
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { athleteId, triggerType, recipientType, deliveryMethod } = body;

    // Validate required fields
    if (!athleteId || !triggerType) {
      return NextResponse.json(
        { success: false, error: 'athleteId and triggerType are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database queries and GPT integration
    // For now, return mock response
    const mockResponse = {
      athleteId,
      triggerType,
      recipientType: recipientType || 'both',
      deliveryMethod: deliveryMethod || 'email',
      generated: {
        email: {
          subject: generateEmailSubject(triggerType),
          body: generateEmailBody(triggerType),
          sent: false,
          reason: 'SMTP credentials not configured',
        },
        sms: {
          message: generateSMSMessage(triggerType),
          sent: false,
          reason: 'SMS credentials not configured',
        },
      },
      nextSteps: [
        'Configure SMTP credentials in Replit Secrets',
        'Enable email-to-SMS for free messaging',
        'Set up OpenAI API key for GPT personalization',
      ],
    };

    return NextResponse.json({
      success: true,
      data: mockResponse,
      message: 'Mock communication generated - configure credentials to send',
    });

    /* PRODUCTION CODE - Uncomment when ready:
    
    // 1. Fetch athlete data
    const { db } = await import('@/lib/db');
    const { athletes, transcriptAudits } = await import('@/drizzle/schema/starpath');
    const { eq, desc } = await import('drizzle-orm');

    const athlete = await db
      .select()
      .from(athletes)
      .where(eq(athletes.id, athleteId))
      .limit(1);

    if (!athlete.length) {
      return NextResponse.json(
        { success: false, error: 'Athlete not found' },
        { status: 404 }
      );
    }

    // 2. Get latest audit data
    const latestAudit = await db
      .select()
      .from(transcriptAudits)
      .where(eq(transcriptAudits.athleteId, athleteId))
      .orderBy(desc(transcriptAudits.createdAt))
      .limit(1);

    // 3. Generate GPT-powered message
    const { generateStarPathFollowup } = await import('@/ai-engine/starpath/starpath-followup');
    const message = await generateStarPathFollowup({
      athlete: athlete[0],
      audit: latestAudit[0],
      triggerType,
      recipientType,
    });

    // 4. Send via appropriate channel(s)
    const results = {
      email: { sent: false },
      sms: { sent: false },
    };

    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
      const { sendEmailNodemailer } = await import('@/lib/sendEmailNodemailer');
      const emailResult = await sendEmailNodemailer({
        to: athlete[0].email,
        subject: message.emailSubject,
        html: message.emailBody,
      });
      results.email = emailResult;
    }

    if (deliveryMethod === 'sms' || deliveryMethod === 'both') {
      const { sendSMS } = await import('@/lib/sms-free');
      const smsResult = await sendSMS({
        to: athlete[0].phone,
        message: message.smsBody,
        carrier: athlete[0].carrier,
      });
      results.sms = smsResult;
    }

    // 5. Log communication event
    const { starpathEvents } = await import('@/drizzle/schema/starpath');
    await db.insert(starpathEvents).values({
      userId: athlete[0].userId,
      category: 'communication',
      skillName: triggerType,
      points: 0,
      metadata: JSON.stringify({
        triggerType,
        recipientType,
        deliveryMethod,
        emailSent: results.email.sent,
        smsSent: results.sms.sent,
      }),
    });

    return NextResponse.json({
      success: true,
      data: {
        athleteId,
        triggerType,
        results,
        message: message,
      },
    });
    */

  } catch (error) {
    console.error('StarPath followup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send followup',
      },
      { status: 500 }
    );
  }
}

// Helper functions for mock content generation
function generateEmailSubject(triggerType: string): string {
  const subjects = {
    'audit-complete': '🎓 Your StarPath Transcript Audit is Complete!',
    'gar-update': '⭐ Your GAR Score Has Been Updated',
    'ncaa-change': '🏆 NCAA Eligibility Status Update',
    'milestone': '🎉 Congratulations on Your StarPath Milestone!',
  };
  return subjects[triggerType as keyof typeof subjects] || 'StarPath Update';
}

function generateEmailBody(triggerType: string): string {
  const templates = {
    'audit-complete': `
      <h2>Great news! Your transcript audit is complete.</h2>
      <p>Your Academic Rigor Index (ARI): <strong>85/100</strong></p>
      <p>NCAA Status: <strong>On Track</strong></p>
      <p>Core Courses Completed: <strong>12/16</strong></p>
      <h3>Next Steps:</h3>
      <ul>
        <li>Complete Algebra 2 by May 2026</li>
        <li>Maintain current GPA of 3.75+</li>
        <li>Schedule your GAR verification test</li>
      </ul>
      <p><a href="/starpath">View Full Report → StarPath Dashboard</a></p>
    `,
    'gar-update': `
      <h2>Your athletic performance has been verified!</h2>
      <p>New GAR Score: <strong>12.5</strong> (Games Above Replacement)</p>
      <p>Star Rating: <strong>⭐⭐⭐⭐ (4-Star Athlete)</strong></p>
      <p>D1 Readiness Score: <strong>78.5/100</strong></p>
      <h3>What This Means:</h3>
      <p>You're in the top 25% of athletes in your position and grad year!</p>
      <p><a href="/starpath">See Your Complete Profile → StarPath Dashboard</a></p>
    `,
    'ncaa-change': `
      <h2>Your NCAA eligibility status has changed</h2>
      <p>New Status: <strong>On Track</strong> ✅</p>
      <p>Credits Completed: <strong>12/16</strong></p>
      <p>Projected Eligibility: <strong>On schedule for graduation</strong></p>
      <h3>Keep It Up!</h3>
      <p>You're doing great. Continue your current pace to maintain eligibility.</p>
      <p><a href="/starpath">Track Your Progress → StarPath Dashboard</a></p>
    `,
    'milestone': `
      <h2>🎉 Congratulations! You've reached a major milestone!</h2>
      <p>StarPath Progress: <strong>75% Complete</strong></p>
      <p>You've earned: <strong>1,250 points</strong></p>
      <p>New badges unlocked: <strong>Academic All-Star, GAR Verified</strong></p>
      <h3>What's Next?</h3>
      <p>Book your Transcript Audit to unlock your final academic certification!</p>
      <p><a href="/starpath">Continue Your Journey → StarPath Dashboard</a></p>
    `,
  };
  return templates[triggerType as keyof typeof templates] || '<p>StarPath update available</p>';
}

function generateSMSMessage(triggerType: string): string {
  const templates = {
    'audit-complete': '🎓 Your transcript audit is done! ARI: 85/100. NCAA: On Track. View full report: [link]',
    'gar-update': '⭐ GAR Score updated to 12.5! You\'re a 4-star athlete. See profile: [link]',
    'ncaa-change': '🏆 NCAA Status: On Track! 12/16 credits done. Keep it up! Details: [link]',
    'milestone': '🎉 Milestone reached! 75% complete, 1,250 pts earned. See dashboard: [link]',
  };
  return templates[triggerType as keyof typeof templates] || 'StarPath update available';
}
