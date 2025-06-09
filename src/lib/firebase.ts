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
  updatePassword,
  connectAuthEmulator
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Enhanced Firebase configuration with better validation
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Enhanced configuration validation with better error handling
const validateFirebaseConfig = (): { isValid: boolean; missingFields: string[]; errors: string[] } => {
  const requiredFields = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 
    'messagingSenderId', 'appId'
  ];
  
  const errors: string[] = [];
  const missingFields = requiredFields.filter(field => {
    const value = firebaseConfig[field as keyof typeof firebaseConfig];
    if (!value || value === "demo-api-key" || value === "your_project_id" || value === "") {
      return true;
    }
    return false;
  });
  
  // Validate format of key fields with better error messages
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('AIza') && firebaseConfig.apiKey !== "demo-api-key") {
    errors.push('Invalid Firebase API key format - should start with "AIza"');
  }
  
  if (firebaseConfig.authDomain && !firebaseConfig.authDomain.includes('.firebaseapp.com') && firebaseConfig.authDomain !== "your_project.firebaseapp.com") {
    errors.push('Invalid Firebase auth domain format - should end with ".firebaseapp.com"');
  }
  
  if (firebaseConfig.projectId && firebaseConfig.projectId.length < 3 && firebaseConfig.projectId !== "your_project_id") {
    errors.push('Invalid Firebase project ID - should be at least 3 characters');
  }
  
  const isValid = missingFields.length === 0 && errors.length === 0;
  
  if (!isValid) {
    console.warn('Firebase configuration validation failed:', {
      missingFields,
      errors,
      config: Object.keys(firebaseConfig).reduce((acc, key) => {
        acc[key] = firebaseConfig[key as keyof typeof firebaseConfig] ? '[SET]' : '[MISSING]';
        return acc;
      }, {} as Record<string, string>)
    });
  }
  
  return { isValid, missingFields, errors };
};

// Initialize Firebase with enhanced error handling
let app: any;
let auth: any;
let db: any;
let analytics: any;
let googleProvider: GoogleAuthProvider;

const configValidation = validateFirebaseConfig();
const isConfigValid = configValidation.isValid;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize analytics only in production with proper error handling
    if (import.meta.env.PROD && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.warn('Analytics initialization failed:', analyticsError);
      }
    }
    
    // Configure Google Auth Provider with enhanced settings
    googleProvider = new GoogleAuthProvider();
    
    // Set custom parameters for better UX
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      hd: undefined, // Remove domain restriction
      include_granted_scopes: 'true',
      access_type: 'online'
    });
    
    // Add required scopes
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    googleProvider.addScope('openid');
    
    // Configure auth settings
    auth.languageCode = 'en';
    auth.useDeviceLanguage();
    
    // Connect to emulator in development if needed
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (emulatorError) {
        console.warn('Firebase emulator connection failed:', emulatorError);
      }
    }
    
    console.log('✅ Firebase initialized successfully');
    console.log('🔐 Google OAuth provider configured');
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('Configuration validation:', configValidation);
  }
} else {
  console.warn('⚠️ Firebase configuration incomplete - Authentication services will be unavailable');
  console.log('📝 Missing fields:', configValidation.missingFields);
  console.log('📝 Validation errors:', configValidation.errors);
  console.log('📝 Please check your .env file and ensure all Firebase configuration values are set correctly');
}

// Standardized error handling with better error messages
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
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method. Please try signing in with your email and password.',
    'auth/credential-already-in-use': 'This Google account is already linked to another user.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled. Please contact support.',
    'auth/invalid-credential': 'The Google sign-in credential is invalid or expired.',
    'auth/user-cancelled': 'Google sign-in was cancelled by the user.',
    'auth/timeout': 'Google sign-in timed out. Please try again.',
    
    // Configuration errors
    'auth/invalid-api-key': 'Invalid API key. Please check your Firebase configuration.',
    'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication.',
    'auth/invalid-user-token': 'User token is invalid. Please sign in again.',
    'auth/user-token-expired': 'User token has expired. Please sign in again.',
    
    // Network and browser errors
    'auth/web-storage-unsupported': 'Your browser does not support web storage.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
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

// Enhanced Google Sign-In with comprehensive error handling
export const signInWithGoogle = async (): Promise<AuthResponse<User>> => {
  if (!isConfigValid || !auth || !googleProvider) {
    return {
      user: null,
      error: 'Google authentication is not properly configured. Please check your Firebase setup or contact support.'
    };
  }

  try {
    console.log('🚀 Initiating Google sign-in...');
    
    // Clear any existing auth state
    if (auth.currentUser) {
      console.log('📝 Existing user session found, proceeding with Google sign-in');
    }
    
    // Configure popup settings for better compatibility
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!user) {
      return {
        user: null,
        error: 'Google sign-in completed but no user data received'
      };
    }
    
    console.log('✅ Google sign-in successful:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    });
    
    // Get additional user info from Google
    const additionalUserInfo = result.user.providerData[0];
    
    // Create or update user profile with Google data
    try {
      await createOrUpdateUserProfile(user, 'google', {
        googleCredential: {
          accessToken: credential?.accessToken,
          idToken: credential?.idToken,
          providerId: additionalUserInfo?.providerId,
          lastSignInTime: new Date().toISOString()
        }
      });
      
      console.log('🔐 User profile updated with Google authentication data');
    } catch (profileError) {
      console.warn('Profile update failed:', profileError);
      // Don't fail the auth if profile update fails
    }
    
    return { user, error: null };
    
  } catch (error: any) {
    console.error('❌ Google sign-in error:', error);
    
    // Enhanced error logging for debugging
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
      customData: error.customData
    });
    
    const errorMessage = getAuthErrorMessage(error.code);
    return { user: null, error: errorMessage };
  }
};

// Enhanced Email/Password Sign-In with better error handling
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse<User>> => {
  if (!auth) {
    return { user: null, error: 'Authentication service is not available' };
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
  if (!auth) {
    return { user: null, error: 'Authentication service is not available' };
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
  if (!auth) {
    return { user: null, error: 'Authentication service is not available' };
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
    }
    
    // Clear all local storage and session data
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch (storageError) {
      console.warn('Storage cleanup failed:', storageError);
    }
    
    return { user: null, error: null };
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    
    // Force logout even if Firebase fails
    try {
      localStorage.clear();
      sessionStorage.clear();
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
export const isFirebaseConfigured = (): boolean => {
  return isConfigValid && !!auth;
};

export const isGoogleOAuthAvailable = (): boolean => {
  return isConfigValid && !!auth && !!googleProvider;
};

// Export Firebase instances
export { auth, db, analytics };

// Export configuration validation for debugging
export const getFirebaseConfigStatus = () => configValidation;