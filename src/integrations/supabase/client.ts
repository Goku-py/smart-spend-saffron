import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_url' && 
    supabaseAnonKey !== 'your_supabase_anon_key')
}

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null

// Enhanced authentication functions
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  if (!supabase) {
    return { 
      data: null, 
      error: { message: 'Supabase not configured. Please set up your environment variables.' }
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: fullName
        }
      }
    })

    return { data, error }
  } catch (error: any) {
    return { 
      data: null, 
      error: { message: error.message || 'Sign up failed' }
    }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) {
    return { 
      data: null, 
      error: { message: 'Supabase not configured. Please set up your environment variables.' }
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  } catch (error: any) {
    return { 
      data: null, 
      error: { message: error.message || 'Sign in failed' }
    }
  }
}

export const signInWithGoogle = async () => {
  if (!supabase) {
    return { 
      data: null, 
      error: { message: 'Supabase not configured. Please set up your environment variables.' }
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    return { data, error }
  } catch (error: any) {
    return { 
      data: null, 
      error: { message: error.message || 'Google sign in failed' }
    }
  }
}

export const signOut = async () => {
  if (!supabase) {
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error: any) {
    return { error: { message: error.message || 'Sign out failed' } }
  }
}

export const resetPassword = async (email: string) => {
  if (!supabase) {
    return { 
      data: null, 
      error: { message: 'Supabase not configured. Please set up your environment variables.' }
    }
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`
    })

    return { data, error }
  } catch (error: any) {
    return { 
      data: null, 
      error: { message: error.message || 'Password reset failed' }
    }
  }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    return { data: { user: null }, error: null }
  }

  try {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  } catch (error: any) {
    return { 
      data: { user: null }, 
      error: { message: error.message || 'Failed to get user' }
    }
  }
}

export const getCurrentSession = async () => {
  if (!supabase) {
    return { data: { session: null }, error: null }
  }

  try {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  } catch (error: any) {
    return { 
      data: { session: null }, 
      error: { message: error.message || 'Failed to get session' }
    }
  }
}

// Auth state change listener
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } }
  }

  return supabase.auth.onAuthStateChange(callback)
}

export default supabase