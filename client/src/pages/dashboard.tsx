import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Course, Subscription } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Clock, AlertCircle, Search, LogOut, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const { user, logoutMutation } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
        queryKey: ["/api/courses"],
    });

    const { data: subscriptions, isLoading: subsLoading } = useQuery<Subscription[]>({
        queryKey: ["/api/subscriptions"],
    });

    const subscribeMutation = useMutation({
        mutationFn: async (courseId: number) => {
            const res = await apiRequest("POST", `/api/courses/${courseId}/subscribe`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
            toast({
                title: "Subscribed Successfully",
                description: "Payment confirmed (Mock). You now have access.",
            });
        },
        onError: () => {
            toast({
                title: "Subscription Failed",
                description: "Could not process payment.",
                variant: "destructive"
            });
        }
    });

    const subscribedCourseIds = new Set(subscriptions?.map(s => s.courseId));

    const filteredCourses = courses?.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (coursesLoading || subsLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                        <span className="font-bold text-xl text-indigo-900">Phunzi+</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden md:inline">Welcome, {user?.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Active Subscriptions Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-green-600" />
                        My Active Courses
                    </h2>
                    {subscriptions && subscriptions.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subscriptions.map((sub, index) => {
                                const course = courses?.find(c => c.id === sub.courseId);
                                if (!course) return null;
                                return (
                                    <motion.div
                                        key={sub.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link href={`/course/${course.id}`}>
                                            <div className="cursor-pointer group h-full">
                                                <Card className="h-full border-green-100 bg-green-50/50 hover:bg-green-50 transition-all hover:shadow-md hover:-translate-y-1">
                                                    <CardHeader>
                                                        <CardTitle className="text-green-800 flex items-center justify-between">
                                                            {course.code}
                                                            <Sparkles className="h-4 w-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </CardTitle>
                                                        <CardDescription>{course.name}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-sm text-green-600 font-medium">Access Granted</div>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button className="w-full bg-green-600 hover:bg-green-700 shadow-sm">View Notes</Button>
                                                    </CardFooter>
                                                </Card>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-lg border border-dashed text-gray-500">
                            You haven't subscribed to any courses yet.
                        </div>
                    )}
                </div>

                {/* Marketplace Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900">Course Marketplace</h2>
                            <p className="text-gray-500">Find reliable notes for courses you're missing.</p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search code (e.g. MATH 1110)"
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredCourses?.map((course, index) => {
                                const isSubscribed = subscribedCourseIds.has(course.id);
                                if (isSubscribed) return null; // Already shown above

                                return (
                                    <motion.div
                                        key={course.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="h-full hover:shadow-lg transition-all border-indigo-50 hover:border-indigo-100">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-indigo-900">{course.code}</CardTitle>
                                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                        K{course.price}
                                                    </span>
                                                </div>
                                                <CardDescription className="line-clamp-2">{course.name}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            </CardContent>
                                            <CardFooter>
                                                <Button
                                                    className="w-full shadow-sm bg-indigo-600 hover:bg-indigo-700"
                                                    onClick={() => {
                                                        if (confirm(`Subscribe to ${course.code} for K${course.price}? (Mock Payment)`)) {
                                                            subscribeMutation.mutate(course.id);
                                                        }
                                                    }}
                                                    disabled={subscribeMutation.isPending}
                                                >
                                                    {subscribeMutation.isPending ? "Processing..." : "Subscribe Now"}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {filteredCourses?.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No courses found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
