import { users, leaderboard, type User, type InsertUser, type LeaderboardEntry, type InsertLeaderboardEntry } from "@shared/schema";

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

export const storage = new MemStorage();
