import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CourseFeed from "@/pages/course-feed";
import Upload from "@/pages/upload";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/course/:id" component={CourseFeed} />
      <Route path="/feed" component={Home} /> {/* Reuse Home for My Courses for now */}
      <Route path="/upload" component={Upload} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
