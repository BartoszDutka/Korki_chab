import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PageLoader from './PageLoader'

export default function UserProtectedRoute() {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageLoader label="Sprawdzanie sesji…" />
  }

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/zaloguj?redirect=${redirect}`} replace state={{ from: location }} />
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
