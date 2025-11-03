'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

/**
 * PostHog Analytics Client Component
 * Tracks funnel events: cta_click, rsvp_submit, attended, audit_booked, apply_started, enrolled
 */
export default function PostHogClient() {
  useEffect(() => {
    // Respect Do Not Track
    if (
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1'
    ) {
      return;
    }

    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (!host || !key) {
      // PostHog not configured - skip initialization
      return;
    }

    posthog.init(key, {
      api_host: host,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug();
      },
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // Manual tracking for funnel events
    });

    // Track CTA clicks (data-cta attribute)
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const cta = target.closest('[data-cta]');
      
      if (cta) {
        const ctaName = cta.getAttribute('data-cta');
        const href = (cta as HTMLAnchorElement).href || cta.getAttribute('data-href');
        
        posthog.capture('cta_click', {
          cta_name: ctaName,
          cta_href: href,
          page_path: window.location.pathname,
          page_url: window.location.href,
        });
      }
    });

    // Cleanup on unmount
    return () => {
      posthog.reset();
    };
  }, []);

  return null; // No UI - pure tracking component
}

/**
 * Helper functions for manual tracking
 */
export const trackRsvpSubmit = (eventType: string, region: string) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('rsvp_submit', {
      event_type: eventType,
      region,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackAttended = (eventType: string, eventId: number) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('attended', {
      event_type: eventType,
      event_id: eventId,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackAuditBooked = (leadId: number) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('audit_booked', {
      lead_id: leadId,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackApplyStarted = (leadId: number) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('apply_started', {
      lead_id: leadId,
      timestamp: new Date().toISOString(),
    });
  }
};

export const trackEnrolled = (leadId: number, hub: string) => {
  if (typeof window !== 'undefined' && window.posthog) {
    posthog.capture('enrolled', {
      lead_id: leadId,
      hub,
      timestamp: new Date().toISOString(),
    });
  }
};
