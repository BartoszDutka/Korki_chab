import { useEffect } from 'react'
import { initAnalytics } from '../lib/firebase'

export default function AppBootstrap() {
  useEffect(() => {
    const loadAnalytics = () => {
      initAnalytics().catch(() => {
        /* analytics optional */
      })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadAnalytics, { timeout: 5000 })
    } else {
      globalThis.setTimeout(loadAnalytics, 3000)
    }
  }, [])

  return null
}
