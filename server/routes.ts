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
