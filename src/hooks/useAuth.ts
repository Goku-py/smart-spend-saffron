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

// Enhanced session validation
const validateDemoSession = (session: any): boolean => {
  if (!session || !session.timestamp) return false;
  
  const sessionAge = Date.now() - session.timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  return sessionAge < maxAge;
};

// Enhanced demo session management
const getDemoSession = (): { user: any; session: any } | null => {
  try {
    const demoUser = localStorage.getItem('demo_user');
    const demoSession = localStorage.getItem('demo_session');
    
    if (demoUser && demoSession) {
      const user = JSON.parse(demoUser);
      const session = JSON.parse(demoSession);
      
      if (validateDemoSession(session)) {
        return { user, session };
      } else {
        // Session expired, clean up
        localStorage.removeItem('demo_user');
        localStorage.removeItem('demo_session');
      }
    }
  } catch (error) {
    console.error('Error loading demo session:', error);
    // Clean up corrupted data
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_session');
  }
  
  return null;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let mounted = true; // Track component mount status

    const setAuthStateIfMounted = (newState: Partial<AuthState>) => {
      if (mounted) {
        setAuthState(prev => ({ ...prev, ...newState }));
      }
    };

    const initializeAuth = async () => {
      try {
        // Check if Firebase is configured and set up listener
        if (isFirebaseConfigured()) {
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!mounted) return;

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
                  try {
                    await syncWithSupabase(authUser);
                  } catch (syncError) {
                    console.warn('Supabase sync failed:', syncError);
                  }
                }
                
                setAuthStateIfMounted({
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
                
                setAuthStateIfMounted({
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
        setAuthStateIfMounted({
          error: 'Authentication initialization failed',
          loading: false
        });
        await checkDemoSession();
      }
    };

    const checkSupabaseSession = async () => {
      if (!mounted) return;

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
          
          setAuthStateIfMounted({
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
      if (!mounted) return;

      try {
        const demoData = getDemoSession();
        
        if (demoData) {
          const { user } = demoData;
          
          const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            displayName: user.user_metadata?.full_name,
            provider: 'demo'
          };
          
          setAuthStateIfMounted({
            user: authUser,
            loading: false,
            error: null
          });
          return;
        }
        
        setAuthStateIfMounted({
          user: null,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Demo session check error:', error);
        setAuthStateIfMounted({
          user: null,
          loading: false,
          error: 'Session validation failed'
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

  // Refresh user profile with error handling
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
        setAuthState(prev => ({
          ...prev,
          error: 'Failed to refresh profile'
        }));
      }
    }
  };

  return {
    ...authState,
    refreshProfile
  };
};