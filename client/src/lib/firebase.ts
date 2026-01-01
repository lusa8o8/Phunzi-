import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCl1CnSFaZJL15HJVHuHYBbYUmKAutqUYo",
    authDomain: "phunzi-plus.firebaseapp.com",
    projectId: "phunzi-plus",
    storageBucket: "phunzi-plus.firebasestorage.app",
    messagingSenderId: "701188567868",
    appId: "1:701188567868:web:031de628d1df745bf3a439",
    measurementId: "G-5PSKR4DRL4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const FLW_PUBLIC_KEY = "FLWPUBK_TEST-REPLACE_WITH_YOUR_KEY"; // Placeholder for real payment integration
export default app;
