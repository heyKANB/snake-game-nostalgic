import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { 
  users, 
  leaderboard, 
  dailyLeaderboard, 
  weeklyLeaderboard,
  type User, 
  type InsertUser, 
  type LeaderboardEntry, 
  type InsertLeaderboardEntry,
  type DailyLeaderboardEntry,
  type WeeklyLeaderboardEntry,
  type InsertDailyLeaderboardEntry,
  type InsertWeeklyLeaderboardEntry
} from "@shared/schema";
import { desc, gte, eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leaderboard methods
  addScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getAllTimeLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getWeeklyLeaderboard(limit?: number): Promise<WeeklyLeaderboardEntry[]>;
  getDailyLeaderboard(limit?: number): Promise<DailyLeaderboardEntry[]>;
  
  // Helper methods for getting current user's best scores
  getUserDailyBest(playerName: string, date: string): Promise<number>;
  getUserWeeklyBest(playerName: string, week: string): Promise<number>;
  getUserAllTimeBest(playerName: string): Promise<number>;
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

  async getWeeklyLeaderboard(limit = 10): Promise<WeeklyLeaderboardEntry[]> {
    // For MemStorage, we'll simulate weekly data with current week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return Array.from(this.leaderboardEntries.values())
      .filter(entry => entry.createdAt >= oneWeekAgo)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(entry => ({ ...entry, week: '2025-31' })) as WeeklyLeaderboardEntry[];
  }

  async getDailyLeaderboard(limit = 10): Promise<DailyLeaderboardEntry[]> {
    // For MemStorage, we'll simulate daily data with current date
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return Array.from(this.leaderboardEntries.values())
      .filter(entry => entry.createdAt >= oneDayAgo)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(entry => ({ ...entry, date: '2025-07-31' })) as DailyLeaderboardEntry[];
  }

  async getUserDailyBest(playerName: string, date: string): Promise<number> {
    return 0; // Not implemented for MemStorage
  }

  async getUserWeeklyBest(playerName: string, week: string): Promise<number> {
    return 0; // Not implemented for MemStorage  
  }

  async getUserAllTimeBest(playerName: string): Promise<number> {
    const userEntries = Array.from(this.leaderboardEntries.values())
      .filter(entry => entry.playerName === playerName);
    return userEntries.length > 0 ? Math.max(...userEntries.map(e => e.score)) : 0;
  }
}

class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql, { schema: { users, leaderboard, dailyLeaderboard, weeklyLeaderboard } });
  }

  // Helper function to get current date in YYYY-MM-DD format
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Helper function to get current ISO week in YYYY-WW format
  private getCurrentWeek(): string {
    const date = new Date();
    const start = new Date(date.getFullYear(), 0, 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const weekOfYear = Math.ceil(dayOfYear / 7);
    return `${date.getFullYear()}-${weekOfYear.toString().padStart(2, '0')}`;
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
    const currentDate = this.getCurrentDate();
    const currentWeek = this.getCurrentWeek();
    
    // Add to all-time leaderboard
    const allTimeResult = await this.db.insert(leaderboard).values({
      playerName: entry.playerName,
      score: entry.score,
      theme: entry.theme || 'retro'
    }).returning();

    // Check if this is a new daily best for this player
    const currentDailyBest = await this.getUserDailyBest(entry.playerName, currentDate);
    if (entry.score > currentDailyBest) {
      await this.db.insert(dailyLeaderboard).values({
        playerName: entry.playerName,
        score: entry.score,
        theme: entry.theme || 'retro',
        date: currentDate
      });
    }

    // Check if this is a new weekly best for this player
    const currentWeeklyBest = await this.getUserWeeklyBest(entry.playerName, currentWeek);
    if (entry.score > currentWeeklyBest) {
      await this.db.insert(weeklyLeaderboard).values({
        playerName: entry.playerName,
        score: entry.score,
        theme: entry.theme || 'retro',
        week: currentWeek
      });
    }

    return allTimeResult[0];
  }

  async getAllTimeLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    return await this.db.select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.score))
      .limit(limit);
  }

  async getWeeklyLeaderboard(limit = 10): Promise<WeeklyLeaderboardEntry[]> {
    const currentWeek = this.getCurrentWeek();
    
    return await this.db.select()
      .from(weeklyLeaderboard)
      .where(eq(weeklyLeaderboard.week, currentWeek))
      .orderBy(desc(weeklyLeaderboard.score))
      .limit(limit);
  }

  async getDailyLeaderboard(limit = 10): Promise<DailyLeaderboardEntry[]> {
    const currentDate = this.getCurrentDate();
    
    return await this.db.select()
      .from(dailyLeaderboard)
      .where(eq(dailyLeaderboard.date, currentDate))
      .orderBy(desc(dailyLeaderboard.score))
      .limit(limit);
  }

  async getUserDailyBest(playerName: string, date: string): Promise<number> {
    const result = await this.db.select({ score: dailyLeaderboard.score })
      .from(dailyLeaderboard)
      .where(and(
        eq(dailyLeaderboard.playerName, playerName),
        eq(dailyLeaderboard.date, date)
      ))
      .orderBy(desc(dailyLeaderboard.score))
      .limit(1);
    
    return result.length > 0 ? result[0].score : 0;
  }

  async getUserWeeklyBest(playerName: string, week: string): Promise<number> {
    const result = await this.db.select({ score: weeklyLeaderboard.score })
      .from(weeklyLeaderboard)
      .where(and(
        eq(weeklyLeaderboard.playerName, playerName),
        eq(weeklyLeaderboard.week, week)
      ))
      .orderBy(desc(weeklyLeaderboard.score))
      .limit(1);
    
    return result.length > 0 ? result[0].score : 0;
  }

  async getUserAllTimeBest(playerName: string): Promise<number> {
    const result = await this.db.select({ score: leaderboard.score })
      .from(leaderboard)
      .where(eq(leaderboard.playerName, playerName))
      .orderBy(desc(leaderboard.score))
      .limit(1);
    
    return result.length > 0 ? result[0].score : 0;
  }
}

export const storage = new DatabaseStorage();
