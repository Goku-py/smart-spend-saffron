import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
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
  updatePassword,
  connectAuthEmulator,
  Auth
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Firebase configuration with validation
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  const errors = [];
  
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('AIza')) {
    errors.push('Invalid API key format');
  }
  
  if (firebaseConfig.authDomain && !firebaseConfig.authDomain.includes('.firebaseapp.com')) {
    errors.push('Invalid auth domain format');
  }
  
  return {
    isValid: errors.length === 0,
    missingFields,
    errors
  };
};

// Firebase instances
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;
let performance: ReturnType<typeof getPerformance> | null = null;

// Initialize Firebase with enhanced error handling
const initializeFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (getApps().length > 0) {
      console.warn('Firebase already initialized');
      return;
    }

    const configValidation = validateFirebaseConfig();
    if (!configValidation.isValid) {
      console.warn('Firebase configuration incomplete:', configValidation.errors);
      console.warn('Running in demo mode. Some features may be limited.');
      return;
    }

    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth
    auth = getAuth(app);
    auth.languageCode = 'en';
    auth.useDeviceLanguage();
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Initialize Analytics (only in production)
    if (import.meta.env.PROD) {
      try {
        const analyticsSupported = await isAnalyticsSupported();
        if (analyticsSupported) {
          analytics = getAnalytics(app);
        }
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
    
    // Initialize Performance Monitoring
    try {
      performance = getPerformance(app);
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
    
    console.log('✅ Firebase initialized successfully');
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.warn('Running in demo mode. Some features may be limited.');
  }
};

// Enhanced error handling with better error messages
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // General auth errors
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 8 characters long.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
    
    // Google OAuth specific errors
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.',
    'auth/cancelled-popup-request': 'Another sign-in request is already in progress.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    'auth/credential-already-in-use': 'This Google account is already linked to another user.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled. Please contact support.',
    'auth/invalid-credential': 'Invalid authentication credentials. Please check your email and password.',
    'auth/user-cancelled': 'Google sign-in was cancelled by the user.',
    'auth/timeout': 'Google sign-in timed out. Please try again.',
    
    // Configuration errors
    'auth/invalid-api-key': 'Invalid API key. Please check your Firebase configuration.',
    'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
    'auth/invalid-user-token': 'User token is invalid. Please sign in again.',
    'auth/user-token-expired': 'User token has expired. Please sign in again.',
    
    // Network and browser errors
    'auth/web-storage-unsupported': 'Your browser does not support web storage.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations. Please follow the setup guide to authorize this domain in Firebase Console and Google Cloud Console.',
    'auth/invalid-action-code': 'The action code is invalid or expired.',
    'auth/expired-action-code': 'The action code has expired.',
    'auth/invalid-continue-uri': 'The continue URL provided is invalid.'
  };
  
  return errorMessages[errorCode] || `Authentication error: ${errorCode}. Please try again or contact support.`;
};

// Standardized error response interface
interface AuthResponse<T = any> {
  user: T | null;
  error: string | null;
}

// Enhanced Email/Password Sign-In with better error handling
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse<User>> => {
  if (!isFirebaseConfigured()) {
    // Demo mode - simulate authentication
    if (email === 'demo@example.com' && password === 'password123') {
      const demoUser = {
        uid: 'demo-user-123',
        email: 'demo@example.com',
        displayName: 'Demo User',
        emailVerified: true,
        providerData: [{ providerId: 'password' }]
      } as unknown as User;
      
      return { user: demoUser, error: null };
    }
    
    return { 
      user: null, 
      error: 'Email authentication is not properly configured. Running in demo mode - use demo@example.com / password123 or create a new account.' 
    };
  }

  try {
    // Input validation
    if (!email || !password) {
      return { user: null, error: 'Email and password are required' };
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { user: null, error: 'Please enter a valid email address' };
    }
    
    console.log('🔐 Attempting email sign-in for:', email);
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update last login timestamp
    try {
      await updateUserProfile(user.uid, {
        lastLoginAt: serverTimestamp(),
        lastLoginMethod: 'email'
      });
    } catch (profileError) {
      console.warn('Profile update failed:', profileError);
    }
    
    console.log('✅ Email sign-in successful:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('❌ Email sign-in error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

// Enhanced Email/Password Registration with GDPR compliance
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  fullName: string,
  gdprConsent: { marketing: boolean; analytics: boolean }
): Promise<AuthResponse<User>> => {
  if (!isFirebaseConfigured()) {
    // Demo mode - simulate registration
    const demoUser = {
      uid: `demo-${Date.now()}`,
      email: email,
      displayName: fullName,
      emailVerified: false,
      providerData: [{ providerId: 'password' }]
    } as unknown as User;
    
    // Store in localStorage for demo persistence
    try {
      localStorage.setItem('demo_user', JSON.stringify({
        uid: demoUser.uid,
        email: demoUser.email,
        displayName: demoUser.displayName,
        emailVerified: demoUser.emailVerified,
        gdprConsent
      }));
    } catch (e) {
      console.warn('Failed to store demo user:', e);
    }
    
    return { user: demoUser, error: null };
  }

  try {
    // Enhanced input validation
    if (!email || !password || !fullName) {
      return { user: null, error: 'All fields are required' };
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { user: null, error: 'Please enter a valid email address' };
    }
    
    if (password.length < 8) {
      return { user: null, error: 'Password must be at least 8 characters long' };
    }
    
    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { user: null, error: 'Password must contain uppercase, lowercase, and numeric characters' };
    }
    
    console.log('📝 Creating new user account for:', email);
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user profile with display name
    try {
      await updateProfile(user, {
        displayName: fullName
      });
    } catch (profileError) {
      console.warn('Display name update failed:', profileError);
    }
    
    // Send email verification
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/auth?verified=true`,
        handleCodeInApp: false
      });
    } catch (verificationError) {
      console.warn('Email verification failed:', verificationError);
    }
    
    // Create comprehensive user profile with GDPR compliance
    try {
      await createOrUpdateUserProfile(user, 'email', {
        gdprConsent: {
          marketing: gdprConsent.marketing,
          analytics: gdprConsent.analytics,
          consentDate: serverTimestamp(),
          consentVersion: '1.0'
        },
        emailVerificationSent: true
      });
    } catch (profileError) {
      console.warn('Profile creation failed:', profileError);
    }
    
    console.log('✅ User registration successful:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('❌ Email sign-up error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

// Enhanced Password Reset
export const resetPassword = async (email: string): Promise<AuthResponse> => {
  if (!isFirebaseConfigured()) {
    // Demo mode - simulate password reset
    console.log(`[DEMO MODE] Password reset requested for ${email}`);
    return { 
      user: null, 
      error: null 
    };
  }

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { user: null, error: 'Please enter a valid email address' };
    }
    
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/auth?mode=signin`,
      handleCodeInApp: false
    });
    
    console.log('📧 Password reset email sent to:', email);
    
    return { user: null, error: null };
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

// Enhanced logout with comprehensive cleanup
export const logOut = async (): Promise<AuthResponse> => {
  try {
    if (auth?.currentUser) {
      const uid = auth.currentUser.uid;
      
      // Update last logout timestamp
      try {
        await updateUserProfile(uid, {
          lastLogoutAt: serverTimestamp()
        });
      } catch (profileError) {
        console.warn('Profile update failed during logout:', profileError);
      }
      
      await signOut(auth);
      
      console.log('✅ User logged out successfully:', uid);
    } else {
      // Demo mode - clear localStorage
      localStorage.removeItem('demo_user');
    }
    
    // Clear all local storage and session data
    try {
      // Don't clear everything, just auth-related items
      localStorage.removeItem('firebase:authUser');
      localStorage.removeItem('firebase:session');
      localStorage.removeItem('demo_user');
      sessionStorage.removeItem('firebase:authUser');
      sessionStorage.removeItem('firebase:session');
    } catch (storageError) {
      console.warn('Storage cleanup failed:', storageError);
    }
    
    return { user: null, error: null };
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    
    // Force logout even if Firebase fails
    try {
      localStorage.removeItem('firebase:authUser');
      localStorage.removeItem('firebase:session');
      localStorage.removeItem('demo_user');
      sessionStorage.removeItem('firebase:authUser');
      sessionStorage.removeItem('firebase:session');
    } catch (storageError) {
      console.warn('Emergency storage cleanup failed:', storageError);
    }
    
    return { user: null, error: error.message };
  }
};

// User profile management functions with enhanced error handling
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
    
    const baseProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      lastLoginAt: now,
      provider,
      preferences: {
        language: 'en',
        currency: 'INR',
        notifications: true
      }
    };
    
    if (!userSnap.exists()) {
      // Create new user profile
      const newProfile = {
        ...baseProfile,
        createdAt: now,
        gdprConsent: {
          marketing: false,
          analytics: false,
          consentDate: now,
          consentVersion: '1.0'
        },
        ...additionalData
      };
      
      await setDoc(userRef, newProfile);
      console.log('👤 User profile created:', user.uid);
    } else {
      // Update existing user profile
      await updateDoc(userRef, {
        ...baseProfile,
        updatedAt: now,
        ...additionalData
      });
      console.log('👤 User profile updated:', user.uid);
    }
  } catch (error) {
    console.error('❌ Error managing user profile:', error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Get user profile with error handling
export const getUserProfile = async (uid: string) => {
  if (!db) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return null;
  }
};

// Update user profile with error handling
export const updateUserProfile = async (uid: string, updates: any) => {
  if (!db) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    console.log('👤 User profile updated:', uid);
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Auth state listener with error handling
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.error('❌ Error setting up auth state listener:', error);
    callback(null);
    return () => {};
  }
};

// Configuration status checks
const isFirebaseConfigured = (): boolean => {
  return validateFirebaseConfig().isValid && !!auth;
};

// Export Firebase instances and utilities
export {
  app,
  auth,
  db,
  analytics,
  performance,
  initializeFirebase,
  getAuthErrorMessage,
  isFirebaseConfigured
};

// Export configuration validation for debugging
export const getFirebaseConfigStatus = () => validateFirebaseConfig();