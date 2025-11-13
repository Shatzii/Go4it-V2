// Re-export schema definitions from the consolidated shared schema modules.
// This file aggregates multiple shared schema sources so consumers can import
// from `@/lib/db/schema` for compatibility with existing code paths.
export * from '../../shared/schema';
export * from '../../shared/academy-schema';
export * from '../../shared/comprehensive-schema';

// NOTE: avoid double-exporting the same symbols; we only re-export the
// consolidated shared schemas above. Legacy explicit re-exports were
// removed to prevent duplicate-export errors during Turbopack builds.