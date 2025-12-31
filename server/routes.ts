import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Courses
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await storage.getCourse(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  });

  // Subscriptions - Mock Payment
  app.post("/api/courses/:id/subscribe", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const courseId = parseInt(req.params.id);

    // In real app, verify mobile money payment here
    const sub = await storage.subscribeUser(req.user.id, courseId);
    res.status(201).json(sub);
  });

  app.get("/api/subscriptions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const subs = await storage.getUserSubscriptions(req.user.id);
    res.json(subs);
  });

  // Notes Feed - Only for subscribers
  app.get("/api/courses/:id/notes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    // Check if subscribed
    const courseId = parseInt(req.params.id);
    const subs = await storage.getUserSubscriptions(req.user.id);
    const isSubscribed = subs.some(s => s.courseId === courseId);

    if (!isSubscribed) {
      return res.status(403).json({ message: "Subscription required to view notes" });
    }

    const notes = await storage.getCourseNotes(courseId);
    res.json(notes);
  });

  return httpServer;
}
