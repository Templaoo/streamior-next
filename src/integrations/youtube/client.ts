import { google } from 'googleapis'

export function createOAuthClient() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    const missing = [
      !clientId ? 'GOOGLE_OAUTH_CLIENT_ID' : null,
      !clientSecret ? 'GOOGLE_OAUTH_CLIENT_SECRET' : null,
      !redirectUri ? 'GOOGLE_OAUTH_REDIRECT_URI' : null,
    ].filter(Boolean)

    throw new Error(
      `YouTube OAuth configuration missing: ${missing.join(', ')}. ` +
      'Add them to your .env.local and restart the server. ' +
      'Example values are documented in .env.example and docs/YOUTUBE_INTEGRATION.md.'
    )
  }

  const client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  )
  return client
}

export function createYouTubeClient(accessToken: string) {
  const auth = createOAuthClient()
  auth.setCredentials({ access_token: accessToken })
  return google.youtube({ version: 'v3', auth })
}
