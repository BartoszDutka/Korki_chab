import type { Unsubscribe } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { Cart, CartItem } from '../types'

export function subscribeCart(userId: string, cb: (cart: Cart | null) => void): Unsubscribe {
  let unsub: Unsubscribe | undefined
  let cancelled = false

  void Promise.all([import('firebase/firestore'), getDb()]).then(([{ doc, onSnapshot }, db]) => {
    if (cancelled) return
    unsub = onSnapshot(
      doc(db, 'carts', userId),
      (snap) => {
        cb(snap.exists() ? ({ userId, ...snap.data() } as Cart) : null)
      },
      (error) => {
        if (import.meta.env.DEV) console.warn('cartsService.subscribe:', error)
        cb(null)
      },
    )
  })

  return () => {
    cancelled = true
    unsub?.()
  }
}

export async function getCart(userId: string): Promise<Cart | null> {
  const [{ doc, getDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const snap = await getDoc(doc(db, 'carts', userId))
  if (!snap.exists()) return null
  return { userId, ...snap.data() } as Cart
}

export async function saveCart(userId: string, items: CartItem[]): Promise<void> {
  const [{ doc, setDoc }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  await setDoc(doc(db, 'carts', userId), {
    userId,
    items,
    updatedAt: new Date().toISOString(),
  })
}

export async function clearCart(userId: string): Promise<void> {
  await saveCart(userId, [])
}

export const cartsService = {
  subscribe: subscribeCart,
  get: getCart,
  save: saveCart,
  clear: clearCart,
}
