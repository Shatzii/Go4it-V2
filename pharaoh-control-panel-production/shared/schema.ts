import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, json, index, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User schema
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: text("username").unique(),
  email: text("email").unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  plan: text("plan").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Server metrics schema
export const serverMetrics = pgTable("server_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  serverId: text("server_id").notNull(),
  name: text("name").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Marketplace models schema
export const marketplaceModels = pgTable("marketplace_models", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  icon: text("icon").notNull(),
  memory: text("memory").notNull(),
  verified: boolean("verified").default(false),
  featured: boolean("featured").default(false),
  badge: text("badge"),
  color: text("color").notNull(),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  category: text("category"),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewCount: integer("review_count"),
  price: text("price"),
  publisherName: text("publisher_name"),
  publisherVerified: boolean("publisher_verified").default(false),
  premium: boolean("premium").default(false),
});

// Installed models schema (represents models installed by users)
export const installedModels = pgTable("installed_models", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  modelId: varchar("model_id", { length: 255 }).notNull().references(() => marketplaceModels.id, { onDelete: 'cascade' }),
  installedAt: timestamp("installed_at").defaultNow(),
  status: text("status").default("active"),
  lastUsed: timestamp("last_used"),
  configuration: json("configuration"),
});

// Self-healing events schema
export const healingEvents = pgTable("healing_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  status: text("status").default("pending"),
  serverId: text("server_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  affectedService: text("affected_service"),
  severity: text("severity").default("medium"),
  autoResolved: boolean("auto_resolved").default(false),
  resolutionTime: integer("resolution_time"),
  impact: text("impact"),
  category: text("category"),
  commands: json("commands"),
});

// Activity logs schema
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  iconColor: text("icon_color").notNull(),
  serverId: text("server_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  details: json("details"),
  category: text("category"),
});

// Automation rules schema
export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  trigger: json("trigger").notNull(),
  actions: json("actions").notNull(),
  enabled: boolean("enabled").default(true),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  category: text("category"),
  serverId: text("server_id"),
});

// System logs schema
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text("message").notNull(),
  level: text("level").notNull(),
  source: text("source").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata"),
  serverId: text("server_id"),
});

// AI Analyses schema
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  timestamp: timestamp("timestamp").defaultNow(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  details: json("details"),
  serverId: text("server_id"),
});

// Server management schema
export const servers = pgTable("servers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  hostname: text("hostname"),
  ipAddress: text("ip_address"),
  os: text("os"),
  status: text("status").default("online"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  connectionInfo: json("connection_info"),
});

// Model reviews schema
export const modelReviews = pgTable("model_reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  modelId: varchar("model_id", { length: 255 }).notNull().references(() => marketplaceModels.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  content: text("content"),
  timestamp: timestamp("timestamp").defaultNow(),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
});

// Notifications schema for real-time updates
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  read: boolean("read").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
  link: text("link"),
  icon: text("icon"),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  installedModels: many(installedModels),
  serverMetrics: many(serverMetrics),
  healingEvents: many(healingEvents),
  activityLogs: many(activityLogs),
  analyses: many(analyses),
  servers: many(servers),
  notifications: many(notifications),
}));

export const installedModelsRelations = relations(installedModels, ({ one }) => ({
  user: one(users, {
    fields: [installedModels.userId],
    references: [users.id],
  }),
  model: one(marketplaceModels, {
    fields: [installedModels.modelId],
    references: [marketplaceModels.id],
  }),
}));

export const serverMetricsRelations = relations(serverMetrics, ({ one }) => ({
  user: one(users, {
    fields: [serverMetrics.userId],
    references: [users.id],
  }),
}));

export const healingEventsRelations = relations(healingEvents, ({ one }) => ({
  user: one(users, {
    fields: [healingEvents.userId],
    references: [users.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const modelReviewsRelations = relations(modelReviews, ({ one }) => ({
  user: one(users, {
    fields: [modelReviews.userId],
    references: [users.id],
  }),
  model: one(marketplaceModels, {
    fields: [modelReviews.modelId],
    references: [marketplaceModels.id],
  }),
}));

// Create insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertServerMetricSchema = createInsertSchema(serverMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertMarketplaceModelSchema = createInsertSchema(marketplaceModels).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertInstalledModelSchema = createInsertSchema(installedModels).omit({
  id: true,
  installedAt: true,
  lastUsed: true,
});

export const insertHealingEventSchema = createInsertSchema(healingEvents).omit({
  id: true,
  timestamp: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastTriggered: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  timestamp: true,
});

export const insertServerSchema = createInsertSchema(servers).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertModelReviewSchema = createInsertSchema(modelReviews).omit({
  id: true,
  timestamp: true,
  likes: true,
  dislikes: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
  read: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertServerMetric = z.infer<typeof insertServerMetricSchema>;
export type ServerMetric = typeof serverMetrics.$inferSelect;

export type InsertMarketplaceModel = z.infer<typeof insertMarketplaceModelSchema>;
export type MarketplaceModel = typeof marketplaceModels.$inferSelect;

export type InsertInstalledModel = z.infer<typeof insertInstalledModelSchema>;
export type InstalledModel = typeof installedModels.$inferSelect;

export type InsertHealingEvent = z.infer<typeof insertHealingEventSchema>;
export type HealingEvent = typeof healingEvents.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type AutomationRule = typeof automationRules.$inferSelect;

export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

export type InsertServer = z.infer<typeof insertServerSchema>;
export type Server = typeof servers.$inferSelect;

export type InsertModelReview = z.infer<typeof insertModelReviewSchema>;
export type ModelReview = typeof modelReviews.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
