'use client'

import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useAuthContext } from './auth-provider'
import { toast } from 'sonner'
import { AuthHelper } from '@/lib/auth-helper'

interface SignInCardProps {
  onSwitchToSignUp: () => void
}

export function SignInCard({ onSwitchToSignUp }: SignInCardProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithOAuth } = useAuthContext()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      toast.info('Checking your account status...')
      
      // Use the enhanced OAuth with signin context
      const { error, redirect } = await signInWithOAuth('google', 'signin')
      
      // If user is already authenticated, they'll be redirected automatically
      if (redirect) {
        toast.success('Welcome back! Redirecting to your dashboard...')
        return // The AuthSessionManager handles the redirect
      }
      
      if (error) {
        const errorInfo = AuthHelper.handleOAuthError(error, 'signin')
        AuthHelper.showUserFriendlyMessage(errorInfo, 
          errorInfo.action === 'switch_to_signup' ? onSwitchToSignUp : undefined
        )
        
        if (errorInfo.action === 'switch_to_signup') {
          setTimeout(() => {
            onSwitchToSignUp()
          }, 2500)
        }
      } else {
        toast.success(AuthHelper.getSuccessMessage('signin'))
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-gray-600">
          Continue your learning journey
        </p>
      </div>

      {/* User Status Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800 text-sm">Returning User</p>
            <p className="text-green-700 text-xs leading-relaxed">
              Sign in to access your account
            </p>
          </div>
        </div>
      </div>

      {/* Google Sign In Button */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
        variant="outline"
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            <span>Signing you in...</span>
          </>
        ) : (
          <>
            <svg className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </Button>

      {/* Switch to Sign Up */}
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600">
          New to Learningly AI?{' '}
          <button
            onClick={onSwitchToSignUp}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 hover:underline underline-offset-4"
          >
            Create account
          </button>
        </p>
      </div>

      {/* Terms */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors hover:underline">
            Terms
          </a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}