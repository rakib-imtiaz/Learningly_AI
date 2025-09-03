'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthContext } from './auth-provider'
import SocialLoginButtons from './social-login-buttons'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { FadeContent } from '@/components/react-bits/fade-content'
import { ClickSpark } from '@/components/react-bits/click-spark'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuthContext()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Sign in form submitted:', { email, hasPassword: !!password })
      const { data, error } = await signIn(email, password)
      
      console.log('Sign in result:', { hasData: !!data, hasUser: !!data?.user, error: error?.message })
      
      if (error) {
        console.error('Sign in error details:', error)
        toast.error(error.message || 'Failed to sign in')
        return
      }

      if (data.user) {
        console.log('Sign in successful, redirecting to dashboard')
        toast.success('Successfully signed in!')
        // Use replace to prevent back navigation to sign-in page
        router.replace('/dashboard')
      } else {
        console.warn('Sign in returned no user')
        toast.error('Sign in failed - no user returned')
      }
    } catch (error) {
      console.error('Unexpected error in sign in form:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl">
      <CardContent className="p-8">
        <FadeContent delay={0.1}>
          <SocialLoginButtons />
        </FadeContent>
        
        <FadeContent delay={0.2}>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">
                Or continue with email
              </span>
            </div>
          </div>
        </FadeContent>

        <FadeContent delay={0.3}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a 
                  href="/account/forgot-password" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            
            <ClickSpark>
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </ClickSpark>
          </form>
        </FadeContent>
        
        <FadeContent delay={0.4}>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <span className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                Sign up for free
              </span>
            </p>
          </div>
        </FadeContent>
      </CardContent>
    </Card>
  )
}
