import { 
  users, 
  type User, 
  type InsertUser,
  activityLogs, 
  type ActivityLog, 
  type InsertActivityLog,
  stateStandards,
  type StateStandard,
  learningObjectives,
  type LearningObjective,
  lessonPlans,
  type LessonPlan,
  academicUnits,
  type AcademicUnit,
  neurodivergentProfiles,
  type NeurodivergentProfile,
  curriculumPaths,
  type CurriculumPath
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Activity log methods
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivity(limit?: number): Promise<ActivityLog[]>;
  
  // Academic standards methods
  getStateStandards(stateCode: string, subject?: string, gradeLevel?: string): Promise<StateStandard[]>;
  createStateStandard(standard: any): Promise<StateStandard>;
  
  // Learning objectives methods
  getLearningObjectives(standardId: number): Promise<LearningObjective[]>;
  createLearningObjective(objective: any): Promise<LearningObjective>;
  
  // Lesson plan methods
  getLessonPlans(filters?: any): Promise<LessonPlan[]>;
  createLessonPlan(lessonPlan: any): Promise<LessonPlan>;
  
  // Academic unit methods
  getAcademicUnits(filters?: any): Promise<AcademicUnit[]>;
  createAcademicUnit(unit: any): Promise<AcademicUnit>;
  
  // Neurodivergent profile methods
  getNeurodivergentProfiles(type?: string): Promise<NeurodivergentProfile[]>;
  saveNeurodivergentProfile(profile: any): Promise<NeurodivergentProfile>;
  
  // Curriculum path methods
  getCurriculumPaths(studentId: number): Promise<CurriculumPath[]>;
  createCurriculumPath(path: any): Promise<CurriculumPath>;
  
  // Student methods
  getStudent(id: number): Promise<Student | undefined>;
  getStudents(filters?: any): Promise<Student[]>;
  createStudent(student: any): Promise<Student>;
  updateStudent(id: number, student: any): Promise<Student>;
  
  // Learning activities methods
  getLearningActivities(filters?: any): Promise<LearningActivity[]>;
  getLearningActivity(id: number): Promise<LearningActivity | undefined>;
  createLearningActivity(activity: any): Promise<LearningActivity>;
  
  // Assessment methods
  getAssessments(filters?: any): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: any): Promise<Assessment>;
  
  // Student progress methods
  getStudentProgress(studentId: number): Promise<StudentProgress[]>;
  updateStudentProgress(studentId: number, progress: any): Promise<StudentProgress>;
  getStudentProgressStats(studentId: number): Promise<any>;
  recordActivityCompletion(studentId: number, activityId: number, data: any): Promise<StudentProgress>;
  
  // Assessment results methods
  getAssessmentResults(studentId: number, assessmentId?: number): Promise<AssessmentResult[]>;
  createAssessmentResult(result: any): Promise<AssessmentResult>;
  recordAssessmentResult(studentId: number, assessmentId: number, data: any): Promise<AssessmentResult>;
  
  // Achievement methods
  getAchievements(filters?: any): Promise<Achievement[]>;
  getAchievementByCode(code: string): Promise<Achievement | undefined>;
  createAchievement(achievement: any): Promise<Achievement>;
  
  // Student achievement methods
  getStudentAchievements(studentId: number): Promise<StudentAchievement[]>;
  awardAchievement(studentId: number, achievementId: number, metadata?: any): Promise<StudentAchievement>;
  
  // Student activity log methods
  getStudentActivityLogs(studentId: number, limit?: number): Promise<StudentActivityLog[]>;
  logStudentActivity(studentId: number, activity: any): Promise<StudentActivityLog>;
}

import { DatabaseStorage } from './services/DatabaseStorage';

// For backward compatibility - will be replaced by DatabaseStorage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activityLogs: ActivityLog[];
  private userId: number;
  private activityId: number;
  
  // Academic data stores
  private stateStandards: Map<number, StateStandard>;
  private learningObjectives: Map<number, LearningObjective>;
  private lessonPlans: Map<number, LessonPlan>;
  private academicUnits: Map<number, AcademicUnit>;
  private neurodivergentProfiles: Map<number, NeurodivergentProfile>;
  private curriculumPaths: Map<number, CurriculumPath>;
  
  // ID counters
  private standardId: number;
  private objectiveId: number;
  private lessonPlanId: number;
  private academicUnitId: number;
  private profileId: number;
  private curriculumPathId: number;

  constructor() {
    this.users = new Map();
    this.activityLogs = [];
    this.userId = 1;
    this.activityId = 1;
    
    // Initialize academic data stores
    this.stateStandards = new Map();
    this.learningObjectives = new Map();
    this.lessonPlans = new Map();
    this.academicUnits = new Map();
    this.neurodivergentProfiles = new Map();
    this.curriculumPaths = new Map();
    
    // Initialize ID counters
    this.standardId = 1;
    this.objectiveId = 1;
    this.lessonPlanId = 1;
    this.academicUnitId = 1;
    this.profileId = 1;
    this.curriculumPathId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityId++;
    const activityLog: ActivityLog = { 
      ...activity, 
      id,
      time: activity.time || new Date() // Ensure time is always a Date object
    };
    this.activityLogs.push(activityLog);
    return activityLog;
  }
  
  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    // Sort by time descending and apply limit
    return [...this.activityLogs]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  }
  
  // State Standards methods
  async getStateStandards(stateCode: string, subject?: string, gradeLevel?: string): Promise<StateStandard[]> {
    let standards = [...this.stateStandards.values()];
    
    if (stateCode) {
      standards = standards.filter(standard => standard.stateCode === stateCode);
    }
    
    if (subject) {
      standards = standards.filter(standard => standard.subject === subject);
    }
    
    if (gradeLevel) {
      standards = standards.filter(standard => standard.gradeLevel === gradeLevel);
    }
    
    return standards;
  }
  
  async createStateStandard(standard: any): Promise<StateStandard> {
    const id = this.standardId++;
    const now = new Date();
    
    const newStandard: StateStandard = {
      id,
      ...standard,
      createdAt: now,
      updatedAt: now
    };
    
    this.stateStandards.set(id, newStandard);
    return newStandard;
  }
  
  // Learning Objectives methods
  async getLearningObjectives(standardId: number): Promise<LearningObjective[]> {
    const objectives = [...this.learningObjectives.values()];
    return objectives.filter(objective => objective.standardId === standardId);
  }
  
  async createLearningObjective(objective: any): Promise<LearningObjective> {
    const id = this.objectiveId++;
    const now = new Date();
    
    const newObjective: LearningObjective = {
      id,
      ...objective,
      createdAt: now,
      updatedAt: now
    };
    
    this.learningObjectives.set(id, newObjective);
    return newObjective;
  }
  
  // Lesson Plan methods
  async getLessonPlans(filters: any = {}): Promise<LessonPlan[]> {
    let lessonPlans = [...this.lessonPlans.values()];
    
    if (filters.subject) {
      lessonPlans = lessonPlans.filter(lp => lp.subject === filters.subject);
    }
    
    if (filters.gradeLevel) {
      lessonPlans = lessonPlans.filter(lp => lp.gradeLevel === filters.gradeLevel);
    }
    
    if (filters.authorId) {
      lessonPlans = lessonPlans.filter(lp => lp.authorId === filters.authorId);
    }
    
    if (filters.visibility) {
      lessonPlans = lessonPlans.filter(lp => lp.visibility === filters.visibility);
    }
    
    return lessonPlans;
  }
  
  async createLessonPlan(lessonPlan: any): Promise<LessonPlan> {
    const id = this.lessonPlanId++;
    const now = new Date();
    
    const newLessonPlan: LessonPlan = {
      id,
      ...lessonPlan,
      createdAt: now,
      updatedAt: now
    };
    
    this.lessonPlans.set(id, newLessonPlan);
    return newLessonPlan;
  }
  
  // Academic Unit methods
  async getAcademicUnits(filters: any = {}): Promise<AcademicUnit[]> {
    let units = [...this.academicUnits.values()];
    
    if (filters.subject) {
      units = units.filter(unit => unit.subject === filters.subject);
    }
    
    if (filters.gradeLevel) {
      units = units.filter(unit => unit.gradeLevel === filters.gradeLevel);
    }
    
    if (filters.authorId) {
      units = units.filter(unit => unit.authorId === filters.authorId);
    }
    
    return units;
  }
  
  async createAcademicUnit(unit: any): Promise<AcademicUnit> {
    const id = this.academicUnitId++;
    const now = new Date();
    
    const newUnit: AcademicUnit = {
      id,
      ...unit,
      createdAt: now,
      updatedAt: now
    };
    
    this.academicUnits.set(id, newUnit);
    return newUnit;
  }
  
  // Neurodivergent Profile methods
  async getNeurodivergentProfiles(type?: string): Promise<NeurodivergentProfile[]> {
    let profiles = [...this.neurodivergentProfiles.values()];
    
    if (type) {
      profiles = profiles.filter(profile => profile.type === type);
    }
    
    return profiles;
  }
  
  async saveNeurodivergentProfile(profile: any): Promise<NeurodivergentProfile> {
    const now = new Date();
    
    // Update existing profile
    if (profile.id && this.neurodivergentProfiles.has(profile.id)) {
      const updatedProfile: NeurodivergentProfile = {
        ...this.neurodivergentProfiles.get(profile.id)!,
        ...profile,
        updatedAt: now
      };
      
      this.neurodivergentProfiles.set(profile.id, updatedProfile);
      return updatedProfile;
    }
    
    // Create new profile
    const id = this.profileId++;
    
    const newProfile: NeurodivergentProfile = {
      id,
      ...profile,
      createdAt: now,
      updatedAt: now
    };
    
    this.neurodivergentProfiles.set(id, newProfile);
    return newProfile;
  }
  
  // Curriculum Path methods
  async getCurriculumPaths(studentId: number): Promise<CurriculumPath[]> {
    const paths = [...this.curriculumPaths.values()];
    return paths.filter(path => path.studentId === studentId);
  }
  
  async createCurriculumPath(path: any): Promise<CurriculumPath> {
    const id = this.curriculumPathId++;
    const now = new Date();
    
    const newPath: CurriculumPath = {
      id,
      ...path,
      createdAt: now,
      updatedAt: now
    };
    
    this.curriculumPaths.set(id, newPath);
    return newPath;
  }
}

// If we have a database connection, use DatabaseStorage otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
