import { Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Footer from './Footer'
import SkipLink from './SkipLink'

const EditModeBar = lazy(() => import('./live-edit/EditModeBar'))

function AdminEditBar() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null
  return (
    <Suspense fallback={null}>
      <EditModeBar />
    </Suspense>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden">
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="min-w-0">
        <Outlet />
      </main>
      <Footer />
      <AdminEditBar />
    </div>
  )
}
