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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone } from "lucide-react";

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, Timestamp } from "firebase/firestore";

export default function Dashboard() {
    const { user, logoutMutation } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [paymentProvider, setPaymentProvider] = useState("airtel");

    const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
        queryKey: ["/api/courses"],
        queryFn: async () => {
            const querySnapshot = await getDocs(collection(db, "courses"));
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id as any
            } as Course));
        }
    });

    const { data: subscriptions, isLoading: subsLoading } = useQuery<Subscription[]>({
        queryKey: ["/api/subscriptions", user?.id],
        enabled: !!user,
        queryFn: async () => {
            if (!user) return [];
            const q = query(collection(db, "subscriptions"), where("userId", "==", user.id));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id as any
            } as Subscription));
        }
    });

    const subscribeMutation = useMutation({
        mutationFn: async (courseId: number) => {
            if (!user) throw new Error("Not authenticated");
            const subData = {
                userId: user.id,
                courseId: courseId,
                active: true,
                startDate: Timestamp.now()
            };
            const docRef = await addDoc(collection(db, "subscriptions"), subData);
            return { id: docRef.id, ...subData };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/subscriptions", user?.id] });
            setSelectedCourse(null);
            toast({
                title: "Subscribed Successfully",
                description: "Payment confirmed (Mock). You now have access.",
            });
        },
        onError: (err: any) => {
            toast({
                title: "Subscription Failed",
                description: err.message || "Could not process payment.",
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
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.university} • {user?.school}</p>
                        </div>
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
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-indigo-100 flex flex-col items-center shadow-sm"
                        >
                            <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Learning Journey</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                You don't have any active subscriptions yet. Explore the marketplace below to find high-quality notes for your courses.
                            </p>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 rounded-xl text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Browse Marketplace
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Marketplace Section */}
                <div id="marketplace-section" className="space-y-6 pt-4 scroll-mt-20">
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
                                                    onClick={() => setSelectedCourse(course)}
                                                    disabled={subscribeMutation.isPending}
                                                >
                                                    Subscribe Now
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

            <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white text-2xl flex items-center gap-2">
                                <CreditCard className="h-6 w-6" />
                                Secure Checkout
                            </DialogTitle>
                            <DialogDescription className="text-indigo-100">
                                Complete your subscription to {selectedCourse?.code}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <div>
                                <p className="text-sm text-indigo-600 font-semibold">Price</p>
                                <p className="text-2xl font-bold text-indigo-900">K{selectedCourse?.price}.00</p>
                            </div>
                            <div className="text-right text-xs text-indigo-400 capitalize bg-white px-3 py-1 rounded-full shadow-sm border border-indigo-100">
                                One-time Payment
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-gray-700 font-bold">Select Payment Provider</Label>
                            <RadioGroup
                                value={paymentProvider}
                                onValueChange={setPaymentProvider}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div>
                                    <RadioGroupItem value="airtel" id="airtel" className="peer sr-only" />
                                    <Label
                                        htmlFor="airtel"
                                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50/50 cursor-pointer transition-all"
                                    >
                                        <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold mb-2">airtel</div>
                                        <span className="text-sm font-semibold">Airtel Money</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="mtn" id="mtn" className="peer sr-only" />
                                    <Label
                                        htmlFor="mtn"
                                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-yellow-600 peer-data-[state=checked]:bg-yellow-50/50 cursor-pointer transition-all"
                                    >
                                        <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-black font-bold mb-2">MTN</div>
                                        <span className="text-sm font-semibold">MTN MoMo</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700 font-bold">Phone Number</Label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input disabled value={user?.phoneNumber || ""} className="pl-9 bg-gray-50 border-gray-200" />
                            </div>
                            <p className="text-[10px] text-gray-400 italic text-center uppercase tracking-widest pt-2">Powered by PhunziPay Gateway</p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-gray-50">
                        <Button
                            className="w-full py-6 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => selectedCourse && subscribeMutation.mutate(selectedCourse.id)}
                            disabled={subscribeMutation.isPending}
                        >
                            {subscribeMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Confirm Payment (K${selectedCourse?.price}.00)`
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
