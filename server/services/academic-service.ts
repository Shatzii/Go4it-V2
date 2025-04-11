import { db } from '../db';
import {
  academicSubjects,
  academicCourses,
  courseEnrollments,
  academicAssignments,
  academicTerms,
  adhdStudyStrategies,
  studentStudyStrategies,
  academicAthleticAnalytics,
  users,
  type AcademicSubject,
  type AcademicCourse,
  type CourseEnrollment,
  type AcademicAssignment,
  type AcademicTerm,
  type AdhdStudyStrategy,
  type StudentStudyStrategy,
  type AcademicAthleticAnalytics,
  type InsertAcademicSubject,
  type InsertAcademicCourse,
  type InsertCourseEnrollment,
  type InsertAcademicAssignment,
  type InsertAcademicTerm,
  type InsertAdhdStudyStrategy,
  type InsertStudentStudyStrategy,
  type InsertAcademicAthleticAnalytics
} from '@shared/schema';
import { eq, and, like, gte, lte, desc, sql, asc, ilike, inArray } from 'drizzle-orm';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';

const academicCache = new CacheContainer(new MemoryStorage());

export class AcademicService {
  private constructor() {}

  private static instance: AcademicService;
  
  public static getInstance(): AcademicService {
    if (!AcademicService.instance) {
      AcademicService.instance = new AcademicService();
    }
    return AcademicService.instance;
  }

  async getSubjects(): Promise<AcademicSubject[]> {
    return db.select().from(academicSubjects).orderBy(asc(academicSubjects.name));
  }

  async getSubjectById(id: number): Promise<AcademicSubject | undefined> {
    const [subject] = await db.select().from(academicSubjects).where(eq(academicSubjects.id, id));
    return subject;
  }

  async createSubject(data: InsertAcademicSubject): Promise<AcademicSubject> {
    const [subject] = await db.insert(academicSubjects).values(data).returning();
    return subject;
  }

  async getCourses(filters?: { subjectId?: number, courseLevel?: string, gradeLevel?: number }): Promise<AcademicCourse[]> {
    let query = db.select().from(academicCourses);
    
    if (filters) {
      if (filters.subjectId) {
        query = query.where(eq(academicCourses.subjectId, filters.subjectId));
      }
      if (filters.courseLevel) {
        query = query.where(eq(academicCourses.courseLevel, filters.courseLevel));
      }
      if (filters.gradeLevel) {
        query = query.where(eq(academicCourses.gradeLevel, filters.gradeLevel));
      }
    }
    
    return query.orderBy(asc(academicCourses.name));
  }

  async getCourseById(id: number): Promise<AcademicCourse | undefined> {
    const [course] = await db.select().from(academicCourses).where(eq(academicCourses.id, id));
    return course;
  }

  async createCourse(data: InsertAcademicCourse): Promise<AcademicCourse> {
    const [course] = await db.insert(academicCourses).values(data).returning();
    return course;
  }

  async getUserEnrollments(userId: number): Promise<CourseEnrollment[]> {
    return db.select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, userId))
      .orderBy(desc(courseEnrollments.createdAt));
  }

  async getEnrollmentById(id: number): Promise<CourseEnrollment | undefined> {
    const [enrollment] = await db.select().from(courseEnrollments).where(eq(courseEnrollments.id, id));
    return enrollment;
  }

  async createEnrollment(data: InsertCourseEnrollment): Promise<CourseEnrollment> {
    const [enrollment] = await db.insert(courseEnrollments).values(data).returning();
    return enrollment;
  }

  async updateEnrollmentGrade(id: number, grade: string, percentage: number): Promise<CourseEnrollment> {
    const [enrollment] = await db
      .update(courseEnrollments)
      .set({ 
        currentGrade: grade, 
        currentPercentage: percentage,
        updatedAt: new Date()
      })
      .where(eq(courseEnrollments.id, id))
      .returning();
    return enrollment;
  }

  async getAssignmentsForEnrollment(enrollmentId: number): Promise<AcademicAssignment[]> {
    return db.select()
      .from(academicAssignments)
      .where(eq(academicAssignments.courseEnrollmentId, enrollmentId))
      .orderBy(asc(academicAssignments.dueDate));
  }

  async createAssignment(data: InsertAcademicAssignment): Promise<AcademicAssignment> {
    const [assignment] = await db.insert(academicAssignments).values(data).returning();
    return assignment;
  }

  async updateAssignmentGrade(id: number, grade: string, percentage: number): Promise<AcademicAssignment> {
    const [assignment] = await db
      .update(academicAssignments)
      .set({ 
        grade, 
        percentage,
        status: 'completed',
        updatedAt: new Date()
      })
      .where(eq(academicAssignments.id, id))
      .returning();
    return assignment;
  }

  async getUserTerms(userId: number): Promise<AcademicTerm[]> {
    return db.select()
      .from(academicTerms)
      .where(eq(academicTerms.userId, userId))
      .orderBy(desc(academicTerms.startDate));
  }

  async createTerm(data: InsertAcademicTerm): Promise<AcademicTerm> {
    const [term] = await db.insert(academicTerms).values(data).returning();
    return term;
  }

  async getStudyStrategies(category?: string): Promise<AdhdStudyStrategy[]> {
    let query = db.select().from(adhdStudyStrategies);
    
    if (category) {
      query = query.where(eq(adhdStudyStrategies.category, category));
    }
    
    return query.orderBy(desc(adhdStudyStrategies.effectiveness));
  }

  async createStudyStrategy(data: InsertAdhdStudyStrategy): Promise<AdhdStudyStrategy> {
    const [strategy] = await db.insert(adhdStudyStrategies).values(data).returning();
    return strategy;
  }

  async getUserStudyStrategies(userId: number): Promise<StudentStudyStrategy[]> {
    return db.select()
      .from(studentStudyStrategies)
      .where(eq(studentStudyStrategies.userId, userId))
      .orderBy(desc(studentStudyStrategies.implementationDate));
  }

  async implementStudyStrategy(data: InsertStudentStudyStrategy): Promise<StudentStudyStrategy> {
    const [strategy] = await db.insert(studentStudyStrategies).values(data).returning();
    return strategy;
  }

  async updateStudyStrategyEffectiveness(id: number, effectiveness: number): Promise<StudentStudyStrategy> {
    const [strategy] = await db
      .update(studentStudyStrategies)
      .set({ 
        effectiveness,
        updatedAt: new Date()
      })
      .where(eq(studentStudyStrategies.id, id))
      .returning();
    return strategy;
  }

  async getUserAcademicAnalytics(userId: number): Promise<AcademicAthleticAnalytics | undefined> {
    const [analytics] = await db
      .select()
      .from(academicAthleticAnalytics)
      .where(eq(academicAthleticAnalytics.userId, userId))
      .orderBy(desc(academicAthleticAnalytics.timestampRecorded))
      .limit(1);
    return analytics;
  }

  async createOrUpdateAcademicAnalytics(data: InsertAcademicAthleticAnalytics): Promise<AcademicAthleticAnalytics> {
    // Check if analytics already exist for this user
    const existing = await this.getUserAcademicAnalytics(data.userId);
    
    if (existing) {
      // Update existing analytics
      const [analytics] = await db
        .update(academicAthleticAnalytics)
        .set({
          ...data,
          timestampRecorded: new Date()
        })
        .where(eq(academicAthleticAnalytics.id, existing.id))
        .returning();
      return analytics;
    } else {
      // Create new analytics
      const [analytics] = await db
        .insert(academicAthleticAnalytics)
        .values(data)
        .returning();
      return analytics;
    }
  }

  async calculateGPA(userId: number, termName?: string): Promise<number> {
    let enrollments: CourseEnrollment[];
    
    if (termName) {
      // Get enrollments for specific term
      enrollments = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, userId),
          eq(courseEnrollments.semester, termName),
          eq(courseEnrollments.status, 'completed')
        ));
    } else {
      // Get all completed enrollments
      enrollments = await db.select()
        .from(courseEnrollments)
        .where(and(
          eq(courseEnrollments.userId, userId),
          eq(courseEnrollments.status, 'completed')
        ));
    }
    
    if (enrollments.length === 0) {
      return 0;
    }

    // Get courses for these enrollments to get credit values
    const courseIds = enrollments.map(e => e.courseId);
    const courses = await db.select()
      .from(academicCourses)
      .where(inArray(academicCourses.id, courseIds));
    
    // Map of course ID to credits
    const courseCreditsMap = new Map(courses.map(c => [c.id, c.credits || 1]));
    
    let totalQualityPoints = 0;
    let totalCredits = 0;
    
    // Calculate GPA
    for (const enrollment of enrollments) {
      // Convert letter grade to GPA value
      let gradeValue = 0;
      if (enrollment.currentGrade) {
        switch (enrollment.currentGrade.toUpperCase()) {
          case 'A+': gradeValue = 4.0; break;
          case 'A': gradeValue = 4.0; break;
          case 'A-': gradeValue = 3.7; break;
          case 'B+': gradeValue = 3.3; break;
          case 'B': gradeValue = 3.0; break;
          case 'B-': gradeValue = 2.7; break;
          case 'C+': gradeValue = 2.3; break;
          case 'C': gradeValue = 2.0; break;
          case 'C-': gradeValue = 1.7; break;
          case 'D+': gradeValue = 1.3; break;
          case 'D': gradeValue = 1.0; break;
          case 'D-': gradeValue = 0.7; break;
          case 'F': gradeValue = 0.0; break;
          default:
            // If percentage is available, use that to estimate grade
            if (enrollment.currentPercentage) {
              if (enrollment.currentPercentage >= 90) gradeValue = 4.0;
              else if (enrollment.currentPercentage >= 80) gradeValue = 3.0;
              else if (enrollment.currentPercentage >= 70) gradeValue = 2.0;
              else if (enrollment.currentPercentage >= 60) gradeValue = 1.0;
              else gradeValue = 0.0;
            }
        }
      } else if (enrollment.currentPercentage) {
        // Use percentage to estimate grade if letter grade is not available
        if (enrollment.currentPercentage >= 90) gradeValue = 4.0;
        else if (enrollment.currentPercentage >= 80) gradeValue = 3.0;
        else if (enrollment.currentPercentage >= 70) gradeValue = 2.0;
        else if (enrollment.currentPercentage >= 60) gradeValue = 1.0;
        else gradeValue = 0.0;
      }
      
      // Get course credits
      const credits = courseCreditsMap.get(enrollment.courseId) || 1;
      
      totalQualityPoints += gradeValue * credits;
      totalCredits += credits;
    }
    
    return totalCredits > 0 ? +(totalQualityPoints / totalCredits).toFixed(2) : 0;
  }

  async identifyStrongestAndWeakestSubjects(userId: number): Promise<{ strongest: string[], weakest: string[] }> {
    // Get all completed enrollments
    const enrollments = await db.select()
      .from(courseEnrollments)
      .where(and(
        eq(courseEnrollments.userId, userId),
        eq(courseEnrollments.status, 'completed')
      ));
      
    if (enrollments.length === 0) {
      return { strongest: [], weakest: [] };
    }
    
    // Get courses for these enrollments
    const courseIds = enrollments.map(e => e.courseId);
    const courses = await db.select()
      .from(academicCourses)
      .where(inArray(academicCourses.id, courseIds));
    
    // Get subjects for these courses
    const subjectIds = [...new Set(courses.map(c => c.subjectId).filter(id => id !== null))] as number[];
    const subjectsData = await db.select()
      .from(academicSubjects)
      .where(inArray(academicSubjects.id, subjectIds));
    
    // Create maps for lookups
    const courseMap = new Map(courses.map(c => [c.id, c]));
    const subjectMap = new Map(subjectsData.map(s => [s.id, s]));
    
    // Group enrollments by subject and calculate average grade for each subject
    const subjectGrades: Record<string, { total: number, count: number, average: number }> = {};
    
    for (const enrollment of enrollments) {
      const course = courseMap.get(enrollment.courseId);
      if (!course || !course.subjectId) continue;
      
      const subject = subjectMap.get(course.subjectId);
      if (!subject) continue;
      
      const subjectName = subject.name;
      
      // Convert grade/percentage to numerical value
      let gradeValue = 0;
      if (enrollment.currentPercentage) {
        gradeValue = enrollment.currentPercentage;
      } else if (enrollment.currentGrade) {
        switch (enrollment.currentGrade.toUpperCase()) {
          case 'A+': case 'A': gradeValue = 95; break;
          case 'A-': gradeValue = 90; break;
          case 'B+': gradeValue = 87; break;
          case 'B': gradeValue = 84; break;
          case 'B-': gradeValue = 80; break;
          case 'C+': gradeValue = 77; break;
          case 'C': gradeValue = 74; break;
          case 'C-': gradeValue = 70; break;
          case 'D+': gradeValue = 67; break;
          case 'D': gradeValue = 64; break;
          case 'D-': gradeValue = 60; break;
          case 'F': gradeValue = 55; break;
        }
      }
      
      // Initialize or update subject grade data
      if (!subjectGrades[subjectName]) {
        subjectGrades[subjectName] = { total: 0, count: 0, average: 0 };
      }
      
      subjectGrades[subjectName].total += gradeValue;
      subjectGrades[subjectName].count += 1;
    }
    
    // Calculate averages
    for (const subject in subjectGrades) {
      const data = subjectGrades[subject];
      data.average = data.total / data.count;
    }
    
    // Sort subjects by average
    const sortedSubjects = Object.entries(subjectGrades)
      .sort((a, b) => b[1].average - a[1].average)
      .map(([name]) => name);
    
    // Identify strongest (top 3) and weakest subjects (bottom 3)
    const strongest = sortedSubjects.slice(0, Math.min(3, sortedSubjects.length));
    const weakest = sortedSubjects.slice(-Math.min(3, sortedSubjects.length)).reverse();
    
    return { strongest, weakest };
  }

  async analyzeStudyPatterns(userId: number): Promise<{ 
    recommendedStudyPatterns: any;
    recommendedSubjectFocus: string;
  }> {
    // Get implemented strategies for this user
    const studentStrategies = await db.select()
      .from(studentStudyStrategies)
      .where(eq(studentStudyStrategies.userId, userId));
      
    // Get the actual strategy details
    const strategyIds = studentStrategies.map(s => s.strategyId);
    const strategies = await db.select()
      .from(adhdStudyStrategies)
      .where(inArray(adhdStudyStrategies.id, strategyIds));
    
    // Map strategy effectiveness ratings
    const strategyMap = new Map(strategies.map(s => [s.id, s]));
    
    // Group strategies by category and identify most effective ones
    const categoryEffectiveness: Record<string, { 
      totalEffectiveness: number; 
      count: number; 
      strategies: Array<{ name: string; effectiveness: number; tips: string[] }> 
    }> = {};
    
    for (const userStrategy of studentStrategies) {
      const strategy = strategyMap.get(userStrategy.strategyId);
      if (!strategy) continue;
      
      const effectiveness = userStrategy.effectiveness || strategy.effectiveness || 0;
      
      if (!categoryEffectiveness[strategy.category]) {
        categoryEffectiveness[strategy.category] = {
          totalEffectiveness: 0,
          count: 0,
          strategies: []
        };
      }
      
      categoryEffectiveness[strategy.category].totalEffectiveness += effectiveness;
      categoryEffectiveness[strategy.category].count += 1;
      
      // Add this strategy if it's effective (rating 7+)
      if (effectiveness >= 7) {
        categoryEffectiveness[strategy.category].strategies.push({
          name: strategy.title,
          effectiveness,
          tips: strategy.tips || []
        });
      }
    }
    
    // Identify subjects that need focus
    const { weakest } = await this.identifyStrongestAndWeakestSubjects(userId);
    const recommendedSubjectFocus = weakest.length > 0 ? weakest[0] : '';
    
    // Build recommended study patterns
    const recommendedStudyPatterns: Record<string, any> = {};
    
    for (const category in categoryEffectiveness) {
      const data = categoryEffectiveness[category];
      const avgEffectiveness = data.count > 0 ? data.totalEffectiveness / data.count : 0;
      
      recommendedStudyPatterns[category] = {
        averageEffectiveness: avgEffectiveness,
        recommendedStrategies: data.strategies
          .sort((a, b) => b.effectiveness - a.effectiveness)
          .slice(0, 3)
      };
    }
    
    return {
      recommendedStudyPatterns,
      recommendedSubjectFocus
    };
  }

  async updateAcademicAnalytics(userId: number): Promise<AcademicAthleticAnalytics> {
    // Calculate GPA
    const currentGPA = await this.calculateGPA(userId);
    
    // Get strongest and weakest subjects
    const { strongest, weakest } = await this.identifyStrongestAndWeakestSubjects(userId);
    
    // Get study patterns and recommendations
    const { recommendedStudyPatterns, recommendedSubjectFocus } = await this.analyzeStudyPatterns(userId);
    
    // Get existing analytics
    const existingAnalytics = await this.getUserAcademicAnalytics(userId);
    
    // Prepare time series data for GPA
    const gpaTimeSeries = existingAnalytics?.gpaTimeSeries || [];
    
    // Skip adding a new entry if GPA hasn't changed
    if (!existingAnalytics || existingAnalytics.currentGPA !== currentGPA) {
      const newEntry = {
        date: new Date().toISOString(),
        gpa: currentGPA
      };
      
      if (Array.isArray(gpaTimeSeries)) {
        gpaTimeSeries.push(newEntry);
      }
    }
    
    // Calculate improvement rates
    let academicImprovementRate = 0;
    if (gpaTimeSeries.length >= 2) {
      const sortedEntries = [...gpaTimeSeries].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const oldestEntry = sortedEntries[0];
      const newestEntry = sortedEntries[sortedEntries.length - 1];
      
      if (oldestEntry.gpa > 0) {
        academicImprovementRate = ((newestEntry.gpa - oldestEntry.gpa) / oldestEntry.gpa) * 100;
      }
    }
    
    // Create or update analytics
    const analyticsData: InsertAcademicAthleticAnalytics = {
      userId,
      currentGPA,
      gpaTimeSeries,
      strongestSubjects: strongest,
      weakestSubjects: weakest,
      recommendedStudyPatterns,
      recommendedSubjectFocus,
      academicImprovementRate
    };
    
    return this.createOrUpdateAcademicAnalytics(analyticsData);
  }

  // Implement the getAcademicProgress method that's referenced in routes
  async getAcademicProgress(userId: number): Promise<any> {
    try {
      // Get basic academic analytics
      const analytics = await this.getUserAcademicAnalytics(userId);
      
      // Get enrollment data
      const enrollments = await this.getUserEnrollments(userId);
      
      // Get study strategies
      const studyStrategies = await this.getUserStudyStrategies(userId);
      
      // Get terms
      const terms = await this.getUserTerms(userId);
      
      // Get assignments for each enrollment
      const assignmentsPromises = enrollments.map(enrollment => 
        this.getAssignmentsForEnrollment(enrollment.id)
      );
      const assignmentsByEnrollment = await Promise.all(assignmentsPromises);
      
      // Calculate current GPA if analytics doesn't exist
      const currentGPA = analytics?.currentGPA || await this.calculateGPA(userId);
      
      // Calculate current term GPA if available
      let currentTermGPA = 0;
      const currentTerm = terms.length > 0 ? terms[0] : null;
      if (currentTerm) {
        currentTermGPA = await this.calculateGPA(userId, currentTerm.name);
      }
      
      // If no analytics exist yet, generate initial analytics
      if (!analytics) {
        const { strongest, weakest } = await this.identifyStrongestAndWeakestSubjects(userId);
        const { recommendedStudyPatterns, recommendedSubjectFocus } = await this.analyzeStudyPatterns(userId);
        
        // Create new analytics
        await this.createOrUpdateAcademicAnalytics({
          userId,
          currentGPA,
          gpaTimeSeries: [{ date: new Date().toISOString(), gpa: currentGPA }],
          strongestSubjects: strongest,
          weakestSubjects: weakest,
          recommendedStudyPatterns,
          recommendedSubjectFocus
        });
      }
      
      // Get course details for each enrollment
      const courseIds = enrollments.map(e => e.courseId);
      const courses = courseIds.length > 0 
        ? await db.select().from(academicCourses).where(inArray(academicCourses.id, courseIds))
        : [];
      
      // Get subject details
      const subjectIds = courses.map(c => c.subjectId).filter(id => id !== null) as number[];
      const subjects = subjectIds.length > 0
        ? await db.select().from(academicSubjects).where(inArray(academicSubjects.id, subjectIds))
        : [];
      
      // Create maps for easier lookup
      const courseMap = new Map(courses.map(c => [c.id, c]));
      const subjectMap = new Map(subjects.map(s => [s.id, s]));
      
      // Calculate NCAA eligibility based on GPA and core courses
      const ncaaEligible = this.calculateNcaaEligibility(currentGPA, enrollments, courseMap);
      
      // Enhance enrollments with course and subject data
      const enhancedEnrollments = enrollments.map((enrollment, index) => {
        const course = courseMap.get(enrollment.courseId);
        const subject = course?.subjectId ? subjectMap.get(course.subjectId) : null;
        
        return {
          ...enrollment,
          course: course || null,
          subject: subject || null,
          assignments: assignmentsByEnrollment[index] || []
        };
      });
      
      // Prepare progress report
      return {
        userId,
        currentGPA,
        currentTermGPA,
        ncaaEligible,
        analytics: analytics || null,
        enrollments: enhancedEnrollments,
        terms,
        studyStrategies,
        currentTerm
      };
    } catch (error) {
      console.error("Error generating academic progress report:", error);
      throw error;
    }
  }
  
  async generateAcademicReport(userId: number): Promise<any> {
    try {
      // First, update the analytics to make sure they're current
      await this.updateAcademicAnalytics(userId);
      
      // Then get the complete progress data
      const progressData = await this.getAcademicProgress(userId);
      
      // Get the user details
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      // Generate ADHD-specific study recommendations
      const adhdRecommendations = await this.generateAdhdStudyRecommendations(userId);
      
      // Generate NCAA eligibility recommendations if not eligible
      let ncaaRecommendations = [];
      if (!progressData.ncaaEligible.eligible) {
        ncaaRecommendations = await this.generateNcaaEligibilityRecommendations(progressData);
      }
      
      // Generate subject improvement recommendations
      const subjectRecommendations = await this.generateSubjectRecommendations(progressData);
      
      // Add generated recommendations to the progress data
      return {
        ...progressData,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        recommendations: {
          adhdStudyStrategies: adhdRecommendations,
          ncaaEligibility: ncaaRecommendations,
          subjectImprovement: subjectRecommendations
        },
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error generating academic report:", error);
      throw error;
    }
  }
  
  async generateAdhdStudyRecommendations(userId: number): Promise<any[]> {
    // Get the currently implemented strategies for this user
    const userStrategies = await this.getUserStudyStrategies(userId);
    const implementedStrategyIds = userStrategies.map(s => s.strategyId);
    
    // Get all effective study strategies that haven't been implemented yet
    const allStrategies = await this.getStudyStrategies();
    const newStrategies = allStrategies.filter(s => 
      !implementedStrategyIds.includes(s.id) && s.effectiveness >= 7
    );
    
    // Group by category and take top 2 from each
    const categorizedStrategies: Record<string, any[]> = {};
    
    for (const strategy of newStrategies) {
      if (!categorizedStrategies[strategy.category]) {
        categorizedStrategies[strategy.category] = [];
      }
      
      if (categorizedStrategies[strategy.category].length < 2) {
        categorizedStrategies[strategy.category].push({
          id: strategy.id,
          title: strategy.title,
          description: strategy.description,
          tips: strategy.tips,
          effectiveness: strategy.effectiveness,
          category: strategy.category
        });
      }
    }
    
    // Flatten into array
    return Object.values(categorizedStrategies).flat();
  }
  
  async generateNcaaEligibilityRecommendations(progressData: any): Promise<any[]> {
    const recommendations = [];
    
    // Check GPA requirements
    if (!progressData.ncaaEligible.requirements.gpaRequirement.met) {
      const currentGPA = progressData.ncaaEligible.requirements.gpaRequirement.current;
      const requiredGPA = progressData.ncaaEligible.requirements.gpaRequirement.required;
      
      // Find the weakest subjects to focus on
      const weakSubjects = progressData.analytics?.weakestSubjects || [];
      
      recommendations.push({
        title: "Improve GPA to Meet NCAA Requirements",
        description: `Your current GPA (${currentGPA}) is below the NCAA requirement of ${requiredGPA}. Focus on improving grades in your weakest subjects.`,
        actionItems: [
          `Create a study schedule focusing on ${weakSubjects.join(', ')}`,
          "Meet with teachers or tutors for additional help",
          "Dedicate extra study time to improving your lowest grades first"
        ]
      });
    }
    
    // Check core course requirements
    if (!progressData.ncaaEligible.requirements.coreCourseRequirement.met) {
      const completedCourses = progressData.ncaaEligible.requirements.coreCourseRequirement.current;
      const requiredCourses = progressData.ncaaEligible.requirements.coreCourseRequirement.required;
      
      recommendations.push({
        title: "Complete Required NCAA Core Courses",
        description: `You have completed ${completedCourses} out of ${requiredCourses} required NCAA core courses.`,
        actionItems: [
          "Meet with your academic counselor to plan remaining core courses",
          "Ensure your course load includes NCAA-approved core classes",
          "Consider summer school options to complete requirements faster"
        ]
      });
    }
    
    return recommendations;
  }
  
  async generateSubjectRecommendations(progressData: any): Promise<any[]> {
    const recommendations = [];
    
    // Generate recommendations for weakest subjects
    const weakSubjects = progressData.analytics?.weakestSubjects || [];
    
    if (weakSubjects.length > 0) {
      // Find the enrollments for these weak subjects
      const weakSubjectEnrollments = progressData.enrollments.filter(enrollment => {
        return enrollment.subject && weakSubjects.includes(enrollment.subject.name);
      });
      
      // Create recommendations based on these enrollments
      for (const subject of weakSubjects) {
        const subjectEnrollments = weakSubjectEnrollments.filter(
          e => e.subject && e.subject.name === subject
        );
        
        if (subjectEnrollments.length > 0) {
          // Calculate average score in this subject
          const grades = subjectEnrollments.map(e => e.currentPercentage).filter(g => g !== null) as number[];
          const averageGrade = grades.length > 0 
            ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length 
            : 0;
          
          recommendations.push({
            title: `Improve Performance in ${subject}`,
            description: `Your average grade in ${subject} is ${averageGrade.toFixed(1)}%. Focus on specific improvement strategies.`,
            actionItems: [
              `Find a tutor specialized in ${subject}`,
              "Create flashcards for key concepts",
              "Practice with online resources and educational apps"
            ]
          });
        }
      }
    }
    
    return recommendations;
  }
  
  calculateNcaaEligibility(gpa: number, enrollments: CourseEnrollment[], courseMap: Map<number, AcademicCourse>): {
    eligible: boolean;
    reason?: string;
    requirements: {
      gpaRequirement: { met: boolean; current: number; required: number; };
      coreCourseRequirement: { met: boolean; current: number; required: number; };
    };
  } {
    // NCAA Division I eligibility requirements:
    // - Minimum 2.3 GPA in core courses
    // - Complete 16 core courses (4 English, 3 math, 2 science, etc.)
    
    const minGPA = 2.3;
    const requiredCoreCourses = 16;
    
    // Count core courses (this is simplified, real NCAA has specific subject requirements)
    let coreCoursesCompleted = 0;
    
    for (const enrollment of enrollments) {
      // Get the course
      const course = courseMap.get(enrollment.courseId);
      
      // Check if it's a core course and completed
      if (course?.isCore && enrollment.status === 'completed') {
        coreCoursesCompleted++;
      }
    }
    
    // Check eligibility
    const gpaRequirementMet = gpa >= minGPA;
    const coreCourseRequirementMet = coreCoursesCompleted >= requiredCoreCourses;
    const eligible = gpaRequirementMet && coreCourseRequirementMet;
    
    let reason = undefined;
    if (!eligible) {
      if (!gpaRequirementMet && !coreCourseRequirementMet) {
        reason = `GPA below ${minGPA} and only ${coreCoursesCompleted}/${requiredCoreCourses} core courses completed`;
      } else if (!gpaRequirementMet) {
        reason = `GPA below required ${minGPA}`;
      } else {
        reason = `Only ${coreCoursesCompleted}/${requiredCoreCourses} core courses completed`;
      }
    }
    
    return {
      eligible,
      reason,
      requirements: {
        gpaRequirement: {
          met: gpaRequirementMet,
          current: gpa,
          required: minGPA
        },
        coreCourseRequirement: {
          met: coreCourseRequirementMet,
          current: coreCoursesCompleted,
          required: requiredCoreCourses
        }
      }
    };
  }
}

export default AcademicService.getInstance();