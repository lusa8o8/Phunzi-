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
        <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <div className="flex flex-col justify-center items-center p-8">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <GraduationCap className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Phunzi+
                    </h1>
                    <p className="text-gray-600 mt-2">
                        The Micro-Subscription Marketplace for Students
                    </p>
                </div>

                <Card className="w-full max-w-md shadow-xl border-indigo-100">
                    <CardHeader>
                        <CardTitle className="text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">Login or Register to access your notes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
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

            <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-indigo-600 text-white">
                <div className="max-w-lg space-y-6">
                    <h2 className="text-3xl font-bold">Don't let a clash cost you your degree.</h2>
                    <p className="text-indigo-100 text-lg">
                        "Course Overload" is real. Access high-quality notes from top-performing juniors.
                        Secure your grades without being in two places at once.
                    </p>
                    <ul className="space-y-4 mt-8">
                        <li className="flex items-center">
                            <span className="h-2 w-2 bg-white rounded-full mr-3" />
                            Human-Verified Notes (PDFs)
                        </li>
                        <li className="flex items-center">
                            <span className="h-2 w-2 bg-white rounded-full mr-3" />
                            Audio Summaries of Lectures
                        </li>
                        <li className="flex items-center">
                            <span className="h-2 w-2 bg-white rounded-full mr-3" />
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

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                    {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {mode === "login" ? "Login" : "Create Account"}
                </Button>
            </form>
        </Form>
    );
}
