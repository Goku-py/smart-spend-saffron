import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured, getUserProfile } from '../lib/firebase';
import { supabase, isSupabaseConfigured } from '../integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  provider: 'firebase' | 'supabase' | 'demo';
  profile?: any;
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
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        // Check if Firebase is configured and set up listener
        if (isFirebaseConfigured()) {
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              try {
                // Get user profile from Firestore
                const profile = await getUserProfile(firebaseUser.uid);
                
                const authUser: AuthUser = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || profile?.displayName || undefined,
                  photoURL: firebaseUser.photoURL || profile?.photoURL || undefined,
                  emailVerified: firebaseUser.emailVerified,
                  provider: 'firebase',
                  profile
                };
                
                // Sync with Supabase if configured
                if (isSupabaseConfigured()) {
                  await syncWithSupabase(authUser);
                }
                
                setAuthState({
                  user: authUser,
                  loading: false,
                  error: null
                });
              } catch (error) {
                console.error('Error loading user profile:', error);
                // Still set user even if profile loading fails
                const authUser: AuthUser = {
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || undefined,
                  photoURL: firebaseUser.photoURL || undefined,
                  emailVerified: firebaseUser.emailVerified,
                  provider: 'firebase'
                };
                
                setAuthState({
                  user: authUser,
                  loading: false,
                  error: null
                });
              }
            } else {
              // No Firebase user, check Supabase
              await checkSupabaseSession();
            }
          });
        } else {
          // Firebase not configured, check Supabase
          await checkSupabaseSession();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await checkDemoSession();
      }
    };

    const checkSupabaseSession = async () => {
      try {
        if (!isSupabaseConfigured() || !supabase) {
          await checkDemoSession();
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Supabase session check error:', error);
          await checkDemoSession();
          return;
        }
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.full_name,
            photoURL: session.user.user_metadata?.avatar_url,
            emailVerified: session.user.email_confirmed_at ? true : false,
            provider: 'supabase'
          };
          
          setAuthState({
            user: authUser,
            loading: false,
            error: null
          });
        } else {
          await checkDemoSession();
        }
      } catch (error) {
        console.error('Supabase session check error:', error);
        await checkDemoSession();
      }
    };

    const checkDemoSession = async () => {
      try {
        const demoUser = localStorage.getItem('demo_user');
        const demoSession = localStorage.getItem('demo_session');
        
        if (demoUser && demoSession) {
          const user = JSON.parse(demoUser);
          const session = JSON.parse(demoSession);
          
          // Check if demo session is still valid (24 hours)
          const sessionAge = Date.now() - (session.timestamp || 0);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            const authUser: AuthUser = {
              id: user.id,
              email: user.email,
              displayName: user.user_metadata?.full_name,
              provider: 'demo'
            };
            
            setAuthState({
              user: authUser,
              loading: false,
              error: null
            });
            return;
          } else {
            // Demo session expired, clear it
            localStorage.removeItem('demo_user');
            localStorage.removeItem('demo_session');
          }
        }
        
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Demo session check error:', error);
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
      }
    };

    const syncWithSupabase = async (user: AuthUser) => {
      try {
        if (!isSupabaseConfigured() || !supabase) {
          return;
        }

        // Check if user exists in Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // Create profile in Supabase
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.displayName,
              avatar_url: user.photoURL,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error('Supabase sync error:', error);
        // Don't fail auth if Supabase sync fails
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Refresh user profile
  const refreshProfile = async () => {
    if (authState.user && authState.user.provider === 'firebase') {
      try {
        const profile = await getUserProfile(authState.user.id);
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, profile } : null
        }));
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  return {
    ...authState,
    refreshProfile
  };
};