import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'chabowka_edit_mode'

interface EditModeContextValue {
  isEditMode: boolean
  canEdit: boolean
  toggleEditMode: () => void
  setEditMode: (enabled: boolean) => void
}

const EditModeContext = createContext<EditModeContextValue | null>(null)

export function EditModeProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      setIsEditMode(false)
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    setIsEditMode(stored === 'true')
  }, [isAdmin])

  const setEditMode = (enabled: boolean) => {
    if (!isAdmin) return
    setIsEditMode(enabled)
    localStorage.setItem(STORAGE_KEY, String(enabled))
  }

  const toggleEditMode = () => setEditMode(!isEditMode)

  return (
    <EditModeContext.Provider
      value={{ isEditMode: isAdmin && isEditMode, canEdit: isAdmin, toggleEditMode, setEditMode }}
    >
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const ctx = useContext(EditModeContext)
  if (!ctx) throw new Error('useEditMode must be used within EditModeProvider')
  return ctx
}
