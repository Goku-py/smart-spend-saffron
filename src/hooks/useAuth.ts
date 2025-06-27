import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, onAuthStateChange, isFirebaseConfigured } from '../lib/firebase';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: 'google' | 'email' | 'demo';
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    const setAuthStateIfMounted = (state: AuthState) => {
      if (mounted) {
        setAuthState(state);
      }
    };

    const initializeAuth = async () => {
      try {
        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
          console.log('Firebase not configured, checking for demo user');
          // Check for demo user in localStorage
          try {
            const demoUserJson = localStorage.getItem('demo_user');
            if (demoUserJson) {
              const demoUser = JSON.parse(demoUserJson);
              setAuthStateIfMounted({
                user: {
                  id: demoUser.uid,
                  email: demoUser.email,
                  displayName: demoUser.displayName,
                  photoURL: demoUser.photoURL,
                  emailVerified: demoUser.emailVerified,
                  provider: 'demo'
                },
                loading: false,
                error: null
              });
            } else {
              setAuthStateIfMounted({
                user: null,
                loading: false,
                error: null
              });
            }
          } catch (error) {
            console.error('Error checking for demo user:', error);
            setAuthStateIfMounted({
              user: null,
              loading: false,
              error: null
            });
          }
          return;
        }

        // Set up auth state listener
        unsubscribe = onAuthStateChange(async (firebaseUser) => {
          if (firebaseUser) {
            const authUser: AuthUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
              emailVerified: firebaseUser.emailVerified,
              provider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
            };

            setAuthStateIfMounted({
              user: authUser,
              loading: false,
              error: null
            });
          } else {
            setAuthStateIfMounted({
              user: null,
              loading: false,
              error: null
            });
          }
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthStateIfMounted({
          user: null,
          loading: false,
          error: 'Failed to initialize authentication'
        });
      }
    };

    // Start initialization
    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return authState;
};