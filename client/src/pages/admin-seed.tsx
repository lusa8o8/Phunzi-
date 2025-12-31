import { db } from "@/lib/firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Database } from "lucide-react";

export default function AdminSeed() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const seedData = async () => {
        setLoading(true);
        setStatus("Seeding data...");
        try {
            // Seed Courses
            const courseRef = await addDoc(collection(db, "courses"), {
                code: "MATH 1110",
                name: "Introduction to Calculus",
                description: "Comprehensive notes for first-year calculus, including limits, derivatives, and integrals.",
                price: 15,
                providerId: "virt_prov_1"
            });
            const courseId = courseRef.id;

            await addDoc(collection(db, "courses"), {
                code: "PHYS 1210",
                name: "Mechanics & Relativity",
                description: "Deep dive into Newtonian mechanics and special relativity concepts.",
                price: 20,
                providerId: "virt_prov_1"
            });

            // Seed Notes for MATH 1110
            const notes = [
                {
                    title: "Lecture 1: Limits & Continuity",
                    type: "pdf",
                    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    courseId: courseId,
                    createdAt: new Date().toISOString()
                },
                {
                    title: "Audio Summary: The Chain Rule",
                    type: "audio",
                    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                    courseId: courseId,
                    createdAt: new Date().toISOString()
                },
                {
                    title: "Lecture 2: Derivatives of Trig Functions",
                    type: "pdf",
                    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    courseId: courseId,
                    createdAt: new Date().toISOString()
                }
            ];

            for (const note of notes) {
                await addDoc(collection(db, "notes"), note);
            }

            setStatus("Success! Firestore seeded with MATH 1110 and PHYS 1210.");
        } catch (error: any) {
            setStatus("Error: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-6 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
                <Database className="h-12 w-12 text-indigo-600 mx-auto" />
                <h1 className="text-2xl font-bold">Database Seeder</h1>
                <p className="text-gray-500">Click below to populate your Firestore with initial Phunzi+ content.</p>
                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 text-lg"
                    onClick={seedData}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Seed Firestore Now"}
                </Button>
                {status && <p className={`text-sm ${status.includes("Error") ? "text-red-500" : "text-green-600"}`}>{status}</p>}
            </div>
            <a href="/" className="text-indigo-600 hover:underline">Back to App</a>
        </div>
    );
}
