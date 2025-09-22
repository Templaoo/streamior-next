import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp: App | undefined

export function initializeFirebaseAdmin(): App {
  // Return existing app if already initialized
  if (adminApp) {
    return adminApp
  }

  const existingApps = getApps()
  if (existingApps.length > 0) {
    adminApp = existingApps[0]
    return adminApp
  }

  try {
    // Try to initialize with service account (production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    } 
    // Try application default credentials (development with gcloud auth)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    }
    // Fallback for development with explicit project ID
    else {
      console.warn('No Firebase Admin credentials found. Falling back to default initialization.')
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    }

    console.log('Firebase Admin initialized successfully')
    return adminApp
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    throw new Error('Firebase Admin initialization failed')
  }
}

export function getAdminFirestore() {
  const app = initializeFirebaseAdmin()
  return getFirestore(app)
}
