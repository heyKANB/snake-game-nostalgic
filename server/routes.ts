import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join } from "path";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Leaderboard endpoints
  app.post("/api/leaderboard", async (req, res) => {
    try {
      const { playerName, score, theme } = req.body;
      if (!playerName || typeof score !== 'number' || !theme) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const entry = await storage.addScore({ playerName, score, theme });
      res.json(entry);
    } catch (error) {
      console.error("Error adding score:", error);
      res.status(500).json({ error: "Failed to add score" });
    }
  });

  app.get("/api/leaderboard/all-time", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getAllTimeLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching all-time leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/leaderboard/weekly", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getWeeklyLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/leaderboard/daily", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getDailyLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Privacy policy route (not prefixed with /api since it's a page)
  app.get('/privacy', (req, res) => {
    try {
      const privacyHTML = readFileSync(join(process.cwd(), 'privacy-policy.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(privacyHTML);
    } catch (error) {
      res.status(404).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Privacy Policy</h1>
            <p>Privacy policy temporarily unavailable. Please contact support.</p>
          </body>
        </html>
      `);
    }
  });

  // Support page route
  app.get('/support', (req, res) => {
    try {
      const supportHTML = readFileSync(join(process.cwd(), 'support.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(supportHTML);
    } catch (error) {
      res.status(404).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Support</h1>
            <p>Support page temporarily unavailable. Please contact kathrynbrown@heykanb.com</p>
          </body>
        </html>
      `);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
