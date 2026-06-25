import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DataSetupBanner() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null

  return (
    <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-secondary-fixed text-on-secondary-container text-center py-2 px-4 text-sm font-medium shadow-sm">
      Baza Firestore jest pusta — wyświetlamy treści domyślne.{' '}
      <Link to="/admin" className="underline font-bold">
        Panel admin
      </Link>{' '}
      → „Utwórz dane przykładowe”.
    </div>
  )
}
