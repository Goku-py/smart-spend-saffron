import { useState, useEffect } from 'react';
import { validateSession, logoutUser } from '../lib/auth';

interface AuthState {
  user: any | null;
  sessionToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    sessionToken: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false
  });

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const savedToken = localStorage.getItem('secure_session_token');
        const savedUser = localStorage.getItem('secure_user_data');
        
        if (savedToken && savedUser) {
          const user = JSON.parse(savedUser);
          const sessionValidation = validateSession(savedToken);
          
          if (sessionValidation.valid && sessionValidation.user) {
            setAuthState({
              user: sessionValidation.user,
              sessionToken: savedToken,
              loading: false,
              isAuthenticated: true,
              isAdmin: sessionValidation.user.role === 'admin'
            });
          } else {
            // Invalid session, clear storage
            localStorage.removeItem('secure_session_token');
            localStorage.removeItem('secure_user_data');
            setAuthState({
              user: null,
              sessionToken: null,
              loading: false,
              isAuthenticated: false,
              isAdmin: false
            });
          }
        } else {
          setAuthState({
            user: null,
            sessionToken: null,
            loading: false,
            isAuthenticated: false,
            isAdmin: false
          });
        }
      } catch (error) {
        console.error('Error loading session:', error);
        setAuthState({
          user: null,
          sessionToken: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false
        });
      }
    };

    loadSession();

    // Check session validity every 5 minutes
    const interval = setInterval(() => {
      if (authState.sessionToken) {
        const sessionValidation = validateSession(authState.sessionToken);
        if (!sessionValidation.valid) {
          logout();
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = (user: any, sessionToken: string) => {
    try {
      localStorage.setItem('secure_session_token', sessionToken);
      localStorage.setItem('secure_user_data', JSON.stringify(user));
      
      setAuthState({
        user,
        sessionToken,
        loading: false,
        isAuthenticated: true,
        isAdmin: user.role === 'admin'
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const logout = () => {
    try {
      if (authState.sessionToken) {
        logoutUser(authState.sessionToken);
      }
      
      localStorage.removeItem('secure_session_token');
      localStorage.removeItem('secure_user_data');
      
      setAuthState({
        user: null,
        sessionToken: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshSession = () => {
    if (authState.sessionToken) {
      const sessionValidation = validateSession(authState.sessionToken);
      if (sessionValidation.valid && sessionValidation.user) {
        setAuthState(prev => ({
          ...prev,
          user: sessionValidation.user
        }));
        localStorage.setItem('secure_user_data', JSON.stringify(sessionValidation.user));
      } else {
        logout();
      }
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshSession
  };
};