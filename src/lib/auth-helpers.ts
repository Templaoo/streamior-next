import { getAuth } from 'firebase-admin/auth'
import { initializeFirebaseAdmin } from './firebase-admin'
import { NextRequest } from 'next/server'

export interface AuthenticatedUser {
  uid: string
  email?: string
  name?: string
}

export async function getCurrentUserUid(request: NextRequest): Promise<string | null> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // Initialize Firebase Admin and verify the token
    initializeFirebaseAdmin()
    const auth = getAuth()
    const decodedToken = await auth.verifyIdToken(token)
    
    return decodedToken.uid
  } catch (error) {
    console.error('Error verifying Firebase token:', error)
    return null
  }
}

export async function getCurrentUserUidOrThrow(request: NextRequest): Promise<string> {
  const uid = await getCurrentUserUid(request)
  if (!uid) {
    throw new Error('User not authenticated')
  }
  return uid
}

// Alternative: For cookie-based session (if you implement session cookies later)
export async function getCurrentUserFromCookie(request: NextRequest): Promise<string | null> {
  try {
    const sessionCookie = request.cookies.get('session')?.value
    if (!sessionCookie) {
      return null
    }

    initializeFirebaseAdmin()
    const auth = getAuth()
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
    
    return decodedClaims.uid
  } catch (error) {
    console.error('Error verifying session cookie:', error)
    return null
  }
}

export function createAuthError(message: string, status = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}
