import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, fetchOwnChannel, verifyState } from '@/integrations/youtube/auth'
import { persistYouTubeConnection } from '@/integrations/youtube/firestore'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const stateRaw = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  try {
    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        `/dashboard/destinations?error=${encodeURIComponent(`Authentication failed: ${error}`)}`
      )
    }

    // Validate required parameters
    if (!code || !stateRaw) {
      return NextResponse.redirect(
        '/dashboard/destinations?error=missing_code_or_state'
      )
    }

    // Verify and extract state information
    const { uid, r } = verifyState(stateRaw)

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code)

    // Fetch the user's YouTube channel information
    const channel = await fetchOwnChannel(tokens.accessToken)

    // Persist the connection to Firestore
    await persistYouTubeConnection({
      uid,
      tokens,
      channel,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly']
    })

    // Redirect back to the dashboard with success
    const returnUrl = r || '/dashboard/destinations'
    return NextResponse.redirect(`${returnUrl}?success=youtube_connected&channel=${encodeURIComponent(channel.title)}`)

  } catch (error) {
    console.error('Error in YouTube OAuth callback:', error)
    
    // Extract error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.redirect(
      `/dashboard/destinations?error=${encodeURIComponent(`Failed to connect YouTube: ${errorMessage}`)}`
    )
  }
}
