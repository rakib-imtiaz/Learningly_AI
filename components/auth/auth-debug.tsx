'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseClient } from '@/lib/supabase-client'
import { useAuthContext } from './auth-provider'

export function AuthDebug() {
  const [testResult, setTestResult] = useState<string>('')
  const { user, session } = useAuthContext()
  const supabase = getSupabaseClient()

  const testConnection = async () => {
    try {
      setTestResult('Testing connection...')
      
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setTestResult(`Connection Error: ${error.message}`)
        return
      }
      
      setTestResult('✅ Supabase connection successful!')
      
      // Test sign in with a dummy request to see the actual error
      const testSignIn = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      
      console.log('Test sign-in response:', testSignIn)
      
    } catch (err) {
      setTestResult(`❌ Connection failed: ${err}`)
      console.error('Connection test error:', err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Environment Check:</strong>
          <div className="text-sm text-gray-600">
            <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
            <div>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
          </div>
        </div>
        
        <div>
          <strong>Auth State:</strong>
          <div className="text-sm text-gray-600">
            <div>User: {user ? '✅ Authenticated' : '❌ Not authenticated'}</div>
            <div>Session: {session ? '✅ Active' : '❌ No session'}</div>
          </div>
        </div>
        
        <Button onClick={testConnection} className="w-full">
          Test Supabase Connection
        </Button>
        
        {testResult && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            {testResult}
          </div>
        )}
      </CardContent>
    </Card>
  )
}