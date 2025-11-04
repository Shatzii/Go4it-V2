import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './schema';

// Alumni Profiles
export const alumniProfiles = pgTable('alumni_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id).unique(),
  
  // Basic Info
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  profileImage: text('profile_image'),
  
  // Athletic Background
  sports: jsonb('sports').$type<string[]>().default([]),
  graduationYear: integer('graduation_year'),
  highSchool: text('high_school'),
  
  // College/Pro Career
  collegeName: text('college_name'),
  collegeLevel: varchar('college_level', { length: 20 }), // 'D1', 'D2', 'D3', 'NAIA', 'JUCO'
  collegeSport: text('college_sport'),
  collegePosition: text('college_position'),
  collegeYears: varchar('college_years', { length: 50 }), // "2015-2019"
  
  // Professional Career
  isPro: boolean('is_pro').default(false),
  proTeam: text('pro_team'),
  proLeague: text('pro_league'),
  
  // Current Status
  currentOccupation: text('current_occupation'),
  currentEmployer: text('current_employer'),
  location: text('location'),
  
  // Achievements
  achievements: jsonb('achievements').$type<Array<{title: string, year: number, description: string}>>().default([]),
  honors: jsonb('honors').$type<string[]>().default([]),
  
  // Mentorship
  availableForMentorship: boolean('available_for_mentorship').default(false),
  mentorshipAreas: jsonb('mentorship_areas').$type<string[]>().default([]), // 'recruiting', 'training', 'academics', 'career'
  mentorshipCapacity: integer('mentorship_capacity').default(0), // Max mentees
  
  // Contact
  linkedIn: text('linked_in'),
  twitter: text('twitter'),
  instagram: text('instagram'),
  website: text('website'),
  
  // Privacy
  isPublic: boolean('is_public').default(true),
  showEmail: boolean('show_email').default(false),
  
  // Stats
  viewCount: integer('view_count').default(0),
  menteeCount: integer('mentee_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Coach Profiles
export const coachProfiles = pgTable('coach_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id).unique(),
  
  // Basic Info
  displayName: text('display_name').notNull(),
  title: text('title'), // "Head Coach", "Assistant Coach", "Skills Trainer"
  bio: text('bio'),
  profileImage: text('profile_image'),
  
  // Coaching Background
  sports: jsonb('sports').$type<string[]>().default([]),
  specializations: jsonb('specializations').$type<string[]>().default([]), // 'offense', 'defense', 'goalkeeper', etc.
  yearsExperience: integer('years_experience'),
  
  // Certifications
  certifications: jsonb('certifications').$type<Array<{name: string, issuer: string, year: number}>>().default([]),
  licenses: jsonb('licenses').$type<string[]>().default([]),
  
  // Current Position
  currentTeam: text('current_team'),
  currentLevel: varchar('current_level', { length: 50 }), // 'youth', 'high_school', 'club', 'college', 'pro'
  location: text('location'),
  
  // Coaching Philosophy
  philosophy: text('philosophy'),
  approach: jsonb('approach').$type<string[]>().default([]), // 'technical', 'tactical', 'mental', 'physical'
  
  // Achievements
  achievements: jsonb('achievements').$type<Array<{title: string, year: number, description: string}>>().default([]),
  championsips: integer('championships').default(0),
  
  // Availability
  acceptingClients: boolean('accepting_clients').default(true),
  offersMentorship: boolean('offers_mentorship').default(true),
  offersPrivateTraining: boolean('offers_private_training').default(false),
  
  // Rates (optional)
  hourlyRate: integer('hourly_rate'),
  sessionPackages: jsonb('session_packages').$type<Array<{sessions: number, price: number, description: string}>>().default([]),
  
  // Contact
  email: text('email'),
  phone: text('phone'),
  linkedIn: text('linked_in'),
  website: text('website'),
  
  // Verification
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  
  // Stats
  viewCount: integer('view_count').default(0),
  studentCount: integer('student_count').default(0),
  rating: integer('rating').default(0), // Average rating * 10 (e.g., 45 = 4.5 stars)
  reviewCount: integer('review_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mentorship Connections
export const mentorships = pgTable('mentorships', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorId: text('mentor_id').notNull().references(() => users.id),
  menteeId: text('mentee_id').notNull().references(() => users.id),
  
  // Connection Details
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'active', 'completed', 'cancelled'
  requestMessage: text('request_message'),
  
  // Focus Areas
  focusAreas: jsonb('focus_areas').$type<string[]>().default([]),
  goals: text('goals'),
  
  // Schedule
  meetingFrequency: varchar('meeting_frequency', { length: 50 }), // 'weekly', 'biweekly', 'monthly'
  preferredTime: text('preferred_time'),
  
  // Progress Tracking
  meetingsCompleted: integer('meetings_completed').default(0),
  lastMeetingDate: timestamp('last_meeting_date'),
  nextMeetingDate: timestamp('next_meeting_date'),
  
  // Notes
  mentorNotes: text('mentor_notes'),
  menteeNotes: text('mentee_notes'),
  
  // Milestones
  milestones: jsonb('milestones').$type<Array<{title: string, completed: boolean, date?: string}>>().default([]),
  
  // Feedback
  mentorRating: integer('mentor_rating'), // 1-5
  menteeFeedback: text('mentee_feedback'),
  
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Success Stories
export const successStories = pgTable('success_stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id),
  
  // Story Content
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(), // Rich text/markdown
  coverImage: text('cover_image'),
  
  // Story Details
  storyType: varchar('story_type', { length: 50 }).notNull(), // 'recruitment', 'college', 'pro', 'career', 'personal'
  sport: text('sport'),
  
  // Timeline
  journeyStart: integer('journey_start'), // Year
  journeyEnd: integer('journey_end'),
  
  // Key Stats
  stats: jsonb('stats').$type<Record<string, string>>().default({}), // Flexible key-value pairs
  
  // Media
  images: jsonb('images').$type<string[]>().default([]),
  videos: jsonb('videos').$type<string[]>().default([]),
  
  // Engagement
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  
  // Tags
  tags: jsonb('tags').$type<string[]>().default([]),
  
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Networking Events
export const networkingEvents = pgTable('networking_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizerId: text('organizer_id').notNull().references(() => users.id),
  
  // Event Details
  title: text('title').notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'meetup', 'workshop', 'panel', 'social', 'training_camp'
  
  // Location
  locationType: varchar('location_type', { length: 20 }).notNull(), // 'in_person', 'virtual', 'hybrid'
  venue: text('venue'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  virtualLink: text('virtual_link'),
  
  // Timing
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  timezone: text('timezone').default('America/New_York'),
  
  // Capacity
  maxAttendees: integer('max_attendees'),
  currentAttendees: integer('current_attendees').default(0),
  
  // Eligibility
  targetAudience: jsonb('target_audience').$type<string[]>().default([]), // 'alumni', 'current_athletes', 'coaches', 'parents'
  sports: jsonb('sports').$type<string[]>().default([]),
  
  // Registration
  requiresRegistration: boolean('requires_registration').default(true),
  registrationDeadline: timestamp('registration_deadline'),
  registrationFee: integer('registration_fee').default(0), // Cents
  
  // Content
  agenda: jsonb('agenda').$type<Array<{time: string, title: string, speaker?: string}>>().default([]),
  speakers: jsonb('speakers').$type<Array<{name: string, title: string, bio: string, image?: string}>>().default([]),
  
  // Media
  coverImage: text('cover_image'),
  images: jsonb('images').$type<string[]>().default([]),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('upcoming'), // 'upcoming', 'ongoing', 'completed', 'cancelled'
  
  // Engagement
  isPublic: boolean('is_public').default(true),
  isFeatured: boolean('is_featured').default(false),
  viewCount: integer('view_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Event Attendees
export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => networkingEvents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  
  // Registration
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  status: varchar('status', { length: 20 }).notNull().default('registered'), // 'registered', 'confirmed', 'attended', 'no_show', 'cancelled'
  
  // Check-in
  checkedIn: boolean('checked_in').default(false),
  checkInTime: timestamp('check_in_time'),
  
  // Payment (if applicable)
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending'), // 'pending', 'completed', 'refunded'
  paymentAmount: integer('payment_amount').default(0),
  
  // Additional Info
  dietaryRestrictions: text('dietary_restrictions'),
  specialRequests: text('special_requests'),
  
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages (Alumni/Coach messaging)
export const networkMessages = pgTable('network_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id),
  recipientId: text('recipient_id').notNull().references(() => users.id),
  
  // Thread
  threadId: text('thread_id').notNull(), // Format: smaller_userId_larger_userId
  
  // Content
  subject: text('subject'),
  message: text('message').notNull(),
  
  // Status
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  // Type
  messageType: varchar('message_type', { length: 20 }).default('direct'), // 'direct', 'mentorship', 'coaching'
  
  // Attachments
  attachments: jsonb('attachments').$type<Array<{name: string, url: string, type: string}>>().default([]),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reviews (for coaches)
export const coachReviews = pgTable('coach_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  coachId: text('coach_id').notNull().references(() => users.id),
  reviewerId: text('reviewer_id').notNull().references(() => users.id),
  
  // Review Content
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  review: text('review').notNull(),
  
  // Context
  relationship: varchar('relationship', { length: 50 }), // 'student', 'parent', 'fellow_coach'
  duration: text('duration'), // "6 months", "2 years"
  
  // Moderation
  isVerified: boolean('is_verified').default(false),
  isPublished: boolean('is_published').default(true),
  
  // Engagement
  helpfulCount: integer('helpful_count').default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
