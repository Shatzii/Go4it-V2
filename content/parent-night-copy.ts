/**
 * Copy for Parent Night funnel pages
 */

import { BRAND } from "./brand";

export const PARENT_NIGHT_COPY = {
  hero: {
    headline: "Train Here. Place Anywhere.",
    subheadline: "Join our Parent Night to discover how Go4it combines American academics, NCAA readiness, and elite sports training in Denver, Vienna, Dallas, and Mérida.",
    ctaLabel: "RSVP for Parent Night",
    ctaHref: "/parent-night?utm_source=site&utm_medium=organic&utm_campaign=parent-night&utm_content=hero_banner",
  },

  page: {
    title: "Parent Night RSVP",
    description: "Choose your region and time zone to join our live discovery sessions. Learn about our unique approach to combining academics, athletics, and NCAA eligibility.",
    
    tuesdayInfo: {
      title: "Tuesday: Info & Discovery",
      description: "Perfect for families just learning about Go4it. We'll cover our academic program, NCAA eligibility support, athlete development system, and training hub locations.",
    },

    thursdayDecision: {
      title: "Thursday: Confirmation & Decision",
      description: "For families ready to move forward. We'll review enrollment options, answer specific questions, and introduce our 48-Hour Credit Audit process.",
    },

    mondayOnboarding: {
      title: "Monday: New Family Onboarding",
      description: "Welcome session for families who enrolled last week. Get your Study Hall timer, connect class tracker, and start your NCAA checklist.",
    },

    europeLable: "🇪🇺 Europe (Vienna Time)",
    europeTime: "7:00 PM Europe/Vienna",
    
    usLabel: "🇺🇸 United States (Central Time)",
    usTime: "7:00 PM America/Chicago (Central)",
    
    mondayEuTime: "9:00 AM Europe/Vienna",
    mondayUsTime: "9:00 AM America/Chicago (Central)",
  },

  compliance: {
    micro: BRAND.compliance.guardrail,
    full: BRAND.compliance.full,
    footer: `For questions, contact ${BRAND.email} or call ${BRAND.phoneDisplay}.`,
  },

  confirmEmail: {
    subject: "You're Registered for Parent Night",
    preheader: "See you soon! Here's your meeting link and calendar invite.",
  },

  decisionInvite: {
    subject: "Ready for the Next Step? Join Thursday Decision Night",
    preheader: "You attended Tuesday — let's talk enrollment, credits, and your athlete's path.",
  },

  auditOffer: {
    subject: "Free 48-Hour Credit Audit — Know Where You Stand",
    preheader: "Get a personalized NCAA eligibility and academic transcript review.",
  },

  onboardingReminder: {
    subject: "Welcome to Go4it! Your Onboarding Session is Monday",
    preheader: "Get ready to start your journey. We'll walk you through Study Hall, class tracking, and NCAA checklists.",
  },
} as const;
