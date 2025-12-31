import { LucideIcon, FileText, Mic, AlertCircle, BookOpen } from "lucide-react";

export interface Course {
  id: string;
  code: string;
  title: string;
  price: string;
  noteTaker: {
    name: string;
    rating: number;
    verified: boolean;
  };
  isLive: boolean;
  subscribers: number;
}

export interface FeedEntry {
  id: string;
  courseId: string;
  type: "pdf" | "audio" | "text" | "alert";
  title: string;
  timestamp: string;
  content?: string; // For text
  duration?: string; // For audio
  fileSize?: string; // For pdf
}

export const COURSES: Course[] = [
  {
    id: "1",
    code: "MATH 1110",
    title: "Foundation Mathematics",
    price: "K50/mo",
    noteTaker: {
      name: "Chanda M.",
      rating: 4.8,
      verified: true,
    },
    isLive: true,
    subscribers: 142,
  },
  {
    id: "2",
    code: "BIO 1010",
    title: "Introductory Biology",
    price: "K45/mo",
    noteTaker: {
      name: "John S.",
      rating: 4.5,
      verified: true,
    },
    isLive: false,
    subscribers: 89,
  },
  {
    id: "3",
    code: "CHEM 1000",
    title: "General Chemistry",
    price: "K50/mo",
    noteTaker: {
      name: "Mercy K.",
      rating: 4.9,
      verified: true,
    },
    isLive: false,
    subscribers: 201,
  },
  {
    id: "4",
    code: "PHY 1010",
    title: "Introductory Physics",
    price: "K50/mo",
    noteTaker: {
      name: "Peter L.",
      rating: 4.2,
      verified: true,
    },
    isLive: false,
    subscribers: 76,
  },
];

export const FEED_ENTRIES: FeedEntry[] = [
  {
    id: "101",
    courseId: "1",
    type: "alert",
    title: "Quiz Rescheduled",
    timestamp: "10 mins ago",
    content: "The lecturer just announced that Friday's quiz is moved to next Tuesday! Spread the word.",
  },
  {
    id: "102",
    courseId: "1",
    type: "pdf",
    title: "Lecture 12: Set Theory & Functions",
    timestamp: "1 hour ago",
    fileSize: "2.4 MB",
  },
  {
    id: "103",
    courseId: "1",
    type: "audio",
    title: "Explanation of Inverse Functions",
    timestamp: "1 hour ago",
    duration: "2:15",
  },
  {
    id: "104",
    courseId: "1",
    type: "text",
    title: "Exam Hint",
    timestamp: "Yesterday",
    content: "Prof emphasized 'Domain and Range' heavily today. Definitely coming in the mid-terms.",
  },
  {
    id: "105",
    courseId: "1",
    type: "pdf",
    title: "Tutorial Sheet 4 Solutions",
    timestamp: "2 days ago",
    fileSize: "1.8 MB",
  },
];
