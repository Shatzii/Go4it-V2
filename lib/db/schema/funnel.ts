/**
 * Funnel schema for Parent Night automation
 * SQLite dev / Postgres prod compatible
 */

import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Event types for our funnel
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  kind: text("kind", { 
    enum: ["parent_night_info", "parent_night_decision", "onboarding"] 
  }).notNull(),
  region: text("region", { enum: ["eu", "us"] }).notNull(),
  tz: text("tz").notNull(), // IANA timezone (Europe/Vienna, America/Chicago)
  startIso: text("start_iso").notNull(), // ISO 8601 datetime
  endIso: text("end_iso").notNull(),
  joinUrl: text("join_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lead capture and progression tracking
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  role: text("role", { 
    enum: ["parent", "athlete", "coach"] 
  }).notNull().default("parent"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"), // City, State/Country
  sport: text("sport"),
  gradYear: integer("grad_year"),
  stage: text("stage").notNull().default("site_visit"), 
  // Stages: site_visit → rsvp_tuesday → attended_tuesday → rsvp_thursday → 
  //         attended_thursday → audit_booked → applied → enrolled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// RSVP tracking for events
export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  status: text("status", { 
    enum: ["registered", "attended", "no_show"] 
  }).notNull().default("registered"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Marketing content scheduling
export const marketingItems = pgTable("marketing_items", {
  id: serial("id").primaryKey(),
  weekOf: text("week_of").notNull(), // ISO week start date (YYYY-MM-DD)
  channel: text("channel", { 
    enum: ["site", "ig", "li", "x", "tiktok", "email", "sms"] 
  }).notNull(),
  slot: text("slot", { 
    enum: ["hero_banner", "events_card", "post", "email", "sms"] 
  }).notNull(),
  publishAt: text("publish_at").notNull(), // ISO 8601 datetime
  title: text("title"),
  copy: text("copy"),
  html: text("html"),
  plainText: text("plain_text"),
  alt: text("alt"), // For images/social posts
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  status: text("status").notNull().default("scheduled"), // scheduled → published → archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const leadsRelations = relations(leads, ({ many }) => ({
  rsvps: many(rsvps),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  rsvps: many(rsvps),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  lead: one(leads, {
    fields: [rsvps.leadId],
    references: [leads.id],
  }),
  event: one(events, {
    fields: [rsvps.eventId],
    references: [events.id],
  }),
}));
