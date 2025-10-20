import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  goalId: z.string().uuid(),
  leadId: z.string().uuid(),
  status: z.enum(['active', 'completed', 'paused']).default('active'),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(['5-year', 'yearly', 'quarterly', 'monthly']),
  targetValue: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  parentGoalId: z.string().uuid().optional().nullable(),
});
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  allDay: z.boolean().default(false),
  type: z.enum(['meeting', 'combine', 'training', 'deadline']),
  location: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const createCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  taskId: z.string().uuid(),
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
