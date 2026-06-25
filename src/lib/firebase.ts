import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { FirebaseStorage } from 'firebase/storage'
import type { Analytics } from 'firebase/analytics'

function env(key: string): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    return import.meta.env[key] as string
  }
  return process.env[key] ?? ''
}

const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
  measurementId: env('VITE_FIREBASE_MEASUREMENT_ID'),
}

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

let dbInstance: Firestore | null = null
let dbPromise: Promise<Firestore> | null = null

export function getDb(): Promise<Firestore> {
  if (dbInstance) return Promise.resolve(dbInstance)
  if (!dbPromise) {
    dbPromise = import('firebase/firestore').then(({ getFirestore }) => {
      dbInstance = getFirestore(app)
      return dbInstance
    })
  }
  return dbPromise
}

let authInstance: Auth | null = null
let authPromise: Promise<Auth> | null = null

export function getAuthInstance(): Promise<Auth> {
  if (authInstance) return Promise.resolve(authInstance)
  if (!authPromise) {
    authPromise = import('firebase/auth').then(({ getAuth }) => {
      authInstance = getAuth(app)
      return authInstance
    })
  }
  return authPromise
}

let storageInstance: FirebaseStorage | null = null

export async function getFirebaseStorage(): Promise<FirebaseStorage> {
  if (!storageInstance) {
    const { getStorage } = await import('firebase/storage')
    storageInstance = getStorage(app)
  }
  return storageInstance
}

let analyticsInstance: Analytics | null = null

export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null
  if (analyticsInstance) return analyticsInstance
  const { getAnalytics, isSupported } = await import('firebase/analytics')
  if (await isSupported()) {
    analyticsInstance = getAnalytics(app)
    return analyticsInstance
  }
  return null
}
