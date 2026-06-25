import { useEffect, useState } from 'react'

function scheduleIdle(task: () => void, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout })
  } else {
    globalThis.setTimeout(task, 150)
  }
}

/** Odczyt po pierwszym malowaniu — nie blokuje FCP/LCP. */
export function useDeferredOnce<T>(fetch: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    let cancelled = false
    scheduleIdle(() => {
      fetch()
        .then((result) => {
          if (!cancelled) {
            setData(result)
            setSettled(true)
          }
        })
        .catch(() => {
          if (!cancelled) setSettled(true)
        })
    })
    return () => {
      cancelled = true
    }
  }, [fetch])

  return { data, settled }
}
