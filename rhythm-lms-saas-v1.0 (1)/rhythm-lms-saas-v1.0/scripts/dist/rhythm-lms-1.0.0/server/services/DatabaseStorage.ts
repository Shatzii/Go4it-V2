import { db } from '../db';
import { 
  eq, 
  desc 
} from 'drizzle-orm';
import { 
  users, 
  User, 
  InsertUser,
  activityLogs, 
  ActivityLog, 
  InsertActivityLog,
  stateStandards, 
  StateStandard,
  learningObjectives, 
  LearningObjective,
  lessonPlans, 
  LessonPlan,
  academicUnits,
  AcademicUnit,
  neurodivergentProfiles,
  NeurodivergentProfile,
  curriculumPaths,
  CurriculumPath
} from '@shared/schema';

/**
 * DatabaseStorage provides database-backed persistent storage for the application
 * using PostgreSQL with Drizzle ORM
 */
export class DatabaseStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Activity log methods
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [activityLog] = await db
      .insert(activityLogs)
      .values(activity)
      .returning();
    return activityLog;
  }

  async getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  // Academic standards methods
  async getStateStandards(stateCode: string, subject?: string, gradeLevel?: string): Promise<StateStandard[]> {
    let query = db.select().from(stateStandards).where(eq(stateStandards.stateCode, stateCode));
    
    if (subject) {
      query = query.where(eq(stateStandards.subject, subject));
    }
    
    if (gradeLevel) {
      query = query.where(eq(stateStandards.gradeLevel, gradeLevel));
    }
    
    return await query;
  }

  async createStateStandard(standard: any): Promise<StateStandard> {
    const [result] = await db.insert(stateStandards).values(standard).returning();
    return result;
  }

  // Learning objectives methods
  async getLearningObjectives(standardId: number): Promise<LearningObjective[]> {
    return await db
      .select()
      .from(learningObjectives)
      .where(eq(learningObjectives.standardId, standardId));
  }

  async createLearningObjective(objective: any): Promise<LearningObjective> {
    const [result] = await db.insert(learningObjectives).values(objective).returning();
    return result;
  }

  // Lesson plan methods
  async getLessonPlans(filters: any = {}): Promise<LessonPlan[]> {
    let query = db.select().from(lessonPlans);

    if (filters.subject) {
      query = query.where(eq(lessonPlans.subject, filters.subject));
    }

    if (filters.gradeLevel) {
      query = query.where(eq(lessonPlans.gradeLevel, filters.gradeLevel));
    }

    if (filters.authorId) {
      query = query.where(eq(lessonPlans.authorId, filters.authorId));
    }

    if (filters.visibility) {
      query = query.where(eq(lessonPlans.visibility, filters.visibility));
    }

    return await query;
  }

  async createLessonPlan(lessonPlan: any): Promise<LessonPlan> {
    const [result] = await db.insert(lessonPlans).values(lessonPlan).returning();
    return result;
  }

  // Academic unit methods
  async getAcademicUnits(filters: any = {}): Promise<AcademicUnit[]> {
    let query = db.select().from(academicUnits);

    if (filters.subject) {
      query = query.where(eq(academicUnits.subject, filters.subject));
    }

    if (filters.gradeLevel) {
      query = query.where(eq(academicUnits.gradeLevel, filters.gradeLevel));
    }

    if (filters.authorId) {
      query = query.where(eq(academicUnits.authorId, filters.authorId));
    }

    return await query;
  }

  async createAcademicUnit(unit: any): Promise<AcademicUnit> {
    const [result] = await db.insert(academicUnits).values(unit).returning();
    return result;
  }

  // Neurodivergent profile methods
  async getNeurodivergentProfiles(type?: string): Promise<NeurodivergentProfile[]> {
    let query = db.select().from(neurodivergentProfiles);
    
    if (type) {
      query = query.where(eq(neurodivergentProfiles.type, type));
    }
    
    return await query;
  }

  async saveNeurodivergentProfile(profile: any): Promise<NeurodivergentProfile> {
    // If updating an existing profile
    if (profile.id) {
      const [result] = await db
        .update(neurodivergentProfiles)
        .set({
          ...profile,
          updatedAt: new Date().toISOString()
        })
        .where(eq(neurodivergentProfiles.id, profile.id))
        .returning();
      return result;
    } 
    // Creating a new profile
    else {
      const [result] = await db
        .insert(neurodivergentProfiles)
        .values(profile)
        .returning();
      return result;
    }
  }

  // Curriculum path methods
  async getCurriculumPaths(studentId: number): Promise<CurriculumPath[]> {
    return await db
      .select()
      .from(curriculumPaths)
      .where(eq(curriculumPaths.studentId, studentId));
  }

  async createCurriculumPath(path: any): Promise<CurriculumPath> {
    const [result] = await db.insert(curriculumPaths).values(path).returning();
    return result;
  }
}