import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { getAuthInstance } from '../lib/firebase'
import type { UserProfile } from '../types'
import { isAdminEmail } from '../types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  authChecked: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
  isUser: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    const start = async () => {
      const [{ onAuthStateChanged }, auth] = await Promise.all([
        import('firebase/auth'),
        getAuthInstance(),
      ])
      const { usersService } = await import('../services/usersService')
      unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u)
        if (u) {
          const p = await usersService.createOrUpdate(u.uid, {
            displayName: u.displayName ?? u.email ?? 'Użytkownik',
            email: u.email ?? '',
            photoURL: u.photoURL ?? undefined,
          })
          setProfile(p)
        } else {
          setProfile(null)
        }
        setAuthChecked(true)
      })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => void start(), { timeout: 3000 })
    } else {
      globalThis.setTimeout(() => void start(), 500)
    }

    return () => {
      unsub?.()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const [{ signInWithEmailAndPassword }, auth] = await Promise.all([
      import('firebase/auth'),
      getAuthInstance(),
    ])
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const [{ createUserWithEmailAndPassword, updateProfile }, auth] = await Promise.all([
      import('firebase/auth'),
      getAuthInstance(),
    ])
    const { usersService } = await import('../services/usersService')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName?.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() })
    }
    await usersService.createOrUpdate(cred.user.uid, {
      displayName: displayName?.trim() || email,
      email,
    })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const [{ signInWithPopup, GoogleAuthProvider }, auth] = await Promise.all([
      import('firebase/auth'),
      getAuthInstance(),
    ])
    await signInWithPopup(auth, new GoogleAuthProvider())
  }, [])

  const logout = useCallback(async () => {
    const [{ signOut }, auth] = await Promise.all([
      import('firebase/auth'),
      getAuthInstance(),
    ])
    await signOut(auth)
  }, [])

  const isAdmin = profile?.role === 'admin' || isAdminEmail(user?.email)
  const isUser = !!user && profile?.role === 'user'
  const loading = !authChecked

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      authChecked,
      login,
      register,
      signInWithGoogle,
      logout,
      isAdmin,
      isUser,
    }),
    [user, profile, loading, authChecked, login, register, signInWithGoogle, logout, isAdmin, isUser],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
