import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { auth } from '../../lib/firebase'
import { usersService } from '../../services/usersService'
import { isAdminEmail } from '../../types'
import { inputClass } from '../../components/admin/AdminUi'
import Icon from '../../components/ui'

export default function AdminLoginPage() {
  const { login, user, loading, isAdmin, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('Logowanie nie powiodło się.')
        return
      }

      const profile = await usersService.createOrUpdate(currentUser.uid, {
        displayName: currentUser.displayName ?? email,
        email: currentUser.email ?? email,
      })

      const allowed = profile.role === 'admin' || isAdminEmail(currentUser.email ?? email)
      if (!allowed) {
        await logout()
        setError('To konto nie ma uprawnień administratora.')
        return
      }
    } catch {
      setError('Nieprawidłowy e-mail lub hasło.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-container-low px-4 py-8">
      <div className="max-w-md w-full mx-auto mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary font-medium text-sm min-h-[44px] hover:text-secondary-container transition-colors"
        >
          <Icon name="arrow_forward" className="w-4 h-4 rotate-180" />
          Powrót na stronę
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-outline-variant p-6 md:p-8">
          <h1 className="text-headline-lg font-bold text-primary mb-2">Panel administracyjny</h1>
          <p className="text-body-md text-on-surface-variant mb-6">
            Zaloguj się kontem administratora (e-mail i hasło).
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-label-md font-medium text-primary mb-1" htmlFor="admin-email">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@centrumchabowka.pl"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-label-md font-medium text-primary mb-1" htmlFor="admin-password">
                Hasło
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-secondary-container hover:bg-warm-orange-hover text-on-secondary font-bold py-3 rounded-lg min-h-[48px] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Logowanie…' : 'Zaloguj się'}
            </button>
          </form>
          <p className="text-xs text-on-surface-variant mt-6">
            Użytkownicy Google logują się na stronie publicznej — nie w panelu admina.
          </p>
        </div>
      </div>
    </div>
  )
}
