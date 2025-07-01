import { 
  users, plans, subscriptions, demoRequests, contactRequests, testimonials, userMetrics, userGoals, userActivities,
  type User, type InsertUser, type Plan, type InsertPlan, 
  type Subscription, type InsertSubscription, type DemoRequest, type InsertDemoRequest,
  type ContactRequest, type InsertContactRequest, type Testimonial, type InsertTestimonial,
  type UserMetrics, type InsertUserMetrics, type UserGoals, type InsertUserGoals,
  type UserActivities, type InsertUserActivities
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Plans
  getAllPlans(): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  
  // Subscriptions
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionsByUser(userId: number): Promise<Subscription[]>;
  
  // Demo Requests
  createDemoRequest(request: InsertDemoRequest): Promise<DemoRequest>;
  getAllDemoRequests(): Promise<DemoRequest[]>;
  updateDemoRequestStatus(id: number, status: string): Promise<void>;
  
  // Contact Requests
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getAllContactRequests(): Promise<ContactRequest[]>;
  updateContactRequestStatus(id: number, status: string): Promise<void>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // User Metrics
  getUserMetrics(userId: number, startDate?: string, endDate?: string): Promise<UserMetrics[]>;
  createUserMetrics(metrics: InsertUserMetrics): Promise<UserMetrics>;
  updateUserMetrics(userId: number, date: string, metrics: Partial<InsertUserMetrics>): Promise<UserMetrics>;
  
  // User Goals
  getUserGoals(userId: number, type?: string): Promise<UserGoals[]>;
  createUserGoal(goal: InsertUserGoals): Promise<UserGoals>;
  updateUserGoal(id: number, updates: Partial<InsertUserGoals>): Promise<UserGoals>;
  
  // User Activities
  getUserActivities(userId: number, limit?: number): Promise<UserActivities[]>;
  createUserActivity(activity: InsertUserActivities): Promise<UserActivities>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plans: Map<number, Plan>;
  private subscriptions: Map<number, Subscription>;
  private demoRequests: Map<number, DemoRequest>;
  private contactRequests: Map<number, ContactRequest>;
  private testimonials: Map<number, Testimonial>;
  private userMetrics: Map<string, UserMetrics>; // key: userId-date
  private userGoals: Map<number, UserGoals>;
  private userActivities: Map<number, UserActivities>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.subscriptions = new Map();
    this.demoRequests = new Map();
    this.contactRequests = new Map();
    this.testimonials = new Map();
    this.userMetrics = new Map();
    this.userGoals = new Map();
    this.userActivities = new Map();
    this.currentId = {
      users: 1,
      plans: 1,
      subscriptions: 1,
      demoRequests: 1,
      contactRequests: 1,
      testimonials: 1,
      userMetrics: 1,
      userGoals: 1,
      userActivities: 1,
    };
    
    this.seedData();
  }

  private seedData() {
    // Seed plans - AI Solutions focus
    const plans: InsertPlan[] = [
      {
        name: "AI Starter",
        price: "29.00",
        description: "Local AI that works offline",
        features: ["1 server connection", "AI-powered monitoring", "Basic deployment", "Local AI analysis", "Community support"],
        popular: false,
        category: "ai",
      },
      {
        name: "AI Professional",
        price: "99.00",
        description: "Full AI-powered server management",
        features: ["5 server connections", "Advanced AI automation", "GitHub/Replit integration", "Real-time monitoring", "SSL automation", "Priority support"],
        popular: true,
        category: "ai",
      },
      {
        name: "AI Enterprise",
        price: "299.00",
        description: "Complete AI infrastructure solution",
        features: ["Unlimited servers", "Advanced AI rules", "White-label options", "Enterprise security", "Custom integrations", "Dedicated support"],
        popular: false,
        category: "ai",
      },
      {
        name: "CMS Pro",
        price: "59.00",
        description: "Headless CMS with AI features",
        features: ["AI content optimization", "GraphQL & REST APIs", "Custom field types", "User authentication", "50GB storage"],
        popular: false,
        category: "cms",
      },
      {
        name: "Deploy Pro",
        price: "79.00",
        description: "AI-enhanced deployment platform",
        features: ["Auto-deployment", "AI performance optimization", "Preview environments", "Global CDN", "Advanced analytics"],
        popular: false,
        category: "deployment",
      },
      {
        name: "Sentinel Starter",
        price: "299.00",
        description: "AI-powered cybersecurity for growing teams",
        features: ["Up to 100 endpoints", "AI threat detection", "Basic compliance", "Email support", "24-hour response"],
        popular: false,
        category: "security",
      },
      {
        name: "Sentinel Professional",
        price: "899.00",
        description: "Advanced threat correlation and response",
        features: ["Up to 1,000 endpoints", "Automated incident response", "Advanced compliance", "Priority support", "4-hour response"],
        popular: false,
        category: "security",
      },
      {
        name: "Sentinel Enterprise",
        price: "2499.00",
        description: "Enterprise cybersecurity with unlimited scale",
        features: ["Unlimited endpoints", "Custom AI training", "Executive dashboard", "24/7 phone support", "1-hour response"],
        popular: false,
        category: "security",
      },
      {
        name: "ShatziiOS Starter",
        price: "2500.00",
        description: "CEO dashboard for neurodivergent education",
        features: ["Up to 2,000 students", "Basic analytics", "Standard reporting", "Email support", "24-hour response"],
        popular: false,
        category: "education",
      },
      {
        name: "ShatziiOS Professional",
        price: "4500.00",
        description: "Advanced education analytics platform",
        features: ["Up to 5,000 students", "AI teacher tracking", "Custom reporting", "Multi-school management", "Priority support"],
        popular: false,
        category: "education",
      },
      {
        name: "TruckFlow Starter",
        price: "299.00",
        description: "AI-powered trucking dispatch platform",
        features: ["Basic dispatch", "AI rate suggestions", "Real-time tracking", "Mobile app", "Email support"],
        popular: false,
        category: "logistics",
      },
      {
        name: "TruckFlow Professional",
        price: "499.00",
        description: "Advanced trucking operations suite",
        features: ["Advanced analytics", "IoT integration", "Voice commands", "Predictive maintenance", "Priority support"],
        popular: false,
        category: "logistics",
      },
      {
        name: "TruckFlow Enterprise",
        price: "799.00",
        description: "Complete autonomous trucking platform",
        features: ["Autonomous vehicle integration", "Blockchain contracts", "Custom integrations", "24/7 support", "ROI guarantee"],
        popular: false,
        category: "logistics",
      },
    ];

    plans.forEach(plan => this.createPlan(plan));

    // Add admin users
    this.currentId.users = 3;
    const adminUser: User = {
      id: 2,
      name: "Shatzii Admin",
      email: "admin@shatzii.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "ShatziiAdmin2025!"
      role: "admin",
      company: "Shatzii Inc",
      createdAt: new Date()
    };
    this.users.set(2, adminUser);

    const spacePharaohUser: User = {
      id: 3,
      name: "SpacePharaoh", 
      email: "SpaceP@shatzii.com",
      password: "$2b$10$0eHq1PF7pnO8wlJAjj9QOeHJKA2C4jT.CYASGFzbT1t.DwEN23wxe", // "*GodFlow42$$"
      role: "SUPREME_PHARAOH",
      company: "Shatzii AI Empire",
      title: "Supreme AI Pharaoh & Master Administrator",
      industry: "Artificial Intelligence",
      primaryGoals: "Ultimate control over autonomous AI operations and empire expansion",
      phone: "+1-555-PHARAOH",
      website: "https://shatzii.com/pharaoh",
      linkedinProfile: "https://linkedin.com/in/spacepharaoh",
      businessSize: "Enterprise",
      department: "Executive Leadership",
      aiExperience: "Master Level",
      specificNeeds: "Supreme administrative control over all AI systems",
      aiRecommendations: "Master Admin Key: SHATZII_MASTER_2025_SUPREME_ACCESS",
      createdAt: new Date()
    };
    this.users.set(3, spacePharaohUser);

    // Seed testimonials - AI-focused
    const testimonials: InsertTestimonial[] = [
      {
        name: "Sarah Chen",
        title: "CTO",
        company: "TechFlow",
        content: "Pharaoh's local AI saved us thousands in API costs while providing better server insights than any cloud solution.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        featured: true,
      },
      {
        name: "Marcus Rodriguez",
        title: "DevOps Engineer",
        company: "InnovateLab",
        content: "Deploy from GitHub, Replit, or VS Code in seconds. The AI-powered monitoring catches issues before they become problems.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        featured: true,
      },
      {
        name: "Emily Watson",
        title: "Lead Developer",
        company: "CreativeCo",
        content: "Finally, AI that actually saves money instead of costing it. The offline capabilities are a game-changer.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
        featured: true,
      },
      {
        name: "Michael Chen",
        title: "CISO",
        company: "Fortune 500 Financial Services",
        content: "Sentinel AI transformed our security operations overnight. We went from managing 15 different security tools to one unified platform. The AI-powered threat detection caught a sophisticated attack that our previous $2M SIEM completely missed.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        featured: true,
      },
      {
        name: "Dr. Amanda Foster",
        title: "CEO",
        company: "Neurodivergent Learning Network",
        content: "ShatziiOS CEO Dashboard gave us visibility into our 6 schools and 24,000+ students like never before. The 92.8% success rate speaks for itself - our AI teacher optimization increased tutoring effectiveness by 26.4%.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        featured: true,
      },
      {
        name: "Mike Rodriguez",
        title: "CEO",
        company: "Rodriguez Transport",
        content: "TruckFlow AI increased our profit margins by 22% in the first quarter. The AI rate optimization alone paid for the entire platform. We're saving 6 hours daily on dispatch operations.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        featured: true,
      },
    ];

    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || 'user',
      company: insertUser.company || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Plans
  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = this.currentId.plans++;
    const plan: Plan = { 
      ...insertPlan, 
      id,
      popular: insertPlan.popular || null,
      category: insertPlan.category || 'general'
    };
    this.plans.set(id, plan);
    return plan;
  }

  // Subscriptions
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentId.subscriptions++;
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null,
      createdAt: new Date(),
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscriptionsByUser(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.userId === userId);
  }

  // Demo Requests
  async createDemoRequest(insertRequest: InsertDemoRequest): Promise<DemoRequest> {
    const id = this.currentId.demoRequests++;
    const request: DemoRequest = {
      ...insertRequest,
      id,
      message: insertRequest.message || null,
      status: "pending",
      createdAt: new Date(),
    };
    this.demoRequests.set(id, request);
    return request;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    return Array.from(this.demoRequests.values());
  }

  async updateDemoRequestStatus(id: number, status: string): Promise<void> {
    const request = this.demoRequests.get(id);
    if (request) {
      this.demoRequests.set(id, { ...request, status });
    }
  }

  // Contact Requests
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = this.currentId.contactRequests++;
    const request: ContactRequest = {
      ...insertRequest,
      id,
      company: insertRequest.company || null,
      status: "pending",
      createdAt: new Date(),
    };
    this.contactRequests.set(id, request);
    return request;
  }

  async getAllContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }

  async updateContactRequestStatus(id: number, status: string): Promise<void> {
    const request = this.contactRequests.get(id);
    if (request) {
      this.contactRequests.set(id, { ...request, status });
    }
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(t => t.featured);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId.testimonials++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      avatar: insertTestimonial.avatar || null,
      featured: insertTestimonial.featured || null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // User Metrics
  async getUserMetrics(userId: number, startDate?: string, endDate?: string): Promise<UserMetrics[]> {
    const userMetricsArray = Array.from(this.userMetrics.values())
      .filter(metric => metric.userId === userId);
    
    if (startDate && endDate) {
      return userMetricsArray.filter(metric => 
        metric.date >= startDate && metric.date <= endDate
      );
    }
    
    return userMetricsArray;
  }

  async createUserMetrics(insertMetrics: InsertUserMetrics): Promise<UserMetrics> {
    const id = this.currentId.userMetrics++;
    const metrics: UserMetrics = { 
      date: insertMetrics.date,
      userId: insertMetrics.userId,
      id,
      tasksCompleted: insertMetrics.tasksCompleted || null,
      timeSpent: insertMetrics.timeSpent || null,
      leadsGenerated: insertMetrics.leadsGenerated || null,
      dealsCreated: insertMetrics.dealsCreated || null,
      revenue: insertMetrics.revenue || null,
      efficiency: insertMetrics.efficiency || null,
      createdAt: new Date()
    };
    
    const key = `${metrics.userId}-${metrics.date}`;
    this.userMetrics.set(key, metrics);
    return metrics;
  }

  async updateUserMetrics(userId: number, date: string, updates: Partial<InsertUserMetrics>): Promise<UserMetrics> {
    const key = `${userId}-${date}`;
    const existing = this.userMetrics.get(key);
    
    if (!existing) {
      // Create new metrics if not exists
      return this.createUserMetrics({ 
        userId, 
        date, 
        ...updates 
      } as InsertUserMetrics);
    }
    
    const updated = { ...existing, ...updates };
    this.userMetrics.set(key, updated);
    return updated;
  }

  // User Goals
  async getUserGoals(userId: number, type?: string): Promise<UserGoals[]> {
    const userGoalsArray = Array.from(this.userGoals.values())
      .filter(goal => goal.userId === userId);
    
    if (type) {
      return userGoalsArray.filter(goal => goal.type === type);
    }
    
    return userGoalsArray;
  }

  async createUserGoal(insertGoal: InsertUserGoals): Promise<UserGoals> {
    const id = this.currentId.userGoals++;
    const goal: UserGoals = { 
      ...insertGoal, 
      id,
      current: insertGoal.current || null,
      achieved: insertGoal.achieved || null,
      createdAt: new Date()
    };
    
    this.userGoals.set(id, goal);
    return goal;
  }

  async updateUserGoal(id: number, updates: Partial<InsertUserGoals>): Promise<UserGoals> {
    const existing = this.userGoals.get(id);
    if (!existing) {
      throw new Error('Goal not found');
    }
    
    const updated = { ...existing, ...updates };
    this.userGoals.set(id, updated);
    return updated;
  }

  // User Activities
  async getUserActivities(userId: number, limit: number = 50): Promise<UserActivities[]> {
    return Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => {
        const aTime = a.timestamp?.getTime() || 0;
        const bTime = b.timestamp?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  async createUserActivity(insertActivity: InsertUserActivities): Promise<UserActivities> {
    const id = this.currentId.userActivities++;
    const activity: UserActivities = { 
      ...insertActivity, 
      id,
      metadata: insertActivity.metadata || null,
      timestamp: new Date()
    };
    
    this.userActivities.set(id, activity);
    return activity;
  }
}

import { DatabaseStorage } from './database-storage';

// Switch to database storage for production
export const storage = new DatabaseStorage();
