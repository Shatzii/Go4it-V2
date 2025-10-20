import { z } from 'zod';

const booleanString = z.enum(['true', 'false']).optional();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Auth (Clerk) – optional for local, required for prod if auth is enabled
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),

  // Stripe – optional unless payments are enabled
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Observability (optional)
  SENTRY_DSN: z.string().optional(),

  // Feature flags
  ENABLE_METRICS: booleanString,
  ENABLE_AUDIT_LOGGING: booleanString,
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Environment validation failed:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
