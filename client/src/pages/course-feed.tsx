import { useParams } from "wouter";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { COURSES, FEED_ENTRIES } from "@/lib/mockData";
import { ArrowLeft, Download, FileText, Mic, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function CourseFeed() {
  const { id } = useParams();
  const course = COURSES.find(c => c.id === id) || COURSES[0]; // Fallback for demo
  const entries = FEED_ENTRIES;

  return (
    <Layout>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="p-4">
          <Link href="/">
            <div className="flex items-center gap-2 text-muted-foreground mb-4 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to Courses
            </div>
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-serif text-primary">{course.code}</h1>
              <p className="text-sm text-muted-foreground">{course.title}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Taught by</div>
              <div className="font-medium text-sm">{course.noteTaker.name}</div>
              <div className="flex items-center justify-end gap-1 text-xs text-accent-foreground mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-primary" /> Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Alert */}
      <div className="p-4 pb-0">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-accent-foreground">Next Assessment</h4>
            <p className="text-xs text-muted-foreground mt-1">Mid-term test coming up on Friday, 14th June. Covers Set Theory to Calculus I.</p>
          </div>
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="p-4 relative">
        <div className="absolute left-8 top-4 bottom-4 w-px bg-border" /> {/* Timeline Line */}
        
        <div className="space-y-6 relative">
          {entries.map((entry) => (
            <div key={entry.id} className="pl-10 relative">
              
              {/* Timeline Dot */}
              <div className="absolute left-[11px] top-3 h-3 w-3 rounded-full border-2 border-background z-10 
                data-[type=alert]:bg-destructive data-[type=pdf]:bg-primary data-[type=audio]:bg-accent data-[type=text]:bg-muted-foreground"
                data-type={entry.type}
              />

              <div className="bg-card rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {entry.type === 'pdf' && <FileText className="h-4 w-4 text-primary" />}
                    {entry.type === 'audio' && <Mic className="h-4 w-4 text-accent-foreground" />}
                    {entry.type === 'alert' && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {entry.type === 'text' && <FileText className="h-4 w-4 text-muted-foreground" />}
                    
                    <span className="text-xs font-medium text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  
                  {/* Type Badge */}
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {entry.type.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="font-semibold text-foreground mb-2">{entry.title}</h3>

                {entry.content && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry.content}
                  </p>
                )}

                {/* Actions */}
                {entry.type === 'pdf' && (
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-2 text-primary border-primary/20 hover:bg-primary/5">
                    <Download className="h-4 w-4" /> Download PDF ({entry.fileSize})
                  </Button>
                )}

                {entry.type === 'audio' && (
                  <div className="mt-3 bg-secondary/50 rounded-full p-2 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div className="h-1 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{entry.duration}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
