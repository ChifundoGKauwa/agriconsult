import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";

const provider = new GoogleAuthProvider();
const USERS_COLLECTION = "users";

// Simple SHA-256 hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string
) => {
  // Create user in Firebase Auth
  const result = await createUserWithEmailAndPassword(auth, email, password);

  try {
    // Hash the password for Firestore storage
    const hashedPwd = await hashPassword(password);

    // Store user details in Firestore (code creates this collection automatically)
    await setDoc(doc(db, USERS_COLLECTION, result.user.uid), {
      userID: result.user.uid,
      email: result.user.email,
      password: hashedPwd,
      createdAt: new Date().toISOString(),
    });
  } catch (firestoreError) {
    // If Firestore write fails, delete the Auth user to keep things consistent
    console.error("Firestore write failed — deleting Auth user:", firestoreError);
    await result.user.delete();
    throw new Error(
      "Failed to save user data. Please check Firestore security rules."
    );
  }

  return result;
};

export const getUserFromFirestore = async (userId: string) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};
