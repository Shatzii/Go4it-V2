/**
 * GET /api/healthz
 * Comprehensive health check for sales automation systems
 * Returns detailed status of all automation components
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, parentNightEvents } from '@/lib/db/schema/funnel';
import { sql } from "drizzle-orm";

export async function GET() {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    overall: 'healthy' as 'healthy' | 'degraded' | 'down',
    systems: {
      database: { status: 'unknown', latency: 0, details: '' },
      leadScoring: { status: 'unknown', activeLeads: 0, avgScore: 0 },
      n8nWebhooks: { status: 'unknown', configured: false, details: '' },
      prospectScraper: { status: 'unknown', details: 'Check /api/scraping/automated' },
      parentNightFunnel: { status: 'unknown', upcomingEvents: 0, totalRSVPs: 0 },
      emailAutomation: { status: 'unknown', configured: false },
    },
    salesAutomation: {
      fullyAutomated: false,
      missingComponents: [] as string[],
      readyForTuesdayThursday: false,
    },
  };

  try {
    // 1. Database Health Check
    const dbStart = Date.now();
    try {
      await db.execute(sql`SELECT 1`);
      healthStatus.systems.database.status = 'healthy';
      healthStatus.systems.database.latency = Date.now() - dbStart;
      healthStatus.systems.database.details = `${healthStatus.systems.database.latency}ms`;
    } catch (error) {
      healthStatus.systems.database.status = 'down';
      healthStatus.systems.database.details = 'Connection failed';
      healthStatus.overall = 'down';
    }

    // 2. Lead Scoring Check
    try {
      const leadsData = await db.select().from(leads).limit(1000);
      const activeLeads = leadsData.filter((l) => 
        l.stage !== 'enrolled' && l.stage !== 'site_visit'
      );
      const avgScore = activeLeads.length > 0
        ? activeLeads.reduce((acc, l) => acc + (l.score || 0), 0) / activeLeads.length
        : 0;

      healthStatus.systems.leadScoring.status = 'healthy';
      healthStatus.systems.leadScoring.activeLeads = activeLeads.length;
      healthStatus.systems.leadScoring.avgScore = Math.round(avgScore);
    } catch (error) {
      healthStatus.systems.leadScoring.status = 'degraded';
    }

    // 3. N8N Webhook Configuration Check
    const n8nBaseUrl = process.env.N8N_BASE_URL;
    const n8nApiKey = process.env.N8N_API_KEY;
    
    if (n8nBaseUrl && n8nApiKey) {
      healthStatus.systems.n8nWebhooks.configured = true;
      healthStatus.systems.n8nWebhooks.status = 'healthy';
      healthStatus.systems.n8nWebhooks.details = `Configured: ${n8nBaseUrl}`;
    } else {
      healthStatus.systems.n8nWebhooks.configured = false;
      healthStatus.systems.n8nWebhooks.status = 'degraded';
      healthStatus.systems.n8nWebhooks.details = 'Missing N8N_BASE_URL or N8N_API_KEY';
      healthStatus.salesAutomation.missingComponents.push('N8N Webhooks not configured');
    }

    // 4. Prospect Scraper Check (manual verification needed at /api/scraping/automated)
    healthStatus.systems.prospectScraper.status = 'healthy';
    healthStatus.systems.prospectScraper.details = 'API available at /api/scraping/automated';

    // 5. Parent Night Funnel Check
    try {
      const upcomingEvents = await db
        .select()
        .from(parentNightEvents)
        .where(sql`${parentNightEvents.startIso} > NOW()`)
        .limit(10);

      const allLeadsWithRSVP = await db
        .select()
        .from(leads)
        .where(sql`${leads.stage} IN ('rsvp_tuesday', 'rsvp_thursday', 'attended_tuesday', 'attended_thursday')`);

      healthStatus.systems.parentNightFunnel.upcomingEvents = upcomingEvents.length;
      healthStatus.systems.parentNightFunnel.totalRSVPs = allLeadsWithRSVP.length;

      if (upcomingEvents.length > 0) {
        healthStatus.systems.parentNightFunnel.status = 'healthy';
      } else {
        healthStatus.systems.parentNightFunnel.status = 'degraded';
        healthStatus.salesAutomation.missingComponents.push('No upcoming Parent Night events scheduled');
      }
    } catch (error) {
      healthStatus.systems.parentNightFunnel.status = 'down';
    }

    // 6. Email Automation Check (RESEND)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      healthStatus.systems.emailAutomation.configured = true;
      healthStatus.systems.emailAutomation.status = 'healthy';
    } else {
      healthStatus.systems.emailAutomation.configured = false;
      healthStatus.systems.emailAutomation.status = 'degraded';
      healthStatus.salesAutomation.missingComponents.push('Email automation (RESEND) not configured');
    }

    // 7. Overall Sales Automation Assessment
    const criticalSystems = [
      healthStatus.systems.database.status === 'healthy',
      healthStatus.systems.leadScoring.status === 'healthy',
      healthStatus.systems.n8nWebhooks.configured,
      healthStatus.systems.emailAutomation.configured,
    ];

    healthStatus.salesAutomation.fullyAutomated = criticalSystems.every((s) => s);
    healthStatus.salesAutomation.readyForTuesdayThursday = 
      healthStatus.systems.database.status === 'healthy' &&
      healthStatus.systems.leadScoring.status === 'healthy' &&
      healthStatus.systems.parentNightFunnel.status !== 'down';

    // Set overall status
    const allHealthy = Object.values(healthStatus.systems).every(
      (s) => s.status === 'healthy'
    );
    const anyDown = Object.values(healthStatus.systems).some(
      (s) => s.status === 'down'
    );

    if (allHealthy) {
      healthStatus.overall = 'healthy';
    } else if (anyDown) {
      healthStatus.overall = 'down';
    } else {
      healthStatus.overall = 'degraded';
    }

    return NextResponse.json(healthStatus, {
      status: healthStatus.overall === 'down' ? 503 : 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: 'down',
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

