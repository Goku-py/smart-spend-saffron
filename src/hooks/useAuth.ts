import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { supabase } from '../integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: 'firebase' | 'supabase' | 'demo';
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
        // Check if Firebase is configured
        if (isFirebaseConfigured()) {
          // Set up Firebase auth listener
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
              const authUser: AuthUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                provider: 'firebase'
              };
              
              // Sync with Supabase
              await syncWithSupabase(authUser);
              
              setAuthState({
                user: authUser,
                loading: false,
                error: null
              });
            } else {
              // Check for Supabase session
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.full_name,
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

  return authState;
};