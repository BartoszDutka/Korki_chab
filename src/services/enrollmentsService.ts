import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Enrollment, EnrollmentStatus } from '../types'
import {
  getCollection,
  mapDoc,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from './firestoreUtils'

const COL = 'enrollments'

export const enrollmentsService = {
  getAll: () => getCollection<Enrollment>(COL),
  subscribe: (cb: (items: Enrollment[]) => void): Unsubscribe => {
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => mapDoc<Enrollment>(d.id, d.data()))),
      (error) => {
        if (import.meta.env.DEV) console.warn('enrollmentsService.subscribe:', error)
        cb([])
      },
    )
  },
  subscribeByUser: (userId: string, cb: (items: Enrollment[]) => void): Unsubscribe => {
    const q = query(collection(db, COL), where('userId', '==', userId))
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs
          .map((d) => mapDoc<Enrollment>(d.id, d.data()))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        cb(items)
      },
      (error) => {
        if (import.meta.env.DEV) console.warn('enrollmentsService.subscribeByUser:', error)
        cb([])
      },
    )
  },
  subscribeByCourse: (courseId: string, cb: (items: Enrollment[]) => void): Unsubscribe => {
    return enrollmentsService.subscribe((all) => {
      cb(all.filter((e) => e.selectedCourses.some((c) => c.courseId === courseId)))
    })
  },
  add: (item: Omit<Enrollment, 'id'>) => addCollectionItem(COL, item),
  update: (id: string, data: Partial<Enrollment>) => updateCollectionItem(COL, id, data),
  updateStatus: (id: string, status: EnrollmentStatus, adminNote?: string) => {
    const data: Partial<Enrollment> = {
      status,
      updatedAt: new Date().toISOString(),
    }
    if (adminNote !== undefined) data.adminNote = adminNote
    return updateCollectionItem(COL, id, data)
  },
  delete: (id: string) => deleteCollectionItem(COL, id),
}
