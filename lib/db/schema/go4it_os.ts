import { pgTable, text, timestamp, integer, serial, boolean } from 'drizzle-orm/pg-core';

// Additional Go4it OS tables (avoid duplicating existing ones in funnel.ts)

export const creditAudits = pgTable('credit_audits', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').notNull(),
  amountCents: integer('amount_cents').notNull().default(29900),
  currency: text('currency').notNull().default('usd'),
  status: text('status', { enum: ['created', 'succeeded', 'failed', 'refunded'] }).notNull().default('created'),
  stripePi: text('stripe_pi'),
  offerVariant: text('offer_variant'),
  tuitionCreditApplied: boolean('tuition_credit_applied').default(false).notNull(),
  creditAppliedAt: timestamp('credit_applied_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const households = pgTable('households', {
  id: serial('id').primaryKey(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const householdMembers = pgTable('household_members', {
  id: serial('id').primaryKey(),
  householdId: integer('household_id').notNull(),
  leadId: integer('lead_id').notNull(),
  role: text('role', { enum: ['guardian', 'athlete'] }).notNull().default('guardian'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const clubs = pgTable('clubs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const referrers = pgTable('referrers', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name'),
  contactEmail: text('contact_email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerId: integer('referrer_id').notNull(),
  leadId: integer('lead_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payouts = pgTable('payouts', {
  id: serial('id').primaryKey(),
  referrerId: integer('referrer_id').notNull(),
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').notNull().default('usd'),
  month: text('month').notNull(), // YYYY-MM
  status: text('status', { enum: ['pending', 'paid', 'failed'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pseoPages = pgTable('pseo_pages', {
  id: serial('id').primaryKey(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  sport: text('sport').notNull(),
  gradYear: integer('grad_year').notNull(),
  slug: text('slug').notNull(),
  visits: integer('visits').notNull().default(0),
  conversions: integer('conversions').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
