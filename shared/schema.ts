import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["subscriber", "provider"] }).notNull().default("subscriber"),
  phoneNumber: text("phone_number"), // For Mobile Money
  bio: text("bio"), // For providers to show off creds (optional for now)
  rating: integer("rating").default(5), // 1-5 stars
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g. MATH 1110
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull().default(50), // Price in ZMW
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(), // Foreign key to courses
  providerId: integer("provider_id").notNull(), // Foreign key to users
  title: text("title").notNull(),
  type: text("type", { enum: ["pdf", "audio"] }).notNull(),
  url: text("url").notNull(), // Mock URL for now
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  active: boolean("active").default(true),
  startDate: timestamp("start_date").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  phoneNumber: true,
});

export const insertCourseSchema = createInsertSchema(courses);
export const insertNoteSchema = createInsertSchema(notes);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);

export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
