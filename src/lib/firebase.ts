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

// Enhanced configuration validation
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 
    'messagingSenderId', 'appId'
  ];
  
  const missingFields = requiredFields.filter(field => {
    const value = firebaseConfig[field as keyof typeof firebaseConfig];
    return !value || value === "demo-api-key" || value === "your_project_id";
  });
  
  if (missingFields.length > 0) {
    console.warn('Missing Firebase configuration fields:', missingFields);
    return false;
  }
  
  // Validate format of key fields
  if (!firebaseConfig.apiKey?.startsWith('AIza')) {
    console.warn('Invalid Firebase API key format');
    return false;
  }
  
  if (!firebaseConfig.authDomain?.includes('.firebaseapp.com')) {
    console.warn('Invalid Firebase auth domain format');
    return false;
  }
  
  return true;
};

// Initialize Firebase only if config is valid
let app: any;
let auth: any;
let db: any;
let analytics: any;
let googleProvider: GoogleAuthProvider;

const isConfigValid = validateFirebaseConfig();

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize analytics only in production
    if (import.meta.env.PROD && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
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
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    console.log('✅ Firebase initialized successfully');
    console.log('🔐 Google OAuth provider configured');
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.warn('⚠️ Firebase configuration incomplete - Authentication services will be unavailable');
  console.log('📝 Please check your .env file and ensure all Firebase configuration values are set correctly');
}

// Enhanced error handling with specific Google OAuth errors
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

// Enhanced Google Sign-In with comprehensive error handling
export const signInWithGoogle = async () => {
  if (!isConfigValid || !auth || !googleProvider) {
    throw new Error('Google authentication is not properly configured. Please check your Firebase setup or contact support.');
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
      throw new Error('Google sign-in completed but no user data received');
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
    await createOrUpdateUserProfile(user, 'google', {
      googleCredential: {
        accessToken: credential?.accessToken,
        idToken: credential?.idToken,
        providerId: additionalUserInfo?.providerId,
        lastSignInTime: new Date().toISOString()
      }
    });
    
    // Log successful authentication for security monitoring
    console.log('🔐 User profile updated with Google authentication data');
    
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
    
    // Handle specific Google OAuth errors
    let errorMessage = getAuthErrorMessage(error.code);
    
    // Add specific troubleshooting for common issues
    if (error.code === 'auth/popup-blocked') {
      errorMessage += '\n\nTroubleshooting:\n1. Allow pop-ups for this website\n2. Try disabling popup blockers\n3. Use a different browser if the issue persists';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage += '\n\nThis appears to be a configuration issue. Please contact support.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage += '\n\nGoogle sign-in needs to be enabled in the Firebase console.';
    }
    
    throw new Error(errorMessage);
  }
};

// Enhanced Email/Password Sign-In
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
    
    console.log('🔐 Attempting email sign-in for:', email);
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update last login timestamp
    await updateUserProfile(user.uid, {
      lastLoginAt: serverTimestamp(),
      lastLoginMethod: 'email'
    });
    
    console.log('✅ Email sign-in successful:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('❌ Email sign-in error:', error);
    
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
    
    console.log('📝 Creating new user account for:', email);
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: fullName
    });
    
    // Send email verification
    await sendEmailVerification(user, {
      url: `${window.location.origin}/auth?verified=true`,
      handleCodeInApp: false
    });
    
    // Create comprehensive user profile with GDPR compliance
    await createOrUpdateUserProfile(user, 'email', {
      gdprConsent: {
        marketing: gdprConsent.marketing,
        analytics: gdprConsent.analytics,
        consentDate: serverTimestamp(),
        consentVersion: '1.0'
      },
      emailVerificationSent: true
    });
    
    console.log('✅ User registration successful:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('❌ Email sign-up error:', error);
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

// Enhanced Password Reset
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
    
    console.log('📧 Password reset email sent to:', email);
    
    return { error: null };
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    
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
      
      console.log('✅ User logged out successfully:', uid);
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
    console.error('❌ Logout error:', error);
    
    // Force logout even if Firebase fails
    localStorage.clear();
    sessionStorage.clear();
    
    return { error: error.message };
  }
};

// User profile management functions
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
  }
};

// Get user profile
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

// Update user profile
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
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Configuration status check
export const isFirebaseConfigured = () => {
  return isConfigValid && !!auth;
};

// Google OAuth availability check
export const isGoogleOAuthAvailable = () => {
  return isConfigValid && !!auth && !!googleProvider;
};

// Export Firebase instances
export { auth, db, analytics };