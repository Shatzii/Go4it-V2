// Re-export everything from shared/schema.ts to maintain compatibility
// All schema definitions are consolidated in shared/schema.ts
export * from '../../shared/schema';

// Explicit exports for deployment compatibility
export {
	aiTutorConversations,
	aiTutorSessions,
	aiTutorProgress,
	tasks,
	taskDependencies,
	timeEntries,
	activityLog
} from '../../shared/schema';