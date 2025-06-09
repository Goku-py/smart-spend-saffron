import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatus from "./components/NetworkStatus";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Quicken-inspired pages
import QuickenDashboard from "./pages/QuickenDashboard";
import QuickenAccounts from "./pages/QuickenAccounts";
import QuickenTransactions from "./pages/QuickenTransactions";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import './i18n';

const queryClient = new QueryClient();

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
          // If there's an error, we'll work in demo mode
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        if (mounted) {
          console.log('Initial session:', session);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Fallback to demo mode if Supabase is not available
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state listener
    let subscription: any;
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;
          
          console.log('Auth state changed:', event, session);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Handle successful sign in
          if (event === 'SIGNED_IN' && session) {
            console.log('User signed in successfully, redirecting to dashboard');
            // Use setTimeout to ensure state is updated before redirect
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 100);
          }

          // Handle sign out
          if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setUser(null);
            setSession(null);
          }
        }
      );
      subscription = authSubscription;
    } catch (error) {
      console.error('Auth listener error:', error);
      if (mounted) {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Check if Supabase is available
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        
        // Demo mode fallback - create a mock user for testing
        if (email && password.length >= 6) {
          const mockUser = {
            id: 'demo-user-' + Date.now(),
            email: email,
            user_metadata: { full_name: email.split('@')[0] },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated'
          } as User;
          
          const mockSession = {
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser
          } as Session;
          
          setUser(mockUser);
          setSession(mockSession);
          
          // Store in localStorage for persistence
          localStorage.setItem('demo_user', JSON.stringify(mockUser));
          localStorage.setItem('demo_session', JSON.stringify(mockSession));
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 100);
          
          return { error: null };
        }
        
        return { error };
      }

      console.log('Login successful:', data);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: 'Invalid credentials' } };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear demo data
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_session');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear local state and redirect to landing page
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if Supabase fails
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  // Check for demo session on mount
  useEffect(() => {
    if (!user && !loading) {
      const demoUser = localStorage.getItem('demo_user');
      const demoSession = localStorage.getItem('demo_session');
      
      if (demoUser && demoSession) {
        try {
          setUser(JSON.parse(demoUser));
          setSession(JSON.parse(demoSession));
        } catch (error) {
          console.error('Error parsing demo session:', error);
          localStorage.removeItem('demo_user');
          localStorage.removeItem('demo_session');
        }
      }
    }
  }, [user, loading]);

  const value = {
    user,
    session,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CurrencyProvider>
            <TranslationProvider>
              <NotificationProvider>
                <NetworkStatus />
                <Router>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Original Smart Spend Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/expenses" element={
                      <ProtectedRoute>
                        <Expenses />
                      </ProtectedRoute>
                    } />
                    <Route path="/budgets" element={
                      <ProtectedRoute>
                        <Budgets />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />

                    {/* Quicken-Inspired Routes */}
                    <Route path="/quicken" element={
                      <ProtectedRoute>
                        <QuickenDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/accounts" element={
                      <ProtectedRoute>
                        <QuickenAccounts />
                      </ProtectedRoute>
                    } />
                    <Route path="/transactions" element={
                      <ProtectedRoute>
                        <QuickenTransactions />
                      </ProtectedRoute>
                    } />

                    <Route path="/index" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
                <Toaster />
              </NotificationProvider>
            </TranslationProvider>
          </CurrencyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;