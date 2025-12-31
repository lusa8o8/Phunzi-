import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: any;
    logoutMutation: any;
    registerMutation: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUser({
                            ...userDoc.data(),
                            id: firebaseUser.uid as any // Using UID as ID
                        } as User);
                    } else {
                        setUser(null);
                    }
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                    setError(err as Error);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginMutation = useMutation({
        mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
            // Note: Firebase uses email. We'll treat username as email for simplicity or map it.
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.username.includes("@") ? credentials.username : `${credentials.username}@phunzi.plus`,
                credentials.password
            );
            return userCredential.user;
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: InsertUser) => {
            const email = credentials.username.includes("@") ? credentials.username : `${credentials.username}@phunzi.plus`;
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                credentials.password
            );

            // Create user profile in Firestore
            const userProfile: Omit<User, "id"> = {
                username: credentials.username,
                password: "HIDDEN", // Don't store plain password in Firestore
                name: credentials.name,
                role: credentials.role || "subscriber",
                phoneNumber: credentials.phoneNumber || null,
                university: credentials.university || null,
                school: credentials.school || null,
                studentId: credentials.studentId || null,
                bio: null,
                rating: 5
            };

            await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
            return userCredential.user;
        },
        onError: (error: Error) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await signOut(auth);
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            setUser(null);
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
