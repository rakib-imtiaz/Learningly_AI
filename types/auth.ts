export type OAuthProvider = 'google' | 'github'

export type AuthProvider = 'google' | 'github' | 'email'

/**
 * Interface for social user metadata fields that can be present in user.user_metadata
 * Based on OAuth providers (Google, GitHub) and email authentication
 */
export interface SocialUserMetadata {
  // Common OAuth fields
  iss?: string // OIDC issuer
  sub?: string // OIDC subject identifier
  aud?: string // OIDC audience
  iat?: number // OIDC issued at timestamp
  exp?: number // OIDC expiration timestamp
  
  // Display name fields (various providers use different field names)
  full_name?: string // Google, some other providers
  name?: string // Generic name field
  preferred_username?: string // Some OIDC providers
  
  // Given and family names
  given_name?: string // Google, OIDC standard
  family_name?: string // Google, OIDC standard
  
  // Email fields
  email?: string // Email from OAuth provider (may differ from user.email)
  email_verified?: boolean // Email verification status
  
  // Avatar/Profile picture fields
  avatar_url?: string // GitHub, some other providers
  picture?: string // Google, OIDC standard
  avatarUrl?: string // Alternative spelling
  
  // GitHub-specific fields
  user_name?: string // GitHub username
  login?: string // GitHub login/username
  company?: string // GitHub company
  blog?: string // GitHub blog URL
  bio?: string // GitHub bio
  location?: string // GitHub location
  hireable?: boolean // GitHub hireable status
  twitter_username?: string // GitHub Twitter username
  public_repos?: number // GitHub public repos count
  public_gists?: number // GitHub public gists count
  followers?: number // GitHub followers count
  following?: number // GitHub following count
  created_at?: string // GitHub account creation date
  updated_at?: string // GitHub account update date
  
  // Google-specific fields
  hd?: string // Google hosted domain
  locale?: string // Google locale
  
  // Additional OAuth fields
  provider?: string // Provider identifier
  providers?: string[] // List of providers
  
  // Custom fields that might be added by the application
  [key: string]: any // Allow for additional custom fields
}

/**
 * Extended Supabase User type with properly typed user_metadata
 */
export interface ExtendedSupabaseUser {
  id: string
  email?: string
  user_metadata: SocialUserMetadata
  app_metadata?: {
    provider?: string
    [key: string]: any
  }
  [key: string]: any
}

/**
 * Helper function to safely get typed user metadata from a Supabase User
 */
export function getUserMetadata(user: any): SocialUserMetadata {
  return (user?.user_metadata || {}) as SocialUserMetadata
}

/**
 * Helper function to get the auth provider from user metadata
 */
export function getAuthProviderFromUser(user: any): AuthProvider {
  const userMetadata = getUserMetadata(user)
  
  // Check app_metadata first
  if (user?.app_metadata?.provider) {
    const provider = user.app_metadata.provider
    if (provider === 'google' || provider === 'github') {
      return provider
    }
  }
  
  // Check OIDC issuer
  if (userMetadata?.iss) {
    if (userMetadata.iss.includes('google')) return 'google'
    if (userMetadata.iss.includes('github')) return 'github'
  }
  
  // Check subject identifier
  if (userMetadata?.sub?.startsWith('google')) return 'google'
  if (userMetadata?.sub?.startsWith('github')) return 'github'
  
  // Check GitHub-specific fields
  if (userMetadata?.user_name || userMetadata?.login) {
    return 'github'
  }
  
  // Gmail heuristic
  if (userMetadata?.email?.endsWith('@gmail.com') && userMetadata?.email_verified) {
    return 'google'
  }
  
  return 'email'
}
