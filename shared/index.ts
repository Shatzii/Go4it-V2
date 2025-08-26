// Centralized shared exports - re-export stable symbols to avoid duplicate type names
export * from './schema';
export { teamRosters } from './enhanced-schema';

// Re-export enrollments from sports-school comprehensive schema so top-level imports work
export { enrollments } from '../sports-school/shared/comprehensive-schema';
