import { users, courses, notes, subscriptions, type User, type InsertUser, type Course, type Note, type Subscription } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Course & Note Methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseNotes(courseId: number): Promise<Note[]>;

  // Subscription Methods
  subscribeUser(userId: number, courseId: number): Promise<Subscription>;
  getUserSubscriptions(userId: number): Promise<Subscription[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private notes: Map<number, Note>;
  private subscriptions: Map<number, Subscription>;
  sessionStore: session.Store;
  currentId: number;
  currentCourseId: number;
  currentNoteId: number;
  currentSubId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.notes = new Map();
    this.subscriptions = new Map();
    this.currentId = 1;
    this.currentCourseId = 1;
    this.currentNoteId = 1;
    this.currentSubId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    this.seed();
  }

  getUser(id: number): Promise<User | undefined> {
    return Promise.resolve(this.users.get(id));
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(
      Array.from(this.users.values()).find(
        (user) => user.username === username,
      ),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, bio: null, rating: 5, role: insertUser.role || "subscriber" };
    this.users.set(id, user);
    return user;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourseNotes(courseId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(n => n.courseId === courseId);
  }

  async subscribeUser(userId: number, courseId: number): Promise<Subscription> {
    const id = this.currentSubId++;
    const sub: Subscription = {
      id,
      userId,
      courseId,
      active: true,
      startDate: new Date(),
    };
    this.subscriptions.set(id, sub);
    return sub;
  }

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(s => s.userId === userId && s.active);
  }

  private seed() {
    // 1. Create a "Virtual Provider" - The "Math Genius"
    const providerId = this.currentId++;
    this.users.set(providerId, {
      id: providerId,
      username: "math_wizard",
      password: "password123", // Doesn't matter for seeding
      name: "Chanda M.",
      role: "provider",
      phoneNumber: "0977000000",
      bio: "A+ Student in Math & Physics. Regular uploader.",
      rating: 5
    });

    // 2. Create MATH 1110 Course
    const courseId = this.currentCourseId++;
    this.courses.set(courseId, {
      id: courseId,
      code: "MATH 1110",
      name: "Mathematics for Social Sciences",
      description: "Foundational math course tailored for Humanities. Matrices, Calculus, and more.",
      price: 50
    });

    // 3. Create another course
    const course2Id = this.currentCourseId++;
    this.courses.set(course2Id, {
      id: course2Id,
      code: "BIO 1010",
      name: "Introductory Biology",
      description: "Basic biological concepts.",
      price: 45
    });

    // 4. Seed Notes for MATH 1110
    const notesData = [
      { title: "Lecture 1: Intro to Matrices", type: "pdf", url: "https://example.com/note1.pdf" },
      { title: "Week 2 Recap: Determinants", type: "audio", url: "https://example.com/audio1.mp3" },
      { title: "Quiz 1 Prep Sheet", type: "pdf", url: "https://example.com/quiz1.pdf" },
      { title: "Lecture 5: Linear Equations", type: "pdf", url: "https://example.com/note5.pdf" },
    ];

    notesData.forEach(n => {
      const id = this.currentNoteId++;
      this.notes.set(id, {
        id,
        courseId,
        providerId,
        title: n.title,
        type: n.type as "pdf" | "audio",
        url: n.url,
        createdAt: new Date()
      });
    });

    console.log("Database Seeded with Phunzi+ Data: MATH 1110 + Mock Notes");
  }
}

export const storage = new MemStorage();
