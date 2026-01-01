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

import { db, FLW_PUBLIC_KEY } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, Timestamp } from "firebase/firestore";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

export default function Dashboard() {
    const { user, logoutMutation } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [paymentProvider, setPaymentProvider] = useState("airtel");
    const [phoneNumber, setPhoneNumber] = useState("");

    const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
        queryKey: ["/api/courses"],
    });

    const { data: subscriptions, isLoading: subsLoading } = useQuery<Subscription[]>({
        queryKey: ["/api/subscriptions"],
        enabled: !!user,
    });

    const fwConfig = {
        public_key: FLW_PUBLIC_KEY,
        tx_ref: `${user?.id}_${selectedCourse?.id}_${Date.now()}`,
        amount: selectedCourse?.price || 0,
        currency: "ZMW",
        payment_options: "mobilemoneyzambia",
        customer: {
            email: user?.username || "student@phunzi.plus",
            phone_number: user?.phoneNumber || "",
            name: user?.name || "Student",
        },
        customizations: {
            title: "Phunzi+ Subscription",
            description: `Subscription for ${selectedCourse?.code}`,
            logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-education-virtual-learning-graphic.jpg",
        },
    };

    const handleFlutterwavePayment = useFlutterwave(fwConfig);

    const subscribeMutation = useMutation({
        mutationFn: async (courseId: number) => {
            await apiRequest("POST", `/api/courses/${courseId}/subscribe`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/subscriptions", user?.id] });
            setSelectedCourse(null);
            toast({
                title: "Subscribed Successfully",
                description: "Payment confirmed. You now have access.",
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
        <div className="min-h-screen bg-[#0a0c10] pb-20">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 shadow-lg">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <BookOpen className="h-6 w-6 text-indigo-400" />
                        </div>
                        <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Phunzi+</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-white">{user?.name}</p>
                            <p className="text-xs text-indigo-300/60">{user?.university} • {user?.school}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()} className="hover:bg-white/10 text-indigo-300 hover:text-white transition-colors">
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
                                                <Card className="h-full border-green-500/20 bg-green-500/5 backdrop-blur-md hover:bg-green-500/10 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:-translate-y-1 overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                        <Sparkles className="h-5 w-5 text-green-400" />
                                                    </div>
                                                    <CardHeader>
                                                        <CardTitle className="text-green-400 flex items-center justify-between">
                                                            {course.code}
                                                        </CardTitle>
                                                        <CardDescription className="text-green-100/60">{course.name}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-xs font-bold text-green-400/80 uppercase tracking-widest px-2 py-1 rounded bg-green-500/10 w-fit">Full Access</div>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Button className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20 border-0">View Notes</Button>
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
                            className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center shadow-2xl"
                        >
                            <div className="h-20 w-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                <Search className="h-10 w-10 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Start Your Learning Journey</h3>
                            <p className="text-indigo-100/60 max-w-sm mx-auto mb-8 leading-relaxed">
                                You don't have any active subscriptions yet. Explore the marketplace below to find high-quality notes for your courses.
                            </p>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-500 px-8 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95 border-0"
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
                            <h2 className="text-2xl font-bold text-white">Course Marketplace</h2>
                            <p className="text-indigo-200/60">Find reliable notes for courses you're missing.</p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-indigo-300/50" />
                            <Input
                                placeholder="Search code (e.g. MATH 1110)"
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-indigo-300/40 focus:border-indigo-500"
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
                                        <Card className="h-full hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all border-white/5 bg-white/5 backdrop-blur-xl group overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <CardHeader className="relative">
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-white group-hover:text-indigo-300 transition-colors">{course.code}</CardTitle>
                                                    <span className="bg-indigo-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-lg border border-indigo-400/30">
                                                        K{course.price}
                                                    </span>
                                                </div>
                                                <CardDescription className="line-clamp-2 text-white/50">{course.name}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="relative">
                                                <p className="text-sm text-white/70 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="relative">
                                                <Button
                                                    className="w-full shadow-lg bg-indigo-600 hover:bg-indigo-500 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                    onClick={() => setSelectedCourse(course)}
                                                    disabled={subscribeMutation.isPending}
                                                >
                                                    Unlock Course
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
                                <Input
                                    value={phoneNumber || user?.phoneNumber || ""}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="pl-9 bg-white border-gray-200 text-gray-900"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 italic text-center uppercase tracking-widest pt-2">Powered by PhunziPay Gateway</p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-gray-50">
                        <Button
                            className="w-full py-6 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => {
                                handleFlutterwavePayment({
                                    callback: (response) => {
                                        if (response.status === "successful") {
                                            selectedCourse && subscribeMutation.mutate(selectedCourse.id);
                                        }
                                        closePaymentModal();
                                    },
                                    onClose: () => { },
                                });
                            }}
                            disabled={subscribeMutation.isPending}
                        >
                            {subscribeMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Activating Subscription...
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
