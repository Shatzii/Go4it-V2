export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoAnalysis {
    id: string;
    userId: string;
    videoUrl: string;
    analysisResults: AnalysisResult[];
    createdAt: Date;
}

export interface AnalysisResult {
    model: string;
    score: number;
    feedback: string;
}

export interface NCAAEligibility {
    sport: string;
    eligibilityStatus: boolean;
    notes: string;
}

export interface TrainingSession {
    id: string;
    userId: string;
    sport: string;
    date: Date;
    duration: number; // in minutes
    notes: string;
}

export interface SkillDevelopment {
    id: string;
    userId: string;
    sport: string;
    skill: string;
    progress: number; // percentage
    createdAt: Date;
}