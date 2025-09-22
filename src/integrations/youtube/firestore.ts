import { getAdminFirestore } from '@/lib/firebase-admin'
import type { PersistConnectionParams, YouTubeDestination } from './schema'

export async function persistYouTubeConnection({ 
  uid, 
  tokens, 
  channel, 
  scopes 
}: PersistConnectionParams): Promise<void> {
  const db = getAdminFirestore()
  const ref = db.doc(`users/${uid}/destinations/youtube`)
  const now = Date.now()

  const data: YouTubeDestination = {
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
  }

  try {
    await ref.set(data, { merge: true })
    console.log(`YouTube destination saved for user ${uid}: ${channel.title}`)
  } catch (error) {
    console.error('Failed to persist YouTube connection:', error)
    throw new Error('Failed to save YouTube connection to database')
  }
}

export async function getYouTubeConnection(uid: string): Promise<YouTubeDestination | null> {
  const db = getAdminFirestore()
  const ref = db.doc(`users/${uid}/destinations/youtube`)

  try {
    const doc = await ref.get()
    if (!doc.exists) {
      return null
    }
    return doc.data() as YouTubeDestination
  } catch (error) {
    console.error('Failed to get YouTube connection:', error)
    throw new Error('Failed to retrieve YouTube connection from database')
  }
}

export async function updateYouTubeTokens(
  uid: string, 
  accessToken: string, 
  expiryDate?: number,
  refreshToken?: string
): Promise<void> {
  const db = getAdminFirestore()
  const ref = db.doc(`users/${uid}/destinations/youtube`)

  const updateData: Partial<YouTubeDestination> = {
    accessToken,
    tokenExpiry: expiryDate || null,
    updatedAt: Date.now(),
  }

  if (refreshToken) {
    updateData.refreshToken = refreshToken
  }

  try {
    await ref.update(updateData)
    console.log(`YouTube tokens updated for user ${uid}`)
  } catch (error) {
    console.error('Failed to update YouTube tokens:', error)
    throw new Error('Failed to update YouTube tokens in database')
  }
}

export async function deleteYouTubeConnection(uid: string): Promise<void> {
  const db = getAdminFirestore()
  const ref = db.doc(`users/${uid}/destinations/youtube`)

  try {
    await ref.delete()
    console.log(`YouTube connection deleted for user ${uid}`)
  } catch (error) {
    console.error('Failed to delete YouTube connection:', error)
    throw new Error('Failed to delete YouTube connection from database')
  }
}
