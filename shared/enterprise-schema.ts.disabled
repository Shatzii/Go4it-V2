import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  serial,
  decimal,
} from 'drizzle-orm/pg-core';

// Enterprise Audit Events Table
export const auditEvents = pgTable(
  'audit_events',
  {
    id: text('id').primaryKey(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
    userId: text('user_id').notNull(),
    action: text('action').notNull(),
    resource: text('resource').notNull(),
    details: jsonb('details'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    sessionId: text('session_id'),
    location: jsonb('location'),
    riskScore: integer('risk_score'),
    complianceFlags: text('compliance_flags').array(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_audit_events_timestamp').on(table.timestamp),
    index('idx_audit_events_user_id').on(table.userId),
    index('idx_audit_events_action').on(table.action),
    index('idx_audit_events_resource').on(table.resource),
    index('idx_audit_events_risk_score').on(table.riskScore),
    index('idx_audit_events_compliance_flags').on(table.complianceFlags),
    index('idx_audit_events_user_action').on(table.userId, table.action),
    index('idx_audit_events_resource_timestamp').on(table.resource, table.timestamp),
  ]
);

// Enterprise Metrics Table
export const metrics = pgTable(
  'metrics',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    value: decimal('value', { precision: 10, scale: 2 }).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
    tags: jsonb('tags'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_metrics_name').on(table.name),
    index('idx_metrics_timestamp').on(table.timestamp),
    index('idx_metrics_name_timestamp').on(table.name, table.timestamp),
  ]
);

// Enterprise Cache Entries Table
export const cacheEntries = pgTable(
  'cache_entries',
  {
    id: serial('id').primaryKey(),
    key: text('key').unique().notNull(),
    value: text('value'),
    ttl: integer('ttl'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    metadata: jsonb('metadata'),
    lastAccessed: timestamp('last_accessed', { withTimezone: true }),
    accessCount: integer('access_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_cache_entries_key').on(table.key),
    index('idx_cache_entries_expires_at').on(table.expiresAt),
    index('idx_cache_entries_last_accessed').on(table.lastAccessed),
    index('idx_cache_entries_active').on(table.key).where(sql`${table.expiresAt} > NOW()`),
  ]
);

// Enterprise Rate Limits Table
export const rateLimits = pgTable(
  'rate_limits',
  {
    id: serial('id').primaryKey(),
    key: text('key').unique().notNull(),
    requests: integer('requests').notNull().default(0),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    windowEnd: timestamp('window_end', { withTimezone: true }).notNull(),
    blocked: boolean('blocked').notNull().default(false),
    blockExpiry: timestamp('block_expiry', { withTimezone: true }),
    lastRequest: timestamp('last_request', { withTimezone: true }).notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_rate_limits_key').on(table.key),
    index('idx_rate_limits_window_end').on(table.windowEnd),
    index('idx_rate_limits_blocked').on(table.blocked),
    index('idx_rate_limits_active').on(table.key).where(sql`${table.windowEnd} > NOW()`),
  ]
);

// Social Media Metrics Table
export const socialMediaMetrics = pgTable(
  'social_media_metrics',
  {
    id: serial('id').primaryKey(),
    metrics: jsonb('metrics').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_social_media_metrics_created_at').on(table.createdAt),
  ]
);

// Generated Content Table
export const generatedContent = pgTable(
  'generated_content',
  {
    id: serial('id').primaryKey(),
    athleteId: text('athlete_id').notNull(),
    platform: text('platform').notNull(),
    content: text('content').notNull(),
    mediaUrls: text('media_urls').array(),
    hashtags: text('hashtags').array(),
    scheduledTime: timestamp('scheduled_time', { withTimezone: true }),
    contentType: text('content_type').notNull(),
    priority: text('priority').notNull().default('medium'),
    auditId: text('audit_id'),
    status: text('status').notNull().default('generated'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_generated_content_athlete_id').on(table.athleteId),
    index('idx_generated_content_platform').on(table.platform),
    index('idx_generated_content_status').on(table.status),
    index('idx_generated_content_scheduled_time').on(table.scheduledTime),
    index('idx_generated_content_audit_id').on(table.auditId),
    index('idx_generated_content_athlete_platform').on(table.athleteId, table.platform),
  ]
);

// Social Media Posts Table
export const socialMediaPosts = pgTable(
  'social_media_posts',
  {
    id: serial('id').primaryKey(),
    athleteId: text('athlete_id').notNull(),
    platform: text('platform').notNull(),
    postId: text('post_id'),
    url: text('url'),
    content: text('content'),
    mediaUrls: text('media_urls').array(),
    hashtags: text('hashtags').array(),
    engagement: jsonb('engagement'),
    status: text('status').notNull().default('posted'),
    errorMessage: text('error_message'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_social_media_posts_athlete_id').on(table.athleteId),
    index('idx_social_media_posts_platform').on(table.platform),
    index('idx_social_media_posts_status').on(table.status),
    index('idx_social_media_posts_posted_at').on(table.postedAt),
    index('idx_social_media_posts_athlete_platform').on(table.athleteId, table.platform),
  ]
);

// Athlete Profiles Table (for social media engine)
export const athleteProfiles = pgTable(
  'athlete_profiles',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    sport: text('sport').notNull(),
    position: text('position').notNull(),
    school: text('school').notNull(),
    stats: jsonb('stats'),
    rankings: jsonb('rankings'),
    socialMedia: jsonb('social_media'),
    achievements: text('achievements').array(),
    highlightVideo: text('highlight_video'),
    qualityScore: integer('quality_score'),
    graduationYear: integer('graduation_year'),
    location: text('location'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_athlete_profiles_sport').on(table.sport),
    index('idx_athlete_profiles_school').on(table.school),
    index('idx_athlete_profiles_quality_score').on(table.qualityScore),
    index('idx_athlete_profiles_graduation_year').on(table.graduationYear),
  ]
);

// Export types
export type AuditEvent = typeof auditEvents.$inferSelect;
export type InsertAuditEvent = typeof auditEvents.$inferInsert;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;

export type CacheEntry = typeof cacheEntries.$inferSelect;
export type InsertCacheEntry = typeof cacheEntries.$inferInsert;

export type RateLimit = typeof rateLimits.$inferSelect;
export type InsertRateLimit = typeof rateLimits.$inferInsert;

export type SocialMediaMetric = typeof socialMediaMetrics.$inferSelect;
export type InsertSocialMediaMetric = typeof socialMediaMetrics.$inferInsert;

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = typeof generatedContent.$inferInsert;

export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;
export type InsertSocialMediaPost = typeof socialMediaPosts.$inferInsert;

export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = typeof athleteProfiles.$inferInsert;
