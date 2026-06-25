import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import type { UserProfile } from '../types'
import { isAdminEmail } from '../types'
import { usersService } from '../services/usersService'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub: (() => void) | undefined
    let cancelled = false

    const start = () => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        if (cancelled) return
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
          setLoading(false)
        })
      })
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(start, { timeout: 2500 })
    } else {
      globalThis.setTimeout(start, 300)
    }

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
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
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const isAdmin = profile?.role === 'admin' || isAdminEmail(user?.email)
  const isUser = !!user && profile?.role === 'user'

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      login,
      register,
      signInWithGoogle,
      logout,
      isAdmin,
      isUser,
    }),
    [user, profile, loading, login, register, signInWithGoogle, logout, isAdmin, isUser],
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
