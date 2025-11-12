// Re-export from shared/schema.ts to maintain compatibility
// Funnel-related tables are now in shared/schema.ts
export * from '../../../shared/schema';

// Explicit exports for production build compatibility
export { prospects } from '../../../shared/schema';

// Temporary placeholder exports for missing tables to fix deployment
// These are minimal definitions to satisfy import requirements
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  email: varchar('email'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const marketingItems = pgTable('marketing_items', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const parentNightEvents = pgTable('parent_night_events', {
  id: serial('id').primaryKey(),
  eventName: varchar('event_name'),
  eventDate: timestamp('event_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  eventId: serial('event_id'),
  email: varchar('email'),
  createdAt: timestamp('created_at').defaultNow(),
});