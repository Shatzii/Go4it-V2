/**
 * StarPath XP & Achievement Tracking Utility
 * Handles XP awards, achievement unlocks, and milestone progress
 */

interface XPConfig {
  // Academic Activities
  lesson_completed: number;
  quiz_passed_90plus: number;
  quiz_passed_80plus: number;
  quiz_passed_70plus: number;
  assignment_submitted_ontime: number;
  assignment_submitted_late: number;
  course_completed: number;
  perfect_quiz_score: number;
  
  // Athletic Activities
  video_uploaded: number;
  highlight_reel_created: number;
  gar_session_completed: number;
  gar_score_improvement: number; // Per point improved
  gar_elite_score_90plus: number;
  
  // NCAA Progress
  ncaa_core_course_completed: number;
  ncaa_gpa_milestone: number; // 3.0, 3.5, 4.0
  ncaa_eligibility_achieved: number;
  
  // Scholarship & Recruiting
  recruiter_contact_initiated: number;
  scholarship_interest_received: number;
  official_visit_scheduled: number;
  scholarship_offer_received: number;
  scholarship_offer_accepted: number;
  
  // Engagement
  daily_login: number;
  login_streak_bonus: number; // Per day in streak
  forum_post_created: number;
  forum_post_helpful: number;
  study_group_joined: number;
  event_attended: number;
  
  // Milestones
  first_star_achievement: number;
  second_star_achievement: number;
  third_star_achievement: number;
  fourth_star_achievement: number;
  fifth_star_achievement: number;
}

export const XP_VALUES: XPConfig = {
  // Academic
  lesson_completed: 50,
  quiz_passed_90plus: 150,
  quiz_passed_80plus: 100,
  quiz_passed_70plus: 75,
  assignment_submitted_ontime: 100,
  assignment_submitted_late: 50,
  course_completed: 500,
  perfect_quiz_score: 200,
  
  // Athletic
  video_uploaded: 75,
  highlight_reel_created: 200,
  gar_session_completed: 100,
  gar_score_improvement: 10,
  gar_elite_score_90plus: 300,
  
  // NCAA
  ncaa_core_course_completed: 250,
  ncaa_gpa_milestone: 400,
  ncaa_eligibility_achieved: 1000,
  
  // Scholarship
  recruiter_contact_initiated: 50,
  scholarship_interest_received: 200,
  official_visit_scheduled: 300,
  scholarship_offer_received: 1000,
  scholarship_offer_accepted: 2000,
  
  // Engagement
  daily_login: 25,
  login_streak_bonus: 5,
  forum_post_created: 30,
  forum_post_helpful: 50,
  study_group_joined: 75,
  event_attended: 100,
  
  // Milestones
  first_star_achievement: 500,
  second_star_achievement: 1000,
  third_star_achievement: 2000,
  fourth_star_achievement: 4000,
  fifth_star_achievement: 10000,
};

/**
 * Calculate level from total XP
 * Level formula: Level = floor(sqrt(XP / 100))
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Calculate XP required for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  return (currentLevel * currentLevel) * 100;
}

/**
 * Calculate XP progress to next level
 */
export function xpProgressToNextLevel(totalXP: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = ((currentLevel - 1) * (currentLevel - 1)) * 100;
  const xpForNext = xpForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNext - xpForCurrentLevel;
  const progressPercent = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  
  return {
    currentLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
  };
}

/**
 * Calculate star rating based on multiple factors
 */
export function calculateStarRating(data: {
  avgGarScore: number;
  coreGPA: number;
  ncaaEligibilityScore: number;
  scholarshipOffers: number;
  totalXP: number;
}): number {
  let rating = 1.0;
  
  // GAR Score contribution (up to 1.5 stars)
  if (data.avgGarScore >= 90) rating += 1.5;
  else if (data.avgGarScore >= 85) rating += 1.25;
  else if (data.avgGarScore >= 80) rating += 1.0;
  else if (data.avgGarScore >= 75) rating += 0.75;
  else if (data.avgGarScore >= 70) rating += 0.5;
  else if (data.avgGarScore >= 65) rating += 0.25;
  
  // NCAA Eligibility (up to 1.0 star)
  if (data.ncaaEligibilityScore >= 95) rating += 1.0;
  else if (data.ncaaEligibilityScore >= 80) rating += 0.75;
  else if (data.ncaaEligibilityScore >= 60) rating += 0.5;
  else if (data.ncaaEligibilityScore >= 40) rating += 0.25;
  
  // Core GPA (up to 1.0 star)
  if (data.coreGPA >= 4.0) rating += 1.0;
  else if (data.coreGPA >= 3.7) rating += 0.75;
  else if (data.coreGPA >= 3.5) rating += 0.5;
  else if (data.coreGPA >= 3.0) rating += 0.25;
  
  // Scholarship offers (up to 1.0 star)
  if (data.scholarshipOffers >= 5) rating += 1.0;
  else if (data.scholarshipOffers >= 3) rating += 0.75;
  else if (data.scholarshipOffers >= 2) rating += 0.5;
  else if (data.scholarshipOffers >= 1) rating += 0.25;
  
  // XP/Level bonus (up to 0.5 star)
  const level = calculateLevel(data.totalXP);
  if (level >= 50) rating += 0.5;
  else if (level >= 40) rating += 0.4;
  else if (level >= 30) rating += 0.3;
  else if (level >= 20) rating += 0.2;
  else if (level >= 10) rating += 0.1;
  
  // Cap at 5.0 stars
  return Math.min(5.0, Math.round(rating * 10) / 10);
}

/**
 * Get GAR milestone based on average score
 */
export function getGarMilestone(avgScore: number): string {
  if (avgScore >= 90) return 'elite';
  if (avgScore >= 85) return 'advanced';
  if (avgScore >= 75) return 'proficient';
  if (avgScore >= 65) return 'developing';
  return 'beginner';
}

/**
 * Get NCAA status based on eligibility score and core requirements
 */
export function getNcaaStatus(eligibilityScore: number, coreGPA: number, coreCredits: number): string {
  if (eligibilityScore >= 95 && coreGPA >= 2.3 && coreCredits >= 16) return 'eligible';
  if (eligibilityScore >= 90 && coreGPA >= 2.3 && coreCredits >= 16) return 'certified';
  if (eligibilityScore >= 75 && coreGPA >= 2.0) return 'on_track';
  if (eligibilityScore >= 50) return 'in_progress';
  if (eligibilityScore < 40) return 'at_risk';
  return 'not_started';
}

/**
 * Award XP and log activity
 */
export async function awardXP(
  userId: string,
  activityType: keyof XPConfig,
  description: string,
  options?: {
    relatedEntityType?: string;
    relatedEntityId?: string;
    multiplier?: number;
  }
): Promise<{ xpAwarded: number; newTotalXP: number; leveledUp: boolean; newLevel?: number }> {
  const baseXP = XP_VALUES[activityType];
  const multiplier = options?.multiplier || 1.0;
  const xpAwarded = Math.round(baseXP * multiplier);
  
  try {
    const response = await fetch('/api/starpath/award-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        activityType,
        description,
        xpAwarded,
        multiplier,
        relatedEntityType: options?.relatedEntityType,
        relatedEntityId: options?.relatedEntityId,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        xpAwarded,
        newTotalXP: data.totalXP,
        leveledUp: data.leveledUp,
        newLevel: data.newLevel,
      };
    }
  } catch (error) {
    // Log error but don't throw
  }
  
  return {
    xpAwarded,
    newTotalXP: 0,
    leveledUp: false,
  };
}

/**
 * Check and unlock achievements
 */
export async function checkAchievements(userId: string, progressData: any): Promise<string[]> {
  try {
    const response = await fetch('/api/starpath/check-achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, progressData }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.unlockedAchievements || [];
    }
  } catch (error) {
    // Log error
  }
  
  return [];
}

/**
 * Update milestone progress
 */
export async function updateMilestoneProgress(userId: string): Promise<void> {
  try {
    await fetch('/api/starpath/update-milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  } catch (error) {
    // Log error
  }
}

/**
 * Get XP multiplier bonuses
 */
export function getXPMultiplier(data: {
  loginStreak?: number;
  currentGPA?: number;
  isPremium?: boolean;
}): number {
  let multiplier = 1.0;
  
  // Streak bonus (up to 50% bonus)
  if (data.loginStreak) {
    if (data.loginStreak >= 30) multiplier += 0.5;
    else if (data.loginStreak >= 14) multiplier += 0.3;
    else if (data.loginStreak >= 7) multiplier += 0.2;
    else if (data.loginStreak >= 3) multiplier += 0.1;
  }
  
  // GPA bonus (up to 25% bonus)
  if (data.currentGPA) {
    if (data.currentGPA >= 4.0) multiplier += 0.25;
    else if (data.currentGPA >= 3.7) multiplier += 0.2;
    else if (data.currentGPA >= 3.5) multiplier += 0.15;
    else if (data.currentGPA >= 3.0) multiplier += 0.1;
  }
  
  // Premium bonus (25% bonus)
  if (data.isPremium) {
    multiplier += 0.25;
  }
  
  return multiplier;
}

const starPathXP = {
  XP_VALUES,
  calculateLevel,
  xpForNextLevel,
  xpProgressToNextLevel,
  calculateStarRating,
  getGarMilestone,
  getNcaaStatus,
  awardXP,
  checkAchievements,
  updateMilestoneProgress,
  getXPMultiplier,
};

export default starPathXP;
