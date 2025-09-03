'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import GoogleLoginButton from './google-login-button'
import GitHubLoginButton from './github-login-button'

interface SocialLoginButtonsProps {
  className?: string
}

export default function SocialLoginButtons({ className }: SocialLoginButtonsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <GoogleLoginButton />
      <GitHubLoginButton />
    </div>
  )
}
