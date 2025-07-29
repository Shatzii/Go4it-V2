import { pgTable, text, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  discountType: text('discount_type').notNull(), // 'percentage' | 'fixed' | 'free'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until'),
  applicablePlans: text('applicable_plans').array(), // Array of plan IDs
  minimumAmount: decimal('minimum_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const couponUsage = pgTable('coupon_usage', {
  id: text('id').primaryKey(),
  couponId: text('coupon_id').notNull().references(() => coupons.id),
  userId: text('user_id').notNull(),
  usedAt: timestamp('used_at').defaultNow().notNull(),
  orderAmount: decimal('order_amount', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  stripeCouponId: text('stripe_coupon_id'), // Stripe coupon ID for tracking
});

// Zod schemas
export const insertCouponSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  discountType: z.string(),
  discountValue: z.string(),
  maxUses: z.number().optional(),
  isActive: z.boolean().default(true),
  validFrom: z.date(),
  validUntil: z.date().optional(),
  applicablePlans: z.array(z.string()).optional(),
  minimumAmount: z.string().optional(),
});

export const insertCouponUsageSchema = z.object({
  couponId: z.string(),
  userId: z.string(),
  orderAmount: z.string(),
  discountAmount: z.string(),
  stripeCouponId: z.string().optional(),
});

// Types
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type CouponUsage = typeof couponUsage.$inferSelect;
export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;

// Predefined coupon codes
export const PREDEFINED_COUPONS: InsertCoupon[] = [
  {
    code: 'FREEMONTH',
    name: 'Free Month Access',
    description: 'Get one month completely free on any plan',
    discountType: 'free',
    discountValue: '100',
    maxUses: 1000,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    applicablePlans: ['starter', 'pro', 'elite'],
    minimumAmount: '0',
  },
  {
    code: 'SAVE20',
    name: '20% Off Discount',
    description: 'Save 20% on your subscription',
    discountType: 'percentage',
    discountValue: '20',
    maxUses: 500,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    applicablePlans: ['starter', 'pro', 'elite'],
    minimumAmount: '10',
  },
  {
    code: 'HALFOFF',
    name: '50% Off Special',
    description: 'Limited time 50% discount',
    discountType: 'percentage',
    discountValue: '50',
    maxUses: 200,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    applicablePlans: ['starter', 'pro', 'elite'],
    minimumAmount: '15',
  },
  {
    code: 'SUPERSTAR75',
    name: '75% Off Elite Deal',
    description: 'Massive 75% savings for serious athletes',
    discountType: 'percentage',
    discountValue: '75',
    maxUses: 50,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
    applicablePlans: ['pro', 'elite'],
    minimumAmount: '25',
  },
];