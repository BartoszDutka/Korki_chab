import type { Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { UserProfile, UserRole } from '../types'
import { isAdminEmail } from '../types'

const COL = 'users'

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const [{ doc, getDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const snap = await getDoc(doc(db, COL, uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as UserProfile
}

export function subscribeUserProfile(uid: string, cb: (profile: UserProfile | null) => void): Unsubscribe {
  let unsub: Unsubscribe | undefined
  let cancelled = false

  void Promise.all([import('firebase/firestore'), getDb()]).then(([{ doc, onSnapshot }, db]) => {
    if (cancelled) return
    unsub = onSnapshot(
      doc(db, COL, uid),
      (snap) => {
        cb(snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null)
      },
      (error) => {
        if (import.meta.env.DEV) console.warn('usersService.subscribe:', error)
        cb(null)
      },
    )
  })

  return () => {
    cancelled = true
    unsub?.()
  }
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

  const [{ doc, setDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await setDoc(doc(db, COL, uid), profile, { merge: true })
  return profile
}

export const usersService = {
  get: getUserProfile,
  subscribe: subscribeUserProfile,
  createOrUpdate: createOrUpdateUserProfile,
}
