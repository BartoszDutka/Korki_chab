import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PageLoader from './PageLoader'

export default function UserProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <PageLoader label="Sprawdzanie sesji…" />
  }

  if (!user) {
    return <Navigate to="/zaloguj" replace />
  }

  return <Outlet />
}
