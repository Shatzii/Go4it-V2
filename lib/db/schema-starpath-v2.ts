/**
 * StarPath v2 Schema - Production Hardening
 * 
 * Adds: Multi-tenant orgs, Event Mode (GetVerified™), normalized GAR metrics,
 * audit logging, consent management, and performance indexes.
 * 
 * ADDITIVE ONLY - extends schema-starpath.ts
 */

import { pgTable, text, integer, real, timestamp, boolean, jsonb, unique, index } from "drizzle-orm/pg-core";
import { users } from "./schema";
import { garSessions } from "./schema-starpath";

// Re-export garSessions as starpathGARSessions for consistency
export const starpathGARSessions = garSessions;

// ========== MULTI-TENANT FOUNDATION ==========

/**
 * Organizations - Schools, clubs, facilities, internal teams
 */
export const starpathOrgs = pgTable("starpath_orgs", {
  id: text("id").primaryKey(), // uuidv7
  name: text("name").notNull(),
  kind: text("kind").notNull(), // 'school', 'club', 'facility', 'internal'
  slug: text("slug").unique(),
  country: text("country"), // ISO 3166-1 alpha-2
  timezone: text("timezone"), // IANA timezone (e.g., 'America/Denver')
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  metadata: jsonb("metadata"), // Partner-specific config
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Memberships - User ↔ Org relationships with roles
 */
export const starpathMemberships = pgTable("starpath_memberships", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => starpathOrgs.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // 'student', 'parent', 'coach', 'staff', 'admin'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  metadata: jsonb("metadata"), // Role-specific data
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueMembership: unique("unique_org_user_role").on(table.orgId, table.userId, table.role),
  orgIdx: index("idx_membership_org").on(table.orgId),
  userIdx: index("idx_membership_user").on(table.userId),
}));

/**
 * Lead Links - Marketing attribution (Lead ID → User ID)
 */
export const starpathLeadLinks = pgTable("starpath_lead_links", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull(), // From CRM/Stripe/n8n
  userId: text("user_id").notNull().references(() => users.id),
  source: text("source"), // 'utm_source' or 'event:CO-2025-11-16'
  campaign: text("campaign"), // UTM campaign
  medium: text("medium"), // UTM medium
  eventId: text("event_id"), // If from event registration
  linkedAt: timestamp("linked_at").defaultNow().notNull(),
}, (table) => ({
  leadIdx: index("idx_lead_links_lead").on(table.leadId),
  userIdx: index("idx_lead_links_user").on(table.userId),
}));

// ========== GAR METRICS (NORMALIZED) ==========

/**
 * GAR Metrics - Individual metric values per session
 * Replaces flat JSON in gar_sessions for better querying
 */
export const starpathGARMetrics = pgTable("starpath_gar_metrics", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => starpathGARSessions.id, { onDelete: "cascade" }),
  metric: text("metric").notNull(), // 'speed_40yd', 'pro_agility', 'vertical', 'broad', 'strength_iso', 'mobility_fms'
  value: real("value").notNull(),
  units: text("units"), // 's', 'in', 'kg', 'score'
  percentile: real("percentile"), // Age-group percentile (0-100)
  verified: boolean("verified").default(false), // Staff-verified result
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index("idx_gar_metrics_session").on(table.sessionId),
  metricIdx: index("idx_gar_metrics_metric").on(table.metric),
  sessionMetricIdx: index("idx_gar_metrics_session_metric").on(table.sessionId, table.metric),
}));

// ========== EVENT MODE (GetVerified™) ==========

/**
 * Events - Combines, showcases, testing sessions
 */
export const starpathEvents = pgTable("starpath_events", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(), // 'CO-2025-11-16'
  name: text("name").notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  timezone: text("timezone").notNull(), // 'America/Denver'
  venue: text("venue"),
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  capacity: integer("capacity"),
  priceBase: integer("price_base"), // cents
  priceProPack: integer("price_pro_pack"), // cents (video + metrics)
  priceAuditAddon: integer("price_audit_addon"), // cents ($299)
  orgId: text("org_id").references(() => starpathOrgs.id), // Hosting org
  status: text("status").notNull().default("draft"), // 'draft', 'open', 'full', 'completed', 'cancelled'
  imageUrl: text("image_url"),
  calEventTypeId: text("cal_event_type_id"), // Cal.com event type
  metadata: jsonb("metadata"), // Custom fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  startsAtIdx: index("idx_events_starts_at").on(table.startsAt),
  slugIdx: index("idx_events_slug").on(table.slug),
}));

/**
 * Event Registrations - Who's attending which wave
 */
export const starpathEventRegistrations = pgTable("starpath_event_registrations", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => starpathEvents.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id),
  wave: text("wave"), // 'AM', 'PM', null
  checkinAt: timestamp("checkin_at"),
  proPack: boolean("pro_pack").default(false),
  auditAddon: boolean("audit_addon").default(false),
  status: text("status").notNull().default("registered"), // 'registered', 'checked_in', 'no_show', 'cancelled'
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amountPaid: integer("amount_paid"), // cents
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueReg: unique("unique_event_user").on(table.eventId, table.userId),
  eventIdx: index("idx_event_regs_event").on(table.eventId),
  userIdx: index("idx_event_regs_user").on(table.userId),
}));

// ========== COMPLIANCE & AUDIT ==========

/**
 * Audit Log - Compliance trail for all StarPath operations
 */
export const starpathAuditLog = pgTable("starpath_audit_log", {
  id: text("id").primaryKey(),
  actorUserId: text("actor_user_id"), // Who performed action (null = system)
  action: text("action").notNull(), // 'eval_linked', 'manual_override', 'report_generated', 'consent_granted'
  subjectType: text("subject_type"), // 'evaluation', 'session', 'event', 'user'
  subjectId: text("subject_id"),
  detailsJson: jsonb("details_json").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  source: text("source"), // 'web', 'event_kiosk', 'batch_upload', 'api'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  actorIdx: index("idx_audit_log_actor").on(table.actorUserId),
  subjectIdx: index("idx_audit_log_subject").on(table.subjectType, table.subjectId),
  actionIdx: index("idx_audit_log_action").on(table.action),
  createdAtIdx: index("idx_audit_log_created_at").on(table.createdAt),
}));

/**
 * Consent Management - GDPR/COPPA compliance
 */
export const starpathConsent = pgTable("starpath_consent", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  kind: text("kind").notNull(), // 'terms', 'privacy', 'recording', 'marketing'
  granted: boolean("granted").notNull(),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
  version: text("version"), // Terms version accepted
  ipAddress: text("ip_address"),
  metadata: jsonb("metadata"),
}, (table) => ({
  uniqueConsent: unique("unique_user_kind_version").on(table.userId, table.kind, table.version),
  userIdx: index("idx_consent_user").on(table.userId),
  kindIdx: index("idx_consent_kind").on(table.kind),
}));

// ========== ENHANCED CONSTRAINTS & INDEXES ==========

/**
 * Add missing constraints to existing tables
 * (These would be in a migration, shown here for reference)
 */

// ALTER TABLE starpath_ncaa_evaluations ADD CONSTRAINT chk_division CHECK (division IN ('DI','DII','DIII'));
// ALTER TABLE starpath_ncaa_evaluations ADD CONSTRAINT chk_status CHECK (status IN ('ready','review','incomplete','error'));

// CREATE INDEX idx_student_profiles_user ON starpath_student_profiles(user_id);
// CREATE INDEX idx_ncaa_eval_student ON starpath_ncaa_evaluations(student_id);
// CREATE INDEX idx_gar_sessions_student ON starpath_gar_sessions(student_id);

// ========== TYPE EXPORTS ==========

export type StarpathOrg = typeof starpathOrgs.$inferSelect;
export type NewStarpathOrg = typeof starpathOrgs.$inferInsert;

export type StarpathMembership = typeof starpathMemberships.$inferSelect;
export type NewStarpathMembership = typeof starpathMemberships.$inferInsert;

export type StarpathLeadLink = typeof starpathLeadLinks.$inferSelect;
export type NewStarpathLeadLink = typeof starpathLeadLinks.$inferInsert;

export type StarpathGARMetric = typeof starpathGARMetrics.$inferSelect;
export type NewStarpathGARMetric = typeof starpathGARMetrics.$inferInsert;

export type StarpathEvent = typeof starpathEvents.$inferSelect;
export type NewStarpathEvent = typeof starpathEvents.$inferInsert;

export type StarpathEventRegistration = typeof starpathEventRegistrations.$inferSelect;
export type NewStarpathEventRegistration = typeof starpathEventRegistrations.$inferInsert;

export type StarpathAuditLog = typeof starpathAuditLog.$inferSelect;
export type NewStarpathAuditLog = typeof starpathAuditLog.$inferInsert;

export type StarpathConsent = typeof starpathConsent.$inferSelect;
export type NewStarpathConsent = typeof starpathConsent.$inferInsert;
