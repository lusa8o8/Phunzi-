import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Course, Note } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, Headphones, Calendar, Download, AlertCircle, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function CourseFeed() {
  const [match, params] = useRoute("/course/:id");
  const id = params?.id || "0";

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
  });

  const { data: notes, isLoading: notesLoading, error: notesError } = useQuery<Note[]>({
    queryKey: [`/api/courses/${id}/notes`],
    retry: false,
  });

  if (courseLoading || notesLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  if (notesError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0a0c10]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl max-w-sm border border-white/10"
        >
          <div className="h-20 w-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <ShoppingCart className="h-10 w-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Locked</h2>
          <p className="text-indigo-100/60 mb-8 leading-relaxed">
            Full access to {course?.code} notes requires a premium subscription.
          </p>
          <Link href="/">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 py-7 rounded-2xl shadow-xl shadow-indigo-900/30 text-lg font-bold transition-all hover:scale-105 active:scale-95 border-0">
              Unlock Now
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-[#0a0c10] pb-20 text-white">
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 h-20 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-6 w-6 text-indigo-400" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">{course.code}</h1>
            <p className="text-xs text-indigo-300/60 uppercase font-bold tracking-widest">{course.name}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="relative border-l-2 border-indigo-200 ml-4 space-y-8 pl-8 py-4">
          {notes && notes.length > 0 ? notes.map((note, index) => (
            <motion.div
              key={note.id}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[41px] top-4 h-5 w-5 rounded-full border-4 border-white ${note.type === 'pdf' ? 'bg-red-500' : 'bg-blue-500'} shadow-sm`} />

              <Card className="hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all hover:border-indigo-500/30 bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`p-4 rounded-2xl ${note.type === 'pdf' ? 'bg-red-500/10' : 'bg-blue-500/10'} shadow-inner`}>
                        {note.type === 'pdf' ? (
                          <FileText className="h-7 w-7 text-red-400" />
                        ) : (
                          <Headphones className="h-7 w-7 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{note.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-indigo-200/50 mt-2">
                          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                            <Calendar className="h-3.5 w-3.5" />
                            {note.createdAt ? format(new Date(note.createdAt), "MMM d, yyyy") : 'Unknown Date'}
                          </div>
                          <span className="uppercase font-black text-[10px] tracking-[0.2em] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md">{note.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all border-white/10 bg-white/5 py-5 px-4 rounded-xl">
                      <a href={note.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span className="font-bold">Access</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )) : (
            <div className="text-center text-gray-500 py-10">
              No notes uploaded yet for this course.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
