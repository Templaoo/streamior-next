import { createOAuthClient, createYouTubeClient } from './client'
import type { OAuthTokens, YouTubeChannel, OAuthState } from './schema'

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']

export function buildYouTubeAuthUrl({ state }: { state: string }) {
  const oauth2Client = createOAuthClient()
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Force consent to ensure refresh_token is returned
    scope: SCOPES,
    state,
  })
  return url
}

export async function exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
  const oauth2Client = createOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  
  if (!tokens.access_token) {
    throw new Error('No access token received')
  }
  
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || undefined, // Only returned on first consent or if prompt=consent
    expiryDate: tokens.expiry_date || undefined,
  }
}

export async function fetchOwnChannel(accessToken: string): Promise<YouTubeChannel> {
  const youtube = createYouTubeClient(accessToken)
  
  try {
    const { data } = await youtube.channels.list({ 
      part: ['snippet'], 
      mine: true 
    })
    
    const channel = data.items?.[0]
    if (!channel) {
      throw new Error('No YouTube channel found for this account')
    }
    
    return {
      id: channel.id!,
      title: channel.snippet?.title || 'Unknown Channel',
      thumbnail: channel.snippet?.thumbnails?.default
        ? {
            url: channel.snippet.thumbnails.default.url!,
            width: channel.snippet.thumbnails.default.width || undefined,
            height: channel.snippet.thumbnails.default.height || undefined,
          }
        : undefined,
    }
  } catch (error) {
    console.error('Failed to fetch YouTube channel:', error)
    throw new Error('Failed to fetch YouTube channel information')
  }
}

export function createState(uid: string, returnUrl?: string): string {
  const state: OAuthState = {
    uid,
    nonce: crypto.randomUUID(),
    r: returnUrl || '/dashboard/destinations'
  }
  return JSON.stringify(state)
}

export function verifyState(stateRaw: string): OAuthState {
  try {
    const parsed: OAuthState = JSON.parse(stateRaw)
    if (!parsed?.uid || !parsed?.nonce) {
      throw new Error('Invalid state structure')
    }
    return parsed
  } catch (error) {
    console.error('State verification failed:', error)
    throw new Error('Invalid OAuth state parameter')
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
  const oauth2Client = createOAuthClient()
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  
  try {
    const { credentials } = await oauth2Client.refreshAccessToken()
    
    if (!credentials.access_token) {
      throw new Error('No access token received from refresh')
    }
    
    return {
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token || refreshToken, // Keep old refresh token if new one not provided
      expiryDate: credentials.expiry_date || undefined,
    }
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    throw new Error('Failed to refresh YouTube access token')
  }
}
