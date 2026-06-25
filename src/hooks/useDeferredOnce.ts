import { useEffect, useState, useRef } from 'react'

function scheduleIdle(task: () => void, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout })
  } else {
    globalThis.setTimeout(task, 150)
  }
}

type DeferredOptions = {
  /** Dodatkowe opóźnienie po idle (ms) — dla danych poniżej pierwszego ekranu. */
  delayMs?: number
}

/** Odczyt po pierwszym malowaniu — nie blokuje FCP/LCP. */
export function useDeferredOnce<T>(fetch: () => Promise<T>, options: DeferredOptions = {}) {
  const { delayMs = 0 } = options
  const [data, setData] = useState<T | null>(null)
  const [settled, setSettled] = useState(false)
  const fetchRef = useRef(fetch)
  fetchRef.current = fetch

  useEffect(() => {
    let cancelled = false
    let delayTimer: ReturnType<typeof setTimeout> | undefined

    const runFetch = () => {
      fetchRef
        .current()
        .then((result) => {
          if (!cancelled) {
            setData(result)
            setSettled(true)
          }
        })
        .catch(() => {
          if (!cancelled) setSettled(true)
        })
    }

    scheduleIdle(() => {
      if (cancelled) return
      if (delayMs > 0) {
        delayTimer = globalThis.setTimeout(runFetch, delayMs)
      } else {
        runFetch()
      }
    })

    return () => {
      cancelled = true
      if (delayTimer) clearTimeout(delayTimer)
    }
  }, [delayMs])

  return { data, settled }
}
