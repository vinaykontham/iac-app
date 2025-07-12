import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is properly set
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.projectId !== 'your_project_id' &&
    !firebaseConfig.apiKey.includes('undefined') &&
    !firebaseConfig.projectId.includes('undefined')
  );
};

// Demo mode flag - force demo mode if config is invalid or explicitly set
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !isFirebaseConfigured();

let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let firestore: any = null;
let functions: any = null;

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase only if it hasn't been initialized yet
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    firestore = getFirestore(app);
    functions = getFunctions(app);

    // Configure Google provider
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth, googleProvider, firestore, functions };
