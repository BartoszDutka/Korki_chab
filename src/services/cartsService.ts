import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Cart, CartItem } from '../types'

export function subscribeCart(userId: string, cb: (cart: Cart | null) => void): Unsubscribe {
  return onSnapshot(
    doc(db, 'carts', userId),
    (snap) => {
      cb(snap.exists() ? ({ userId, ...snap.data() } as Cart) : null)
    },
    (error) => {
      if (import.meta.env.DEV) console.warn('cartsService.subscribe:', error)
      cb(null)
    },
  )
}

export async function getCart(userId: string): Promise<Cart | null> {
  const snap = await getDoc(doc(db, 'carts', userId))
  if (!snap.exists()) return null
  return { userId, ...snap.data() } as Cart
}

export async function saveCart(userId: string, items: CartItem[]): Promise<void> {
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
