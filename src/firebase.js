import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Firebase configuration from your screenshot
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBIVP08faAnyg748-da3mnxlR5KnBW-NzI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bookstore-fa549.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bookstore-fa549",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bookstore-fa549.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "78555630396",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:78555630396:web:6ae74a5db7c80b9a59ec39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult };
