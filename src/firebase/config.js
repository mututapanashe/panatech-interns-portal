import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const isConfigValid = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim() !== "" && !value.startsWith("your-"),
);

let app;
let auth;
let db;
let functions;
let storage;

if (isConfigValid) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || "us-central1");
  storage = getStorage(app);
} else {
  console.warn("Firebase config is missing. Auth features are disabled until .env is set.");
  auth = null;
  db = null;
  functions = null;
  storage = null;
}

export { auth, db, functions, storage, isConfigValid as isFirebaseConfigured };
