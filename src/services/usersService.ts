import type { Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { ParticipantProfile, UserProfile, UserRole } from '../types'
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
    photoURL: data.photoURL ?? existing?.photoURL,
    phone: data.phone ?? existing?.phone,
    role,
    participantProfiles: existing?.participantProfiles,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  const [{ doc, setDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await setDoc(doc(db, COL, uid), profile, { merge: true })
  return profile
}

function participantLabel(firstName: string, lastName: string, studentClass: string): string {
  const name = `${firstName} ${lastName}`.trim()
  return studentClass ? `${name} (klasa ${studentClass})` : name
}

export async function saveParticipantProfile(
  uid: string,
  data: {
    firstName: string
    lastName: string
    birthDate?: string
    studentClass: string
  },
): Promise<ParticipantProfile> {
  const existing = await getUserProfile(uid)
  const now = new Date().toISOString()
  const firstName = data.firstName.trim()
  const lastName = data.lastName.trim()
  const studentClass = data.studentClass.trim()
  const birthDate = data.birthDate?.trim() || undefined

  const profiles = [...(existing?.participantProfiles ?? [])]
  const duplicateIndex = profiles.findIndex(
    (p) =>
      p.firstName.toLowerCase() === firstName.toLowerCase() &&
      p.lastName.toLowerCase() === lastName.toLowerCase() &&
      (p.birthDate ?? '') === (birthDate ?? ''),
  )

  let saved: ParticipantProfile
  if (duplicateIndex >= 0) {
    saved = {
      ...profiles[duplicateIndex],
      firstName,
      lastName,
      studentClass,
      birthDate,
      label: participantLabel(firstName, lastName, studentClass),
      updatedAt: now,
    }
    profiles[duplicateIndex] = saved
  } else {
    saved = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      studentClass,
      birthDate,
      label: participantLabel(firstName, lastName, studentClass),
      createdAt: now,
      updatedAt: now,
    }
    profiles.push(saved)
  }

  const [{ doc, setDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await setDoc(
    doc(db, COL, uid),
    { participantProfiles: profiles, updatedAt: now },
    { merge: true },
  )
  return saved
}

export const usersService = {
  get: getUserProfile,
  subscribe: subscribeUserProfile,
  createOrUpdate: createOrUpdateUserProfile,
  saveParticipantProfile,
}
