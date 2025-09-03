'use client'

import React, { useState } from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from './auth-provider'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { OAuthProvider } from '@/types/auth'

export interface SocialLoginButtonProps extends Omit<ButtonProps, 'onClick'> {
  provider: OAuthProvider
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void | Promise<void>
}

const providerLabel: Record<OAuthProvider, string> = {
  google: 'Google',
  github: 'GitHub'
}

export function SocialLoginButton({ 
  provider, 
  icon, 
  children, 
  className,
  onClick,
  variant = 'outline',
  ...rest
}: SocialLoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithOAuth } = useAuthContext()

  const handleClick = async () => {
    // Safely invoke optional onClick callback for analytics or custom flows
    try {
      await onClick?.()
    } catch (e) {
      console.error('Error in onClick callback:', e)
    }
    
    setLoading(true)
    
    try {
      const { data, error } = await signInWithOAuth(provider)
      
      if (error) {
        toast.error(error.message || `Failed to sign in with ${providerLabel[provider]}`)
        return
      }

      // Removed success toast as it might show on redirect-initiation, not completion
    } catch (error) {
      toast.error(`An unexpected error occurred while signing in with ${providerLabel[provider]}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn('w-full', className)}
      onClick={handleClick}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in with {providerLabel[provider]}...
        </>
      ) : (
        <>
          <span className="flex items-center gap-2">
            {icon}
            {children}
          </span>
        </>
      )}
    </Button>
  )
}
