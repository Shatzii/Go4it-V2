import { 
  users, 
  garScores, 
  starpathProgress, 
  videos, 
  academicRecords, 
  achievements,
  cmsContent,
  cmsMenus,
  cmsSports,
  cmsAchievements,
  cmsSettings,
  type User, 
  type InsertUser,
  type GarScore,
  type InsertGarScore,
  type StarpathProgress,
  type InsertStarpathProgress,
  type Video,
  type InsertVideo,
  type AcademicRecord,
  type InsertAcademicRecord,
  type Achievement,
  type InsertAchievement,
  type CmsContent,
  type InsertCmsContent,
  type CmsMenu,
  type InsertCmsMenu,
  type CmsSports,
  type InsertCmsSports,
  type CmsAchievements,
  type InsertCmsAchievements,
  type CmsSettings,
  type InsertCmsSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // GAR Score operations
  getGarScoresByUser(userId: number): Promise<GarScore[]>;
  createGarScore(garScore: InsertGarScore): Promise<GarScore>;

  // StarPath operations
  getStarpathProgressByUser(userId: number): Promise<StarpathProgress[]>;
  createStarpathProgress(progress: InsertStarpathProgress): Promise<StarpathProgress>;
  addXpToUser(userId: number, skillId: string, xpAmount: number): Promise<void>;

  // Video operations
  getVideosByUser(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStatus(videoId: number, status: string): Promise<void>;

  // Academic operations
  getAcademicRecordByUser(userId: number): Promise<AcademicRecord | undefined>;
  createOrUpdateAcademicRecord(record: InsertAcademicRecord): Promise<AcademicRecord>;

  // Achievement operations
  getAchievementsByUser(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // CMS Content operations
  getAllContent(): Promise<CmsContent[]>;
  getContentBySlug(slug: string): Promise<CmsContent | undefined>;
  getContentByType(type: string): Promise<CmsContent[]>;
  createContent(content: InsertCmsContent): Promise<CmsContent>;
  updateContent(id: number, content: Partial<InsertCmsContent>): Promise<CmsContent>;
  deleteContent(id: number): Promise<void>;

  // CMS Menu operations
  getAllMenus(): Promise<CmsMenu[]>;
  getMenuByLocation(location: string): Promise<CmsMenu | undefined>;
  createMenu(menu: InsertCmsMenu): Promise<CmsMenu>;
  updateMenu(id: number, menu: Partial<InsertCmsMenu>): Promise<CmsMenu>;
  deleteMenu(id: number): Promise<void>;

  // CMS Sports operations
  getAllSports(): Promise<CmsSports[]>;
  getSportById(id: number): Promise<CmsSports | undefined>;
  createSport(sport: InsertCmsSports): Promise<CmsSports>;
  updateSport(id: number, sport: Partial<InsertCmsSports>): Promise<CmsSports>;
  deleteSport(id: number): Promise<void>;

  // CMS Achievements operations
  getAllCmsAchievements(): Promise<CmsAchievements[]>;
  getCmsAchievementById(id: string): Promise<CmsAchievements | undefined>;
  createCmsAchievement(achievement: InsertCmsAchievements): Promise<CmsAchievements>;
  updateCmsAchievement(id: number, achievement: Partial<InsertCmsAchievements>): Promise<CmsAchievements>;
  deleteCmsAchievement(id: number): Promise<void>;

  // CMS Settings operations
  getAllSettings(): Promise<CmsSettings[]>;
  getSettingByKey(key: string): Promise<CmsSettings | undefined>;
  getSettingsByCategory(category: string): Promise<CmsSettings[]>;
  createSetting(setting: InsertCmsSettings): Promise<CmsSettings>;
  updateSetting(key: string, value: string): Promise<CmsSettings>;
  deleteSetting(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create default StarPath skills for new user
    await this.initializeDefaultSkills(user.id);
    
    return user;
  }

  // GAR Score operations
  async getGarScoresByUser(userId: number): Promise<GarScore[]> {
    return await db
      .select()
      .from(garScores)
      .where(eq(garScores.userId, userId))
      .orderBy(desc(garScores.createdAt));
  }

  async createGarScore(garScore: InsertGarScore): Promise<GarScore> {
    const [newScore] = await db
      .insert(garScores)
      .values(garScore)
      .returning();

    // Award XP based on score
    const xpReward = Math.floor(newScore.overallScore / 2); // 50 XP for 100 score
    await this.addXpToUser(newScore.userId, "video_analysis", xpReward);

    return newScore;
  }

  // StarPath operations
  async getStarpathProgressByUser(userId: number): Promise<StarpathProgress[]> {
    return await db
      .select()
      .from(starpathProgress)
      .where(eq(starpathProgress.userId, userId))
      .orderBy(desc(starpathProgress.level));
  }

  async createStarpathProgress(progress: InsertStarpathProgress): Promise<StarpathProgress> {
    const [newProgress] = await db
      .insert(starpathProgress)
      .values(progress)
      .returning();
    return newProgress;
  }

  async addXpToUser(userId: number, skillId: string, xpAmount: number): Promise<void> {
    // Find or create the skill progress
    const [existingProgress] = await db
      .select()
      .from(starpathProgress)
      .where(and(eq(starpathProgress.userId, userId), eq(starpathProgress.skillId, skillId)));

    if (existingProgress) {
      const newXP = existingProgress.xpPoints + xpAmount;
      const newLevel = Math.floor(newXP / 1000) + 1; // Level up every 1000 XP

      await db
        .update(starpathProgress)
        .set({
          xpPoints: newXP,
          level: newLevel,
          updatedAt: new Date(),
        })
        .where(eq(starpathProgress.id, existingProgress.id));
    } else {
      // Create new skill progress
      await this.createStarpathProgress({
        userId,
        skillId,
        skillName: this.getSkillNameById(skillId),
        xpPoints: xpAmount,
        level: 1,
        isUnlocked: true,
        unlockedAt: new Date(),
      });
    }
  }

  // Video operations
  async getVideosByUser(userId: number): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.uploadDate));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(video)
      .returning();
    return newVideo;
  }

  async updateVideoStatus(videoId: number, status: string): Promise<void> {
    await db
      .update(videos)
      .set({
        analysisStatus: status,
        processedAt: status === "completed" ? new Date() : null,
      })
      .where(eq(videos.id, videoId));
  }

  // Academic operations
  async getAcademicRecordByUser(userId: number): Promise<AcademicRecord | undefined> {
    const [record] = await db
      .select()
      .from(academicRecords)
      .where(eq(academicRecords.userId, userId));
    return record || undefined;
  }

  async createOrUpdateAcademicRecord(record: InsertAcademicRecord): Promise<AcademicRecord> {
    const existing = await this.getAcademicRecordByUser(record.userId);
    
    if (existing) {
      const [updated] = await db
        .update(academicRecords)
        .set({
          ...record,
          updatedAt: new Date(),
        })
        .where(eq(academicRecords.userId, record.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(academicRecords)
        .values(record)
        .returning();
      return created;
    }
  }

  // Achievement operations
  async getAchievementsByUser(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  // Helper methods
  private async initializeDefaultSkills(userId: number): Promise<void> {
    const defaultSkills = [
      {
        userId,
        skillId: "shooting_accuracy",
        skillName: "Shooting Accuracy",
        xpPoints: 0,
        level: 1,
        isUnlocked: true,
        unlockedAt: new Date(),
      },
      {
        userId,
        skillId: "ball_handling",
        skillName: "Ball Handling",
        xpPoints: 0,
        level: 1,
        isUnlocked: true,
        unlockedAt: new Date(),
      },
    ];

    for (const skill of defaultSkills) {
      await this.createStarpathProgress(skill);
    }
  }

  private getSkillNameById(skillId: string): string {
    const skillNames: Record<string, string> = {
      "shooting_accuracy": "Shooting Accuracy",
      "ball_handling": "Ball Handling",
      "speed_agility": "Speed & Agility",
      "defense_fundamentals": "Defense Fundamentals",
      "team_strategy": "Team Strategy",
      "video_analysis": "Video Analysis",
    };
    return skillNames[skillId] || skillId;
  }

  // CMS Content operations
  async getAllContent(): Promise<CmsContent[]> {
    return await db.select().from(cmsContent).orderBy(desc(cmsContent.updatedAt));
  }

  async getContentBySlug(slug: string): Promise<CmsContent | undefined> {
    const [content] = await db.select().from(cmsContent).where(eq(cmsContent.slug, slug));
    return content;
  }

  async getContentByType(type: string): Promise<CmsContent[]> {
    return await db.select().from(cmsContent).where(eq(cmsContent.type, type));
  }

  async createContent(content: InsertCmsContent): Promise<CmsContent> {
    const [newContent] = await db.insert(cmsContent).values(content).returning();
    return newContent;
  }

  async updateContent(id: number, contentData: Partial<InsertCmsContent>): Promise<CmsContent> {
    const [updatedContent] = await db
      .update(cmsContent)
      .set({ ...contentData, updatedAt: new Date() })
      .where(eq(cmsContent.id, id))
      .returning();
    return updatedContent;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(cmsContent).where(eq(cmsContent.id, id));
  }

  // CMS Menu operations
  async getAllMenus(): Promise<CmsMenu[]> {
    return await db.select().from(cmsMenus).orderBy(cmsMenus.name);
  }

  async getMenuByLocation(location: string): Promise<CmsMenu | undefined> {
    const [menu] = await db.select().from(cmsMenus).where(
      and(eq(cmsMenus.location, location), eq(cmsMenus.isActive, true))
    );
    return menu;
  }

  async createMenu(menu: InsertCmsMenu): Promise<CmsMenu> {
    const [newMenu] = await db.insert(cmsMenus).values(menu).returning();
    return newMenu;
  }

  async updateMenu(id: number, menuData: Partial<InsertCmsMenu>): Promise<CmsMenu> {
    const [updatedMenu] = await db
      .update(cmsMenus)
      .set({ ...menuData, updatedAt: new Date() })
      .where(eq(cmsMenus.id, id))
      .returning();
    return updatedMenu;
  }

  async deleteMenu(id: number): Promise<void> {
    await db.delete(cmsMenus).where(eq(cmsMenus.id, id));
  }

  // CMS Sports operations
  async getAllSports(): Promise<CmsSports[]> {
    return await db.select().from(cmsSports).orderBy(cmsSports.displayOrder, cmsSports.name);
  }

  async getSportById(id: number): Promise<CmsSports | undefined> {
    const [sport] = await db.select().from(cmsSports).where(eq(cmsSports.id, id));
    return sport;
  }

  async createSport(sport: InsertCmsSports): Promise<CmsSports> {
    const [newSport] = await db.insert(cmsSports).values(sport).returning();
    return newSport;
  }

  async updateSport(id: number, sportData: Partial<InsertCmsSports>): Promise<CmsSports> {
    const [updatedSport] = await db
      .update(cmsSports)
      .set({ ...sportData, updatedAt: new Date() })
      .where(eq(cmsSports.id, id))
      .returning();
    return updatedSport;
  }

  async deleteSport(id: number): Promise<void> {
    await db.delete(cmsSports).where(eq(cmsSports.id, id));
  }

  // CMS Achievements operations
  async getAllCmsAchievements(): Promise<CmsAchievements[]> {
    return await db.select().from(cmsAchievements).orderBy(cmsAchievements.category, cmsAchievements.title);
  }

  async getCmsAchievementById(achievementId: string): Promise<CmsAchievements | undefined> {
    const [achievement] = await db.select().from(cmsAchievements).where(eq(cmsAchievements.achievementId, achievementId));
    return achievement;
  }

  async createCmsAchievement(achievement: InsertCmsAchievements): Promise<CmsAchievements> {
    const [newAchievement] = await db.insert(cmsAchievements).values(achievement).returning();
    return newAchievement;
  }

  async updateCmsAchievement(id: number, achievementData: Partial<InsertCmsAchievements>): Promise<CmsAchievements> {
    const [updatedAchievement] = await db
      .update(cmsAchievements)
      .set({ ...achievementData, updatedAt: new Date() })
      .where(eq(cmsAchievements.id, id))
      .returning();
    return updatedAchievement;
  }

  async deleteCmsAchievement(id: number): Promise<void> {
    await db.delete(cmsAchievements).where(eq(cmsAchievements.id, id));
  }

  // CMS Settings operations
  async getAllSettings(): Promise<CmsSettings[]> {
    return await db.select().from(cmsSettings).orderBy(cmsSettings.category, cmsSettings.key);
  }

  async getSettingByKey(key: string): Promise<CmsSettings | undefined> {
    const [setting] = await db.select().from(cmsSettings).where(eq(cmsSettings.key, key));
    return setting;
  }

  async getSettingsByCategory(category: string): Promise<CmsSettings[]> {
    return await db.select().from(cmsSettings).where(eq(cmsSettings.category, category));
  }

  async createSetting(setting: InsertCmsSettings): Promise<CmsSettings> {
    const [newSetting] = await db.insert(cmsSettings).values(setting).returning();
    return newSetting;
  }

  async updateSetting(key: string, value: string): Promise<CmsSettings> {
    const [updatedSetting] = await db
      .update(cmsSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(cmsSettings.key, key))
      .returning();
    return updatedSetting;
  }

  async deleteSetting(id: number): Promise<void> {
    await db.delete(cmsSettings).where(eq(cmsSettings.id, id));
  }
}

export const storage = new DatabaseStorage();
