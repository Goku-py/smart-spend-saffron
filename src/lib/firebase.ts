import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Firebase configuration - these need to be set in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if all required Firebase config values are present
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId &&
    firebaseConfig.apiKey !== "demo-api-key" // Ensure it's not the demo value
  );
};

// Only initialize Firebase if config is valid
let app;
let auth;
let db;

if (isFirebaseConfigValid()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Configure Google Auth Provider
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase configuration incomplete - Google OAuth will be unavailable');
}

// Auth functions with proper error handling
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigValid() || !auth) {
    throw new Error('Google authentication is not configured. Please contact support.');
  }

  try {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user profile in Firestore if it doesn't exist
    await createUserProfile(user);
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Authentication service is not available');
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  if (!auth) {
    throw new Error('Authentication service is not available');
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: fullName
    });
    
    // Create user profile in Firestore
    await createUserProfile(user, { fullName });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Email sign-up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

export const resetPassword = async (email: string) => {
  if (!auth) {
    throw new Error('Authentication service is not available');
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send reset email');
  }
};

export const logOut = async () => {
  if (!auth) {
    // If Firebase auth is not available, just clear local storage
    localStorage.clear();
    sessionStorage.clear();
    return { error: null };
  }

  try {
    await signOut(auth);
    
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    return { error: null };
  } catch (error: any) {
    console.error('Logout error:', error);
    // Force logout even if Firebase fails
    localStorage.clear();
    sessionStorage.clear();
    return { error: error.message };
  }
};

// User profile management
const createUserProfile = async (user: any, additionalData?: any) => {
  if (!user || !db) return;
  
  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      
      await setDoc(userRef, {
        displayName: additionalData?.fullName || displayName || email?.split('@')[0],
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Export the configured status
export const isFirebaseConfigured = () => {
  return isFirebaseConfigValid() && !!auth;
};

export { auth, db };