/**
 * PostHog Analytics Helper - Client Side
 * Provides UI event tracking with deduplication and DNT respect
 * 
 * Event naming convention:
 * - ui_* prefix for all client-side UI interactions
 * - svr_* prefix for server-side state/money events (see posthog.server.ts)
 */

import posthog from "posthog-js";

let isInitialized = false;

/**
 * Initialize PostHog client (call once in root layout)
 */
export function initPostHog() {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!apiKey) {
    console.warn("PostHog API key not found. Analytics disabled.");
    return;
  }

  // Respect Do Not Track
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
    console.info("PostHog disabled: DNT detected");
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.debug(false); // Disable debug in dev
      }
    },
    capture_pageview: false, // Manual pageview tracking
    capture_pageleave: true,
    autocapture: false, // Explicit events only
  });

  isInitialized = true;
}

/**
 * Track UI event (client-side only)
 * Automatically prefixes with "ui_" for consistency
 */
export function trackUIEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (!isInitialized || typeof window === "undefined") return;

  // Auto-prefix with ui_
  const prefixedEvent = eventName.startsWith("ui_") ? eventName : `ui_${eventName}`;

  posthog.capture(prefixedEvent, {
    ...properties,
    source: "client",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Identify user (call after Clerk authentication)
 */
export function identifyUser(
  userId: string,
  traits?: Record<string, any>
) {
  if (!isInitialized || typeof window === "undefined") return;

  posthog.identify(userId, {
    ...traits,
    identified_at: new Date().toISOString(),
  });
}

/**
 * Track page view
 */
export function trackPageView(path?: string) {
  if (!isInitialized || typeof window === "undefined") return;

  posthog.capture("$pageview", {
    $current_url: path || window.location.href,
  });
}

/**
 * Reset user (call on logout)
 */
export function resetUser() {
  if (!isInitialized || typeof window === "undefined") return;

  posthog.reset();
}

// ========== StarPath-specific UI events ==========

export const StarPathUIEvents = {
  starPathTileClick: (tile: string, userId?: string) =>
    trackUIEvent("starpath_tile_click", { tile, userId }),

  ncaaTileView: (status: string, coreGPA?: number, userId?: string) =>
    trackUIEvent("starpath_ncaa_tile_view", { status, coreGPA, userId }),

  garSessionStart: (sessionType: string, userId?: string) =>
    trackUIEvent("gar_session_start", { sessionType, userId }),

  garSessionEnd: (duration: number, sessionType: string, userId?: string) =>
    trackUIEvent("gar_session_end", { duration, sessionType, userId }),

  garRotationComplete: (rotation: string, duration: number, userId?: string) =>
    trackUIEvent("gar_rotation_complete", { rotation, duration, userId }),

  studioRotationStart: (subject: string, week: number, userId?: string) =>
    trackUIEvent("studio_rotation_start", { subject, week, userId }),

  studioRotationComplete: (subject: string, week: number, userId?: string) =>
    trackUIEvent("studio_rotation_complete", { subject, week, userId }),

  studySynthesisDone: (week: number, synthesisType: string, userId?: string) =>
    trackUIEvent("study_synthesis_done", { week, synthesisType, userId }),

  autoPlanCoursesClick: (targetDivision: string, userId?: string) =>
    trackUIEvent("auto_plan_courses_click", { targetDivision, userId }),

  auditEvaluationView: (evaluationId: string, status: string, userId?: string) =>
    trackUIEvent("audit_evaluation_view", { evaluationId, status, userId }),

  academyTileClick: (tile: string, userId?: string) =>
    trackUIEvent("academy_tile_click", { tile, userId }),
};

export default {
  init: initPostHog,
  track: trackUIEvent,
  identify: identifyUser,
  pageView: trackPageView,
  reset: resetUser,
  events: StarPathUIEvents,
};
