import { db } from '@/lib/database';
import {
  users,
  schools,
  courses,
  assignments,
  submissions,
  progress,
  aiSessions,
  payments,
  customers,
  subscriptions,
} from '@/shared/schema';
import type {
  User,
  NewUser,
  School,
  NewSchool,
  Course,
  NewCourse,
  Assignment,
  NewAssignment,
  Submission,
  NewSubmission,
  Progress,
  NewProgress,
  AiSession,
  NewAiSession,
  Payment,
  NewPayment,
  Customer,
  NewCustomer,
  Subscription,
  NewSubscription,
} from '@/shared/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export interface IStorage {
  // User operations
  createUser(user: NewUser): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<NewUser>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;

  // School operations
  createSchool(school: NewSchool): Promise<School>;
  getSchoolById(id: string): Promise<School | null>;
  getSchools(): Promise<School[]>;
  updateSchool(id: string, updates: Partial<NewSchool>): Promise<School | null>;

  // Course operations
  createCourse(course: NewCourse): Promise<Course>;
  getCourseById(id: string): Promise<Course | null>;
  getCoursesBySchool(schoolId: string): Promise<Course[]>;
  getCoursesByTeacher(teacherId: string): Promise<Course[]>;
  updateCourse(id: string, updates: Partial<NewCourse>): Promise<Course | null>;

  // Assignment operations
  createAssignment(assignment: NewAssignment): Promise<Assignment>;
  getAssignmentById(id: string): Promise<Assignment | null>;
  getAssignmentsByCourse(courseId: string): Promise<Assignment[]>;
  updateAssignment(id: string, updates: Partial<NewAssignment>): Promise<Assignment | null>;

  // Submission operations
  createSubmission(submission: NewSubmission): Promise<Submission>;
  getSubmissionById(id: string): Promise<Submission | null>;
  getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: string): Promise<Submission[]>;
  updateSubmission(id: string, updates: Partial<NewSubmission>): Promise<Submission | null>;

  // Progress operations
  createProgress(progress: NewProgress): Promise<Progress>;
  getProgressById(id: string): Promise<Progress | null>;
  getProgressByUser(userId: string): Promise<Progress[]>;
  getProgressByCourse(courseId: string): Promise<Progress[]>;
  updateProgress(id: string, updates: Partial<NewProgress>): Promise<Progress | null>;

  // AI Session operations
  createAiSession(session: NewAiSession): Promise<AiSession>;
  getAiSessionById(id: string): Promise<AiSession | null>;
  getAiSessionsByUser(userId: string): Promise<AiSession[]>;
  updateAiSession(id: string, updates: Partial<NewAiSession>): Promise<AiSession | null>;

  // Payment operations
  createPayment(payment: NewPayment): Promise<Payment>;
  getPaymentById(id: string): Promise<Payment | null>;
  getPaymentsByStudent(studentId: string): Promise<Payment[]>;
  getPaymentHistory(userId: string): Promise<Payment[]>;
  updatePayment(id: string, updates: Partial<NewPayment>): Promise<Payment | null>;
  updatePaymentStatus(paymentIntentId: string, status: string): Promise<Payment | null>;

  // Customer operations
  createCustomer(customer: NewCustomer): Promise<Customer>;
  getCustomerById(id: string): Promise<Customer | null>;
  getCustomerByStudent(studentId: string): Promise<Customer | null>;
  updateCustomer(id: string, updates: Partial<NewCustomer>): Promise<Customer | null>;

  // Subscription operations
  createSubscription(subscription: NewSubscription): Promise<Subscription>;
  getSubscriptionById(id: string): Promise<Subscription | null>;
  getSubscriptionsByStudent(studentId: string): Promise<Subscription[]>;
  updateSubscription(id: string, updates: Partial<NewSubscription>): Promise<Subscription | null>;

  // Additional methods for payment API compatibility
  getUserEnrollments(userId: string, schoolId?: string): Promise<any[]>;
  enrollStudent(userId: string, courseId: string): Promise<boolean>;
}

export class DrizzleStorage implements IStorage {
  // User operations
  async createUser(user: NewUser): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        ...user,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  async updateUser(id: string, updates: Partial<NewUser>): Promise<User | null> {
    const result = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // School operations
  async createSchool(school: NewSchool): Promise<School> {
    const result = await db
      .insert(schools)
      .values({
        ...school,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getSchoolById(id: string): Promise<School | null> {
    const result = await db.select().from(schools).where(eq(schools.id, id)).limit(1);
    return result[0] || null;
  }

  async getSchools(): Promise<School[]> {
    return await db.select().from(schools).where(eq(schools.isActive, true));
  }

  async updateSchool(id: string, updates: Partial<NewSchool>): Promise<School | null> {
    const result = await db
      .update(schools)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schools.id, id))
      .returning();
    return result[0] || null;
  }

  // Course operations
  async createCourse(course: NewCourse): Promise<Course> {
    const result = await db
      .insert(courses)
      .values({
        ...course,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getCourseById(id: string): Promise<Course | null> {
    const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return result[0] || null;
  }

  async getCoursesBySchool(schoolId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(and(eq(courses.schoolId, schoolId), eq(courses.isActive, true)))
      .orderBy(asc(courses.title));
  }

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(and(eq(courses.teacherId, teacherId), eq(courses.isActive, true)))
      .orderBy(asc(courses.title));
  }

  async updateCourse(id: string, updates: Partial<NewCourse>): Promise<Course | null> {
    const result = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return result[0] || null;
  }

  // Assignment operations
  async createAssignment(assignment: NewAssignment): Promise<Assignment> {
    const result = await db
      .insert(assignments)
      .values({
        ...assignment,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getAssignmentById(id: string): Promise<Assignment | null> {
    const result = await db.select().from(assignments).where(eq(assignments.id, id)).limit(1);
    return result[0] || null;
  }

  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    return await db
      .select()
      .from(assignments)
      .where(and(eq(assignments.courseId, courseId), eq(assignments.isActive, true)))
      .orderBy(desc(assignments.dueDate));
  }

  async updateAssignment(id: string, updates: Partial<NewAssignment>): Promise<Assignment | null> {
    const result = await db
      .update(assignments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assignments.id, id))
      .returning();
    return result[0] || null;
  }

  // Submission operations
  async createSubmission(submission: NewSubmission): Promise<Submission> {
    const result = await db
      .insert(submissions)
      .values({
        ...submission,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getSubmissionById(id: string): Promise<Submission | null> {
    const result = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
    return result[0] || null;
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(eq(submissions.assignmentId, assignmentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(eq(submissions.studentId, studentId))
      .orderBy(desc(submissions.submittedAt));
  }

  async updateSubmission(id: string, updates: Partial<NewSubmission>): Promise<Submission | null> {
    const result = await db
      .update(submissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(submissions.id, id))
      .returning();
    return result[0] || null;
  }

  // Progress operations
  async createProgress(progressData: NewProgress): Promise<Progress> {
    const result = await db
      .insert(progress)
      .values({
        ...progressData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getProgressById(id: string): Promise<Progress | null> {
    const result = await db.select().from(progress).where(eq(progress.id, id)).limit(1);
    return result[0] || null;
  }

  async getProgressByUser(userId: string): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .where(eq(progress.userId, userId))
      .orderBy(desc(progress.lastAccessed));
  }

  async getProgressByCourse(courseId: string): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .where(eq(progress.courseId, courseId))
      .orderBy(desc(progress.lastAccessed));
  }

  async updateProgress(id: string, updates: Partial<NewProgress>): Promise<Progress | null> {
    const result = await db
      .update(progress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(progress.id, id))
      .returning();
    return result[0] || null;
  }

  // AI Session operations
  async createAiSession(session: NewAiSession): Promise<AiSession> {
    const result = await db
      .insert(aiSessions)
      .values({
        ...session,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getAiSessionById(id: string): Promise<AiSession | null> {
    const result = await db.select().from(aiSessions).where(eq(aiSessions.id, id)).limit(1);
    return result[0] || null;
  }

  async getAiSessionsByUser(userId: string): Promise<AiSession[]> {
    return await db
      .select()
      .from(aiSessions)
      .where(eq(aiSessions.userId, userId))
      .orderBy(desc(aiSessions.createdAt));
  }

  async updateAiSession(id: string, updates: Partial<NewAiSession>): Promise<AiSession | null> {
    const result = await db
      .update(aiSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(aiSessions.id, id))
      .returning();
    return result[0] || null;
  }

  // Payment operations
  async createPayment(payment: NewPayment): Promise<Payment> {
    const result = await db
      .insert(payments)
      .values({
        ...payment,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0] || null;
  }

  async getPaymentsByStudent(studentId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, studentId))
      .orderBy(desc(payments.createdAt));
  }

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.studentId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async updatePayment(id: string, updates: Partial<NewPayment>): Promise<Payment | null> {
    const result = await db
      .update(payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return result[0] || null;
  }

  async updatePaymentStatus(paymentIntentId: string, status: string): Promise<Payment | null> {
    const result = await db
      .update(payments)
      .set({ status, updatedAt: new Date() })
      .where(eq(payments.stripePaymentIntentId, paymentIntentId))
      .returning();
    return result[0] || null;
  }

  // Customer operations
  async createCustomer(customer: NewCustomer): Promise<Customer> {
    const result = await db
      .insert(customers)
      .values({
        ...customer,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0] || null;
  }

  async getCustomerByStudent(studentId: string): Promise<Customer | null> {
    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.studentId, studentId))
      .limit(1);
    return result[0] || null;
  }

  async updateCustomer(id: string, updates: Partial<NewCustomer>): Promise<Customer | null> {
    const result = await db
      .update(customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return result[0] || null;
  }

  // Subscription operations
  async createSubscription(subscription: NewSubscription): Promise<Subscription> {
    const result = await db
      .insert(subscriptions)
      .values({
        ...subscription,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    return result[0] || null;
  }

  async getSubscriptionsByStudent(studentId: string): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.studentId, studentId))
      .orderBy(desc(subscriptions.createdAt));
  }

  async updateSubscription(
    id: string,
    updates: Partial<NewSubscription>,
  ): Promise<Subscription | null> {
    const result = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0] || null;
  }

  // Additional methods for payment API compatibility
  async getUserEnrollments(userId: string, schoolId?: string): Promise<any[]> {
    // For now, return mock enrollment data
    // In a real implementation, you'd query a course_enrollments table
    return [
      {
        id: '1',
        userId,
        courseId: 'math-101',
        schoolId: schoolId || 'primary',
        status: 'active',
        enrolledAt: new Date().toISOString(),
      },
    ];
  }

  async enrollStudent(userId: string, courseId: string): Promise<boolean> {
    // For now, return true as a successful enrollment
    // In a real implementation, you'd insert into a course_enrollments table
    try {
      // Mock implementation - in production this would insert into enrollments table
      console.log(`Enrolling student ${userId} in course ${courseId}`);
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storage = new DrizzleStorage();
