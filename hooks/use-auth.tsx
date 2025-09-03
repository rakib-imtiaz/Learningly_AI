'use client'

import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { OAuthProvider, AuthProvider } from '@/types/auth'
import { getSupabaseClient } from '@/lib/supabase-client'
import { AuthSessionManager } from '@/lib/auth-session-manager'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  // Debug Supabase configuration
  useEffect(() => {
    console.log('Supabase client initialized:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      client: !!supabase
    })
  }, [])

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting initial session:', error)
        } else {
          console.log('Initial session:', { hasSession: !!session, hasUser: !!session?.user })
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error getting initial session:', err)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, hasSession: !!session, hasUser: !!session?.user })
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', { email, passwordLength: password.length })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('Sign in response:', { data: !!data, error: error?.message, user: !!data?.user })
      
      if (error) {
        console.error('Sign in error:', error)
      }
      
      return { data, error }
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      return { data: null, error: { message: 'An unexpected error occurred during sign in' } }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting sign up with:', { email, passwordLength: password.length })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      console.log('Sign up response:', { data: !!data, error: error?.message, user: !!data?.user })
      
      if (error) {
        console.error('Sign up error:', error)
      }
      
      return { data, error }
    } catch (err) {
      console.error('Unexpected error during sign up:', err)
      return { data: null, error: { message: 'An unexpected error occurred during sign up' } }
    }
  }

  const signInWithOAuth = async (provider: OAuthProvider, context: 'signin' | 'signup' = 'signin') => {
    console.log('Starting enhanced OAuth with context:', context)
    
    // Use the enhanced session manager for better user experience
    const result = await AuthSessionManager.initiateOAuth(provider, context)
    
    switch (result.type) {
      case 'already_authenticated':
        console.log('User already authenticated, redirecting to dashboard')
        // Redirect immediately for better UX
        if (result.redirectTo) {
          window.location.href = result.redirectTo
        }
        return { data: null, error: null, redirect: result.redirectTo }
        
      case 'session_refreshed':
        console.log('Session refreshed, redirecting to dashboard')
        if (result.redirectTo) {
          window.location.href = result.redirectTo
        }
        return { data: null, error: null, redirect: result.redirectTo }
        
      case 'oauth_initiated':
        console.log('OAuth flow initiated successfully')
        return { data: result.data, error: null }
        
      case 'oauth_error':
        console.error('OAuth error:', result.error)
        return { data: null, error: result.error }
        
      case 'unexpected_error':
        console.error('Unexpected OAuth error:', result.error)
        return { data: null, error: { message: 'An unexpected error occurred during authentication' } }
        
      default:
        return { data: null, error: { message: 'Unknown authentication state' } }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    })
    return { data, error }
  }

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    return { data, error }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  }
}
