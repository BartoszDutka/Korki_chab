import type { Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { Post } from '../types'
import {
  getCollection,
  mapDoc,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'posts'

function logFirestoreError(context: string, error: unknown) {
  if (import.meta.env.DEV) {
    console.warn(`Firestore ${context}:`, error)
  }
}

export const postsService = {
  getAll: () => getCollection<Post>(COL),
  subscribe: (cb: (items: Post[]) => void): Unsubscribe => {
    let unsub: Unsubscribe | undefined
    let cancelled = false

    void Promise.all([import('firebase/firestore'), getDb()]).then(
      ([{ collection, onSnapshot, query, where }, db]) => {
        if (cancelled) return
        const q = query(collection(db, COL), where('status', '==', 'published'))
        unsub = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((d) => mapDoc<Post>(d.id, d.data()))
            items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            cb(items)
          },
          (error) => {
            logFirestoreError('posts subscribe', error)
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
  subscribeAll: (cb: (items: Post[]) => void): Unsubscribe => {
    let unsub: Unsubscribe | undefined
    let cancelled = false

    void Promise.all([import('firebase/firestore'), getDb()]).then(
      ([{ collection, onSnapshot, query, orderBy }, db]) => {
        if (cancelled) return
        const q = query(collection(db, COL), orderBy('publishedAt', 'desc'))
        unsub = onSnapshot(
          q,
          (snap) => {
            cb(snap.docs.map((d) => mapDoc<Post>(d.id, d.data())))
          },
          (error) => {
            logFirestoreError('posts subscribeAll', error)
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
  add: (item: Omit<Post, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<Post>) => updateCollectionItem(COL, id, data),
  delete: (id: string) => deleteCollectionItem(COL, id),
  getPublished: async () => {
    const all = await getCollection<Post>(COL)
    return all
      .filter((p) => p.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },
}
