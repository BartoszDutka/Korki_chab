import type { Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { Message, MessageStatus } from '../types'
import {
  getCollection,
  mapDoc,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'messages'

export const messagesService = {
  getAll: () => getCollection<Message>(COL),
  subscribe: (cb: (items: Message[]) => void): Unsubscribe => {
    let unsub: Unsubscribe | undefined
    let cancelled = false

    void Promise.all([import('firebase/firestore'), getDb()]).then(
      ([{ collection, onSnapshot, query, orderBy }, db]) => {
        if (cancelled) return
        const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
        unsub = onSnapshot(
          q,
          (snap) => cb(snap.docs.map((d) => mapDoc<Message>(d.id, d.data()))),
          (error) => {
            if (import.meta.env.DEV) console.warn('messagesService.subscribe:', error)
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
  add: (item: Omit<Message, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<Message>) => updateCollectionItem(COL, id, data),
  updateStatus: (id: string, status: MessageStatus, adminNote?: string) => {
    const data: Partial<Message> = {
      status,
      updatedAt: new Date().toISOString(),
    }
    if (adminNote !== undefined) data.adminNote = adminNote
    if (status !== 'new') data.readAt = new Date().toISOString()
    return updateCollectionItem(COL, id, data)
  },
  delete: (id: string) => deleteCollectionItem(COL, id),
  countNew: (messages: Message[]) => messages.filter((m) => m.status === 'new').length,
}
