import { createClient } from '@supabase/supabase-js'

// Use your provided Supabase configuration
const supabaseUrl = 'https://rvlszwechlzgfbswwlnq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bHN6d2VjaGx6Z2Zic3d3bG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NzAwNjUsImV4cCI6MjA2NDQ0NjA2NX0.5X0iSaGIq0haDnnR7cE-letveR04cESlheC-BqdkPxA'

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_url' && 
    supabaseAnonKey !== 'your_supabase_anon_key')
}

// Create Supabase client with your configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Enhanced authentication functions
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
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
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error: any) {
    return { error: { message: error.message || 'Sign out failed' } }
  }
}

export const resetPassword = async (email: string) => {
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
  return supabase.auth.onAuthStateChange(callback)
}

export default supabase
