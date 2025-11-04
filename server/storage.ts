import { users, type User, type UpsertUser } from '../shared/schema';
import { db } from './db';
import { eq, and, inArray } from 'drizzle-orm';
import { databaseStorage } from './database-storage';

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Academy courses
  listCourses(): Promise<any[]>;
  getCourseById(id: string): Promise<any | undefined>;
  ensureSeedCourses(): Promise<void>;
  listEnrollmentsByStudent(studentId: string): Promise<any[]>;
  enrollStudentInCourse(
    studentId: string,
    courseId: string,
    semester?: string,
    year?: number,
  ): Promise<any>;
  getCourseProgress(studentId: string, courseIds: string[]): Promise<Record<string, number>>;

  // Academy assignments and submissions
  createAssignment(assignmentData: any): Promise<any>;
  getAssignmentsByCourse(courseId: string): Promise<any[]>;
  getStudentAssignments(studentId: string): Promise<any[]>;
  submitAssignment(submissionData: any): Promise<any>;
  gradeSubmission(submissionId: string, score: number, feedback?: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({ target: users.id, set: { ...userData } })
      .returning();
    return user;
  }

  // -------- Academy Courses --------
  async ensureSeedCourses(): Promise<void> {
    // Lightweight idempotent seed (dev only or when table empty)
    // Import dynamically to avoid top-level circular refs
    const { academyCourses } = await import('../shared/schema');
    const existing = await db.select({ id: academyCourses.id }).from(academyCourses).limit(1);
    if (existing.length) return;
    await db
      .insert(academyCourses)
      .values([
        { title: 'Algebra I', description: 'Core mathematics foundations', code: 'MATH-ALG1' },
        { title: 'Biology', description: 'Introduction to life sciences', code: 'SCI-BIO' },
        {
          title: 'English Literature',
          description: 'Reading & analysis of texts',
          code: 'ENG-LIT',
        },
        { title: 'World History', description: 'Global civilizations overview', code: 'SOC-WH' },
      ])
      .onConflictDoNothing();
  }

  async listCourses(): Promise<any[]> {
    const { academyCourses } = await import('../shared/schema');
    return db.select().from(academyCourses).orderBy(academyCourses.createdAt);
  }

  async getCourseById(id: string): Promise<any | undefined> {
    const { academyCourses } = await import('../shared/schema');
    const [c] = await db.select().from(academyCourses).where(eq(academyCourses.id, parseInt(id)));
    return c || undefined;
  }

  async listEnrollmentsByStudent(studentId: string): Promise<any[]> {
    const { academyEnrollments, academyCourses } = await import('../shared/schema');
    const rows = await db
      .select()
      .from(academyEnrollments)
      .leftJoin(academyCourses, eq(academyEnrollments.courseId, academyCourses.id))
      .where(eq(academyEnrollments.studentId, studentId));
    return rows.map((r) => ({
      enrollment: r.academy_enrollments,
      course: r.academy_courses,
    }));
  }

  async enrollStudentInCourse(
    studentId: string,
    courseId: string,
    _semester = 'Fall',
    _year = new Date().getFullYear(),
  ): Promise<any> {
    const { academyEnrollments } = await import('../shared/schema');
    // Avoid duplicate enrollment
    const existing = await db
      .select()
      .from(academyEnrollments)
      .where(
        and(
          eq(academyEnrollments.studentId, studentId),
          eq(academyEnrollments.courseId, parseInt(courseId)),
        ),
      )
      .limit(1);
    if (existing.length) return existing[0];
    const [row] = await db
      .insert(academyEnrollments)
      .values({
        studentId,
        courseId: parseInt(courseId),
        status: 'active',
      })
      .returning();
    return row;
  }

  async getCourseProgress(studentId: string, courseIds: string[]): Promise<Record<string, number>> {
    // Calculate progress based on enrollments
    const { academyEnrollments } = await import('../shared/schema');
    const enrollments = await db
      .select()
      .from(academyEnrollments)
      .where(
        and(
          eq(academyEnrollments.studentId, studentId),
          inArray(academyEnrollments.courseId, courseIds.map((id) => parseInt(id))),
        ),
      );

    const result: Record<string, number> = {};
    for (const id of courseIds) {
      const enrollment = enrollments.find((e) => e.courseId?.toString() === id);
      result[id] = enrollment?.progress || 0;
    }
    return result;
  }

  // -------- Academy Assignments --------
  async createAssignment(assignmentData: any): Promise<any> {
    const { academyAssignments } = await import('../shared/schema');
    const [assignment] = await db.insert(academyAssignments).values(assignmentData).returning();
    return assignment;
  }

  async getAssignmentsByCourse(courseId: string): Promise<any[]> {
    const { academyAssignments } = await import('../shared/schema');
    return db
      .select()
      .from(academyAssignments)
      .where(eq(academyAssignments.courseId, parseInt(courseId)))
      .orderBy(academyAssignments.createdAt);
  }

  async getStudentAssignments(studentId: string): Promise<any[]> {
    const { academyAssignments, academySubmissions, academyCourses, academyEnrollments } =
      await import('../shared/schema');

    // Get assignments for courses the student is enrolled in
    const rows = await db
      .select({
        assignment: academyAssignments,
        submission: academySubmissions,
        course: academyCourses,
      })
      .from(academyAssignments)
      .leftJoin(
        academySubmissions,
        and(
          eq(academyAssignments.id, academySubmissions.assignmentId),
          eq(academySubmissions.studentId, studentId),
        ),
      )
      .leftJoin(academyCourses, eq(academyAssignments.courseId, academyCourses.id))
      .leftJoin(
        academyEnrollments,
        and(
          eq(academyEnrollments.courseId, academyAssignments.courseId),
          eq(academyEnrollments.studentId, studentId),
        ),
      )
      .where(eq(academyEnrollments.isActive, true));

    return rows;
  }

  async submitAssignment(submissionData: any): Promise<any> {
    const { academySubmissions } = await import('../shared/schema');
    const [submission] = await db.insert(academySubmissions).values(submissionData).returning();
    return submission;
  }

  async gradeSubmission(submissionId: string, score: number, feedback?: string): Promise<any> {
    const { academySubmissions } = await import('../shared/schema');
    const [submission] = await db
      .update(academySubmissions)
      .set({
        score,
        feedback,
        gradedAt: new Date(),
        status: 'graded',
      })
      .where(eq(academySubmissions.id, parseInt(submissionId)))
      .returning();
    return submission;
  }
}

// Export singleton storage instance that includes both academy and social media functionality
export const storage = Object.assign(new DatabaseStorage(), databaseStorage);
