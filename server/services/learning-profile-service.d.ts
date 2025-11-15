// Lightweight declaration file to satisfy callers during incremental typing
export type LearningStyleAssessment = any;
export type NeurotypeAssessment = any;
export type LearningStyle = any;
export type Neurotype = any;
export type AdaptationLevel = any;
export type AdaptationCategory = any;
export type LearningProfile = any;
export type InsertLearningProfile = any;
export type AssessmentResult = any;
export type InsertAssessmentResult = any;

export const NeurodivergentType: any;
export const AssessmentType: any;

export function getContentAdaptationRecommendations(userId: number, contentType: string, subject: string): Promise<any>;
export function getLearningProfile(userId: number): Promise<LearningProfile | null>;
export function createLearningProfile(profile: InsertLearningProfile): Promise<boolean>;
export function updateLearningProfile(userId: number, profileData: Partial<InsertLearningProfile>): Promise<boolean>;
export function saveAssessmentResult(assessment: InsertAssessmentResult): Promise<any>;
export function hasCompletedAssessments(userId: number): Promise<boolean>;
export function generateProfileFromAssessments(userId: number): Promise<boolean>;
