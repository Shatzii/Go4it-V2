import { db } from '../db';
import { 
  stateStandards, 
  learningObjectives, 
  lessonPlans, 
  academicUnits,
  neurodivergentProfiles,
  curriculumPaths
} from '@shared/schema';
import { eq, and, or, like } from 'drizzle-orm';

/**
 * Service for managing academic standards and curriculum across all 50 states
 */
class AcademicStandardsService {
  /**
   * Get standards by state and subject
   */
  async getStandardsByState(stateCode: string, subject?: string, gradeLevel?: string) {
    let query = db.select().from(stateStandards).where(eq(stateStandards.stateCode, stateCode));
    
    if (subject) {
      query = query.where(eq(stateStandards.subject, subject));
    }
    
    if (gradeLevel) {
      query = query.where(eq(stateStandards.gradeLevel, gradeLevel));
    }
    
    return await query;
  }

  /**
   * Get learning objectives for a standard
   */
  async getLearningObjectives(standardId: number) {
    return await db
      .select()
      .from(learningObjectives)
      .where(eq(learningObjectives.standardId, standardId));
  }

  /**
   * Create a lesson plan with neurodivergent adaptations
   */
  async createLessonPlan(lessonPlanData: any) {
    const [result] = await db.insert(lessonPlans).values(lessonPlanData).returning();
    return result;
  }

  /**
   * Get lesson plans filtered by various criteria
   */
  async getLessonPlans(filters: {
    subject?: string;
    gradeLevel?: string;
    author?: number;
    visibility?: string;
    status?: string;
  }) {
    let query = db.select().from(lessonPlans);

    if (filters.subject) {
      query = query.where(eq(lessonPlans.subject, filters.subject));
    }

    if (filters.gradeLevel) {
      query = query.where(eq(lessonPlans.gradeLevel, filters.gradeLevel));
    }

    if (filters.author) {
      query = query.where(eq(lessonPlans.authorId, filters.author));
    }

    if (filters.visibility) {
      query = query.where(eq(lessonPlans.visibility, filters.visibility));
    }

    if (filters.status) {
      query = query.where(eq(lessonPlans.status, filters.status));
    }

    return await query;
  }

  /**
   * Create an academic unit from a collection of lesson plans
   */
  async createAcademicUnit(unitData: any) {
    const [result] = await db.insert(academicUnits).values(unitData).returning();
    return result;
  }

  /**
   * Create or update a neurodivergent profile
   */
  async saveNeurodivergentProfile(profileData: any) {
    // If updating an existing profile
    if (profileData.id) {
      const [result] = await db
        .update(neurodivergentProfiles)
        .set({
          ...profileData,
          updatedAt: new Date().toISOString()
        })
        .where(eq(neurodivergentProfiles.id, profileData.id))
        .returning();
      return result;
    } 
    // Creating a new profile
    else {
      const [result] = await db
        .insert(neurodivergentProfiles)
        .values(profileData)
        .returning();
      return result;
    }
  }

  /**
   * Get neurodivergent profiles matching certain criteria
   */
  async getNeurodivergentProfiles(type?: string) {
    let query = db.select().from(neurodivergentProfiles);
    
    if (type) {
      query = query.where(eq(neurodivergentProfiles.type, type));
    }
    
    return await query;
  }

  /**
   * Create a personalized curriculum path for a student based on their neurodivergent profile
   */
  async createCurriculumPath(pathData: any) {
    const [result] = await db.insert(curriculumPaths).values(pathData).returning();
    return result;
  }

  /**
   * Get curriculum paths for a student
   */
  async getStudentCurriculumPaths(studentId: number) {
    return await db
      .select()
      .from(curriculumPaths)
      .where(eq(curriculumPaths.studentId, studentId));
  }

  /**
   * Search standards, lesson plans and units by keyword
   */
  async searchCurriculum(query: string) {
    const standards = await db
      .select()
      .from(stateStandards)
      .where(
        or(
          like(stateStandards.description, `%${query}%`),
          like(stateStandards.category, `%${query}%`),
          like(stateStandards.subcategory, `%${query}%`)
        )
      );

    const lessons = await db
      .select()
      .from(lessonPlans)
      .where(
        or(
          like(lessonPlans.title, `%${query}%`),
          like(lessonPlans.description, `%${query}%`)
        )
      );

    const units = await db
      .select()
      .from(academicUnits)
      .where(
        or(
          like(academicUnits.title, `%${query}%`),
          like(academicUnits.description, `%${query}%`)
        )
      );

    return {
      standards,
      lessons,
      units
    };
  }
}

export const academicStandardsService = new AcademicStandardsService();