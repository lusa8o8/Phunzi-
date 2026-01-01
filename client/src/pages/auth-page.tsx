import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";

export default function AuthPage() {
    const { user, loginMutation, registerMutation } = useAuth();

    if (user) {
        return <Redirect to="/" />;
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0c10]">
            <div className="flex flex-col justify-center items-center p-8">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-16 w-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                            <GraduationCap className="h-9 w-9 text-indigo-400" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">
                        Phunzi+
                    </h1>
                    <p className="text-indigo-200/60 mt-3 font-medium tracking-wide">
                        Premium Notes Marketplace for Students
                    </p>
                </div>

                <Card className="w-full max-w-md shadow-2xl border-white/10 bg-white/5 backdrop-blur-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-white text-2xl">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-indigo-200/50">Login or Register to access your notes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5 border-white/10">
                                <TabsTrigger value="login" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Login</TabsTrigger>
                                <TabsTrigger value="register" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <AuthForm
                                    mode="login"
                                    onSubmit={(data) => loginMutation.mutate(data)}
                                    isLoading={loginMutation.isPending}
                                />
                            </TabsContent>

                            <TabsContent value="register">
                                <AuthForm
                                    mode="register"
                                    onSubmit={(data) => registerMutation.mutate(data)}
                                    isLoading={registerMutation.isPending}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                <div className="max-w-lg space-y-6 relative z-10">
                    <h2 className="text-4xl font-black leading-tight">Don't let a clash cost you your degree.</h2>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        "Course Overload" is real. Access high-quality notes from top-performing juniors.
                        Secure your grades without being in two places at once.
                    </p>
                    <ul className="space-y-4 mt-8">
                        <li className="flex items-center text-lg">
                            <span className="h-2.5 w-2.5 bg-white rounded-full mr-4 shadow-lg shadow-white/50" />
                            Human-Verified Notes (PDFs)
                        </li>
                        <li className="flex items-center text-lg">
                            <span className="h-2.5 w-2.5 bg-white rounded-full mr-4 shadow-lg shadow-white/50" />
                            Audio Summaries of Lectures
                        </li>
                        <li className="flex items-center text-lg">
                            <span className="h-2.5 w-2.5 bg-white rounded-full mr-4 shadow-lg shadow-white/50" />
                            Quiz & Deadline Alerts
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function AuthForm({ mode, onSubmit, isLoading }: {
    mode: "login" | "register",
    onSubmit: (data: InsertUser) => void,
    isLoading: boolean
}) {
    const form = useForm<InsertUser>({
        resolver: zodResolver(insertUserSchema),
        defaultValues: {
            username: "",
            password: "",
            name: "",
            role: "subscriber",
            phoneNumber: "",
            university: "",
            school: "",
            studentId: ""
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="student123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {mode === "register" && (
                    <>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Money Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="097..." {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="university"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>University</FormLabel>
                                        <FormControl>
                                            <Input placeholder="UNZA" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>School</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Natural Sciences" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2021..." {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-900/30 border-0" disabled={isLoading}>
                    {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {mode === "login" ? "Login" : "Create Account"}
                </Button>
            </form>
        </Form>
    );
}
