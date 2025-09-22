# YouTube Data API v3 Integration (OAuth 2.0) — Reusable Module Design

Status: Design Doc (no code deployed yet)
Owner: streamior-next-pro
Last updated: 2025-09-22

This guide describes a production-ready, reusable OAuth 2.0 integration for connecting a user’s YouTube channel to your app. Users click the YouTube icon in the Destinations modal, complete Google consent, and we persist the connection for the signed-in Firebase user. The same module can be reused for other Google/YouTube flows later.


## Table of Contents
- Goals
- High-level Flow
- Security and Secrets
- Google Cloud Console Setup
- Scopes and Permissions
- Local and Production Redirect URIs
- Environment Variables and JSON client mapping
- Data Model (Firestore)
- Module Architecture
- API Endpoints
- Client Wiring (Destinations modal)
- Refresh Tokens and Rotation
- Revocation and Disconnect
- Error Handling and Observability
- Reusability and Extension
- Context7/MCP References
- Step-by-step: End-to-end test plan


## Goals
- Allow a signed-in user to connect their YouTube channel via OAuth 2.0.
- Persist the connection in Firestore for the current Firebase user (uid), including refresh token for server-side calls.
- After linking, show the connected destination in the Destinations list.
- Encapsulate all Google OAuth logic inside a reusable integration module.


## High-level Flow
1) User opens Destinations and clicks the YouTube icon
2) Client calls GET /api/integrations/youtube/auth to start the OAuth flow
3) Server builds a Google consent URL with required scopes and redirects user
4) Google redirects back to /api/integrations/youtube/callback with a code
5) Server exchanges code for access_token and refresh_token
6) Server calls YouTube Data API: channels.list?mine=true (to get channel id, title, thumbnails)
7) Persist tokens + channel metadata under users/{uid}/destinations/youtube
8) Redirect user back to /dashboard/destinations; UI shows “YouTube – <Channel Title>” under connected destinations


## Security and Secrets
- DO NOT commit client secrets to Git. Use environment variables.
- The provided file client_secret_427294899586-inmjmn2pl2dbknlpbdhpusb2ainibegp.apps.googleusercontent.com.json contains client_id and client_secret. Extract values and store them in .env.local (never commit).
- Use access_type=offline + prompt=consent to request a refresh_token on the first grant.
- Store refresh_token server-side only (Firestore via Admin SDK). Never expose refresh tokens to clients.
- Optional: Encrypt refresh_token before persisting (KMS or app-level AES-GCM with a key stored outside the repo).


## Google Cloud Console Setup
1) Enable YouTube Data API v3 for your GCP project
2) Configure OAuth consent screen (External, app name, support email). Add your domain(s) and test users as needed
3) Create OAuth 2.0 Client ID (Web application)
4) Add Authorized redirect URIs:
   - http://localhost:3000/api/integrations/youtube/callback (dev)
   - https://<your-domain>/api/integrations/youtube/callback (prod)
5) Download the client secret JSON (already provided locally). Extract client_id and client_secret to env.


## Scopes and Permissions
To avoid verification hurdles, start with read-only scopes:
- https://www.googleapis.com/auth/youtube.readonly

For uploading or managing live streams, you’ll later need broader scopes (may require Google verification):
- https://www.googleapis.com/auth/youtube
- https://www.googleapis.com/auth/youtube.upload
- https://www.googleapis.com/auth/youtube.force-ssl

For this first milestone, use youtube.readonly.


## Redirect URIs
- Dev: http://localhost:3000/api/integrations/youtube/callback
- Prod: https://<your-domain>/api/integrations/youtube/callback


## Environment Variables and JSON Client Mapping
Create .env.local (not committed):

```bash path=null start=null
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID={{YOUR_GOOGLE_CLIENT_ID}}
GOOGLE_OAUTH_CLIENT_SECRET={{YOUR_GOOGLE_CLIENT_SECRET}}
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/integrations/youtube/callback

# Optional: If you encrypt refresh tokens server-side
YOUTUBE_TOKEN_ENC_KEY={{32-byte-base64-key}}
```

JSON file mapping reference (do not commit this):

```json path=null start=null
{
  "web": {
    "client_id": "{{YOUR_GOOGLE_CLIENT_ID}}",
    "project_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "{{YOUR_GOOGLE_CLIENT_SECRET}}",
    "redirect_uris": [
      "http://localhost:3000/api/integrations/youtube/callback"
    ]
  }
}
```


## Data Model (Firestore)
We keep destination data nested under the user:

Collection path: users/{uid}/destinations/youtube

```json path=null start=null
{
  "provider": "youtube",
  "channelId": "UC...",
  "channelTitle": "My Channel",
  "thumbnail": {
    "url": "https://...",
    "width": 88,
    "height": 88
  },
  "scopes": ["https://www.googleapis.com/auth/youtube.readonly"],
  "accessToken": "<short-lived>",               // optional; we can skip storing transient access tokens
  "refreshToken": "<encrypted-or-raw-refresh-token>",
  "tokenExpiry": 1699999999999,                  // ms epoch
  "connectedAt": 1699999999999,
  "updatedAt": 1699999999999
}
```

Security rules (concept): Users can only read/write their own destinations. Admin endpoints enforce uid consistency. Prefer storing refresh_token server-side only through Admin SDK.


## Module Architecture
Reusable structure proposal:

```
src/
  integrations/
    youtube/
      auth.ts                 // build auth URL, exchange code, refresh logic
      client.ts               // Google API client factory
      schema.ts               // TS types/interfaces
      firestore.ts            // save/read/delete helpers
  app/
    api/
      integrations/
        youtube/
          auth/route.ts       // GET → redirect to consent
          callback/route.ts   // GET → exchange, persist, redirect back
```

Key design points:
- The module is framework-agnostic (logic under src/integrations/youtube)
- API routes only orchestrate input/output and call the module
- Add a provider registry later to standardize multiple destinations


## API Endpoints (design and example code)

### 1) Start OAuth: GET /api/integrations/youtube/auth
Build Google consent URL and redirect.

```ts path=null start=null
// src/app/api/integrations/youtube/auth/route.ts
import { NextResponse } from 'next/server'
import { buildYouTubeAuthUrl } from '@/integrations/youtube/auth'
import { getCurrentUserUidOrRedirect } from '@/lib/auth-helpers' // implement using Firebase session if needed

export async function GET(request: Request) {
  const uid = await getCurrentUserUidOrRedirect()
  // CSRF protection: state includes uid + nonce
  const url = new URL(request.url)
  const state = JSON.stringify({ uid, nonce: crypto.randomUUID(), r: url.searchParams.get('r') || '/dashboard/destinations' })
  const authUrl = buildYouTubeAuthUrl({ state })
  return NextResponse.redirect(authUrl)
}
```

### 2) OAuth Callback: GET /api/integrations/youtube/callback
Exchange code → get channel → persist → redirect back.

```ts path=null start=null
// src/app/api/integrations/youtube/callback/route.ts
import { NextResponse } from 'next/server'
import { exchangeCodeForTokens, fetchOwnChannel, persistYouTubeConnection } from '@/integrations/youtube/auth'
import { verifyState } from '@/integrations/youtube/auth'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const stateRaw = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`/dashboard/destinations?error=${encodeURIComponent(error)}`)
  }
  if (!code || !stateRaw) {
    return NextResponse.redirect('/dashboard/destinations?error=missing_code_or_state')
  }

  const { uid, r } = verifyState(stateRaw) // throws if invalid

  const { accessToken, refreshToken, expiryDate } = await exchangeCodeForTokens(code)
  const channel = await fetchOwnChannel(accessToken) // { id, title, thumbnail }

  await persistYouTubeConnection({
    uid,
    tokens: { refreshToken, accessToken, expiryDate },
    channel,
    scopes: ['https://www.googleapis.com/auth/youtube.readonly']
  })

  return NextResponse.redirect(r || '/dashboard/destinations')
}
```


## Integration Module (core helpers)

```ts path=null start=null
// src/integrations/youtube/schema.ts
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
```

```ts path=null start=null
// src/integrations/youtube/client.ts
import { google } from 'googleapis'

export function createOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID!,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    process.env.GOOGLE_OAUTH_REDIRECT_URI!
  )
  return client
}
```

```ts path=null start=null
// src/integrations/youtube/auth.ts
import { google } from 'googleapis'
import { createOAuthClient } from './client'
import type { OAuthTokens, YouTubeChannel } from './schema'

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']

export function buildYouTubeAuthUrl({ state }: { state: string }) {
  const oauth2Client = createOAuthClient()
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  })
  return url
}

export async function exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
  const oauth2Client = createOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  return {
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token, // only returned on first consent or if prompt=consent
    expiryDate: tokens.expiry_date,
  }
}

export async function fetchOwnChannel(accessToken: string): Promise<YouTubeChannel> {
  const auth = createOAuthClient()
  auth.setCredentials({ access_token: accessToken })
  const youtube = google.youtube({ version: 'v3', auth })
  const { data } = await youtube.channels.list({ part: ['snippet'], mine: true })
  const c = data.items?.[0]
  if (!c) throw new Error('No channel found')
  return {
    id: c.id!,
    title: c.snippet?.title || 'Unknown channel',
    thumbnail: c.snippet?.thumbnails?.default
      ? {
          url: c.snippet.thumbnails.default.url!,
          width: c.snippet.thumbnails.default.width,
          height: c.snippet.thumbnails.default.height,
        }
      : undefined,
  }
}

export function verifyState(stateRaw: string): { uid: string; r?: string } {
  // Minimal example — replace with HMAC-signed JWT or server-stored nonce
  const parsed = JSON.parse(stateRaw)
  if (!parsed?.uid) throw new Error('Invalid state')
  return parsed
}
```

```ts path=null start=null
// src/integrations/youtube/firestore.ts
import { getFirestore } from 'firebase-admin/firestore'

export async function persistYouTubeConnection({ uid, tokens, channel, scopes }: any) {
  const db = getFirestore()
  const ref = db.doc(`users/${uid}/destinations/youtube`)
  const now = Date.now()
  await ref.set(
    {
      provider: 'youtube',
      channelId: channel.id,
      channelTitle: channel.title,
      thumbnail: channel.thumbnail || null,
      scopes,
      refreshToken: tokens.refreshToken || null,
      accessToken: tokens.accessToken || null,
      tokenExpiry: tokens.expiryDate || null,
      connectedAt: now,
      updatedAt: now,
    },
    { merge: true }
  )
}
```

> Note: The above Firestore helper expects Firebase Admin SDK to be initialized server-side (e.g., in src/lib/firebase-admin.ts) with a service account. Do not expose service account credentials to the client.


## Client Wiring (Destinations modal)
When the user clicks the YouTube tile, simply navigate to the auth endpoint. After callback, reload destinations from Firestore to show the connected channel.

```ts path=null start=null
// Example: inside the YouTube card onClick handler
window.location.href = '/api/integrations/youtube/auth?r=/dashboard/destinations'
```

To render the connected destination, query users/{uid}/destinations/youtube and show channelTitle, thumbnail, etc.


## Refresh Tokens and Rotation
- Google access tokens expire (~1h). Use refresh_token to fetch a new access_token server-side.
- Implement a helper refreshAccessToken(uid) that reads refresh_token from Firestore, calls oauth2Client.refreshAccessToken(), and updates accessToken + tokenExpiry.
- Call this before any server-to-server YouTube API calls.


## Revocation and Disconnect
- Add an endpoint to disconnect:
  - Delete users/{uid}/destinations/youtube
  - Optionally call https://oauth2.googleapis.com/revoke with the refresh token


## Error Handling and Observability
- Propagate error query params back to /dashboard/destinations for user-friendly display
- Log server errors with requestId and uid
- Consider adding Sentry for visibility


## Reusability and Extension
- The module layout under src/integrations/youtube is intentionally decoupled from Next.js
- You can reuse client.ts and auth.ts in server actions or background jobs
- Add a provider registry to harmonize props across platforms (youtube, facebook, twitch, etc.)


## Context7 / MCP References
- Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- YouTube Data API v3 (channels.list): https://developers.google.com/youtube/v3/docs/channels/list
- Token revocation: https://developers.google.com/identity/protocols/oauth2/web-server#tokenrevoke
- Using googleapis (Node): https://github.com/googleapis/google-api-nodejs-client
- Firestore server SDK: https://firebase.google.com/docs/firestore

If you use MCP/Context7 in your workflow, you can resolve and fetch these docs via your Context7 provider to keep examples authoritative and up-to-date.


## Step-by-step: End-to-end Test Plan
1) Preconditions: .env.local set with GOOGLE_OAUTH_* vars; OAuth consent screen configured; YouTube Data API enabled; Firebase Admin configured on server
2) Start dev: npm run dev; Login to app; Navigate to Destinations
3) Click YouTube tile → consent
4) Approve with a YouTube account that owns a channel
5) After redirect back, verify Firestore document at users/{uid}/destinations/youtube
6) UI should display “YouTube – <Channel Title>” in connected destinations list
7) Revisit in a new session; connection should persist
8) (Optional) Revoke and reconnect to verify the flow


---

Implementation next steps (when you approve):
- Create src/integrations/youtube/* with the code above
- Add API routes, Firebase Admin bootstrap, and UI callbacks
- Wire the YouTube tile to /api/integrations/youtube/auth
- Render connected destinations from Firestore on the Destinations page

