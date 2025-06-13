import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: 'google' | 'email';
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
        // Set up auth state listener
        unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
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