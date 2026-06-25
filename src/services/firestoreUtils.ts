import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'

export function mapDoc<T extends { id: string }>(id: string, data: DocumentData): T {
  return { id, ...data } as T
}

export async function getCollection<T extends { id: string }>(name: string): Promise<T[]> {
  const [{ collection, getDocs }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const snap = await getDocs(collection(db, name))
  return snap.docs.map((d) => mapDoc<T>(d.id, d.data()))
}

export function subscribeCollection<T extends { id: string }>(
  name: string,
  callback: (items: T[]) => void,
  orderField = 'order',
): Unsubscribe {
  let unsub: Unsubscribe | undefined
  let cancelled = false

  void Promise.all([import('firebase/firestore'), getDb()]).then(([{ collection, onSnapshot, query, orderBy }, db]) => {
    if (cancelled) return
    const q = query(collection(db, name), orderBy(orderField))
    unsub = onSnapshot(
      q,
      (snap) => {
        callback(snap.docs.map((d) => mapDoc<T>(d.id, d.data())))
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.warn(`Firestore subscribeCollection(${name}):`, error)
        }
        callback([])
      },
    )
  })

  return () => {
    cancelled = true
    unsub?.()
  }
}

export async function getSingleDoc<T>(collectionName: string, docId: string): Promise<T | null> {
  const [{ doc, getDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const snap = await getDoc(doc(db, collectionName, docId))
  if (!snap.exists()) return null
  return snap.data() as T
}

export function subscribeSingleDoc<T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void,
): Unsubscribe {
  let unsub: Unsubscribe | undefined
  let cancelled = false

  void Promise.all([import('firebase/firestore'), getDb()]).then(([{ doc, onSnapshot }, db]) => {
    if (cancelled) return
    unsub = onSnapshot(
      doc(db, collectionName, docId),
      (snap) => {
        callback(snap.exists() ? (snap.data() as T) : null)
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.warn(`Firestore subscribeSingleDoc(${collectionName}/${docId}):`, error)
        }
        callback(null)
      },
    )
  })

  return () => {
    cancelled = true
    unsub?.()
  }
}

export async function setSingleDoc<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
): Promise<void> {
  const [{ doc, setDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await setDoc(doc(db, collectionName, docId), data, { merge: true })
}

export async function addCollectionItem<T extends DocumentData>(
  collectionName: string,
  data: T,
): Promise<string> {
  const [{ collection, addDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const ref = await addDoc(collection(db, collectionName), data)
  return ref.id
}

export async function updateCollectionItem(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>,
): Promise<void> {
  const [{ doc, updateDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await updateDoc(doc(db, collectionName, id), data)
}

export async function deleteCollectionItem(collectionName: string, id: string): Promise<void> {
  const [{ doc, deleteDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await deleteDoc(doc(db, collectionName, id))
}

export async function isCollectionEmpty(name: string): Promise<boolean> {
  const [{ collection, getDocs }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const snap = await getDocs(collection(db, name))
  return snap.empty
}
