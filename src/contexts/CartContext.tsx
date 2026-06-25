import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { Course, CartItem } from '../types'
import { cartsService } from '../services/cartsService'
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
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    const unsub = cartsService.subscribe(user.uid, (cart) => {
      setItems(cart?.items ?? [])
      setLoading(false)
    })
    return unsub
  }, [user])

  const persist = useCallback(
    async (newItems: CartItem[]) => {
      if (!user) return
      setItems(newItems)
      await cartsService.save(user.uid, newItems)
    },
    [user],
  )

  const addCourse = async (course: Course): Promise<boolean> => {
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
  }

  const removeCourse = async (courseId: string) => {
    await persist(items.filter((i) => i.courseId !== courseId))
  }

  const clear = async () => {
    if (!user) return
    await cartsService.clear(user.uid)
    setItems([])
  }

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        count: items.length,
        totalPrice,
        addCourse,
        removeCourse,
        clear,
        hasCourse: (id) => items.some((i) => i.courseId === id),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
