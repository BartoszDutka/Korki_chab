import { useEffect } from 'react'
import { initAnalytics } from '../lib/firebase'

export default function AppBootstrap() {
  useEffect(() => {
    if (!import.meta.env.PROD) return

    const loadAnalytics = () => {
      initAnalytics().catch(() => {
        /* analytics optional */
      })
    }

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadAnalytics, { timeout: 8000 })
      } else {
        globalThis.setTimeout(loadAnalytics, 2000)
      }
    }

    globalThis.setTimeout(schedule, 3000)
  }, [])

  return null
}
