import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
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
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => mapDoc<Message>(d.id, d.data()))),
      (error) => {
        if (import.meta.env.DEV) console.warn('messagesService.subscribe:', error)
        cb([])
      },
    )
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
