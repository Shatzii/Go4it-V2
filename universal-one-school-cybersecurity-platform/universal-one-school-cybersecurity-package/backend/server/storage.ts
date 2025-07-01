import { 
  users, clients, threats, logs, networkNodes, alerts, fileIntegrityChecks, anomalies,
  socialMediaAccounts, socialMediaInteractions, socialMediaAlerts,
  type User, type InsertUser, type Client, type InsertClient, type Threat, type InsertThreat,
  type Log, type InsertLog, type Alert, type InsertAlert, type NetworkNode, type InsertNetworkNode,
  type FileIntegrityCheck, type InsertFileIntegrityCheck, type Anomaly, type InsertAnomaly,
  type SocialMediaAccount, type InsertSocialMediaAccount,
  type SocialMediaInteraction, type InsertSocialMediaInteraction,
  type SocialMediaAlert, type InsertSocialMediaAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByClient(clientId: number): Promise<User[]>;

  // Clients
  getClient(id: number): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;

  // Threats
  getThreats(clientId: number, limit?: number): Promise<Threat[]>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  updateThreatStatus(id: number, status: string): Promise<void>;
  getThreatStats(clientId: number): Promise<{ activeThreats: number; resolvedToday: number }>;

  // Logs
  getLogs(clientId: number, limit?: number): Promise<Log[]>;
  createLog(log: InsertLog): Promise<Log>;
  getLogsByLevel(clientId: number, level: string, limit?: number): Promise<Log[]>;

  // Network Nodes
  getNetworkNodes(clientId: number): Promise<NetworkNode[]>;
  createNetworkNode(node: InsertNetworkNode): Promise<NetworkNode>;
  updateNodeStatus(id: number, status: string): Promise<void>;

  // Alerts
  getAlerts(clientId: number, limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<void>;
  getUnreadAlertCount(clientId: number): Promise<number>;

  // File Integrity
  getFileIntegrityChecks(clientId: number, limit?: number): Promise<FileIntegrityCheck[]>;
  createFileIntegrityCheck(check: InsertFileIntegrityCheck): Promise<FileIntegrityCheck>;
  updateFileStatus(id: number, status: string): Promise<void>;

  // Anomalies
  getAnomalies(clientId: number, limit?: number): Promise<Anomaly[]>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  getAnomalyStats(clientId: number): Promise<{ count: number; highRiskCount: number }>;

  // Social Media Accounts
  getSocialMediaAccounts(userId: number): Promise<SocialMediaAccount[]>;
  createSocialMediaAccount(account: InsertSocialMediaAccount): Promise<SocialMediaAccount>;
  updateSocialMediaAccount(id: number, updates: Partial<SocialMediaAccount>): Promise<void>;
  deleteSocialMediaAccount(id: number): Promise<void>;
  
  // Social Media Interactions
  getSocialMediaInteractions(accountId: number, limit?: number): Promise<SocialMediaInteraction[]>;
  createSocialMediaInteraction(interaction: InsertSocialMediaInteraction): Promise<SocialMediaInteraction>;
  
  // Social Media Alerts
  getSocialMediaAlerts(userId: number, limit?: number): Promise<SocialMediaAlert[]>;
  createSocialMediaAlert(alert: InsertSocialMediaAlert): Promise<SocialMediaAlert>;
  markSocialMediaAlertAsResolved(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsersByClient(clientId: number): Promise<User[]> {
    return await db.select().from(users).where(eq(users.clientId, clientId));
  }

  // Clients
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.isActive, true));
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  // Threats
  async getThreats(clientId: number, limit = 50): Promise<Threat[]> {
    return await db.select().from(threats)
      .where(eq(threats.clientId, clientId))
      .orderBy(desc(threats.detectedAt))
      .limit(limit);
  }

  async createThreat(insertThreat: InsertThreat): Promise<Threat> {
    const [threat] = await db.insert(threats).values(insertThreat).returning();
    return threat;
  }

  async updateThreatStatus(id: number, status: string): Promise<void> {
    await db.update(threats).set({ 
      status,
      resolvedAt: status === 'resolved' ? new Date() : null
    }).where(eq(threats.id, id));
  }

  async getThreatStats(clientId: number): Promise<{ activeThreats: number; resolvedToday: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeResult] = await db.select({ count: sql<number>`count(*)` })
      .from(threats)
      .where(and(eq(threats.clientId, clientId), eq(threats.status, 'active')));

    const [resolvedResult] = await db.select({ count: sql<number>`count(*)` })
      .from(threats)
      .where(and(
        eq(threats.clientId, clientId),
        eq(threats.status, 'resolved'),
        gte(threats.resolvedAt, today)
      ));

    return {
      activeThreats: Number(activeResult?.count || 0),
      resolvedToday: Number(resolvedResult?.count || 0)
    };
  }

  // Logs
  async getLogs(clientId: number, limit = 100): Promise<Log[]> {
    return await db.select().from(logs)
      .where(eq(logs.clientId, clientId))
      .orderBy(desc(logs.timestamp))
      .limit(limit);
  }

  async createLog(insertLog: InsertLog): Promise<Log> {
    const [log] = await db.insert(logs).values(insertLog).returning();
    return log;
  }

  async getLogsByLevel(clientId: number, level: string, limit = 50): Promise<Log[]> {
    return await db.select().from(logs)
      .where(and(eq(logs.clientId, clientId), eq(logs.level, level)))
      .orderBy(desc(logs.timestamp))
      .limit(limit);
  }

  // Network Nodes
  async getNetworkNodes(clientId: number): Promise<NetworkNode[]> {
    return await db.select().from(networkNodes)
      .where(eq(networkNodes.clientId, clientId))
      .orderBy(desc(networkNodes.lastSeen));
  }

  async createNetworkNode(insertNode: InsertNetworkNode): Promise<NetworkNode> {
    const [node] = await db.insert(networkNodes).values(insertNode).returning();
    return node;
  }

  async updateNodeStatus(id: number, status: string): Promise<void> {
    await db.update(networkNodes).set({ 
      status,
      lastSeen: new Date()
    }).where(eq(networkNodes.id, id));
  }

  // Alerts
  async getAlerts(clientId: number, limit = 50): Promise<Alert[]> {
    return await db.select().from(alerts)
      .where(eq(alerts.clientId, clientId))
      .orderBy(desc(alerts.createdAt))
      .limit(limit);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  async getUnreadAlertCount(clientId: number): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` })
      .from(alerts)
      .where(and(eq(alerts.clientId, clientId), eq(alerts.isRead, false)));
    
    return Number(result?.count || 0);
  }

  // File Integrity
  async getFileIntegrityChecks(clientId: number, limit = 50): Promise<FileIntegrityCheck[]> {
    return await db.select().from(fileIntegrityChecks)
      .where(eq(fileIntegrityChecks.clientId, clientId))
      .orderBy(desc(fileIntegrityChecks.lastChecked))
      .limit(limit);
  }

  async createFileIntegrityCheck(insertCheck: InsertFileIntegrityCheck): Promise<FileIntegrityCheck> {
    const [check] = await db.insert(fileIntegrityChecks).values(insertCheck).returning();
    return check;
  }

  async updateFileStatus(id: number, status: string): Promise<void> {
    await db.update(fileIntegrityChecks).set({ 
      status,
      lastChecked: new Date()
    }).where(eq(fileIntegrityChecks.id, id));
  }

  // Anomalies
  async getAnomalies(clientId: number, limit = 50): Promise<Anomaly[]> {
    return await db.select().from(anomalies)
      .where(eq(anomalies.clientId, clientId))
      .orderBy(desc(anomalies.detectedAt))
      .limit(limit);
  }

  async createAnomaly(insertAnomaly: InsertAnomaly): Promise<Anomaly> {
    const [anomaly] = await db.insert(anomalies).values(insertAnomaly).returning();
    return anomaly;
  }

  async getAnomalyStats(clientId: number): Promise<{ count: number; highRiskCount: number }> {
    const [countResult] = await db.select({ count: sql<number>`count(*)` })
      .from(anomalies)
      .where(eq(anomalies.clientId, clientId));

    const [highRiskResult] = await db.select({ count: sql<number>`count(*)` })
      .from(anomalies)
      .where(and(eq(anomalies.clientId, clientId), gte(anomalies.score, 80)));

    return {
      count: Number(countResult?.count || 0),
      highRiskCount: Number(highRiskResult?.count || 0)
    };
  }

  // Social Media Accounts
  async getSocialMediaAccounts(userId: number): Promise<SocialMediaAccount[]> {
    return await db
      .select()
      .from(socialMediaAccounts)
      .where(eq(socialMediaAccounts.userId, userId))
      .orderBy(desc(socialMediaAccounts.connectedAt));
  }

  async createSocialMediaAccount(insertAccount: InsertSocialMediaAccount): Promise<SocialMediaAccount> {
    const [account] = await db
      .insert(socialMediaAccounts)
      .values(insertAccount)
      .returning();
    return account;
  }

  async updateSocialMediaAccount(id: number, updates: Partial<SocialMediaAccount>): Promise<void> {
    await db
      .update(socialMediaAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialMediaAccounts.id, id));
  }

  async deleteSocialMediaAccount(id: number): Promise<void> {
    await db
      .delete(socialMediaAccounts)
      .where(eq(socialMediaAccounts.id, id));
  }

  // Social Media Interactions
  async getSocialMediaInteractions(accountId: number, limit = 100): Promise<SocialMediaInteraction[]> {
    return await db
      .select()
      .from(socialMediaInteractions)
      .where(eq(socialMediaInteractions.accountId, accountId))
      .orderBy(desc(socialMediaInteractions.timestamp))
      .limit(limit);
  }

  async createSocialMediaInteraction(insertInteraction: InsertSocialMediaInteraction): Promise<SocialMediaInteraction> {
    const [interaction] = await db
      .insert(socialMediaInteractions)
      .values(insertInteraction)
      .returning();
    return interaction;
  }

  // Social Media Alerts
  async getSocialMediaAlerts(userId: number, limit = 50): Promise<SocialMediaAlert[]> {
    return await db
      .select()
      .from(socialMediaAlerts)
      .where(eq(socialMediaAlerts.userId, userId))
      .orderBy(desc(socialMediaAlerts.createdAt))
      .limit(limit);
  }

  async createSocialMediaAlert(insertAlert: InsertSocialMediaAlert): Promise<SocialMediaAlert> {
    const [alert] = await db
      .insert(socialMediaAlerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async markSocialMediaAlertAsResolved(id: number): Promise<void> {
    await db
      .update(socialMediaAlerts)
      .set({ 
        status: 'resolved',
        resolvedAt: new Date()
      })
      .where(eq(socialMediaAlerts.id, id));
  }
}

export const storage = new DatabaseStorage();
