'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export function QuickSupabaseTest() {
  const [result, setResult] = useState('')
  
  const testConnection = async () => {
    try {
      setResult('Testing...')
      const supabase = createClient()
      
      // Simple session check
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(`❌ Error: ${error.message}`)
      } else {
        setResult('✅ Connection successful!')
      }
    } catch (err) {
      setResult(`❌ Failed: ${err}`)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Supabase Connection Test</h3>
      <button onClick={testConnection} style={{ padding: '10px', margin: '5px' }}>
        Test Connection
      </button>
      <p>{result}</p>
    </div>
  )
}