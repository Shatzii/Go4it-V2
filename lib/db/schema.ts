import { pgTable, uuid, varchar, text, timestamp, boolean, numeric, date, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users (Synced from Clerk)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  profileImageUrl: text('profile_image_url'),
  role: varchar('role', { length: 50 }).notNull().default('staff'),
  location: varchar('location', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  locationIdx: index('users_location_idx').on(table.location),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));

// Goals (The Hierarchy)
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).notNull(), // '5-year', 'yearly', etc.
  targetValue: numeric('target_value'),
  currentValue: numeric('current_value').default('0'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  parentGoalId: uuid('parent_goal_id').references(() => goals.id, { onDelete: 'cascade' }),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Projects
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active'),
  goalId: uuid('goal_id').notNull().references(() => goals.id),
  leadId: uuid('lead_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),

  // Enhanced fields for upgrades
  type: varchar('type', { length: 100 }), // 'combine', 'recruiting', 'training', etc.
  location: varchar('location', { length: 100 }), // Dallas, Vienna, Mexico
  department: varchar('department', { length: 100 }), // Recruiting, Training, Admin
  budget: numeric('budget'), // For financial tracking
  startDate: date('start_date'),
  endDate: date('end_date'),
  priority: varchar('priority', { length: 20 }).default('medium'),
  progress: numeric('progress').default('0'), // 0-100 percentage
  tags: text('tags').array(), // For categorization
}, (table) => {
  return {
    goalIdx: index('goal_idx').on(table.goalId),
    leadIdx: index('lead_idx').on(table.leadId),
    statusIdx: index('project_status_idx').on(table.status),
    typeIdx: index('project_type_idx').on(table.type),
    locationIdx: index('project_location_idx').on(table.location),
    departmentIdx: index('project_department_idx').on(table.department),
  };
});

// Tasks
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('backlog'),
  priority: varchar('priority', { length: 20 }).default('medium'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),

  // Enhanced fields for upgrades
  estimatedHours: numeric('estimated_hours'), // For time tracking (#11)
  actualHours: numeric('actual_hours'), // For time tracking (#11)
  tags: text('tags').array(), // For filtering and categorization
  blockedBy: uuid('blocked_by').references(() => tasks.id), // For dependencies (#8)
  progress: numeric('progress').default('0'), // 0-100 percentage
  outcome: varchar('outcome', { length: 100 }), // For KPI tracking (#3)
  location: varchar('location', { length: 100 }), // For multi-location support
  department: varchar('department', { length: 100 }), // For team organization
}, (table) => {
  return {
    assignedToIdx: index('assigned_to_idx').on(table.assignedTo),
    statusIdx: index('status_idx').on(table.status),
    projectIdx: index('project_idx').on(table.projectId),
    priorityIdx: index('priority_idx').on(table.priority),
    dueDateIdx: index('due_date_idx').on(table.dueDate),
    locationIdx: index('location_idx').on(table.location),
    departmentIdx: index('department_idx').on(table.department),
  };
});

// Events
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  allDay: boolean('all_day').default(false),
  type: varchar('type', { length: 50 }).notNull(),
  location: varchar('location', { length: 255 }),
  projectId: uuid('project_id').references(() => projects.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Event Attendees (Junction Table)
export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('invited'),
}, (table) => {
  return {
    uniqueEventUser: uniqueIndex('unique_event_user').on(table.eventId, table.userId),
  };
});

// Comments
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Activity Log & Audit Trail (Upgrade #10)
export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // e.g., 'task.created', 'task.status.updated'
  entityType: varchar('entity_type', { length: 50 }).notNull(), // 'task', 'project', 'goal'
  entityId: uuid('entity_id').notNull(),
  oldValues: text('old_values'), // JSON string for simplicity
  newValues: text('new_values'), // JSON string for simplicity
  metadata: text('metadata'), // Additional context
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Task Dependencies (Upgrade #8)
export const taskDependencies = pgTable('task_dependencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull(),
  dependsOnTaskId: uuid('depends_on_task_id').notNull(),
  dependencyType: varchar('dependency_type', { length: 50 }).default('finish_to_start'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('task_dependencies_task_idx').on(table.taskId),
  index('task_dependencies_depends_on_idx').on(table.dependsOnTaskId),
]);

// Time Tracking (Upgrade #11)
export const timeEntries = pgTable('time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  taskId: uuid('task_id'),
  projectId: uuid('project_id'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  duration: numeric('duration'), // in minutes
  description: text('description'),
  isBillable: boolean('is_billable').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('time_entries_user_idx').on(table.userId),
  index('time_entries_task_idx').on(table.taskId),
  index('time_entries_project_idx').on(table.projectId),
]);

// Custom Views & Filters (Upgrade #15)
export const savedViews = pgTable('saved_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  viewType: varchar('view_type', { length: 50 }).notNull(), // 'tasks', 'projects', 'dashboard'
  filters: text('filters').notNull(), // JSON string for filter criteria
  sortBy: varchar('sort_by', { length: 100 }),
  sortOrder: varchar('sort_order', { length: 10 }).default('desc'),
  isDefault: boolean('is_default').default(false),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Workflow Templates (Upgrade #13)
export const workflowTemplates = pgTable('workflow_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  triggerType: varchar('trigger_type', { length: 100 }).notNull(),
  triggerConditions: text('trigger_conditions'), // JSON string
  actions: text('actions').notNull(), // JSON string array of actions
  isActive: boolean('is_active').default(true),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Notifications (Upgrade #4)
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // 'email', 'sms', 'in_app', 'slack'
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  priority: varchar('priority', { length: 20 }).default('normal'), // 'low', 'normal', 'high', 'urgent'
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  actionUrl: varchar('action_url', { length: 500 }),
  metadata: text('metadata'), // JSON string for additional data
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('notifications_user_idx').on(table.userId),
  index('notifications_unread_idx').on(table.userId, table.isRead),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdGoals: many(goals),
  createdProjects: many(projects),
  createdTasks: many(tasks),
  assignedTasks: many(tasks),
  createdEvents: many(events),
  eventAttendances: many(eventAttendees),
  comments: many(comments),
  activityLogs: many(activityLog),
  timeEntries: many(timeEntries),
  savedViews: many(savedViews),
  workflowTemplates: many(workflowTemplates),
  notifications: many(notifications),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  creator: one(users, {
    fields: [goals.createdBy],
    references: [users.id],
  }),
  parentGoal: one(goals, {
    fields: [goals.parentGoalId],
    references: [goals.id],
  }),
  childGoals: many(goals),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  goal: one(goals, {
    fields: [projects.goalId],
    references: [goals.id],
  }),
  lead: one(users, {
    fields: [projects.leadId],
    references: [users.id],
  }),
  tasks: many(tasks),
  events: many(events),
  timeEntries: many(timeEntries),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
  comments: many(comments),
  dependencies: many(taskDependencies),
  timeEntries: many(timeEntries),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  project: one(projects, {
    fields: [events.projectId],
    references: [events.id],
  }),
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}));

export const taskDependenciesRelations = relations(taskDependencies, ({ one }) => ({
  task: one(tasks, {
    fields: [taskDependencies.taskId],
    references: [tasks.id],
  }),
  dependsOnTask: one(tasks, {
    fields: [taskDependencies.dependsOnTaskId],
    references: [tasks.id],
  }),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
}));

export const savedViewsRelations = relations(savedViews, ({ one }) => ({
  user: one(users, {
    fields: [savedViews.userId],
    references: [users.id],
  }),
}));

export const workflowTemplatesRelations = relations(workflowTemplates, ({ one }) => ({
  creator: one(users, {
    fields: [workflowTemplates.createdBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// NCAA Schools for Recruiting
export const ncaaSchools = pgTable('ncaa_schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolName: varchar('school_name', { length: 255 }).notNull(),
  division: varchar('division', { length: 50 }).notNull(),
  conference: varchar('conference', { length: 255 }),
  state: varchar('state', { length: 2 }),
  city: varchar('city', { length: 100 }),
  website: text('website'),
  coachingStaff: text('coaching_staff'),
  programs: text('programs'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Recruiting Contacts (CRM)
export const recruitingContacts = pgTable('recruiting_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  schoolId: uuid('school_id').references(() => ncaaSchools.id),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  sport: varchar('sport', { length: 100 }),
  notes: text('notes'),
  interestLevel: varchar('interest_level', { length: 50 }),
  lastContactDate: timestamp('last_contact_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Recruiting Communications Log
export const recruitingCommunications = pgTable('recruiting_communications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  contactId: uuid('contact_id').references(() => recruitingContacts.id),
  type: varchar('type', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  content: text('content'),
  direction: varchar('direction', { length: 20 }).notNull(),
  communicationDate: timestamp('communication_date', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Recruiting Offers and Interest
export const recruitingOffers = pgTable('recruiting_offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  schoolId: uuid('school_id').notNull().references(() => ncaaSchools.id),
  contactId: uuid('contact_id').references(() => recruitingContacts.id),
  status: varchar('status', { length: 50 }).notNull().default('interested'),
  offerType: varchar('offer_type', { length: 100 }),
  scholarshipAmount: numeric('scholarship_amount'),
  scholarshipType: varchar('scholarship_type', { length: 100 }),
  notes: text('notes'),
  visitDate: timestamp('visit_date', { withTimezone: true }),
  offerDate: timestamp('offer_date', { withTimezone: true }),
  commitmentDate: timestamp('commitment_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Recruiting Timeline Events
export const recruitingTimeline = pgTable('recruiting_timeline', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  schoolId: uuid('school_id').references(() => ncaaSchools.id),
  contactId: uuid('contact_id').references(() => recruitingContacts.id),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
  location: varchar('location', { length: 255 }),
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Recruiting Documents
export const recruitingDocuments = pgTable('recruiting_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  documentType: varchar('document_type', { length: 100 }).notNull(),
  fileName: varchar('file_name', { length: 500 }).notNull(),
  filePath: text('file_path').notNull(),
  fileSize: numeric('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
});

// AI Tutor Sessions
export const aiTutorSessions = pgTable('ai_tutor_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: varchar('session_id', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  tutorId: varchar('tutor_id', { length: 100 }).notNull(), // newton, curie, shakespeare, timeline
  subject: varchar('subject', { length: 100 }).notNull(),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'), // easy, medium, hard
  totalMessages: numeric('total_messages').default('0'),
  totalTime: numeric('total_time').default('0'), // in minutes
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  lastActivity: timestamp('last_activity', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ({
  userIdx: index('ai_tutor_sessions_user_idx').on(table.userId),
  tutorIdx: index('ai_tutor_sessions_tutor_idx').on(table.tutorId),
  sessionIdx: index('ai_tutor_sessions_session_idx').on(table.sessionId),
}));

// AI Tutor Conversations
export const aiTutorConversations = pgTable('ai_tutor_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  tutorId: varchar('tutor_id', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 100 }).notNull(),
  userMessage: text('user_message').notNull(),
  aiResponse: text('ai_response').notNull(),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  followUpQuestions: text('follow_up_questions'), // JSON array
  attachments: text('attachments'), // JSON array for images/diagrams
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  sessionIdx: index('ai_tutor_conversations_session_idx').on(table.sessionId),
  userIdx: index('ai_tutor_conversations_user_idx').on(table.userId),
  createdAtIdx: index('ai_tutor_conversations_created_at_idx').on(table.createdAt),
}));

// AI Tutor Progress
export const aiTutorProgress = pgTable('ai_tutor_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 100 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  masteryLevel: numeric('mastery_level').default('0'), // 0-100
  attemptsCount: numeric('attempts_count').default('0'),
  correctCount: numeric('correct_count').default('0'),
  averageTimePerQuestion: numeric('average_time_per_question').default('0'), // in seconds
  lastPracticed: timestamp('last_practiced', { withTimezone: true }).notNull().defaultNow(),
  strengths: text('strengths'), // JSON array
  weaknesses: text('weaknesses'), // JSON array
  recommendations: text('recommendations'), // JSON array
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userSubjectIdx: index('ai_tutor_progress_user_subject_idx').on(table.userId, table.subject),
  lastPracticedIdx: index('ai_tutor_progress_last_practiced_idx').on(table.lastPracticed),
}));

