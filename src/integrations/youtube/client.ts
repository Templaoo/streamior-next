import { google } from 'googleapis'

export function createOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID!,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    process.env.GOOGLE_OAUTH_REDIRECT_URI!
  )
  return client
}

export function createYouTubeClient(accessToken: string) {
  const auth = createOAuthClient()
  auth.setCredentials({ access_token: accessToken })
  return google.youtube({ version: 'v3', auth })
}
