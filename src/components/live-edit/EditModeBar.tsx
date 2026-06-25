import { Link } from 'react-router-dom'
import { useEditMode } from '../../contexts/EditModeContext'
import { useAuth } from '../../contexts/AuthContext'

export default function EditModeBar() {
  const { canEdit, isEditMode, toggleEditMode, setEditMode } = useEditMode()
  const { logout } = useAuth()

  if (!canEdit) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-[100] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-academic-navy-deep text-white p-3 rounded-xl shadow-2xl border border-white/10">
      <button
        type="button"
        onClick={toggleEditMode}
        className={`px-4 py-2 rounded-lg font-bold text-label-md transition-colors ${
          isEditMode ? 'bg-secondary-container text-on-secondary' : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {isEditMode ? 'Wyłącz tryb edycji' : 'Włącz tryb edycji'}
      </button>
      <Link
        to="/admin"
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-medium text-label-md text-center"
        onClick={() => setEditMode(false)}
      >
        Panel admin
      </Link>
      <button
        type="button"
        onClick={() => logout()}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-medium text-label-md"
      >
        Wyloguj
      </button>
    </div>
  )
}
