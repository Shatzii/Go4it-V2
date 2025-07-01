import { storage } from "./storage";

export async function seedCmsData() {
  try {
    console.log("Seeding CMS data...");

    // Create initial content pages
    const contentPages = [
      {
        slug: "landing-hero",
        title: "Landing Page Hero Section",
        content: "Unlock Your Athletic Potential with AI-Powered Analytics and Personalized Training for Neurodivergent Student Athletes",
        type: "page",
        status: "published",
        metadata: JSON.stringify({ section: "hero", editable: true })
      },
      {
        slug: "about-platform",
        title: "About Go4It Sports",
        content: "Go4It Sports is an innovative platform designed specifically for neurodivergent student athletes aged 12-18. We combine advanced AI analytics, personalized training programs, and comprehensive academic support to help athletes reach their full potential.",
        type: "page",
        status: "published",
        metadata: JSON.stringify({ section: "about", priority: "high" })
      },
      {
        slug: "welcome-announcement",
        title: "Welcome to the Enhanced Platform",
        content: "Experience our new AI-powered video analysis, comprehensive GAR analytics, and NCAA eligibility tracking - all designed with neurodivergent athletes in mind.",
        type: "announcement",
        status: "published",
        metadata: JSON.stringify({ featured: true, expires: "2025-12-31" })
      },
      {
        slug: "faq-gar-system",
        title: "What is the GAR Analytics System?",
        content: "The GAR (Game, Athleticism, Readiness) Analytics System provides comprehensive performance tracking across 12+ sports with AI-powered insights and star ratings.",
        type: "faq",
        status: "published",
        metadata: JSON.stringify({ category: "analytics", order: 1 })
      }
    ];

    for (const page of contentPages) {
      await storage.createContent(page);
    }

    // Create sports configuration
    const sportsData = [
      {
        name: "Soccer",
        description: "The world's most popular sport, emphasizing teamwork, endurance, and technical skills.",
        skills: JSON.stringify(["ball_control", "passing", "shooting", "dribbling", "defending", "fitness"]),
        drills: JSON.stringify([
          { name: "Cone Dribbling", difficulty: "beginner", duration: "15min" },
          { name: "Passing Accuracy", difficulty: "intermediate", duration: "20min" },
          { name: "1v1 Defending", difficulty: "advanced", duration: "25min" }
        ]),
        isActive: true,
        displayOrder: 1
      },
      {
        name: "Basketball",
        description: "Fast-paced team sport focusing on shooting, dribbling, and strategic gameplay.",
        skills: JSON.stringify(["shooting", "dribbling", "passing", "defense", "rebounding", "court_vision"]),
        drills: JSON.stringify([
          { name: "Free Throw Practice", difficulty: "beginner", duration: "20min" },
          { name: "Defensive Slides", difficulty: "intermediate", duration: "15min" },
          { name: "Pick and Roll", difficulty: "advanced", duration: "30min" }
        ]),
        isActive: true,
        displayOrder: 2
      },
      {
        name: "Tennis",
        description: "Individual sport requiring precision, strategy, and mental toughness.",
        skills: JSON.stringify(["forehand", "backhand", "serve", "volley", "footwork", "strategy"]),
        drills: JSON.stringify([
          { name: "Wall Practice", difficulty: "beginner", duration: "25min" },
          { name: "Cross Court Rally", difficulty: "intermediate", duration: "30min" },
          { name: "Serve and Volley", difficulty: "advanced", duration: "35min" }
        ]),
        isActive: true,
        displayOrder: 3
      },
      {
        name: "Track and Field",
        description: "Athletic competitions involving running, jumping, and throwing events.",
        skills: JSON.stringify(["sprinting", "endurance", "jumping", "throwing", "technique", "timing"]),
        drills: JSON.stringify([
          { name: "Sprint Intervals", difficulty: "intermediate", duration: "45min" },
          { name: "Long Jump Technique", difficulty: "beginner", duration: "30min" },
          { name: "Shot Put Form", difficulty: "advanced", duration: "40min" }
        ]),
        isActive: true,
        displayOrder: 4
      }
    ];

    for (const sport of sportsData) {
      await storage.createSport(sport);
    }

    // Create platform settings
    const settings = [
      {
        key: "platform_name",
        value: "Go4It Sports Platform",
        type: "text",
        category: "branding",
        description: "Main platform name displayed in headers and navigation"
      },
      {
        key: "primary_color",
        value: "#06b6d4",
        type: "color",
        category: "theme",
        description: "Primary brand color (cyan)"
      },
      {
        key: "secondary_color",
        value: "#0ea5e9",
        type: "color",
        category: "theme",
        description: "Secondary brand color (blue)"
      },
      {
        key: "max_gar_score",
        value: "100",
        type: "number",
        category: "analytics",
        description: "Maximum GAR score for star rating calculations"
      },
      {
        key: "star_rating_enabled",
        value: "true",
        type: "boolean",
        category: "features",
        description: "Enable star rating display across profiles"
      },
      {
        key: "ai_analysis_enabled",
        value: "true",
        type: "boolean",
        category: "features",
        description: "Enable self-hosted AI video analysis"
      },
      {
        key: "ncaa_tracking_enabled",
        value: "true",
        type: "boolean",
        category: "features",
        description: "Enable NCAA eligibility tracking"
      }
    ];

    for (const setting of settings) {
      await storage.createSetting(setting);
    }

    // Create CMS achievements
    const achievements = [
      {
        achievementId: "cms_content_creator",
        title: "Content Creator",
        description: "Created your first content page using the CMS",
        icon: "FileText",
        requirements: JSON.stringify({ content_created: 1 }),
        rewards: JSON.stringify({ xp: 50, badge: "creator" }),
        category: "cms",
        isActive: true
      },
      {
        achievementId: "sports_configurator",
        title: "Sports Configurator",
        description: "Configured a sport with custom skills and drills",
        icon: "Trophy",
        requirements: JSON.stringify({ sports_configured: 1 }),
        rewards: JSON.stringify({ xp: 75, badge: "configurator" }),
        category: "cms",
        isActive: true
      },
      {
        achievementId: "platform_customizer",
        title: "Platform Customizer",
        description: "Customized platform settings and branding",
        icon: "Settings",
        requirements: JSON.stringify({ settings_modified: 3 }),
        rewards: JSON.stringify({ xp: 100, badge: "customizer" }),
        category: "cms",
        isActive: true
      }
    ];

    for (const achievement of achievements) {
      await storage.createCmsAchievement(achievement);
    }

    console.log("CMS data seeded successfully!");
    console.log(`Created ${contentPages.length} content pages`);
    console.log(`Created ${sportsData.length} sports configurations`);
    console.log(`Created ${settings.length} platform settings`);
    console.log(`Created ${achievements.length} CMS achievements`);

  } catch (error) {
    console.error("Error seeding CMS data:", error);
  }
}