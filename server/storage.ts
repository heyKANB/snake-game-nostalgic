import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, leaderboard, type User, type InsertUser, type LeaderboardEntry, type InsertLeaderboardEntry } from "@shared/schema";
import { desc, gte, eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leaderboard methods
  addScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getAllTimeLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getWeeklyLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getDailyLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaderboardEntries: Map<number, LeaderboardEntry>;
  currentId: number;
  currentLeaderboardId: number;

  constructor() {
    this.users = new Map();
    this.leaderboardEntries = new Map();
    this.currentId = 1;
    this.currentLeaderboardId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const id = this.currentLeaderboardId++;
    const leaderboardEntry: LeaderboardEntry = {
      ...entry,
      theme: entry.theme || 'retro',
      id,
      createdAt: new Date()
    };
    this.leaderboardEntries.set(id, leaderboardEntry);
    return leaderboardEntry;
  }

  async getAllTimeLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboardEntries.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getWeeklyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return Array.from(this.leaderboardEntries.values())
      .filter(entry => entry.createdAt >= oneWeekAgo)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getDailyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return Array.from(this.leaderboardEntries.values())
      .filter(entry => entry.createdAt >= oneDayAgo)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql, { schema: { users, leaderboard } });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async addScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const result = await this.db.insert(leaderboard).values({
      playerName: entry.playerName,
      score: entry.score,
      theme: entry.theme || 'retro'
    }).returning();
    return result[0];
  }

  async getAllTimeLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    return await this.db.select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.score))
      .limit(limit);
  }

  async getWeeklyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await this.db.select()
      .from(leaderboard)
      .where(gte(leaderboard.createdAt, oneWeekAgo))
      .orderBy(desc(leaderboard.score))
      .limit(limit);
  }

  async getDailyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return await this.db.select()
      .from(leaderboard)
      .where(gte(leaderboard.createdAt, oneDayAgo))
      .orderBy(desc(leaderboard.score))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
