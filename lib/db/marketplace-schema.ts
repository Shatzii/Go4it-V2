import { pgTable, text, integer, decimal, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Marketplace Courses (for sale)
export const marketplaceCourses = pgTable('marketplace_courses', {
  id: text('id').primaryKey(),
  instructorId: text('instructor_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'academic', 'athletic', 'recruiting', 'wellness'
  level: text('level').notNull(), // 'beginner', 'intermediate', 'advanced'
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  thumbnailUrl: text('thumbnail_url'),
  previewVideoUrl: text('preview_video_url'),
  duration: integer('duration').notNull(), // total minutes
  lessonCount: integer('lesson_count').notNull(),
  enrollmentCount: integer('enrollment_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').default(0),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  tags: text('tags').array(),
  learningOutcomes: text('learning_outcomes').array(),
  requirements: text('requirements').array(),
  targetAudience: text('target_audience'),
  language: text('language').default('en'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  publishedAt: timestamp('published_at'),
}, (table) => ({
  instructorIdx: index('marketplace_courses_instructor_idx').on(table.instructorId),
  categoryIdx: index('marketplace_courses_category_idx').on(table.category),
  publishedIdx: index('marketplace_courses_published_idx').on(table.isPublished),
}));

// Course Purchases/Enrollments
export const coursePurchases = pgTable('course_purchases', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => marketplaceCourses.id),
  userId: text('user_id').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  status: text('status').notNull(), // 'pending', 'completed', 'refunded', 'failed'
  accessGranted: boolean('access_granted').default(false),
  accessExpiresAt: timestamp('access_expires_at'), // for subscription-based access
  refundedAt: timestamp('refunded_at'),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  purchasedAt: timestamp('purchased_at').defaultNow(),
  metadata: jsonb('metadata'), // additional purchase info
}, (table) => ({
  userIdx: index('course_purchases_user_idx').on(table.userId),
  courseIdx: index('course_purchases_course_idx').on(table.courseId),
  statusIdx: index('course_purchases_status_idx').on(table.status),
}));

// Course Reviews
export const courseReviews = pgTable('course_reviews', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => marketplaceCourses.id),
  userId: text('user_id').notNull(),
  purchaseId: text('purchase_id').references(() => coursePurchases.id),
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  comment: text('comment'),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false),
  helpfulCount: integer('helpful_count').default(0),
  reportCount: integer('report_count').default(0),
  isHidden: boolean('is_hidden').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  courseIdx: index('course_reviews_course_idx').on(table.courseId),
  userIdx: index('course_reviews_user_idx').on(table.userId),
}));

// Instructor Profiles
export const instructorProfiles = pgTable('instructor_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  expertise: text('expertise').array(),
  certifications: text('certifications').array(),
  avatarUrl: text('avatar_url'),
  websiteUrl: text('website_url'),
  socialLinks: jsonb('social_links'),
  totalStudents: integer('total_students').default(0),
  totalCourses: integer('total_courses').default(0),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0'),
  stripeAccountId: text('stripe_account_id'), // Stripe Connect account
  stripeOnboardingCompleted: boolean('stripe_onboarding_completed').default(false),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('instructor_profiles_user_idx').on(table.userId),
}));

// Instructor Payouts
export const instructorPayouts = pgTable('instructor_payouts', {
  id: text('id').primaryKey(),
  instructorId: text('instructor_id').notNull().references(() => instructorProfiles.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  status: text('status').notNull(), // 'pending', 'processing', 'paid', 'failed'
  stripeTransferId: text('stripe_transfer_id'),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  purchaseCount: integer('purchase_count').notNull(),
  grossRevenue: decimal('gross_revenue', { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(),
  netRevenue: decimal('net_revenue', { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  instructorIdx: index('instructor_payouts_instructor_idx').on(table.instructorId),
  statusIdx: index('instructor_payouts_status_idx').on(table.status),
}));

// Course Progress Tracking
export const courseProgress = pgTable('course_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  courseId: text('course_id').notNull().references(() => marketplaceCourses.id),
  purchaseId: text('purchase_id').references(() => coursePurchases.id),
  completedLessons: integer('completed_lessons').default(0),
  totalLessons: integer('total_lessons').notNull(),
  progressPercentage: integer('progress_percentage').default(0),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  certificateIssued: boolean('certificate_issued').default(false),
  certificateUrl: text('certificate_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userCourseIdx: index('course_progress_user_course_idx').on(table.userId, table.courseId),
}));

// Course Certificates
export const courseCertificates = pgTable('course_certificates', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  courseId: text('course_id').notNull().references(() => marketplaceCourses.id),
  progressId: text('progress_id').references(() => courseProgress.id),
  certificateNumber: text('certificate_number').notNull().unique(),
  studentName: text('student_name').notNull(),
  courseName: text('course_name').notNull(),
  instructorName: text('instructor_name').notNull(),
  completionDate: timestamp('completion_date').notNull(),
  certificateUrl: text('certificate_url'),
  verified: boolean('verified').default(true),
  issuedAt: timestamp('issued_at').defaultNow(),
}, (table) => ({
  userIdx: index('course_certificates_user_idx').on(table.userId),
  numberIdx: index('course_certificates_number_idx').on(table.certificateNumber),
}));

// Course Wishlist
export const courseWishlist = pgTable('course_wishlist', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  courseId: text('course_id').notNull().references(() => marketplaceCourses.id),
  addedAt: timestamp('added_at').defaultNow(),
}, (table) => ({
  userCourseIdx: index('course_wishlist_user_course_idx').on(table.userId, table.courseId),
}));

// Relations
export const marketplaceCoursesRelations = relations(marketplaceCourses, ({ one, many }) => ({
  instructor: one(instructorProfiles, {
    fields: [marketplaceCourses.instructorId],
    references: [instructorProfiles.id],
  }),
  purchases: many(coursePurchases),
  reviews: many(courseReviews),
  progress: many(courseProgress),
  wishlist: many(courseWishlist),
}));

export const coursePurchasesRelations = relations(coursePurchases, ({ one, many }) => ({
  course: one(marketplaceCourses, {
    fields: [coursePurchases.courseId],
    references: [marketplaceCourses.id],
  }),
  reviews: many(courseReviews),
  progress: one(courseProgress),
}));

export const instructorProfilesRelations = relations(instructorProfiles, ({ many }) => ({
  courses: many(marketplaceCourses),
  payouts: many(instructorPayouts),
}));
