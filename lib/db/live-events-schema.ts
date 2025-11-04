import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './schema';

// Live Events (Parent Nights, Info Sessions, etc.)
export const liveEvents = pgTable('live_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'parent_night', 'info_session', 'workshop', 'coaching_session'
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  
  // Host information
  hostId: text('host_id').notNull().references(() => users.id),
  coHosts: jsonb('co_hosts').$type<string[]>().default([]),
  
  // Meeting details
  meetingLink: text('meeting_link'),
  roomId: text('room_id').notNull(), // WebRTC room identifier
  streamKey: text('stream_key'), // For streaming
  recordingUrl: text('recording_url'),
  
  // Capacity and registration
  maxAttendees: integer('max_attendees').default(100),
  requiresRegistration: boolean('requires_registration').default(true),
  isPublic: boolean('is_public').default(true),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('scheduled'), // 'scheduled', 'live', 'ended', 'cancelled'
  
  // Settings
  allowChat: boolean('allow_chat').default(true),
  allowQA: boolean('allow_qa').default(true),
  allowScreenShare: boolean('allow_screen_share').default(true),
  recordSession: boolean('record_session').default(false),
  
  // Metadata
  tags: jsonb('tags').$type<string[]>().default([]),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Event Registrations
export const eventRegistrations = pgTable('event_registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => liveEvents.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  // Registration details
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  
  // Parent/Guardian specific
  relationship: varchar('relationship', { length: 50 }), // 'parent', 'guardian', 'coach', 'student'
  athleteName: text('athlete_name'), // If registering for a student athlete
  athleteAge: integer('athlete_age'),
  athleteSport: text('athlete_sport'),
  
  // Registration status
  status: varchar('status', { length: 20 }).notNull().default('registered'), // 'registered', 'confirmed', 'attended', 'no_show', 'cancelled'
  attended: boolean('attended').default(false),
  joinedAt: timestamp('joined_at'),
  leftAt: timestamp('left_at'),
  
  // Communication
  emailSent: boolean('email_sent').default(false),
  reminderSent: boolean('reminder_sent').default(false),
  
  // Questionnaire responses
  questions: jsonb('questions').$type<Record<string, any>>().default({}),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Real-time connections (WebRTC peers)
export const activeConnections = pgTable('active_connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: text('room_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  peerId: text('peer_id').notNull(),
  
  // Connection details
  role: varchar('role', { length: 20 }).notNull(), // 'host', 'co_host', 'participant', 'viewer'
  connectionType: varchar('connection_type', { length: 20 }).notNull(), // 'video', 'audio', 'screen_share'
  
  // Permissions
  canSpeak: boolean('can_speak').default(true),
  canVideo: boolean('can_video').default(true),
  canScreenShare: boolean('can_screen_share').default(false),
  
  // Status
  isActive: boolean('is_active').default(true),
  quality: varchar('quality', { length: 20 }), // 'high', 'medium', 'low'
  
  connectedAt: timestamp('connected_at').defaultNow().notNull(),
  disconnectedAt: timestamp('disconnected_at'),
});

// Chat messages during live events
export const eventChatMessages = pgTable('event_chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => liveEvents.id, { onDelete: 'cascade' }),
  roomId: text('room_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  
  message: text('message').notNull(),
  messageType: varchar('message_type', { length: 20 }).default('text'), // 'text', 'emoji', 'system', 'announcement'
  
  // Moderation
  isDeleted: boolean('is_deleted').default(false),
  isPinned: boolean('is_pinned').default(false),
  
  // Replies
  replyTo: uuid('reply_to').references((): any => eventChatMessages.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Q&A during live events
export const eventQuestions = pgTable('event_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => liveEvents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  
  question: text('question').notNull(),
  answer: text('answer'),
  answeredBy: text('answered_by').references(() => users.id),
  answeredAt: timestamp('answered_at'),
  
  // Engagement
  upvotes: integer('upvotes').default(0),
  isAnswered: boolean('is_answered').default(false),
  isHighlighted: boolean('is_highlighted').default(false),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Teacher-Student connections
export const teacherStudentConnections = pgTable('teacher_student_connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherId: text('teacher_id').notNull().references(() => users.id),
  studentId: text('student_id').notNull().references(() => users.id),
  
  // Connection details
  status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'inactive', 'pending', 'blocked'
  connectionType: varchar('connection_type', { length: 50 }).notNull(), // 'coach', 'mentor', 'advisor', 'instructor'
  
  // Permissions
  canScheduleMeetings: boolean('can_schedule_meetings').default(true),
  canViewProgress: boolean('can_view_progress').default(true),
  canShareFiles: boolean('can_share_files').default(true),
  
  // Metadata
  notes: text('notes'),
  tags: jsonb('tags').$type<string[]>().default([]),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Scheduled coaching sessions
export const coachingSessions = pgTable('coaching_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherId: text('teacher_id').notNull().references(() => users.id),
  studentId: text('student_id').notNull().references(() => users.id),
  
  // Session details
  title: text('title').notNull(),
  description: text('description'),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'one_on_one', 'group', 'video_review', 'skills_training'
  
  // Timing
  scheduledStart: timestamp('scheduled_start').notNull(),
  scheduledEnd: timestamp('scheduled_end').notNull(),
  actualStart: timestamp('actual_start'),
  actualEnd: timestamp('actual_end'),
  
  // Meeting
  roomId: text('room_id'),
  meetingLink: text('meeting_link'),
  recordingUrl: text('recording_url'),
  
  // Status
  status: varchar('status', { length: 20 }).notNull().default('scheduled'), // 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'
  
  // Session notes
  agendaItems: jsonb('agenda_items').$type<string[]>().default([]),
  completedItems: jsonb('completed_items').$type<string[]>().default([]),
  teacherNotes: text('teacher_notes'),
  studentNotes: text('student_notes'),
  
  // Follow-up
  actionItems: jsonb('action_items').$type<Array<{task: string, dueDate: string, completed: boolean}>>().default([]),
  nextSessionDate: timestamp('next_session_date'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
