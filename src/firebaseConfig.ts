import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB8pjqJFr06OInXF4SaH7bYUAxlYxbPvzU",
  authDomain: "labwork4-88720.firebaseapp.com",
  projectId: "labwork4-88720",
  storageBucket: "labwork4-88720.firebasestorage.app",
  messagingSenderId: "922125637469",
  appId: "1:922125637469:web:d236e0a82fe3780084fab4",
  measurementId: "G-XXSH6QF7F6"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);