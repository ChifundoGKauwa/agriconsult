// Import the functions 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase lazily — on first access, not at module import time
function initOnce() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
  return { app, auth, db, analytics };
}

let _cache: ReturnType<typeof initOnce> | null = null;
function getCache() {
  if (!_cache) _cache = initOnce();
  return _cache;
}

export const app = new Proxy({} as ReturnType<typeof initOnce>["app"], {
  get(_, prop) { return Reflect.get(getCache().app, prop); },
});
export const auth = new Proxy({} as ReturnType<typeof initOnce>["auth"], {
  get(_, prop) { return Reflect.get(getCache().auth, prop); },
});
export const db = new Proxy({} as ReturnType<typeof initOnce>["db"], {
  get(_, prop) { return Reflect.get(getCache().db, prop); },
});
export const analytics =
  typeof window !== "undefined" ? getCache().analytics : null;
