import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - these need to be set in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const isFirebaseConfigValid = () => {
  const requiredFields = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 
    'messagingSenderId', 'appId'
  ];
  
  return requiredFields.every(field => 
    firebaseConfig[field as keyof typeof firebaseConfig] && 
    firebaseConfig[field as keyof typeof firebaseConfig] !== "demo-api-key"
  );
};

// Initialize Firebase only if config is valid
let app: any;
let auth: any;
let db: any;
let analytics: any;

if (isFirebaseConfigValid()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize analytics only in production
    if (import.meta.env.PROD && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
    
    // Configure Google Auth Provider with security settings
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      hd: undefined // Remove domain restriction for broader access
    });
    
    // Add required scopes for user profile information
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase configuration incomplete - Authentication services will be unavailable');
}

// Enhanced error handling with user-friendly messages
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up was blocked. Please allow pop-ups and try again.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
    'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
    'auth/invalid-verification-id': 'Invalid verification ID. Please try again.'
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// User profile interface for type safety
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: any;
  lastLoginAt: any;
  preferences: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  gdprConsent: {
    marketing: boolean;
    analytics: boolean;
    consentDate: any;
  };
}

// Google Sign-In with enhanced security
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
    
    // Log authentication event for security monitoring
    console.log('Google sign-in successful:', {
      uid: user.uid,
      email: user.email,
      timestamp: new Date().toISOString()
    });
    
    // Create or update user profile
    await createOrUpdateUserProfile(user, 'google');
    
    // Send analytics event (GDPR compliant)
    if (analytics) {
      // Only track if user has consented to analytics
      const userProfile = await getUserProfile(user.uid);
      if (userProfile?.gdprConsent?.analytics) {
        // Track login event
      }
    }
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Enhanced error handling
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Email/Password Sign-In with security enhancements
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Authentication service is not available');
  }

  try {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update last login timestamp
    await updateUserProfile(user.uid, {
      lastLoginAt: serverTimestamp()
    });
    
    // Log successful login for security monitoring
    console.log('Email sign-in successful:', {
      uid: user.uid,
      email: user.email,
      timestamp: new Date().toISOString()
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    
    // Log failed login attempt for security monitoring
    console.warn('Failed login attempt:', {
      email,
      error: error.code,
      timestamp: new Date().toISOString()
    });
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Enhanced Email/Password Registration with GDPR compliance
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  fullName: string,
  gdprConsent: { marketing: boolean; analytics: boolean }
) => {
  if (!auth) {
    throw new Error('Authentication service is not available');
  }

  try {
    // Enhanced input validation
    if (!email || !password || !fullName) {
      throw new Error('All fields are required');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      throw new Error('Password must contain uppercase, lowercase, and numeric characters');
    }
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: fullName
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create comprehensive user profile with GDPR compliance
    await createOrUpdateUserProfile(user, 'email', {
      gdprConsent: {
        marketing: gdprConsent.marketing,
        analytics: gdprConsent.analytics,
        consentDate: serverTimestamp()
      }
    });
    
    console.log('User registration successful:', {
      uid: user.uid,
      email: user.email,
      timestamp: new Date().toISOString()
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Email sign-up error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Enhanced Password Reset with security measures
export const resetPassword = async (email: string) => {
  if (!auth) {
    throw new Error('Authentication service is not available');
  }

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/auth?mode=signin`,
      handleCodeInApp: false
    });
    
    // Log password reset request for security monitoring
    console.log('Password reset requested:', {
      email,
      timestamp: new Date().toISOString()
    });
    
    return { error: null };
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Secure password change functionality
export const changePassword = async (currentPassword: string, newPassword: string) => {
  if (!auth?.currentUser) {
    throw new Error('User not authenticated');
  }

  try {
    const user = auth.currentUser;
    
    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }
    
    await updatePassword(user, newPassword);
    
    // Update user profile timestamp
    await updateUserProfile(user.uid, {
      lastPasswordChange: serverTimestamp()
    });
    
    console.log('Password changed successfully:', {
      uid: user.uid,
      timestamp: new Date().toISOString()
    });
    
    return { error: null };
  } catch (error: any) {
    console.error('Password change error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Enhanced logout with cleanup
export const logOut = async () => {
  try {
    if (auth?.currentUser) {
      const uid = auth.currentUser.uid;
      
      // Update last logout timestamp
      await updateUserProfile(uid, {
        lastLogoutAt: serverTimestamp()
      });
      
      await signOut(auth);
      
      console.log('User logged out successfully:', {
        uid,
        timestamp: new Date().toISOString()
      });
    }
    
    // Clear all local storage and session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
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

// Create or update user profile with GDPR compliance
const createOrUpdateUserProfile = async (
  user: User, 
  provider: string, 
  additionalData?: any
) => {
  if (!user || !db) return;
  
  const userRef = doc(db, 'users', user.uid);
  
  try {
    const userSnap = await getDoc(userRef);
    const now = serverTimestamp();
    
    const baseProfile: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastLoginAt: now,
      preferences: {
        language: 'en',
        currency: 'INR',
        notifications: true
      }
    };
    
    if (!userSnap.exists()) {
      // Create new user profile
      const newProfile: UserProfile = {
        ...baseProfile,
        createdAt: now,
        gdprConsent: {
          marketing: false,
          analytics: false,
          consentDate: now
        },
        ...additionalData
      } as UserProfile;
      
      await setDoc(userRef, newProfile);
      console.log('User profile created:', user.uid);
    } else {
      // Update existing user profile
      await updateDoc(userRef, {
        ...baseProfile,
        ...additionalData
      });
      console.log('User profile updated:', user.uid);
    }
  } catch (error) {
    console.error('Error managing user profile:', error);
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  if (!db) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    console.log('User profile updated:', uid);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Update GDPR consent
export const updateGDPRConsent = async (
  uid: string, 
  consent: { marketing: boolean; analytics: boolean }
) => {
  if (!db) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      gdprConsent: {
        ...consent,
        consentDate: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
    
    console.log('GDPR consent updated:', uid);
  } catch (error) {
    console.error('Error updating GDPR consent:', error);
  }
};

// Delete user account (GDPR Right to be Forgotten)
export const deleteUserAccount = async () => {
  if (!auth?.currentUser || !db) {
    throw new Error('User not authenticated');
  }

  try {
    const user = auth.currentUser;
    const uid = user.uid;
    
    // Delete user profile from Firestore
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      deleted: true,
      deletedAt: serverTimestamp(),
      // Keep minimal data for compliance
      email: '[DELETED]',
      displayName: '[DELETED]',
      photoURL: null
    });
    
    // Delete Firebase Auth user
    await user.delete();
    
    // Clear local data
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('User account deleted:', uid);
    
    return { error: null };
  } catch (error: any) {
    console.error('Account deletion error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Auth state listener for session management
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Export configuration status
export const isFirebaseConfigured = () => {
  return isFirebaseConfigValid() && !!auth;
};

// Export Firebase instances
export { auth, db, analytics };