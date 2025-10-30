import { db } from './db';
import { users, courses, academyEnrollments, academySubmissions } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { LMS_CONFIG, type LMSCourse } from './lms-config';

export class LMSIntegration {
  private baseUrl: string;
  private wsToken: string;

  constructor() {
    this.baseUrl = LMS_CONFIG.moodle.url;
    this.wsToken = LMS_CONFIG.moodle.wsToken || 'development-token';
  }

  // Sync Go4It user to LMS
  async syncUser(userId: number) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      if (!user) throw new Error('User not found');

      // Create LMS user account
      const lmsUser = {
        username: user.username,
        email: user.email,
        firstname: user.firstName || user.name?.split(' ')[0] || 'Student',
        lastname: user.lastName || user.name?.split(' ')[1] || 'Athlete',
        auth: 'manual',
        password: 'Go4It2025!', // Temporary password, will use SSO
        customfields: [
          { type: 'sport', value: user.sport || 'General' },
          { type: 'role', value: user.role },
          { type: 'graduationYear', value: user.graduationYear?.toString() || '2025' },
        ],
      };

      return this.callLMSWebService('core_user_create_users', {
        users: [lmsUser],
      });
    } catch (error) {
      console.error('Error syncing user to LMS:', error);
      throw error;
    }
  }

  // Bulk sync all Go4It users
  async syncAllUsers() {
    try {
      const allUsers = await db.select().from(users);
      const results = [];

      for (const user of allUsers) {
        try {
          const result = await this.syncUser(user.id);
          results.push({ userId: user.id, success: true, result });
        } catch (error) {
          results.push({ userId: user.id, success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('Error bulk syncing users:', error);
      throw error;
    }
  }

  // Get LMS courses and sync to Go4It
  async syncCourses() {
    try {
      // Get all LMS courses
      const lmsCourses = await this.callLMSWebService('core_course_get_courses');

      // Sync to Go4It database
      for (const lmsCourse of lmsCourses) {
        await db
          .insert(courses)
          .values({
            title: lmsCourse.fullname,
            description: lmsCourse.summary,
            code: lmsCourse.shortname,
            credits: '3.0', // Default credits as string
            instructor: 'LMS Instructor',
            difficulty: 'Intermediate',
            subjects: ['Sports Science'], // Direct array, not JSON string
            isActive: true,
          })
          .onConflictDoNothing();
      }

      return lmsCourses;
    } catch (error) {
      console.error('Error syncing courses:', error);
      throw error;
    }
  }

  // Enroll user in LMS course
  async enrollUser(userId: number, courseId: string) {
    try {
      return await this.callLMSWebService('enrol_manual_enrol_users', {
        enrolments: [
          {
            roleid: 5, // Student role
            userid: userId,
            courseid: courseId,
          },
        ],
      });
    } catch (error) {
      console.error('Error enrolling user:', error);
      throw error;
    }
  }

  // Sync grades from LMS to Go4It
  async syncGrades(userId: number) {
    try {
      const grades = await this.callLMSWebService('core_grades_get_grades', {
        courseid: 0, // All courses
        userid: userId,
      });

      // Update Go4It grades database
      for (const grade of grades.items || []) {
        await db
          .insert(academySubmissions)
          .values({
            studentId: userId,
            assignmentId: parseInt(grade.itemid),
            grade: grade.graderaw ? parseFloat(grade.graderaw) : 0,
            feedback: grade.feedback || '',
            submittedAt: new Date(),
            gradedAt: new Date(),
          })
          .onConflictDoNothing();
      }

      return grades;
    } catch (error) {
      console.error('Error syncing grades:', error);
      throw error;
    }
  }

  // Create LMS assignment from Go4It assignment
  async createAssignment(courseId: string, assignment: any) {
    try {
      return await this.callLMSWebService('mod_assign_save_submission', {
        assignmentid: assignment.id,
        plugindata: {
          onlinetext_editor: {
            text: assignment.description,
            format: 1,
          },
        },
      });
    } catch (error) {
      console.error('Error creating LMS assignment:', error);
      throw error;
    }
  }

  // Get LMS analytics
  async getAnalytics(userId?: number) {
    try {
      const params = userId ? { userid: userId } : {};
      return await this.callLMSWebService('core_analytics_get_predictions', params);
    } catch (error) {
      console.error('Error getting LMS analytics:', error);
      return null;
    }
  }

  // Private method to call LMS web service
  private async callLMSWebService(functionName: string, params: any = {}) {
    try {
      const url = new URL(this.baseUrl + LMS_CONFIG.moodle.apiEndpoint);
      url.searchParams.set('wstoken', this.wsToken);
      url.searchParams.set('wsfunction', functionName);
      url.searchParams.set('moodlewsrestformat', 'json');

      // Add parameters
      Object.keys(params).forEach((key) => {
        if (typeof params[key] === 'object') {
          url.searchParams.set(key, JSON.stringify(params[key]));
        } else {
          url.searchParams.set(key, params[key]);
        }
      });

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`LMS API call failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.exception) {
        throw new Error(`LMS Error: ${data.message}`);
      }

      return data;
    } catch (error) {
      console.error(`LMS Web Service call failed for ${functionName}:`, error);
      throw error;
    }
  }
}

export const lmsIntegration = new LMSIntegration();
