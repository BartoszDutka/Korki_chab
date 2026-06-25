import type { Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { Course } from '../types'
import {
  getCollection,
  mapDoc,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'courses'

function logFirestoreError(context: string, error: unknown) {
  if (import.meta.env.DEV) {
    console.warn(`Firestore ${context}:`, error)
  }
}

function sortByOrder(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export const coursesService = {
  getAll: () => getCollection<Course>(COL),
  subscribe: (cb: (items: Course[]) => void): Unsubscribe => {
    let unsub: Unsubscribe | undefined
    let cancelled = false

    void Promise.all([import('firebase/firestore'), getDb()]).then(
      ([{ collection, onSnapshot, query, where }, db]) => {
        if (cancelled) return
        const q = query(
          collection(db, COL),
          where('visible', '==', true),
          where('status', 'in', ['active', 'full']),
        )
        unsub = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((d) => mapDoc<Course>(d.id, d.data()))
            cb(sortByOrder(items))
          },
          (error) => {
            logFirestoreError('courses subscribe', error)
            cb([])
          },
        )
      },
    )

    return () => {
      cancelled = true
      unsub?.()
    }
  },
  subscribeAll: (cb: (items: Course[]) => void): Unsubscribe => {
    let unsub: Unsubscribe | undefined
    let cancelled = false

    void Promise.all([import('firebase/firestore'), getDb()]).then(
      ([{ collection, onSnapshot, query, orderBy }, db]) => {
        if (cancelled) return
        const q = query(collection(db, COL), orderBy('order'))
        unsub = onSnapshot(
          q,
          (snap) => cb(snap.docs.map((d) => mapDoc<Course>(d.id, d.data()))),
          (error) => {
            logFirestoreError('courses subscribeAll', error)
            cb([])
          },
        )
      },
    )

    return () => {
      cancelled = true
      unsub?.()
    }
  },
  add: (item: Omit<Course, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<Course>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
  getPublished: async (): Promise<Course[]> => {
    const all = await getCollection<Course>(COL)
    return sortByOrder(
      all.filter(
        (c) =>
          c.visible !== false &&
          c.status !== 'hidden' &&
          c.status !== 'finished' &&
          (c.status === 'active' || c.status === 'full'),
      ),
    )
  },
}
