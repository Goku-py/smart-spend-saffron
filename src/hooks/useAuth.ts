import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, onAuthStateChange } from '../integrations/supabase/client';

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
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          console.log('Supabase not configured, checking for demo user');
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

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase!.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setAuthStateIfMounted({
            user: null,
            loading: false,
            error: sessionError.message
          });
          return;
        }

        // Set initial auth state
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
            photoURL: session.user.user_metadata?.avatar_url,
            emailVerified: session.user.email_confirmed_at ? true : false,
            provider: session.user.app_metadata?.provider === 'google' ? 'google' : 'email'
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

        // Set up auth state listener
        const { data: { subscription } } = onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event, session);
          
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
              photoURL: session.user.user_metadata?.avatar_url,
              emailVerified: session.user.email_confirmed_at ? true : false,
              provider: session.user.app_metadata?.provider === 'google' ? 'google' : 'email'
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

        unsubscribe = subscription.unsubscribe;

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