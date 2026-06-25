import { useState, type FormEvent, useEffect } from 'react'
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSeo } from '../hooks/useSeo'
import GoogleIcon from '../components/GoogleIcon'
import { inputClass } from '../components/admin/AdminUi'

type Mode = 'login' | 'register'

function authErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ten adres e-mail jest już zarejestrowany. Zaloguj się lub użyj innego e-maila.'
    case 'auth/invalid-email':
      return 'Podaj prawidłowy adres e-mail.'
    case 'auth/weak-password':
      return 'Hasło musi mieć co najmniej 6 znaków.'
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Nieprawidłowy e-mail lub hasło.'
    case 'auth/too-many-requests':
      return 'Zbyt wiele prób. Spróbuj ponownie za chwilę.'
    default:
      return 'Operacja nie powiodła się. Spróbuj ponownie.'
  }
}

export default function LoginPage() {
  const { login, register, signInWithGoogle, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (searchParams.get('mode') === 'register') {
      setMode('register')
    }
  }, [searchParams])

  useSeo({
    title: mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się',
    description: 'Logowanie i rejestracja — e-mail i hasło lub konto Google. Koszyk zapisów i panel Moje zajęcia.',
    path: '/zaloguj',
  })

  if (!loading && user && !isAdmin) {
    return <Navigate to="/moje-zajecia" replace />
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, displayName)
      }
      navigate('/moje-zajecia')
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(authErrorMessage(code))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setSubmitting(true)
    setError('')
    try {
      await signInWithGoogle()
      navigate('/moje-zajecia')
    } catch {
      setError('Logowanie przez Google nie powiodło się.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-margin-mobile sm:px-6 py-10 sm:py-12 md:py-20 min-w-0">
      <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-headline-lg font-bold text-primary">
            {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {mode === 'login'
              ? 'Zaloguj się e-mailem i hasłem lub przez konto Google, aby korzystać z koszyka zapisów i panelu „Moje zajęcia”.'
              : 'Utwórz konto, aby dodawać zajęcia do koszyka zapisów i śledzić swoje zgłoszenia.'}
          </p>
        </div>

        <div className="flex rounded-lg border border-outline-variant overflow-hidden">
          <button
            type="button"
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-3 text-sm font-bold min-h-[44px] transition-colors ${
              mode === 'login' ? 'bg-secondary-container text-on-secondary' : 'bg-surface-container-low text-primary'
            }`}
          >
            Logowanie
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-3 text-sm font-bold min-h-[44px] transition-colors ${
              mode === 'register' ? 'bg-secondary-container text-on-secondary' : 'bg-surface-container-low text-primary'
            }`}
          >
            Rejestracja
          </button>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'register' && (
            <label className="block space-y-1">
              <span className="text-label-md font-medium text-primary">Imię i nazwisko</span>
              <input
                type="text"
                className={inputClass}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jan Kowalski"
                autoComplete="name"
              />
            </label>
          )}
          <label className="block space-y-1">
            <span className="text-label-md font-medium text-primary">E-mail</span>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.pl"
              required
              autoComplete="email"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-label-md font-medium text-primary">Hasło</span>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Minimum 6 znaków' : 'Twoje hasło'}
              required
              minLength={6}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
          </label>

          {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg min-h-[44px] disabled:opacity-60 hover:bg-primary-container transition-colors"
          >
            {submitting
              ? 'Przetwarzanie...'
              : mode === 'login'
                ? 'Zaloguj się'
                : 'Zarejestruj się'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-outline-variant" />
          </div>
          <p className="relative flex justify-center text-label-sm text-on-surface-variant">
            <span className="bg-white px-3">lub</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 border-2 border-outline-variant bg-white font-bold py-3 rounded-lg min-h-[44px] hover:bg-surface-container-low transition-colors disabled:opacity-60"
        >
          <GoogleIcon />
          <span>Zaloguj przez Google</span>
        </button>

        <p className="text-body-sm text-on-surface-variant text-center">
          Możesz też{' '}
          <Link to="/zajecia" className="text-secondary-container font-medium underline">
            przeglądać zajęcia i zapisać się bez konta
          </Link>.
        </p>
      </div>

      <p className="text-body-sm text-on-surface-variant text-center mt-6">
        <Link to="/admin/login" className="underline">Panel administratora</Link>
      </p>
    </div>
  )
}
