import { storage } from "./storage";

// Production configuration and health checks for go4itsports.org
export async function initializeProduction() {
  console.log("🚀 Initializing Go4It Sports Platform for production...");
  
  try {
    // Test database connection
    console.log("📊 Testing database connection...");
    await storage.getAllSettings();
    console.log("✅ Database connection successful");
    
    // Seed CMS data if empty
    console.log("🌱 Checking CMS data...");
    const content = await storage.getAllContent();
    if (content.length === 0) {
      console.log("📝 Seeding initial CMS content...");
      await seedInitialContent();
    }
    
    // Verify essential settings
    console.log("⚙️ Verifying platform settings...");
    await ensureEssentialSettings();
    
    console.log("✅ Production initialization complete");
    console.log(`🌐 Platform ready at https://go4itsports.org`);
    
  } catch (error) {
    console.error("❌ Production initialization failed:", error);
    process.exit(1);
  }
}

async function seedInitialContent() {
  // Essential platform content
  const initialContent = [
    {
      slug: "platform-welcome",
      title: "Welcome to Go4It Sports",
      content: "The premier AI-powered sports analytics platform for neurodivergent student athletes. Track your GAR scores, analyze video performance, and unlock your athletic potential.",
      type: "page",
      status: "published",
      metadata: JSON.stringify({ featured: true, section: "hero" })
    },
    {
      slug: "gar-system-info",
      title: "GAR Analytics System",
      content: "Our comprehensive Game, Athleticism, Readiness (GAR) analytics system provides detailed performance tracking across 12+ sports with AI-powered insights and 5-star rating system.",
      type: "page",
      status: "published",
      metadata: JSON.stringify({ category: "features" })
    },
    {
      slug: "ai-video-analysis",
      title: "Self-Hosted AI Video Analysis",
      content: "Advanced video analysis using locally deployed AI models including MediaPipe Pose, YOLO Sports Detection, OpenPose Advanced, and Motion Classifier for enhanced privacy and performance.",
      type: "page",
      status: "published",
      metadata: JSON.stringify({ category: "features" })
    }
  ];

  for (const content of initialContent) {
    await storage.createContent(content);
  }

  // Core sports configuration
  const coreSports = [
    {
      name: "Soccer",
      description: "World's most popular sport emphasizing teamwork and technical skills",
      skills: JSON.stringify(["ball_control", "passing", "shooting", "defending"]),
      drills: JSON.stringify([
        { name: "Cone Dribbling", difficulty: "beginner" },
        { name: "Passing Accuracy", difficulty: "intermediate" }
      ]),
      isActive: true,
      displayOrder: 1
    },
    {
      name: "Basketball",
      description: "Fast-paced team sport focusing on shooting and strategy",
      skills: JSON.stringify(["shooting", "dribbling", "defense", "court_vision"]),
      drills: JSON.stringify([
        { name: "Free Throw Practice", difficulty: "beginner" },
        { name: "Defensive Slides", difficulty: "intermediate" }
      ]),
      isActive: true,
      displayOrder: 2
    }
  ];

  for (const sport of coreSports) {
    await storage.createSport(sport);
  }
}

async function ensureEssentialSettings() {
  const essentialSettings = [
    {
      key: "platform_name",
      value: "Go4It Sports Platform",
      type: "text",
      category: "branding",
      description: "Platform name for go4itsports.org"
    },
    {
      key: "domain",
      value: "go4itsports.org",
      type: "text",
      category: "system",
      description: "Primary domain name"
    },
    {
      key: "primary_color",
      value: "#06b6d4",
      type: "color",
      category: "branding",
      description: "Primary brand color (cyan)"
    },
    {
      key: "gar_enabled",
      value: "true",
      type: "boolean",
      category: "features",
      description: "Enable GAR analytics system"
    },
    {
      key: "ai_analysis_enabled",
      value: "true",
      type: "boolean",
      category: "features",
      description: "Enable AI video analysis"
    }
  ];

  for (const setting of essentialSettings) {
    try {
      const existing = await storage.getSettingByKey(setting.key);
      if (!existing) {
        await storage.createSetting(setting);
      }
    } catch (error) {
      console.log(`Creating setting: ${setting.key}`);
      await storage.createSetting(setting);
    }
  }
}

export function validateEnvironment() {
  const required = ['DATABASE_URL', 'SESSION_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please check your .env file');
    process.exit(1);
  }
  
  if (process.env.NODE_ENV === 'production') {
    const prodRequired = ['DOMAIN'];
    const prodMissing = prodRequired.filter(key => !process.env[key]);
    
    if (prodMissing.length > 0) {
      console.warn('⚠️ Missing production environment variables:', prodMissing);
    }
  }
}

// Health check endpoint data
export function getSystemHealth() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    domain: process.env.DOMAIN || 'go4itsports.org',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    features: {
      gar_analytics: true,
      ai_video_analysis: true,
      cms_enabled: true,
      admin_dashboard: true,
      star_ratings: true,
      ncaa_tracking: true
    }
  };
}