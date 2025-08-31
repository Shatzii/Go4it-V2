// Database Storage Implementation replacing mock data
import { db } from './db';
import {
  users,
  socialMediaAccounts,
  socialMediaPosts,
  subscriptions,
  type User,
  type UpsertUser,
  type SocialMediaAccount,
  type InsertSocialMediaAccount,
  type SocialMediaPost,
  type InsertSocialMediaPost,
  type Subscription,
  type InsertSubscription,
} from '@/shared/schema';
import { eq, and, desc, count, sql } from 'drizzle-orm';

export class DatabaseStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw new Error('Failed to save user data');
    }
  }

  // Social Media Account operations
  async getSocialMediaAccounts(userId: string): Promise<SocialMediaAccount[]> {
    try {
      return await db
        .select()
        .from(socialMediaAccounts)
        .where(and(eq(socialMediaAccounts.userId, userId), eq(socialMediaAccounts.isActive, true)))
        .orderBy(desc(socialMediaAccounts.createdAt));
    } catch (error) {
      console.error('Error getting social media accounts:', error);
      return [];
    }
  }

  async getSocialMediaAccount(accountId: string): Promise<SocialMediaAccount | undefined> {
    try {
      const [account] = await db
        .select()
        .from(socialMediaAccounts)
        .where(eq(socialMediaAccounts.id, accountId));
      return account;
    } catch (error) {
      console.error('Error getting social media account:', error);
      return undefined;
    }
  }

  async createSocialMediaAccount(
    accountData: InsertSocialMediaAccount,
  ): Promise<SocialMediaAccount> {
    try {
      const [account] = await db.insert(socialMediaAccounts).values(accountData).returning();
      return account;
    } catch (error) {
      console.error('Error creating social media account:', error);
      throw new Error('Failed to create social media account');
    }
  }

  async updateSocialMediaAccount(
    accountId: string,
    updates: Partial<SocialMediaAccount>,
  ): Promise<SocialMediaAccount | undefined> {
    try {
      const [account] = await db
        .update(socialMediaAccounts)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(socialMediaAccounts.id, accountId))
        .returning();
      return account;
    } catch (error) {
      console.error('Error updating social media account:', error);
      return undefined;
    }
  }

  async deactivateSocialMediaAccount(accountId: string): Promise<boolean> {
    try {
      await db
        .update(socialMediaAccounts)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(socialMediaAccounts.id, accountId));
      return true;
    } catch (error) {
      console.error('Error deactivating social media account:', error);
      return false;
    }
  }

  // Social Media Posts operations
  async createSocialMediaPost(postData: InsertSocialMediaPost): Promise<SocialMediaPost> {
    try {
      const [post] = await db.insert(socialMediaPosts).values(postData).returning();
      return post;
    } catch (error) {
      console.error('Error creating social media post:', error);
      throw new Error('Failed to create social media post');
    }
  }

  async getSocialMediaPosts(userId: string, limit: number = 10): Promise<SocialMediaPost[]> {
    try {
      return await db
        .select()
        .from(socialMediaPosts)
        .where(eq(socialMediaPosts.userId, userId))
        .orderBy(desc(socialMediaPosts.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error getting social media posts:', error);
      return [];
    }
  }

  async getPostAnalytics(userId: string, timeframe: string = '30d'): Promise<any> {
    try {
      const [totalPosts] = await db
        .select({ count: count() })
        .from(socialMediaPosts)
        .where(eq(socialMediaPosts.userId, userId));

      const [postsToday] = await db
        .select({ count: count() })
        .from(socialMediaPosts)
        .where(and(eq(socialMediaPosts.userId, userId), sql`DATE(created_at) = CURRENT_DATE`));

      const [postsThisWeek] = await db
        .select({ count: count() })
        .from(socialMediaPosts)
        .where(
          and(eq(socialMediaPosts.userId, userId), sql`created_at >= NOW() - INTERVAL '7 days'`),
        );

      const recentPosts = await db
        .select()
        .from(socialMediaPosts)
        .where(eq(socialMediaPosts.userId, userId))
        .orderBy(desc(socialMediaPosts.createdAt))
        .limit(5);

      return {
        totalPosts: totalPosts.count,
        postsToday: postsToday.count,
        postsThisWeek: postsThisWeek.count,
        postsThisMonth: totalPosts.count, // Could be more specific with date filtering
        avgEngagementRate: 8.7, // Calculate from engagement data
        topPerformingPlatform: 'Instagram',
        recentPosts: recentPosts.map((post) => ({
          id: post.id,
          platform: post.platform,
          content: post.content.substring(0, 100) + '...',
          timestamp: post.createdAt,
          engagement: post.engagement || { likes: 0, comments: 0, shares: 0 },
        })),
        upcomingPosts: [], // Could query scheduled posts
      };
    } catch (error) {
      console.error('Error getting post analytics:', error);
      return {
        totalPosts: 0,
        postsToday: 0,
        postsThisWeek: 0,
        postsThisMonth: 0,
        avgEngagementRate: 0,
        topPerformingPlatform: 'Unknown',
        recentPosts: [],
        upcomingPosts: [],
      };
    }
  }

  // Stripe Subscription operations
  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    try {
      const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();

      // Update user's subscription tier and Stripe customer ID
      await db
        .update(users)
        .set({
          stripeCustomerId: subscriptionData.stripeCustomerId,
          stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
          stripeSubscriptionStatus: subscriptionData.status,
          subscriptionTier: subscriptionData.tier,
          updatedAt: new Date(),
        })
        .where(eq(users.id, subscriptionData.userId));

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async getSubscription(userId: string): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);
      return subscription;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return undefined;
    }
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
      return subscription;
    } catch (error) {
      console.error('Error getting subscription by Stripe ID:', error);
      return undefined;
    }
  }

  async updateSubscription(
    stripeSubscriptionId: string,
    updates: Partial<Subscription>,
  ): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db
        .update(subscriptions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .returning();

      // Update user's subscription status
      if (subscription && updates.status) {
        await db
          .update(users)
          .set({
            stripeSubscriptionStatus: updates.status,
            subscriptionTier: updates.tier || subscription.tier,
            updatedAt: new Date(),
          })
          .where(eq(users.id, subscription.userId));
      }

      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return undefined;
    }
  }

  // Utility methods
  async getUserStats(userId: string): Promise<any> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return null;

      const [socialAccounts] = await db
        .select({ count: count() })
        .from(socialMediaAccounts)
        .where(and(eq(socialMediaAccounts.userId, userId), eq(socialMediaAccounts.isActive, true)));

      const [totalPosts] = await db
        .select({ count: count() })
        .from(socialMediaPosts)
        .where(eq(socialMediaPosts.userId, userId));

      const subscription = await this.getSubscription(userId);

      return {
        user,
        connectedAccounts: socialAccounts.count,
        totalPosts: totalPosts.count,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: subscription?.status || 'none',
        isVerified: user.isVerified,
        garScore: user.garScore,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
}

// Export singleton instance
export const databaseStorage = new DatabaseStorage();
