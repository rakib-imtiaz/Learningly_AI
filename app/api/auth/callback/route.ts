import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Type definitions for better type safety
interface OAuthCallbackParams {
  code?: string | null
  state?: string | null
  error?: string | null
  error_description?: string | null
  next?: string | null
}

interface CallbackError {
  type: 'auth_callback_error' | 'invalid_code' | 'session_error' | 'redirect_error'
  message: string
  details?: string
}

/**
 * Validates and sanitizes the redirect path to prevent open redirect vulnerabilities
 * Supports deep-link returns with query parameters and hash fragments
 */
function validateRedirectPath(path: string | null): string {
  if (!path) return '/dashboard'
  
  // Ensure the path is relative and starts with /
  if (!path.startsWith('/')) {
    return '/dashboard'
  }
  
  // Prevent redirects to external domains
  if (path.includes('://') || path.includes('//')) {
    return '/dashboard'
  }
  
  // Allow common safe paths
  const safePaths = ['/dashboard', '/settings', '/profile']
  if (safePaths.includes(path)) {
    return path
  }
  
  // For other paths, ensure they're relative and don't contain suspicious characters
  // Allow query parameters (?param=value) and hash fragments (#section)
  if (path.match(/^\/[a-zA-Z0-9\/\-_]+(\?[^#]*)?(#.*)?$/)) {
    return path
  }
  
  return '/dashboard'
}

/**
 * Determines the redirect origin based on the deployment environment
 */
function getRedirectOrigin(request: NextRequest): string {
  // Check for forwarded host header (common in production deployments)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  
  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`
  }
  
  // Fallback to the request origin
  return request.nextUrl.origin
}

/**
 * Logs OAuth callback events for debugging and monitoring
 */
function logOAuthEvent(
  event: 'success' | 'error' | 'missing_code' | 'invalid_redirect',
  details: Record<string, any>
): void {
  const timestamp = new Date().toISOString()
  const requestId = Math.random().toString(36).substring(2, 15)
  
  console.log(`[OAuth Callback] ${timestamp} [${requestId}] ${event}:`, {
    ...details,
    requestId,
    timestamp
  })
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(error: CallbackError, origin: string): NextResponse {
  const errorParams = new URLSearchParams({
    error: error.type,
    message: error.message
  })
  
  if (error.details) {
    errorParams.append('details', error.details)
  }
  
  return NextResponse.redirect(`${origin}/account?${errorParams.toString()}`)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const origin = getRedirectOrigin(request)
  
  // Extract and validate OAuth parameters
  const params: OAuthCallbackParams = {
    code: searchParams.get('code'),
    state: searchParams.get('state'),
    error: searchParams.get('error'),
    error_description: searchParams.get('error_description'),
    next: searchParams.get('next')
  }
  
  // Handle OAuth provider errors
  if (params.error) {
    logOAuthEvent('error', {
      providerError: params.error,
      providerErrorDescription: params.error_description,
      url: request.url
    })
    
    return createErrorResponse({
      type: 'auth_callback_error',
      message: 'OAuth provider returned an error',
      details: params.error_description || params.error
    }, origin)
  }
  
  // Validate code parameter
  if (!params.code) {
    logOAuthEvent('missing_code', {
      url: request.url,
      searchParams: Object.fromEntries(searchParams.entries())
    })
    
    return createErrorResponse({
      type: 'invalid_code',
      message: 'No authorization code provided'
    }, origin)
  }
  
  // Note: Supabase automatically validates the state parameter when using exchangeCodeForSession
  // We don't need to manually validate it here as it can interfere with the OAuth flow
  
  // Validate and sanitize redirect path
  const validatedNext = validateRedirectPath(params.next || null)
  
  try {
    // Exchange code for session with cookie bridging
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code)
    
    if (error) {
      logOAuthEvent('error', {
        supabaseError: error.message,
        errorCode: error.status,
        code: params.code.substring(0, 10) + '...' // Log partial code for debugging
      })
      
      return createErrorResponse({
        type: 'session_error',
        message: 'Failed to exchange code for session',
        details: error.message
      }, origin)
    }
    
    if (!data.session) {
      logOAuthEvent('error', {
        message: 'No session returned from code exchange',
        code: params.code.substring(0, 10) + '...'
      })
      
      return createErrorResponse({
        type: 'session_error',
        message: 'No session created from authorization code'
      }, origin)
    }
    
    // Log successful authentication
    logOAuthEvent('success', {
      userId: data.user?.id,
      email: data.user?.email,
      redirectTo: validatedNext,
      provider: data.user?.app_metadata?.provider
    })
    
    // Create response with cookies and redirect
    const response = NextResponse.redirect(`${origin}${validatedNext}`)
    
    // The createServerClient automatically handles cookie setting
    // The response will include the session cookies from the exchangeCodeForSession call
    return response
    
  } catch (error) {
    // Handle unexpected errors (network issues, etc.)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    logOAuthEvent('error', {
      unexpectedError: errorMessage,
      code: params.code.substring(0, 10) + '...'
    })
    
    return createErrorResponse({
      type: 'auth_callback_error',
      message: 'An unexpected error occurred during authentication',
      details: errorMessage
    }, origin)
  }
}
