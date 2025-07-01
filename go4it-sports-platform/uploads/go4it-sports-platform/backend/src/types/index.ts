export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Analytics {
    id: string;
    userId: string;
    sport: string;
    videoUrl: string;
    starRating: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoAnalysis {
    id: string;
    analyticsId: string;
    modelUsed: string;
    analysisResult: any; // Define a more specific type based on the analysis result structure
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    userId: string;
    sessionId: string;
    createdAt: Date;
    expiresAt: Date;
}