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
            // Seed Course: MATH 1110 (using fixed ID for predictable reference)
            const mathId = "MATH1110";
            await setDoc(doc(db, "courses", mathId), {
                code: "MATH 1110",
                name: "Introduction to Calculus",
                description: "Comprehensive notes for first-year calculus, including limits, derivatives, and integrals.",
                price: 15,
                providerId: "virt_prov_1"
            });

            // Seed Course: PHYS 1210
            const physId = "PHYS1210";
            await setDoc(doc(db, "courses", physId), {
                code: "PHYS 1210",
                name: "Mechanics & Relativity",
                description: "Deep dive into Newtonian mechanics and special relativity concepts.",
                price: 20,
                providerId: "virt_prov_1"
            });

            // Seed Notes for MATH 1110
            const notes = [
                { id: "math1110_l1", title: "Lecture 1: Limits & Continuity", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                { id: "math1110_a1", title: "Audio Summary: The Chain Rule", type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                { id: "math1110_l2", title: "Lecture 2: Derivatives of Trig Functions", type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
            ];

            for (const note of notes) {
                await setDoc(doc(db, "notes", note.id), {
                    title: note.title,
                    type: note.type,
                    url: note.url,
                    courseId: mathId,
                    createdAt: new Date().toISOString()
                });
            }

            setStatus("Success! Firestore seeded with MATH 1110 and PHYS 1210.");
        } catch (error: any) {
            console.error(error);
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
