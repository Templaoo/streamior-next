import { NextRequest, NextResponse } from 'next/server'
import { buildYouTubeAuthUrl, createState } from '@/integrations/youtube/auth'
import { createAuthError } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a simple approach - the user should be logged in on the client
    // and we'll get the UID from URL params as a temporary solution
    const url = new URL(request.url)
    const uid = url.searchParams.get('uid')
    const returnUrl = url.searchParams.get('r') || '/dashboard/destinations'

    if (!uid) {
      return createAuthError('User ID is required. Please ensure you are logged in.')
    }

    // TODO: Verify that this UID matches the authenticated user
    // For now, we trust the client to send the correct UID
    
    // Create state parameter with CSRF protection
    const state = createState(uid, returnUrl)
    
    // Build Google consent URL
    const authUrl = buildYouTubeAuthUrl({ state })
    
    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Error starting YouTube OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to start YouTube authentication' },
      { status: 500 }
    )
  }
}
