/**
 * StarPath Programs & Pricing Configuration
 * 
 * This is the single source of truth for all Go4it/StarPath programs.
 * Used by: Frontend UI, Backend API, GPT Assistant, Admin Dashboard
 */

export const PROGRAMS = {
  STARPATH_ASSESSMENT: {
    id: 'assessment',
    name: 'StarPath Assessment™',
    shortName: 'Assessment',
    description: 'Comprehensive academic + athletic profile with NCAA tracking plan',
    priceUSD: 397,
    duration: '1-2 hours',
    deliverables: [
      'Academic profile analysis',
      'Athletic GAP report',
      'NCAA eligibility roadmap',
      'Personalized pathway recommendation'
    ],
    cta: 'Take Assessment',
    url: '/assessment'
  },
  
  ONLINE_ACCELERATOR: {
    id: 'online_accelerator',
    name: 'StarPath Online Accelerator',
    shortName: 'Online Accelerator',
    description: '10 credits in 12 weeks · Fully online · NCAA-aligned',
    priceUSD: 15000,
    credits: 10,
    duration: '12 weeks',
    delivery: 'online',
    features: [
      '10 defensible NCAA-aligned credits',
      'Daily 3-hour live instruction',
      'StarPath Human Development Record (HDR)',
      'AI-powered video analysis',
      'NCAA eligibility tracking',
      'College recruiting support'
    ],
    cta: 'Apply Now',
    url: '/programs/online-accelerator'
  },
  
  VIENNA_RESIDENCY: {
    id: 'vienna_residency',
    name: 'StarPath Vienna Residency',
    shortName: 'Vienna Residency',
    description: '12 credits in 12 weeks · Full immersion · German A2 certification',
    priceUSD: 28000,
    credits: 12,
    duration: '12 weeks',
    delivery: 'in-person',
    location: 'Vienna, Austria',
    features: [
      '12 NCAA-aligned credits',
      'German A2 language certification',
      'Housing & local transportation included',
      'Cultural immersion program',
      'Elite athletic training',
      'StarPath HDR tracking',
      'College recruiting & placement'
    ],
    included: [
      'Tuition (12 credits)',
      'Housing (shared apartment)',
      'Local transportation pass',
      'German language instruction',
      'Cultural site visits',
      'Athletic training access'
    ],
    notIncluded: [
      'Flights to/from Vienna',
      'Meals (budget ~€300/month)',
      'Personal expenses',
      'Travel insurance'
    ],
    cta: 'Apply for Vienna',
    url: '/programs/vienna-residency'
  },
  
  NCAA_TRACKING: {
    id: 'ncaa_tracking',
    name: 'NCAA Eligibility Tracking & Support',
    shortName: 'NCAA Tracking',
    description: 'Transcript audits · Eligibility monitoring · Compliance guidance',
    priceRangeUSD: [1200, 3600],
    tiers: [
      {
        name: 'Basic',
        price: 1200,
        features: ['Quarterly transcript review', 'Eligibility status reports', 'Email support']
      },
      {
        name: 'Standard',
        price: 2400,
        features: ['Monthly transcript audits', 'NCAA Clearinghouse support', 'Phone + email support', 'College recruiting hub access']
      },
      {
        name: 'Premium',
        price: 3600,
        features: ['Bi-weekly check-ins', 'Full compliance guidance', 'Priority support', 'Active recruiting support', 'GetVerified™ Combine access']
      }
    ],
    cta: 'Get NCAA Support',
    url: '/programs/ncaa-tracking'
  }
};

/**
 * GAR™ (Go4it Athletic Rating) Score Ranges
 */
export const GAR_RANGES = {
  ELITE: { min: 90, max: 100, label: 'Elite / D1 Power 5', color: '#DC2626' },
  HIGH_D1: { min: 80, max: 89, label: 'High D1 / Top D2', color: '#EA580C' },
  D1_COMPETITIVE: { min: 70, max: 79, label: 'D1 / Competitive D2', color: '#F59E0B' },
  D2_D3: { min: 60, max: 69, label: 'D2 / D3 / NAIA', color: '#10B981' },
  D3_JUCO: { min: 50, max: 59, label: 'D3 / NAIA / JUCO', color: '#3B82F6' },
  DEVELOPMENTAL: { min: 0, max: 49, label: 'Developmental / JUCO', color: '#6B7280' }
};

/**
 * Contact Information
 */
export const CONTACT_INFO = {
  USA: {
    phone: '+1-303-970-4655',
    displayPhone: '+1 (303) 970-4655',
    timezone: 'MST'
  },
  EU: {
    phone: '+43-650-564-4236',
    displayPhone: '+43 650 564 4236',
    timezone: 'CET'
  },
  email: 'info@go4itsports.org',
  website: 'go4itsports.org'
};

/**
 * Locations
 */
export const LOCATIONS = {
  DENVER: { city: 'Denver', state: 'Colorado', country: 'USA', timezone: 'MST', isHQ: true },
  VIENNA: { city: 'Vienna', country: 'Austria', timezone: 'CET', residency: true },
  DALLAS: { city: 'Dallas', state: 'Texas', country: 'USA', timezone: 'CST' },
  MERIDA: { city: 'Mérida', country: 'Mexico', timezone: 'CST' }
};

/**
 * StarPath Human Development Record (HDR) Pillars
 */
export const HDR_PILLARS = {
  MENTAL: {
    id: 'mental',
    name: 'Mental Development',
    description: 'Mindset, focus, resilience, academic growth',
    metrics: ['daily_reflection', 'academic_progress', 'goal_tracking']
  },
  PHYSICAL: {
    id: 'physical',
    name: 'Physical Development',
    description: 'Athletic training, strength, conditioning, recovery',
    metrics: ['training_sessions', 'performance_tests', 'recovery_quality']
  },
  NUTRITION: {
    id: 'nutrition',
    name: 'Nutrition',
    description: 'Meal quality, hydration, supplements, education',
    metrics: ['meal_logs', 'hydration_tracking', 'nutrition_education']
  },
  TECHNICAL: {
    id: 'technical',
    name: 'Technical Skill',
    description: 'Sport-specific skills, drills, video analysis',
    metrics: ['skill_assessments', 'drill_performance', 'video_analysis']
  },
  CULTURAL: {
    id: 'cultural',
    name: 'Cultural Immersion',
    description: 'Language learning, site visits, global awareness (Vienna only)',
    metrics: ['language_progress', 'cultural_events', 'reflection_journals']
  },
  CAPSTONE: {
    id: 'capstone',
    name: 'Capstone Project',
    description: 'Final synthesis project demonstrating growth across all pillars',
    metrics: ['project_proposal', 'execution_quality', 'presentation']
  }
};

/**
 * NCAA Core Course Requirements
 */
export const NCAA_REQUIREMENTS = {
  D1: {
    coreCourses: 16,
    minGPA: 2.3,
    slidingScale: true,
    description: 'Division 1 requires 16 core courses and a 2.3 minimum GPA (sliding scale with test scores)'
  },
  D2: {
    coreCourses: 16,
    minGPA: 2.2,
    slidingScale: false,
    description: 'Division 2 requires 16 core courses and a 2.2 minimum GPA'
  },
  D3: {
    coreCourses: 0, // D3 has no NCAA Clearinghouse requirement
    minGPA: 0,
    description: 'Division 3 has no NCAA Clearinghouse requirement; admission standards set by individual schools'
  }
};

/**
 * Helper function to get program by ID
 */
export function getProgramById(id) {
  return Object.values(PROGRAMS).find(p => p.id === id);
}

/**
 * Helper function to get GAR range by score
 */
export function getGARRange(score) {
  return Object.values(GAR_RANGES).find(
    range => score >= range.min && score <= range.max
  );
}

/**
 * Helper function to format price
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}
