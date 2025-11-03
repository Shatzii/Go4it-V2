/**
 * Student ID Generator
 * Generates unique student IDs in format: STU-YYYY-XXXXXX
 * Example: STU-2025-000001
 */

import { db } from '../db';
import { students } from '../../shared/comprehensive-schema';
import { sql } from 'drizzle-orm';

export class StudentIdGenerator {
  /**
   * Generate a unique student ID
   * Format: STU-YYYY-XXXXXX
   * @returns {Promise<string>} Unique student ID
   */
  static async generateStudentId(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const yearPrefix = `STU-${currentYear}-`;
    
    try {
      // Get the highest student ID for current year
      const result = await db
        .select({ studentId: students.studentId })
        .from(students)
        .where(sql`${students.studentId} LIKE ${yearPrefix}%`)
        .orderBy(sql`${students.studentId} DESC`)
        .limit(1);

      let nextNumber = 1;
      
      if (result.length > 0 && result[0].studentId) {
        // Extract the number part (last 6 digits)
        const lastId = result[0].studentId;
        const numberPart = lastId.split('-')[2];
        nextNumber = parseInt(numberPart, 10) + 1;
      }

      // Format with leading zeros (6 digits)
      const paddedNumber = nextNumber.toString().padStart(6, '0');
      const newStudentId = `${yearPrefix}${paddedNumber}`;
      
      return newStudentId;
    } catch (error) {
      // Fallback to timestamp-based ID
      return `STU-${currentYear}-${Date.now().toString().slice(-6)}`;
    }
  }

  /**
   * Validate student ID format
   * @param {string} studentId - Student ID to validate
   * @returns {boolean} True if valid format
   */
  static isValidStudentId(studentId: string): boolean {
    const pattern = /^STU-\d{4}-\d{6}$/;
    return pattern.test(studentId);
  }

  /**
   * Extract year from student ID
   * @param {string} studentId - Student ID
   * @returns {number | null} Year or null if invalid
   */
  static extractYear(studentId: string): number | null {
    if (!this.isValidStudentId(studentId)) {
      return null;
    }
    const parts = studentId.split('-');
    return parseInt(parts[1], 10);
  }

  /**
   * Extract sequence number from student ID
   * @param {string} studentId - Student ID
   * @returns {number | null} Sequence number or null if invalid
   */
  static extractSequenceNumber(studentId: string): number | null {
    if (!this.isValidStudentId(studentId)) {
      return null;
    }
    const parts = studentId.split('-');
    return parseInt(parts[2], 10);
  }
}
