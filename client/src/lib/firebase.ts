import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config from the console
const firebaseConfig = {
    apiKey: "PLACEHOLDER",
    authDomain: "PLACEHOLDER.firebaseapp.com",
    projectId: "PLACEHOLDER",
    storageBucket: "PLACEHOLDER.firebasestorage.app",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
