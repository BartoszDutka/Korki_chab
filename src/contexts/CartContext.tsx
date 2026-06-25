import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { Course, CartItem } from '../types'
import { isCourseBookable } from '../lib/courseUtils'

interface CartContextValue {
  items: CartItem[]
  loading: boolean
  count: number
  totalPrice: number
  addCourse: (course: Course) => Promise<boolean>
  removeCourse: (courseId: string) => Promise<void>
  clear: () => Promise<void>
  hasCourse: (courseId: string) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, authChecked } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authChecked || !user) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    let unsub: (() => void) | undefined
    void import('../services/cartsService').then(({ cartsService }) => {
      unsub = cartsService.subscribe(user.uid, (cart) => {
        setItems(cart?.items ?? [])
        setLoading(false)
      })
    })
    return () => unsub?.()
  }, [user, authChecked])

  const persist = useCallback(
    async (newItems: CartItem[]) => {
      if (!user) return
      const { cartsService } = await import('../services/cartsService')
      setItems(newItems)
      await cartsService.save(user.uid, newItems)
    },
    [user],
  )

  const addCourse = useCallback(
    async (course: Course): Promise<boolean> => {
      if (!user) return false
      if (!isCourseBookable(course)) return false
      if (items.some((i) => i.courseId === course.id)) return true
      const newItem: CartItem = {
        courseId: course.id,
        title: course.title,
        date: course.startDate,
        time: `${course.startTime}–${course.endTime}`,
        price: course.price,
        currency: course.currency,
        addedAt: new Date().toISOString(),
      }
      await persist([...items, newItem])
      return true
    },
    [user, items, persist],
  )

  const removeCourse = useCallback(
    async (courseId: string) => {
      await persist(items.filter((i) => i.courseId !== courseId))
    },
    [items, persist],
  )

  const clear = useCallback(async () => {
    if (!user) return
    const { cartsService } = await import('../services/cartsService')
    await cartsService.clear(user.uid)
    setItems([])
  }, [user])

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0)

  const value = useMemo(
    () => ({
      items,
      loading,
      count: items.length,
      totalPrice,
      addCourse,
      removeCourse,
      clear,
      hasCourse: (id: string) => items.some((i) => i.courseId === id),
    }),
    [items, loading, totalPrice, addCourse, removeCourse, clear],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
