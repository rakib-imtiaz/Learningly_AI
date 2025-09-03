'use client'

import { toast } from 'sonner'

/**
 * Enhanced authentication helper that provides better user feedback
 * for OAuth flows, especially handling existing account scenarios
 */
export class AuthHelper {
  static handleOAuthError = (error: any, context: 'signin' | 'signup') => {
    const errorMessage = error?.message?.toLowerCase() || ''
    
    // Common OAuth error patterns
    if (errorMessage.includes('user_already_registered') || errorMessage.includes('already exists')) {
      return {
        type: 'account_exists',
        message: 'This Google account is already registered. Please use Sign In instead.',
        action: 'switch_to_signin'
      }
    }
    
    if (errorMessage.includes('user not found') || errorMessage.includes('invalid_credentials')) {
      return {
        type: 'account_not_found', 
        message: 'No account found with this Google account. Please use Sign Up instead.',
        action: 'switch_to_signup'
      }
    }
    
    if (errorMessage.includes('popup') || errorMessage.includes('blocked')) {
      return {
        type: 'popup_blocked',
        message: 'Popup blocked. Please allow popups and try again.',
        action: 'retry'
      }
    }
    
    if (errorMessage.includes('cancelled') || errorMessage.includes('denied')) {
      return {
        type: 'user_cancelled',
        message: 'Sign-in cancelled. Please try again if you want to continue.',
        action: 'retry'
      }
    }
    
    // Default error
    return {
      type: 'unknown',
      message: error?.message || `Failed to ${context === 'signin' ? 'sign in' : 'sign up'} with Google`,
      action: 'retry'
    }
  }
  
  static showUserFriendlyMessage = (errorInfo: any, onSwitchTab?: () => void) => {
    switch (errorInfo.type) {
      case 'account_exists':
        toast.error(errorInfo.message, {
          duration: 4000,
          action: onSwitchTab ? {
            label: 'Switch to Sign In',
            onClick: onSwitchTab
          } : undefined
        })
        break
        
      case 'account_not_found':
        toast.error(errorInfo.message, {
          duration: 4000,
          action: onSwitchTab ? {
            label: 'Switch to Sign Up', 
            onClick: onSwitchTab
          } : undefined
        })
        break
        
      case 'popup_blocked':
        toast.warning(errorInfo.message, {
          duration: 5000
        })
        break
        
      case 'user_cancelled':
        toast.info(errorInfo.message, {
          duration: 3000
        })
        break
        
      default:
        toast.error(errorInfo.message)
    }
  }
  
  static getLoadingMessage = (context: 'signin' | 'signup') => {
    return context === 'signin' 
      ? 'Signing you in...' 
      : 'Setting up your account...'
  }
  
  static getSuccessMessage = (context: 'signin' | 'signup') => {
    return context === 'signin'
      ? 'Redirecting to your dashboard...'
      : 'Welcome to Learningly AI! Redirecting...'
  }

  /**
   * Enhanced message for already authenticated users
   */
  static showAlreadyAuthenticatedMessage = () => {
    toast.success('You\'re already signed in! Redirecting to your dashboard...', {
      duration: 3000
    })
  }

  /**
   * Message for session refresh scenarios
   */
  static showSessionRefreshedMessage = () => {
    toast.success('Session refreshed! Welcome back to your dashboard...', {
      duration: 3000
    })
  }

  /**
   * Enhanced loading message with user state detection
   */
  static getEnhancedLoadingMessage = (context: 'signin' | 'signup') => {
    return 'Checking your account status...'
  }
}