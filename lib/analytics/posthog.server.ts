/**
 * PostHog Analytics Helper - Server Side
 * Provides server-side event tracking for money/state events
 * 
 * Event naming convention:
 * - svr_* prefix for all server-side events
 * - Use for: payments, evaluations, state changes
 * - NEVER emit these from client (prevents duplicates)
 */

import { PostHog } from "posthog-node";

let posthogInstance: PostHog | null = null;

/**
 * Get PostHog server instance (singleton)
 */
function getPostHog(): PostHog | null {
  if (posthogInstance) return posthogInstance;

  const apiKey = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const apiHost = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!apiKey) {
    console.warn("[PostHog Server] API key not found. Server-side analytics disabled.");
    return null;
  }

  posthogInstance = new PostHog(apiKey, {
    host: apiHost,
  });

  return posthogInstance;
}

/**
 * Track server event (state/money events only)
 * Automatically prefixes with "svr_" for consistency
 */
export async function trackServerEvent(
  eventName: string,
  properties: Record<string, any> & { distinctId: string }
) {
  const ph = getPostHog();
  if (!ph) return;

  // Auto-prefix with svr_
  const prefixedEvent = eventName.startsWith("svr_") ? eventName : `svr_${eventName}`;

  ph.capture({
    distinctId: properties.distinctId,
    event: prefixedEvent,
    properties: {
      ...properties,
      source: "server",
      timestamp: new Date().toISOString(),
    },
  });

  // Flush immediately for critical events
  await ph.flush();
}

/**
 * Shutdown PostHog gracefully (call on server shutdown)
 */
export async function shutdownPostHog() {
  if (posthogInstance) {
    await posthogInstance.shutdown();
    posthogInstance = null;
  }
}

// ========== StarPath-specific server events ==========

export const StarPathServerEvents = {
  auditPaymentSuccess: async (userId: string, leadId: string, amount: number) =>
    trackServerEvent("audit_payment_success", {
      distinctId: userId,
      leadId,
      amount,
      currency: "USD",
    }),

  auditPaymentFailed: async (userId: string, leadId: string, reason: string) =>
    trackServerEvent("audit_payment_failed", {
      distinctId: userId,
      leadId,
      reason,
    }),

  auditEvaluationCreated: async (userId: string, evaluationId: string, division: string) =>
    trackServerEvent("audit_evaluation_created", {
      distinctId: userId,
      evaluationId,
      division,
    }),

  auditEvaluationAttached: async (userId: string, studentId: string, evaluationId: string) =>
    trackServerEvent("audit_evaluation_attached", {
      distinctId: userId,
      studentId,
      evaluationId,
    }),

  studioCompleted: async (
    userId: string,
    week: number,
    rotationsCompleted: number,
    synthesisCompleted: number
  ) =>
    trackServerEvent("studio_completed", {
      distinctId: userId,
      week,
      rotationsCompleted,
      synthesisCompleted,
    }),

  ncaaSummaryGenerated: async (
    userId: string,
    coreGPA: number,
    coreUnits: number,
    status: string
  ) =>
    trackServerEvent("ncaa_summary_generated", {
      distinctId: userId,
      coreGPA,
      coreUnits,
      status,
    }),

  garSessionRecorded: async (
    userId: string,
    sessionType: string,
    duration: number,
    garScore?: number
  ) =>
    trackServerEvent("gar_session_recorded", {
      distinctId: userId,
      sessionType,
      duration,
      garScore,
    }),

  leadStageChanged: async (leadId: string, from: string, to: string, userId?: string) =>
    trackServerEvent("lead_stage_changed", {
      distinctId: userId || leadId,
      leadId,
      from,
      to,
    }),

  autoPlannedCourses: async (userId: string, studentId: string, coursesAdded: number) =>
    trackServerEvent("auto_planned_courses", {
      distinctId: userId,
      studentId,
      coursesAdded,
    }),
};

export default {
  track: trackServerEvent,
  shutdown: shutdownPostHog,
  events: StarPathServerEvents,
};
