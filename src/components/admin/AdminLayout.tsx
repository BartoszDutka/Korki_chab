import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEditMode } from '../../contexts/EditModeContext'
import { useFirestoreCollection } from '../../hooks/useFirestore'
import { messagesService } from '../../services/messagesService'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/settings', label: 'Ustawienia strony' },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/posts', label: 'Aktualności' },
  { to: '/admin/subjects', label: 'Przedmioty' },
  { to: '/admin/education-levels', label: 'Poziomy nauczania' },
  { to: '/admin/pricing', label: 'Cennik' },
  { to: '/admin/courses', label: 'Zajęcia' },
  { to: '/admin/enrollments', label: 'Zgłoszenia' },
  { to: '/admin/messages', label: 'Skrzynka', badge: true },
  { to: '/admin/testimonials', label: 'Opinie' },
  { to: '/admin/faq', label: 'FAQ' },
  { to: '/admin/about', label: 'O nas' },
  { to: '/admin/contact', label: 'Kontakt' },
  { to: '/admin/form', label: 'Formularz' },
  { to: '/admin/email', label: 'Ustawienia e-mail' },
  { to: '/admin/seo', label: 'SEO' },
  { to: '/admin/footer', label: 'Stopka' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const { setEditMode } = useEditMode()
  const { allItems: messages } = useFirestoreCollection(messagesService.subscribe)
  const newCount = messagesService.countNew(messages)

  return (
    <div className="min-h-screen bg-surface-bright flex">
      <aside className="w-64 bg-academic-navy-deep text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <p className="font-bold text-headline-md">Panel admin</p>
          <p className="text-sm opacity-70">Centrum Chabówka</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-secondary-container text-on-secondary' : 'hover:bg-white/10'
                }`
              }
            >
              {l.label}
              {l.badge && newCount > 0 ? ` (${newCount})` : ''}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="block text-center px-3 py-2 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Powrót na stronę
          </Link>
          <Link
            to="/"
            className="block text-center px-3 py-2 rounded-lg bg-secondary-container text-on-secondary font-bold text-sm"
            onClick={() => setEditMode(true)}
          >
            Edytuj stronę na żywo
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full px-3 py-2 rounded-lg bg-white/10 text-sm hover:bg-white/20"
          >
            Wyloguj
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
