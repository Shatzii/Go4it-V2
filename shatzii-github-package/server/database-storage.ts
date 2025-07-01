/**
 * Database Storage Implementation
 * Provides persistent data storage using PostgreSQL with Drizzle ORM
 */

import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users, plans, subscriptions, demoRequests, contactRequests, 
  testimonials, userMetrics, userGoals, userActivities,
  type User, type InsertUser, type Plan, type InsertPlan,
  type Subscription, type InsertSubscription, type DemoRequest, 
  type InsertDemoRequest, type ContactRequest, type InsertContactRequest,
  type Testimonial, type InsertTestimonial, type UserMetrics, 
  type InsertUserMetrics, type UserGoals, type InsertUserGoals,
  type UserActivities, type InsertUserActivities
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      company: insertUser.company || null,
      role: insertUser.role || null
    }).returning();
    return user;
  }

  // Plan operations
  async getAllPlans(): Promise<Plan[]> {
    return await db.select().from(plans);
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan;
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const [plan] = await db.insert(plans).values({
      ...insertPlan,
      category: insertPlan.category || 'standard',
      popular: insertPlan.popular || null
    }).returning();
    return plan;
  }

  // Subscription operations
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values({
      ...insertSubscription,
      stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null
    }).returning();
    return subscription;
  }

  async getSubscriptionsByUser(userId: number): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  }

  // Demo request operations
  async createDemoRequest(insertRequest: InsertDemoRequest): Promise<DemoRequest> {
    const [request] = await db.insert(demoRequests).values({
      ...insertRequest,
      message: insertRequest.message || null
    }).returning();
    return request;
  }

  async getAllDemoRequests(): Promise<DemoRequest[]> {
    return await db.select().from(demoRequests);
  }

  async updateDemoRequestStatus(id: number, status: string): Promise<void> {
    await db.update(demoRequests)
      .set({ status })
      .where(eq(demoRequests.id, id));
  }

  // Contact request operations
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const [request] = await db.insert(contactRequests).values({
      ...insertRequest,
      company: insertRequest.company || null
    }).returning();
    return request;
  }

  async getAllContactRequests(): Promise<ContactRequest[]> {
    return await db.select().from(contactRequests);
  }

  async updateContactRequestStatus(id: number, status: string): Promise<void> {
    await db.update(contactRequests)
      .set({ status })
      .where(eq(contactRequests.id, id));
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.featured, true));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values({
      ...insertTestimonial,
      avatar: insertTestimonial.avatar || null,
      featured: insertTestimonial.featured || null
    }).returning();
    return testimonial;
  }

  // User metrics operations
  async getUserMetrics(userId: number, startDate?: string, endDate?: string): Promise<UserMetrics[]> {
    let query = db.select().from(userMetrics).where(eq(userMetrics.userId, userId));
    return await query;
  }

  async createUserMetrics(insertMetrics: InsertUserMetrics): Promise<UserMetrics> {
    const [metrics] = await db.insert(userMetrics).values({
      ...insertMetrics,
      tasksCompleted: insertMetrics.tasksCompleted || null,
      timeSpent: insertMetrics.timeSpent || null,
      leadsGenerated: insertMetrics.leadsGenerated || null,
      dealsCreated: insertMetrics.dealsCreated || null,
      revenue: insertMetrics.revenue || null,
      efficiency: insertMetrics.efficiency || null
    }).returning();
    return metrics;
  }

  async updateUserMetrics(userId: number, date: string, updates: Partial<InsertUserMetrics>): Promise<UserMetrics> {
    const [metrics] = await db.update(userMetrics)
      .set(updates)
      .where(eq(userMetrics.userId, userId))
      .returning();
    return metrics;
  }

  // User goals operations
  async getUserGoals(userId: number, type?: string): Promise<UserGoals[]> {
    let query = db.select().from(userGoals).where(eq(userGoals.userId, userId));
    return await query;
  }

  async createUserGoal(insertGoal: InsertUserGoals): Promise<UserGoals> {
    const [goal] = await db.insert(userGoals).values({
      ...insertGoal,
      current: insertGoal.current || null,
      achieved: insertGoal.achieved || null
    }).returning();
    return goal;
  }

  async updateUserGoal(id: number, updates: Partial<InsertUserGoals>): Promise<UserGoals> {
    const [goal] = await db.update(userGoals)
      .set(updates)
      .where(eq(userGoals.id, id))
      .returning();
    return goal;
  }

  // User activities operations
  async getUserActivities(userId: number, limit: number = 50): Promise<UserActivities[]> {
    return await db.select().from(userActivities)
      .where(eq(userActivities.userId, userId))
      .limit(limit);
  }

  async createUserActivity(insertActivity: InsertUserActivities): Promise<UserActivities> {
    const [activity] = await db.insert(userActivities).values({
      ...insertActivity,
      metadata: insertActivity.metadata || null
    }).returning();
    return activity;
  }
}