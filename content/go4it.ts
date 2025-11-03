/**
 * Content Management System
 * 
 * Single source of truth for all Go4it Sports Academy copy and messaging.
 * Update content here to propagate changes across the entire site.
 */

export const brand = {
  name: "Go4it Sports Academy",
  tagline: "Train Here. Place Anywhere.",
  slogan: "Your All-in-One Platform to Play at the Next Level",
  hubs: "Denver • Vienna • Dallas • Mérida (MX)",
  contact: {
    email: "invest@go4itsports.org",
    phone: "+1-205-434-4005",
    website: "go4itsports.org"
  },
  compliance: "Go4it is a homeschool learning provider with American teachers. Credits and official transcripts are issued via U.S. school-of-record partners until Fall 2026. Athlete OS and GAR Testing are non-academic and do not grant credit. No recruiting guarantees. NCAA amateurism and FIFA/FA rules respected. Families remain responsible for local education registration. We do not provide immigration or legal advice."
};

export const hero = {
  title: "One Hub for NCAA Eligibility, Classes & Verified Development",
  lead: "Stop juggling tools and invoices. Go4it puts NCAA support, class tracking, GAR™ verification, AthleteAI, and showcases in one place—so athletes can study online, train with structure, and compete internationally.",
  ctas: [
    { 
      label: "Apply to Go4it Sports Academy", 
      href: "/apply", 
      id: "apply",
      variant: "primary" as const
    },
    { 
      label: "Book 48-Hour Credit Audit", 
      href: "/audit", 
      id: "audit",
      variant: "secondary" as const
    },
    { 
      label: "See Events & Testing", 
      href: "/events", 
      id: "events",
      variant: "outline" as const
    }
  ],
  stats: [
    "NCAA Pathway Support",
    "Classes + Study Hall Tracking",
    "GAR™ Included (enrolled)"
  ]
};

export const hub = {
  title: "Everything In One Place",
  subtitle: "Families save time and money when eligibility, academics, and development live together.",
  columns: [
    { 
      title: "NCAA Dashboard", 
      bullets: [
        "Eligibility Center status",
        "Core-course map",
        "Transcripts & GPA translation",
        "Amateurism safeguards"
      ],
      icon: "shield" as const
    },
    { 
      title: "Class & Study Hall Tracking", 
      bullets: [
        "Online course progress",
        "Weekly checkpoints",
        "Coach/teacher notes",
        "Assignment tracking"
      ],
      icon: "book" as const
    },
    { 
      title: "Athlete Development", 
      bullets: [
        "GAR™ cycles",
        "AthleteAI coach & tasks",
        "Events & showcases calendar",
        "Performance analytics"
      ],
      icon: "trophy" as const
    }
  ],
  note: "Verification ≠ recruitment; amateur status protected.",
  ctas: [
    {
      label: "Apply",
      href: "/apply",
      id: "apply",
      variant: "primary" as const
    },
    {
      label: "48-Hour Credit Audit",
      href: "/audit",
      id: "audit",
      variant: "secondary" as const
    }
  ]
};

export const pathways = {
  title: "Three Ways to Go4it",
  subtitle: "Choose the path that fits your goals",
  options: [
    {
      id: "full-student",
      emoji: "🎓",
      title: "Full Academy Student",
      description: "Online + Hybrid School for Elite Athletes",
      features: [
        "American-taught online courses",
        "NCAA core-course alignment",
        "GAR™ testing included",
        "International residency programs",
        "Study Hall tracking",
        "Full AthleteAI access"
      ],
      price: "$999/month",
      href: "/apply?type=full-time"
    },
    {
      id: "ai-coach",
      emoji: "🤖",
      title: "AthleteAI Coach",
      description: "AI-Powered Training + NCAA Tracker",
      features: [
        "Personalized training plans",
        "NCAA eligibility tracking",
        "GAR™ analysis & insights",
        "Video analysis tools",
        "Performance predictions",
        "Monthly coaching sessions"
      ],
      price: "$299/month",
      href: "/apply?type=ai-coach",
      badge: "MOST POPULAR"
    },
    {
      id: "get-verified",
      emoji: "⭐",
      title: "Get Verified Athlete",
      description: "GAR™ Testing + NCAA Audit",
      features: [
        "GAR™ testing events",
        "NCAA credit audit",
        "Transcript evaluation",
        "Eligibility roadmap",
        "Profile on leaderboard",
        "Showcase invitations"
      ],
      price: "$199/event",
      href: "/events"
    }
  ]
};

export const residency = {
  title: "Train Internationally: Vienna & Mérida",
  badge: "✈️ INCLUDED FOR ALL STUDENTS",
  lead: "Every Go4it Academy student gets access to our international training residencies—no extra cost.",
  locations: [
    {
      emoji: "🇦🇹",
      name: "Vienna, Austria",
      features: [
        "High-performance training blocks",
        "Cultural immersion sessions",
        "International showcase games",
        "Professional facilities access"
      ],
      schedule: {
        easter: "Easter Camp 2026 (Mar 30–Apr 4)",
        summer: "Summer Camp: July 20–24, 2026"
      }
    },
    {
      emoji: "🇲🇽",
      name: "Mérida, Mexico",
      features: [
        "Year-round training availability",
        "Spanish language immersion",
        "Liga MX youth showcases",
        "Beach training & recovery"
      ],
      schedule: {
        availability: "Year-round for enrolled students"
      }
    },
    {
      emoji: "🇺🇸",
      name: "Denver & Dallas",
      features: [
        "Weekly training sessions",
        "Friday Night Lights events",
        "College coach showcases",
        "NCAA compliance workshops"
      ],
      schedule: {
        season: "Weekly events during season"
      }
    }
  ],
  benefits: [
    {
      icon: "🏋️",
      title: "Professional Training",
      description: "Access to elite facilities"
    },
    {
      icon: "🏆",
      title: "Competition",
      description: "International showcase games"
    },
    {
      icon: "📚",
      title: "Learning",
      description: "Cultural & language immersion"
    },
    {
      icon: "🌍",
      title: "Cultural",
      description: "Global perspective building"
    },
    {
      icon: "👀",
      title: "Scout Exposure",
      description: "College & pro scout attendance"
    },
    {
      icon: "🎥",
      title: "Professional Film",
      description: "Broadcast-quality highlight reels"
    }
  ],
  cta: {
    label: "Apply to Go4it Academy",
    href: "/apply"
  },
  note: "All enrolled students automatically qualify for residency programs."
};

export const features = {
  title: "Complete Platform Features",
  items: [
    {
      title: "GAR™ Analytics",
      description: "Comprehensive athletic testing and verification",
      link: "/gar"
    },
    {
      title: "AthleteAI Coach",
      description: "Personalized AI-powered training plans",
      link: "/athleteai"
    },
    {
      title: "NCAA Pathway",
      description: "End-to-end eligibility support",
      link: "/ncaa"
    },
    {
      title: "Study Hall",
      description: "Academic progress tracking",
      link: "/study-hall"
    },
    {
      title: "Friday Night Lights",
      description: "Live showcase events",
      link: "/fnl"
    },
    {
      title: "International Hubs",
      description: "Train across 4 global locations",
      link: "/hubs"
    }
  ]
};

export const testimonials = {
  title: "What Athletes & Families Say",
  items: [
    {
      quote: "Go4it simplified everything. One platform for classes, NCAA, and training—game changer.",
      author: "Marcus J.",
      role: "D1 Football Commit",
      avatar: "/testimonials/marcus.jpg"
    },
    {
      quote: "The NCAA audit saved us months of confusion. Worth every penny.",
      author: "Sarah K.",
      role: "Parent, Class of 2026",
      avatar: "/testimonials/sarah.jpg"
    },
    {
      quote: "GAR testing showed colleges exactly what I can do. Committed in 3 months.",
      author: "Diego M.",
      role: "Soccer, Austria Residency",
      avatar: "/testimonials/diego.jpg"
    }
  ]
};

export const faq = {
  title: "Frequently Asked Questions",
  items: [
    {
      question: "Is Go4it an accredited school?",
      answer: "Go4it is a homeschool provider. Official transcripts are issued through our U.S. school-of-record partners until Fall 2026 when we complete full accreditation."
    },
    {
      question: "Are classes NCAA-approved?",
      answer: "Yes. Our courses align with NCAA core-course expectations. We provide transcript support and eligibility tracking."
    },
    {
      question: "What is GAR™ testing?",
      answer: "Get Athlete Ready (GAR™) is our comprehensive testing system covering physical, cognitive, and mental performance. Results are verified and sharable with coaches."
    },
    {
      question: "Can I do just the NCAA tracker without enrolling?",
      answer: "Yes! We offer standalone AthleteAI subscriptions that include NCAA eligibility tracking."
    },
    {
      question: "How do residency programs work?",
      answer: "Full academy students automatically qualify for our Vienna and Mérida training camps at no extra cost. Travel and accommodation are separate."
    }
  ]
};

export const seo = {
  home: {
    title: "Go4it Sports Academy | Online School + NCAA Support for Elite Athletes",
    description: "All-in-one platform for student-athletes: online school, NCAA eligibility tracking, GAR™ verification, AthleteAI coaching, and international training hubs.",
    keywords: "online school athletes, NCAA eligibility, student athlete education, GAR testing, athletic development, hybrid school"
  },
  apply: {
    title: "Apply to Go4it Sports Academy | Online + Hybrid School",
    description: "Join Go4it's online + hybrid program for elite athletes. American-taught courses, NCAA support, GAR™ testing, and international training opportunities.",
    keywords: "apply athletic school, online school enrollment, NCAA pathway, student athlete education"
  },
  audit: {
    title: "48-Hour NCAA Credit Audit | Go4it Sports Academy",
    description: "Fast transcript review, core-course evaluation, gap analysis, and NCAA eligibility roadmap delivered in 48 hours.",
    keywords: "NCAA credit audit, transcript evaluation, eligibility check, core courses"
  }
};
