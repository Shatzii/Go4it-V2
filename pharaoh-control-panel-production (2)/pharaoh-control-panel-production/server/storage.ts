import {
  users, 
  serverMetrics,
  marketplaceModels,
  installedModels,
  healingEvents,
  activityLogs,
  automationRules,
  systemLogs,
  analyses,
  servers,
  modelReviews,
  notifications,
  type User,
  type UpsertUser,
  type ServerMetric,
  type InsertServerMetric,
  type MarketplaceModel,
  type InsertMarketplaceModel,
  type InstalledModel,
  type InsertInstalledModel,
  type HealingEvent,
  type InsertHealingEvent,
  type ActivityLog,
  type InsertActivityLog,
  type AutomationRule,
  type InsertAutomationRule,
  type SystemLog,
  type InsertSystemLog,
  type Analysis,
  type InsertAnalysis,
  type Server,
  type InsertServer,
  type ModelReview,
  type InsertModelReview,
  type Notification,
  type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: string, data: { customerId: string, subscriptionId: string }): Promise<User>;
  updateUserPlan(userId: string, plan: string): Promise<User>;

  // Server metrics operations
  getServerMetrics(userId: string, limit?: number): Promise<ServerMetric[]>;
  createServerMetric(metric: InsertServerMetric): Promise<ServerMetric>;

  // Marketplace models operations
  getMarketplaceModels(filters?: { category?: string, search?: string }): Promise<MarketplaceModel[]>;
  getMarketplaceModel(modelId: string): Promise<MarketplaceModel | undefined>;

  // Installed models operations
  getInstalledModels(userId: string): Promise<InstalledModel[]>;
  installModel(installation: InsertInstalledModel): Promise<InstalledModel>;
  uninstallModel(userId: string, modelId: string): Promise<void>;

  // Healing events operations
  getHealingEvents(userId: string, limit?: number): Promise<HealingEvent[]>;
  createHealingEvent(event: InsertHealingEvent): Promise<HealingEvent>;
  updateHealingEventStatus(eventId: number, status: string): Promise<HealingEvent>;

  // Activity logs operations
  getActivityLogs(userId: string, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Automation rules operations
  getAutomationRules(userId: string): Promise<AutomationRule[]>;
  toggleAutomationRule(ruleId: number, enabled: boolean): Promise<AutomationRule>;

  // System logs operations
  getSystemLogs(userId: string, level?: string, limit?: number): Promise<SystemLog[]>;
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date()
        }
      })
      .returning();
    return user;
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, data: { customerId: string, subscriptionId: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: data.customerId, 
        stripeSubscriptionId: data.subscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUserPlan(userId: string, plan: string): Promise<User> {
    // Validate plan
    const validPlans = ['free', 'premium', 'enterprise'];
    if (!validPlans.includes(plan)) {
      throw new Error(`Invalid plan: ${plan}. Must be one of: ${validPlans.join(', ')}`);
    }
    
    // Update user's plan
    const [user] = await db
      .update(users)
      .set({ 
        plan,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  // Server metrics operations
  async getServerMetrics(userId: string, limit: number = 10): Promise<ServerMetric[]> {
    return await db
      .select()
      .from(serverMetrics)
      .where(eq(serverMetrics.userId, userId))
      .orderBy(desc(serverMetrics.timestamp))
      .limit(limit);
  }

  async createServerMetric(metric: InsertServerMetric): Promise<ServerMetric> {
    const [newMetric] = await db
      .insert(serverMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  // Marketplace models operations
  async getMarketplaceModels(filters?: { category?: string, search?: string }): Promise<MarketplaceModel[]> {
    let query = db.select().from(marketplaceModels);
    
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        query = query.where(eq(marketplaceModels.category, filters.category));
      }
      
      if (filters.search) {
        query = query.where(
          or(
            like(marketplaceModels.name, `%${filters.search}%`),
            like(marketplaceModels.description, `%${filters.search}%`)
          )
        );
      }
    }
    
    return await query.orderBy(desc(marketplaceModels.featured), desc(marketplaceModels.rating));
  }

  async getMarketplaceModel(modelId: string): Promise<MarketplaceModel | undefined> {
    const [model] = await db
      .select()
      .from(marketplaceModels)
      .where(eq(marketplaceModels.id, modelId));
    return model;
  }

  // Installed models operations
  async getInstalledModels(userId: string): Promise<InstalledModel[]> {
    return await db
      .select()
      .from(installedModels)
      .where(eq(installedModels.userId, userId))
      .orderBy(desc(installedModels.installedAt));
  }

  async installModel(installation: InsertInstalledModel): Promise<InstalledModel> {
    const [newInstallation] = await db
      .insert(installedModels)
      .values(installation)
      .returning();
    return newInstallation;
  }

  async uninstallModel(userId: string, modelId: string): Promise<void> {
    await db
      .delete(installedModels)
      .where(
        and(
          eq(installedModels.userId, userId),
          eq(installedModels.modelId, modelId)
        )
      );
  }

  // Healing events operations
  async getHealingEvents(userId: string, limit: number = 10): Promise<HealingEvent[]> {
    return await db
      .select()
      .from(healingEvents)
      .where(eq(healingEvents.userId, userId))
      .orderBy(desc(healingEvents.timestamp))
      .limit(limit);
  }

  async createHealingEvent(event: InsertHealingEvent): Promise<HealingEvent> {
    const [newEvent] = await db
      .insert(healingEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async updateHealingEventStatus(eventId: number, status: string): Promise<HealingEvent> {
    const [updated] = await db
      .update(healingEvents)
      .set({ 
        status,
        ...(status === 'complete' ? { resolutionTime: sql`EXTRACT(EPOCH FROM (NOW() - ${healingEvents.timestamp}))::int` } : {})
      })
      .where(eq(healingEvents.id, eventId))
      .returning();
    return updated;
  }

  // Activity logs operations
  async getActivityLogs(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.timestamp))
      .limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  // Automation rules operations
  async getAutomationRules(userId: string): Promise<AutomationRule[]> {
    return await db
      .select()
      .from(automationRules)
      .where(eq(automationRules.userId, userId))
      .orderBy(automationRules.name);
  }

  async toggleAutomationRule(ruleId: number, enabled: boolean): Promise<AutomationRule> {
    const [updated] = await db
      .update(automationRules)
      .set({ 
        enabled,
        updatedAt: new Date()
      })
      .where(eq(automationRules.id, ruleId))
      .returning();
    return updated;
  }

  // System logs operations
  async getSystemLogs(userId: string, level?: string, limit: number = 50): Promise<SystemLog[]> {
    let query = db
      .select()
      .from(systemLogs)
      .where(eq(systemLogs.userId, userId))
      .orderBy(desc(systemLogs.timestamp))
      .limit(limit);
    
    if (level && level !== 'all') {
      query = query.where(eq(systemLogs.level, level));
    }
    
    return await query;
  }

  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    const [newLog] = await db
      .insert(systemLogs)
      .values(log)
      .returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
