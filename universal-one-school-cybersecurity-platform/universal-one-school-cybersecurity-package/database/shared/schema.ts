import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"), // user, admin, client_admin
  clientId: integer("client_id"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain"),
  isActive: boolean("is_active").notNull().default(true),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const threats = pgTable("threats", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  type: text("type").notNull(), // malware, intrusion, data_breach, etc.
  severity: text("severity").notNull(), // critical, high, medium, low
  status: text("status").notNull().default("active"), // active, resolved, investigating
  title: text("title").notNull(),
  description: text("description"),
  sourceIp: text("source_ip"),
  targetIp: text("target_ip"),
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  level: text("level").notNull(), // error, warn, info, debug
  source: text("source").notNull(), // system, application, network
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const networkNodes = pgTable("network_nodes", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  name: text("name").notNull(),
  ipAddress: text("ip_address").notNull(),
  nodeType: text("node_type").notNull(), // server, workstation, router, etc.
  status: text("status").notNull().default("online"), // online, offline, compromised, warning
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isRead: boolean("is_read").notNull().default(false),
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fileIntegrityChecks = pgTable("file_integrity_checks", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  checksum: text("checksum"),
  status: text("status").notNull(), // unchanged, modified, deleted, quarantined
  lastChecked: timestamp("last_checked").defaultNow(),
});

export const anomalies = pgTable("anomalies", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  type: text("type").notNull(),
  score: integer("score").notNull(), // 1-100 anomaly score
  description: text("description"),
  metadata: jsonb("metadata"),
  detectedAt: timestamp("detected_at").defaultNow(),
});

export const socialMediaAccounts = pgTable("social_media_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(), // instagram, tiktok, snapchat, discord, twitter, youtube, etc.
  username: text("username").notNull(),
  displayName: text("display_name"),
  profileUrl: text("profile_url"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  isPublic: boolean("is_public").default(true),
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
  accountCreatedDate: timestamp("account_created_date"),
  lastActivityDate: timestamp("last_activity_date"),
  privacySettings: jsonb("privacy_settings"), // JSON object of privacy settings
  parentalConsent: boolean("parental_consent").default(false),
  monitoringEnabled: boolean("monitoring_enabled").default(true),
  riskLevel: text("risk_level").default("low"), // low, medium, high, critical
  safetyScore: integer("safety_score").default(100), // 0-100, higher is safer
  lastSafetyCheck: timestamp("last_safety_check"),
  connectedAt: timestamp("connected_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialMediaInteractions = pgTable("social_media_interactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull(),
  interactionType: text("interaction_type").notNull(), // message, post, comment, like, share, story_view
  content: text("content"),
  participantUsernames: jsonb("participant_usernames"), // Array of usernames involved
  mediaUrls: jsonb("media_urls"), // Array of image/video URLs if any
  sentimentScore: integer("sentiment_score"), // -100 to 100, negative is more negative
  toxicityScore: integer("toxicity_score"), // 0-100, higher is more toxic
  bullyingRiskScore: integer("bullying_risk_score"), // 0-100, higher indicates bullying
  predatorRiskScore: integer("predator_risk_score"), // 0-100, higher indicates predatory behavior
  inappropriateContentScore: integer("inappropriate_content_score"), // 0-100
  flaggedForReview: boolean("flagged_for_review").default(false),
  reviewStatus: text("review_status").default("pending"), // pending, reviewed, escalated, resolved
  reviewedBy: integer("reviewed_by"), // user ID of reviewer
  interventionTriggered: boolean("intervention_triggered").default(false),
  interventionType: text("intervention_type"), // automated, human, parental, counselor
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialMediaAlerts = pgTable("social_media_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accountId: integer("account_id").notNull(),
  interactionId: integer("interaction_id"),
  alertType: text("alert_type").notNull(), // cyberbullying, predator_contact, inappropriate_content, mental_health_concern
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  riskFactors: jsonb("risk_factors"), // Array of identified risk factors
  evidenceData: jsonb("evidence_data"), // Screenshots, messages, etc.
  autoResolved: boolean("auto_resolved").default(false),
  requiresHumanReview: boolean("requires_human_review").default(false),
  parentNotified: boolean("parent_notified").default(false),
  schoolNotified: boolean("school_notified").default(false),
  lawEnforcementNotified: boolean("law_enforcement_notified").default(false),
  status: text("status").default("active"), // active, investigating, resolved, escalated
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  threats: many(threats),
  logs: many(logs),
  networkNodes: many(networkNodes),
  alerts: many(alerts),
  fileIntegrityChecks: many(fileIntegrityChecks),
  anomalies: many(anomalies),
}));

export const threatsRelations = relations(threats, ({ one }) => ({
  client: one(clients, {
    fields: [threats.clientId],
    references: [clients.id],
  }),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  client: one(clients, {
    fields: [logs.clientId],
    references: [clients.id],
  }),
}));

export const networkNodesRelations = relations(networkNodes, ({ one }) => ({
  client: one(clients, {
    fields: [networkNodes.clientId],
    references: [clients.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  client: one(clients, {
    fields: [alerts.clientId],
    references: [clients.id],
  }),
}));

export const fileIntegrityChecksRelations = relations(fileIntegrityChecks, ({ one }) => ({
  client: one(clients, {
    fields: [fileIntegrityChecks.clientId],
    references: [clients.id],
  }),
}));

export const anomaliesRelations = relations(anomalies, ({ one }) => ({
  client: one(clients, {
    fields: [anomalies.clientId],
    references: [clients.id],
  }),
}));

export const socialMediaAccountsRelations = relations(socialMediaAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [socialMediaAccounts.userId],
    references: [users.id],
  }),
  interactions: many(socialMediaInteractions),
  alerts: many(socialMediaAlerts),
}));

export const socialMediaInteractionsRelations = relations(socialMediaInteractions, ({ one }) => ({
  account: one(socialMediaAccounts, {
    fields: [socialMediaInteractions.accountId],
    references: [socialMediaAccounts.id],
  }),
  reviewer: one(users, {
    fields: [socialMediaInteractions.reviewedBy],
    references: [users.id],
  }),
}));

export const socialMediaAlertsRelations = relations(socialMediaAlerts, ({ one }) => ({
  user: one(users, {
    fields: [socialMediaAlerts.userId],
    references: [users.id],
  }),
  account: one(socialMediaAccounts, {
    fields: [socialMediaAlerts.accountId],
    references: [socialMediaAccounts.id],
  }),
  interaction: one(socialMediaInteractions, {
    fields: [socialMediaAlerts.interactionId],
    references: [socialMediaInteractions.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  clientId: true,
  isActive: true,
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  domain: true,
  settings: true,
});

export const insertThreatSchema = createInsertSchema(threats).pick({
  clientId: true,
  type: true,
  severity: true,
  title: true,
  description: true,
  sourceIp: true,
  targetIp: true,
});

export const insertLogSchema = createInsertSchema(logs).pick({
  clientId: true,
  level: true,
  source: true,
  message: true,
  metadata: true,
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  clientId: true,
  type: true,
  severity: true,
  title: true,
  description: true,
});

export const insertNetworkNodeSchema = createInsertSchema(networkNodes).pick({
  clientId: true,
  name: true,
  ipAddress: true,
  nodeType: true,
  status: true,
});

export const insertFileIntegrityCheckSchema = createInsertSchema(fileIntegrityChecks).pick({
  clientId: true,
  filePath: true,
  fileType: true,
  checksum: true,
  status: true,
});

export const insertAnomalySchema = createInsertSchema(anomalies).pick({
  clientId: true,
  type: true,
  score: true,
  description: true,
  metadata: true,
});

export const insertSocialMediaAccountSchema = createInsertSchema(socialMediaAccounts).pick({
  userId: true,
  platform: true,
  username: true,
  displayName: true,
  profileUrl: true,
  avatarUrl: true,
  isVerified: true,
  isPublic: true,
  followerCount: true,
  followingCount: true,
  accountCreatedDate: true,
  privacySettings: true,
  parentalConsent: true,
  monitoringEnabled: true,
});

export const insertSocialMediaInteractionSchema = createInsertSchema(socialMediaInteractions).pick({
  accountId: true,
  interactionType: true,
  content: true,
  participantUsernames: true,
  mediaUrls: true,
  timestamp: true,
});

export const insertSocialMediaAlertSchema = createInsertSchema(socialMediaAlerts).pick({
  userId: true,
  accountId: true,
  interactionId: true,
  alertType: true,
  severity: true,
  title: true,
  description: true,
  riskFactors: true,
  evidenceData: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;
export type Threat = typeof threats.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type Log = typeof logs.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertNetworkNode = z.infer<typeof insertNetworkNodeSchema>;
export type NetworkNode = typeof networkNodes.$inferSelect;
export type InsertFileIntegrityCheck = z.infer<typeof insertFileIntegrityCheckSchema>;
export type FileIntegrityCheck = typeof fileIntegrityChecks.$inferSelect;
export type InsertAnomaly = z.infer<typeof insertAnomalySchema>;
export type Anomaly = typeof anomalies.$inferSelect;
export type InsertSocialMediaAccount = z.infer<typeof insertSocialMediaAccountSchema>;
export type SocialMediaAccount = typeof socialMediaAccounts.$inferSelect;
export type InsertSocialMediaInteraction = z.infer<typeof insertSocialMediaInteractionSchema>;
export type SocialMediaInteraction = typeof socialMediaInteractions.$inferSelect;
export type InsertSocialMediaAlert = z.infer<typeof insertSocialMediaAlertSchema>;
export type SocialMediaAlert = typeof socialMediaAlerts.$inferSelect;
