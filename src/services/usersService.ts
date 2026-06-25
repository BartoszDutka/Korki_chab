import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { UserProfile, UserRole } from '../types'
import { isAdminEmail } from '../types'

const COL = 'users'

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, COL, uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as UserProfile
}

export function subscribeUserProfile(uid: string, cb: (profile: UserProfile | null) => void): Unsubscribe {
  return onSnapshot(
    doc(db, COL, uid),
    (snap) => {
      cb(snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null)
    },
    (error) => {
      if (import.meta.env.DEV) console.warn('usersService.subscribe:', error)
      cb(null)
    },
  )
}

export async function createOrUpdateUserProfile(
  uid: string,
  data: {
    displayName: string
    email: string
    photoURL?: string
    phone?: string
  },
): Promise<UserProfile> {
  const existing = await getUserProfile(uid)
  const now = new Date().toISOString()
  const role: UserRole =
    existing?.role === 'admin' || isAdminEmail(data.email) ? 'admin' : 'user'

  const profile: UserProfile = {
    uid,
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL,
    phone: data.phone ?? existing?.phone,
    role,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await setDoc(doc(db, COL, uid), profile, { merge: true })
  return profile
}

export const usersService = {
  get: getUserProfile,
  subscribe: subscribeUserProfile,
  createOrUpdate: createOrUpdateUserProfile,
}
