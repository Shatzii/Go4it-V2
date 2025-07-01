// This file exports TypeScript types and interfaces used throughout the server code.

export interface User {
    id: number;
    email: string;
    name: string;
}

export interface AcademicProgress {
    gpa: number;
    eligibilityStatus: string;
    coursesCompleted: number;
    coursesRequired: number;
}

export interface Team {
    id: number;
    name: string;
    players: Player[];
}

export interface Player {
    id: number;
    name: string;
    position: string;
    teamId: number;
}

export interface SkillNode {
    id: number;
    name: string;
    description: string;
    prerequisites: number[];
}

export interface SkillTree {
    nodes: SkillNode[];
    userSkills: number[];
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}