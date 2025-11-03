/**
 * Brand constants for Go4it Sports Academy
 * DO NOT MODIFY without approval from marketing & compliance
 */

export const BRAND = {
  name: "Go4it Sports Academy",
  tagline: "Train Here. Place Anywhere.",
  hubs: ["Denver", "Vienna", "Dallas", "Mérida (MX)"],
  email: "info@go4itsports.org",
  phoneDisplay: "+1 205-434-8405",
  phoneTel: "tel:+12054348405",
  url: "https://go4itsports.org",
  
  compliance: {
    full: `Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.`,
    guardrail: "Verification ≠ recruitment.",
  },
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/go4itsports",
  linkedin: "https://linkedin.com/company/go4it-sports",
  twitter: "https://twitter.com/go4itsports",
  tiktok: "https://tiktok.com/@go4itsports",
} as const;
