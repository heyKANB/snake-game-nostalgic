import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  theme: text("theme").notNull().default("retro"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyLeaderboard = pgTable("daily_leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  theme: text("theme").notNull().default("retro"),
  date: text("date").notNull(), // Format: YYYY-MM-DD
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const weeklyLeaderboard = pgTable("weekly_leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  theme: text("theme").notNull().default("retro"),
  week: text("week").notNull(), // Format: YYYY-WW (ISO week)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  playerName: true,
  score: true,
  theme: true,
});

export const insertDailyLeaderboardSchema = createInsertSchema(dailyLeaderboard).pick({
  playerName: true,
  score: true,
  theme: true,
  date: true,
});

export const insertWeeklyLeaderboardSchema = createInsertSchema(weeklyLeaderboard).pick({
  playerName: true,
  score: true,
  theme: true,
  week: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertDailyLeaderboardEntry = z.infer<typeof insertDailyLeaderboardSchema>;
export type DailyLeaderboardEntry = typeof dailyLeaderboard.$inferSelect;
export type InsertWeeklyLeaderboardEntry = z.infer<typeof insertWeeklyLeaderboardSchema>;
export type WeeklyLeaderboardEntry = typeof weeklyLeaderboard.$inferSelect;
