'use client'

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from 'sonner'

export default function ForgotPasswordPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Learningly AI</h1>
            <p className="text-gray-300">Reset your password</p>
          </div>
          
          <ForgotPasswordForm />
        </div>
      </div>
      <Toaster />
    </AuthProvider>
  )
}
