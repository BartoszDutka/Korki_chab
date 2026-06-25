import { useEffect, useState } from 'react'

export function useFirestoreCollection<T extends { id: string; order?: number }>(
  subscribe: (cb: (items: T[]) => void) => () => void,
  visibleOnly = false,
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribe((data) => {
      setItems(data)
      setLoading(false)
    })
    return unsub
  }, [subscribe])

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const visible = visibleOnly
    ? sorted.filter((item) => (item as T & { visible?: boolean }).visible !== false)
    : sorted

  return { items: visible, allItems: sorted, loading }
}

export function useFirestoreDoc<T>(
  subscribe: (cb: (data: T | null) => void) => () => void,
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribe((d) => {
      setData(d)
      setLoading(false)
    })
    return unsub
  }, [subscribe])

  return { data, loading }
}
