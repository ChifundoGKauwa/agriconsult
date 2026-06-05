// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Lazy initialization — prevents SSR crashes on Cloudflare Workers
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getApp(): FirebaseApp {
  if (!_app) {
    _app = initializeApp(firebaseConfig);
  }
  return _app;
}

function getAuth_(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());
  }
  return _auth;
}

function getDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

// Proxy-based lazy exports — only initializes Firebase on first access
export const app = new Proxy({} as FirebaseApp, {
  get(_, prop) { return Reflect.get(getApp(), prop); },
}) as FirebaseApp;
export const auth = new Proxy({} as Auth, {
  get(_, prop) { return Reflect.get(getAuth_(), prop); },
}) as Auth;
export const db = new Proxy({} as Firestore, {
  get(_, prop) { return Reflect.get(getDb(), prop); },
}) as Firestore;

export const analytics =
  typeof window !== "undefined" ? () => getAnalytics(getApp()) : null;
