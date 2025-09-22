export interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiryDate?: number // ms epoch
}

export interface YouTubeChannel {
  id: string
  title: string
  thumbnail?: { url: string; width?: number; height?: number }
}

export interface YouTubeDestination {
  provider: 'youtube'
  channelId: string
  channelTitle: string
  thumbnail?: { url: string; width?: number; height?: number } | null
  scopes: string[]
  refreshToken?: string | null
  accessToken?: string | null
  tokenExpiry?: number | null
  connectedAt: number
  updatedAt: number
}

export interface PersistConnectionParams {
  uid: string
  tokens: OAuthTokens
  channel: YouTubeChannel
  scopes: string[]
}

export interface OAuthState {
  uid: string
  nonce: string
  r?: string // return URL
}
