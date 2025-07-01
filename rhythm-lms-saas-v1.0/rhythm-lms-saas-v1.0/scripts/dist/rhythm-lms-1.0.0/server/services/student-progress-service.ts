import { 
  StudentProgress, 
  InsertStudentProgress,
  AssessmentResult,
  InsertAssessmentResult,
  StudentActivityLog,
  InsertStudentActivityLog,
  StudentAchievement,
  Student
} from '@shared/schema';
import { storage } from '../storage';

/**
 * Service for tracking and managing student progress, assessments, activities and achievements
 */
class StudentProgressService {
  /**
   * Get a student by ID
   */
  async getStudent(studentId: number): Promise<Student | undefined> {
    return storage.getStudent(studentId);
  }
  
  /**
   * Get progress data for a student
   */
  async getStudentProgress(studentId: number): Promise<StudentProgress[]> {
    return storage.getStudentProgress(studentId);
  }
  
  /**
   * Update progress for a student on a specific standard, objective, activity, or assessment
   */
  async updateStudentProgress(studentId: number, progressData: Partial<InsertStudentProgress>): Promise<StudentProgress> {
    return storage.updateStudentProgress(studentId, progressData);
  }
  
  /**
   * Get progress statistics for a student
   */
  async getStudentProgressStats(studentId: number) {
    const progress = await storage.getStudentProgress(studentId);
    
    // Calculate statistics from progress data
    const totalItems = progress.length;
    let completedItems = 0;
    let masteredItems = 0;
    let totalScore = 0;
    let scoredItems = 0;
    let totalTimeSpent = 0;
    
    progress.forEach(item => {
      if (item.status === 'completed' || item.status === 'mastered') {
        completedItems++;
      }
      
      if (item.status === 'mastered') {
        masteredItems++;
      }
      
      if (item.bestScore !== null && item.bestScore !== undefined) {
        totalScore += item.bestScore;
        scoredItems++;
      }
      
      if (item.timeSpent) {
        totalTimeSpent += item.timeSpent;
      }
    });
    
    const averageScore = scoredItems > 0 ? Math.round(totalScore / scoredItems) : 0;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const masteryRate = totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;
    
    // Get breakdown by subject area
    const subjectBreakdown: Record<string, {
      total: number;
      completed: number;
      mastered: number;
      averageScore: number;
    }> = {};
    
    // To be implemented with additional subject data from standards/objectives
    
    return {
      totalItems,
      completedItems,
      masteredItems,
      completionRate,
      masteryRate,
      averageScore,
      totalTimeSpent,
      subjectBreakdown
    };
  }
  
  /**
   * Record completion of an activity
   */
  async recordActivityCompletion(
    studentId: number,
    activityId: number,
    data: {
      timeSpent: number;
      pointsEarned?: number;
      completionDate?: string;
      metadata?: any;
    }
  ): Promise<StudentProgress> {
    // Update student progress
    const progressData: Partial<InsertStudentProgress> = {
      activityId,
      status: 'completed',
      timeSpent: data.timeSpent,
      completionDate: data.completionDate ? new Date(data.completionDate) : new Date(),
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined
    };
    
    const progress = await storage.updateStudentProgress(studentId, progressData);
    
    // Log the activity
    await storage.logStudentActivity(studentId, {
      activityType: 'activity_complete',
      activityId,
      duration: data.timeSpent,
      achievementPoints: data.pointsEarned,
      details: { 
        activityId,
        timeSpent: data.timeSpent,
        completionDate: data.completionDate
      }
    });
    
    // Check for achievements
    await this.checkActivityAchievements(studentId, activityId);
    
    return progress;
  }
  
  /**
   * Record assessment result
   */
  async recordAssessmentResult(
    studentId: number,
    assessmentId: number,
    data: {
      score: number;
      timeTaken: number;
      answers: any;
      feedback?: any;
      completionStatus: string;
      startedAt: string;
      completedAt?: string;
      metadata?: any;
    }
  ): Promise<AssessmentResult> {
    // Create assessment result
    const resultData: InsertAssessmentResult = {
      studentId,
      assessmentId,
      score: data.score,
      timeTaken: data.timeTaken,
      answers: JSON.stringify(data.answers),
      feedback: data.feedback ? JSON.stringify(data.feedback) : null,
      completionStatus: data.completionStatus,
      startedAt: new Date(data.startedAt),
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null
    };
    
    const result = await storage.createAssessmentResult(resultData);
    
    // Update student progress
    const progressData: Partial<InsertStudentProgress> = {
      assessmentId,
      status: data.score >= 80 ? 'mastered' : 'completed',
      timeSpent: Math.round(data.timeTaken / 60), // Convert seconds to minutes
      latestScore: data.score,
      bestScore: data.score, // For a new result, latest is the best
      attempts: 1,
      completionDate: data.completedAt ? new Date(data.completedAt) : new Date(),
    };
    
    await storage.updateStudentProgress(studentId, progressData);
    
    // Log the activity
    await storage.logStudentActivity(studentId, {
      activityType: 'assessment_complete',
      activityId: assessmentId,
      duration: data.timeTaken,
      achievementPoints: Math.round(data.score / 10), // Simple conversion of score to points
      details: { 
        assessmentId,
        score: data.score,
        timeTaken: data.timeTaken,
        completionStatus: data.completionStatus
      }
    });
    
    // Check for achievements
    await this.checkAssessmentAchievements(studentId, assessmentId, data.score);
    
    return result;
  }
  
  /**
   * Get student achievements
   */
  async getStudentAchievements(studentId: number): Promise<StudentAchievement[]> {
    return storage.getStudentAchievements(studentId);
  }
  
  /**
   * Award achievement to student
   */
  async awardAchievement(
    studentId: number,
    achievementId: number,
    metadata?: any
  ): Promise<StudentAchievement> {
    const result = await storage.awardAchievement(studentId, achievementId, metadata);
    
    // Log the achievement
    await storage.logStudentActivity(studentId, {
      activityType: 'achievement_earned',
      achievementPoints: 0, // Points would be specified on the achievement itself
      details: { achievementId }
    });
    
    return result;
  }
  
  /**
   * Log student activity
   */
  async logStudentActivity(
    studentId: number,
    activityData: Partial<InsertStudentActivityLog>
  ): Promise<StudentActivityLog> {
    return storage.logStudentActivity(studentId, activityData);
  }
  
  /**
   * Check for and award achievements based on activity completion
   */
  private async checkActivityAchievements(studentId: number, activityId: number): Promise<void> {
    // Get count of completed activities
    const progressItems = await storage.getStudentProgress(studentId);
    const completedActivities = progressItems.filter(
      p => p.activityId !== null && (p.status === 'completed' || p.status === 'mastered')
    ).length;
    
    // Check for milestone achievements
    if (completedActivities === 1) {
      // First activity achievement
      const firstActivityAchievement = await storage.getAchievementByCode('first_activity');
      if (firstActivityAchievement) {
        await this.awardAchievement(studentId, firstActivityAchievement.id);
      }
    } else if (completedActivities === 5) {
      // 5 activities achievement
      const fiveActivitiesAchievement = await storage.getAchievementByCode('five_activities');
      if (fiveActivitiesAchievement) {
        await this.awardAchievement(studentId, fiveActivitiesAchievement.id);
      }
    } else if (completedActivities === 10) {
      // 10 activities achievement
      const tenActivitiesAchievement = await storage.getAchievementByCode('ten_activities');
      if (tenActivitiesAchievement) {
        await this.awardAchievement(studentId, tenActivitiesAchievement.id);
      }
    }
    
    // Note: In a real implementation, we would check for more specific achievements
    // related to the particular activity, subject area, etc.
  }
  
  /**
   * Check for and award achievements based on assessment results
   */
  private async checkAssessmentAchievements(
    studentId: number, 
    assessmentId: number, 
    score: number
  ): Promise<void> {
    // Get count of completed assessments
    const results = await storage.getAssessmentResults(studentId);
    const completedAssessments = results.length;
    
    // Check for milestone achievements
    if (completedAssessments === 1) {
      // First assessment achievement
      const firstAssessmentAchievement = await storage.getAchievementByCode('first_assessment');
      if (firstAssessmentAchievement) {
        await this.awardAchievement(studentId, firstAssessmentAchievement.id);
      }
    } else if (completedAssessments === 5) {
      // 5 assessments achievement
      const fiveAssessmentsAchievement = await storage.getAchievementByCode('five_assessments');
      if (fiveAssessmentsAchievement) {
        await this.awardAchievement(studentId, fiveAssessmentsAchievement.id);
      }
    }
    
    // Check for score-based achievements
    if (score >= 100) {
      // Perfect score achievement
      const perfectScoreAchievement = await storage.getAchievementByCode('perfect_score');
      if (perfectScoreAchievement) {
        await this.awardAchievement(studentId, perfectScoreAchievement.id);
      }
    } else if (score >= 90) {
      // Excellence achievement
      const excellenceAchievement = await storage.getAchievementByCode('excellence');
      if (excellenceAchievement) {
        await this.awardAchievement(studentId, excellenceAchievement.id);
      }
    }
    
    // Note: In a real implementation, we would check for more specific achievements
    // related to the particular assessment, subject area, etc.
  }
}

export const studentProgressService = new StudentProgressService();