import { useState } from "react";
import Layout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Star, Radio, Users, ChevronRight } from "lucide-react";
import { COURSES } from "@/lib/mockData";
import { Link } from "wouter";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredCourses = COURSES.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-4 space-y-6">
        
        {/* Hero / Search Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Find your lifeline.</h1>
            <p className="text-muted-foreground text-sm">Verified notes from the top 1% of seniors.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search course code (e.g. MATH 1110)" 
              className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Live Now Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Happening Now</h2>
            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">LIVE UPDATES</Badge>
          </div>
          
          <div className="space-y-3">
            {filteredCourses.filter(c => c.isLive).map(course => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#0f3a22] p-5 text-white shadow-lg transition-all active:scale-[0.98]">
                  <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full bg-white/5 blur-2xl" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md animate-pulse">
                      <Radio className="mr-1 h-3 w-3" /> LIVE LECTURE
                    </Badge>
                    <span className="font-mono text-xs opacity-80">{course.code}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                  <div className="flex items-center text-sm text-white/80 gap-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {course.subscribers}
                    </span>
                    <span>•</span>
                    <span>{course.noteTaker.name} is typing...</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Courses */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-3">Popular Courses</h2>
          <div className="grid gap-3">
            {filteredCourses.filter(c => !c.isLive).map(course => (
              <Link key={course.id} href={`/course/${course.id}`}>
                <div className="bg-card border rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{course.code}</span>
                      <Badge variant="secondary" className="text-[10px] font-normal">{course.price}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="font-medium text-foreground">{course.noteTaker.rating}</span>
                      <span>•</span>
                      <span>{course.noteTaker.name}</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="text-muted-foreground group-hover:text-primary">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
