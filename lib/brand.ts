// Centralized design tokens for Go4it Sports Academy (brand lock)
export const brand = {
  name: 'Go4it Sports Academy',
  tagline: 'Train Here. Place Anywhere.',
  contact: {
    email: 'info@go4itsports.org',
    phone: '+1 205-434-8405',
  },
  colors: {
    bg: '#0B0F14',
    bgElevated: '#0F141B',
    fg: '#E6EAF0',
    muted: '#5C6678',
    accent: '#00D4FF',
    success: '#27E36A',
    danger: '#FF4D4F',
    warning: '#FFC53D',
    border: '#1C2430',
    focus: '#00D4FF',
  },
  type: {
    headline: { family: 'Oswald, Anton, system-ui', transform: 'uppercase', weights: [700, 800] },
    body: { family: 'Inter, system-ui, -apple-system', weights: [400, 600] },
    scale: {
      h1: { size: '48px', line: '56px', weight: 800, letter: '0.5px' },
      h2: { size: '36px', line: '44px', weight: 700 },
      h3: { size: '28px', line: '36px', weight: 700 },
      body: { size: '16px', line: '24px', weight: 400 },
      small: { size: '14px', line: '22px', weight: 400 },
    },
  },
  motion: {
    fast: '120ms',
    base: '180ms',
    slow: '240ms',
    easing: 'cubic-bezier(.2,.8,.2,1)',
  },
  a11y: {
    contrastMin: 4.5,
    safetyLine: 'Verification ≠ recruitment.',
  },
  complianceFooter:
    'Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice.',
} as const;

export type Brand = typeof brand;
