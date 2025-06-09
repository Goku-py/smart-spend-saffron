export const DEMO_USER = {
  id: 'demo-user-12345',
  email: 'demo@smartspend.com',
  user_metadata: { 
    full_name: 'Demo User',
    avatar_url: null 
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated'
};

export const DEMO_SESSION = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: DEMO_USER
};

export const createDemoUser = (email: string, fullName?: string) => ({
  ...DEMO_USER,
  id: `demo-user-${Date.now()}`,
  email,
  user_metadata: {
    ...DEMO_USER.user_metadata,
    full_name: fullName || email.split('@')[0]
  }
});

export const createDemoSession = (user: any) => ({
  ...DEMO_SESSION,
  user
});

// Demo data persistence utilities
export const saveDemoSession = (user: any, session: any) => {
  try {
    localStorage.setItem('demo_user', JSON.stringify(user));
    localStorage.setItem('demo_session', JSON.stringify(session));
    localStorage.setItem('demo_mode', 'true');
  } catch (error) {
    console.error('Failed to save demo session:', error);
  }
};

export const loadDemoSession = () => {
  try {
    const demoUser = localStorage.getItem('demo_user');
    const demoSession = localStorage.getItem('demo_session');
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (demoUser && demoSession && isDemoMode) {
      return {
        user: JSON.parse(demoUser),
        session: JSON.parse(demoSession)
      };
    }
  } catch (error) {
    console.error('Failed to load demo session:', error);
  }
  return null;
};

export const clearDemoSession = () => {
  try {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_session');
    localStorage.removeItem('demo_mode');
  } catch (error) {
    console.error('Failed to clear demo session:', error);
  }
};

export const isDemoMode = () => {
  return localStorage.getItem('demo_mode') === 'true';
};