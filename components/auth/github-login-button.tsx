'use client'

import React from 'react'
import { Github } from 'lucide-react'
import { SocialLoginButton } from './social-login-button'

interface GitHubLoginButtonProps {
  className?: string
}

export default function GitHubLoginButton({ className }: GitHubLoginButtonProps) {
  return (
    <SocialLoginButton
      provider="github"
      icon={<Github className="h-4 w-4" />}
      className={className}
    >
      Continue with GitHub
    </SocialLoginButton>
  )
}
