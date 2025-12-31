import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Course, Note } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, Headphones, Calendar, Download, AlertCircle, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function CourseFeed() {
  const [match, params] = useRoute("/course/:id");
  const id = parseInt(params?.id || "0");

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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm border border-red-100">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Subscribed</h2>
          <p className="text-gray-500 mb-8">
            You need an active subscription to {course?.code} to access these notes.
          </p>
          <Link href="/">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-xl shadow-lg shadow-indigo-100">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Go to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{course.code}</h1>
            <p className="text-xs text-gray-500">{course.name}</p>
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

              <Card className="hover:shadow-md transition-all hover:border-indigo-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className={`p-3 rounded-lg ${note.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                        {note.type === 'pdf' ? (
                          <FileText className="h-6 w-6 text-red-600" />
                        ) : (
                          <Headphones className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{note.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {note.createdAt ? format(new Date(note.createdAt), "MMM d, yyyy") : 'Unknown Date'}
                          <span className="text-gray-300">•</span>
                          <span className="uppercase font-bold tracking-wider">{note.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                      <a href={note.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
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
