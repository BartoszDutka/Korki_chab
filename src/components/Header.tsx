import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Icon from './ui'
import { useFirestoreDocOnce, useFirestoreCollectionOnce } from '../hooks/useFirestore'
import { menuService } from '../services/menuService'
import { settingsService } from '../services/settingsService'
import { DEFAULT_MENU } from '../data/defaults'

const LOGO_SRC = '/LogoChab.png'

function SiteLogo({ className = 'h-9 lg:h-11 w-auto max-h-10 lg:max-h-12' }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt=""
      className={`shrink-0 object-contain ${className}`}
      width={44}
      height={44}
      fetchPriority="high"
      decoding="async"
    />
  )
}

function NavItem({
  href,
  label,
  onNavigate,
  compact = false,
}: {
  href: string
  label: string
  onNavigate?: () => void
  compact?: boolean
}) {
  const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')
  const className = compact
    ? 'font-medium text-label-sm px-2 py-1.5 rounded-lg transition-all text-primary hover:text-secondary-container hover:bg-surface-container-low whitespace-nowrap'
    : 'font-medium text-label-md px-3 py-2 rounded-lg transition-all text-primary hover:text-secondary-container hover:bg-surface-container-low'

  if (isExternal) {
    return (
      <a href={href} className={className} onClick={onNavigate}>
        {label}
      </a>
    )
  }

  return (
    <Link to={href} className={className} onClick={onNavigate}>
      {label}
    </Link>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAdmin, logout, signInWithGoogle } = useAuth()
  const { count } = useCart()
  const { data: settings } = useFirestoreDocOnce(settingsService.get)
  const { items: menuFromDb, loading: menuLoading } = useFirestoreCollectionOnce(menuService.getAll, true)
  const menuItems = menuFromDb.length > 0 ? menuFromDb : DEFAULT_MENU

  const siteName = settings?.siteName ?? 'Centrum Chabówka'
  const desktopMenuItems = menuItems.filter((item) => item.href !== '/zajecia')
  const closeMenu = () => setMenuOpen(false)

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <header className="bg-surface-container-lowest sticky top-0 w-full z-50 border-b border-outline-variant shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 h-16 lg:h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 shrink"
            aria-label={siteName}
          >
            <SiteLogo />
            <span className="hidden xl:inline text-headline-lg-mobile xl:text-headline-md font-bold text-academic-navy-deep whitespace-nowrap">
              {siteName}
            </span>
          </Link>

          <nav className="hidden lg:flex flex-1 justify-center items-center min-w-0 gap-0.5 xl:gap-1 overflow-hidden">
            {!menuLoading &&
              desktopMenuItems.map((item) => (
                <NavItem key={item.id} href={item.href} label={item.label} compact />
              ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            {user && !isAdmin ? (
              <>
                <Link
                  to="/koszyk"
                  className="hidden lg:inline-flex items-center gap-1 font-medium text-label-sm xl:text-label-md px-2 xl:px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low whitespace-nowrap"
                >
                  Koszyk
                  {count > 0 && (
                    <span className="bg-secondary-container text-on-secondary text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </Link>
                <Link
                  to="/moje-zajecia"
                  className="hidden xl:inline-flex font-medium text-label-md px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low whitespace-nowrap"
                >
                  Moje zajęcia
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="hidden xl:inline-flex font-medium text-label-md px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low whitespace-nowrap"
                >
                  Wyloguj
                </button>
              </>
            ) : !user ? (
              <>
                <Link
                  to="/zaloguj"
                  className="hidden lg:inline-flex font-medium text-label-sm xl:text-label-md px-2 xl:px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low min-h-[44px] items-center whitespace-nowrap"
                >
                  Zaloguj się
                </Link>
                <Link
                  to="/zaloguj?mode=register"
                  className="hidden xl:inline-flex font-medium text-label-md px-3 py-2 rounded-lg text-secondary-container hover:bg-surface-container-low min-h-[44px] items-center font-bold whitespace-nowrap"
                >
                  Zarejestruj się
                </Link>
              </>
            ) : null}

            <Link
              to="/zajecia"
              className="hidden lg:inline-flex bg-secondary-container text-on-secondary font-medium text-label-sm xl:text-label-md px-3 xl:px-4 py-2 rounded-lg hover:bg-warm-orange-hover transition-colors font-bold shadow-sm whitespace-nowrap"
            >
              Zajęcia
            </Link>

            <button
              type="button"
              className="lg:hidden p-2 text-primary rounded-lg hover:bg-surface-container-low min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={closeMenu} aria-hidden="true" />
      )}

      <nav
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-surface-container-lowest z-50 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex justify-between items-center gap-3 p-4 border-b border-outline-variant">
          <Link to="/" className="flex items-center gap-2 min-w-0" onClick={closeMenu} aria-label={siteName}>
            <SiteLogo className="h-8 w-auto max-h-9" />
            <span className="font-bold text-academic-navy-deep truncate">{siteName}</span>
          </Link>
          <button
            type="button"
            className="p-2 text-primary rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Zamknij"
            onClick={closeMenu}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem key={item.id} href={item.href} label={item.label} onNavigate={closeMenu} />
          ))}
          <Link
            to="/zajecia"
            className="mt-2 font-medium px-3 py-2 text-secondary-container font-bold min-h-[44px] flex items-center"
            onClick={closeMenu}
          >
            Dostępne zajęcia
          </Link>
          {user && !isAdmin ? (
            <>
              <Link to="/koszyk" className="font-medium px-3 py-2 text-primary min-h-[44px] flex items-center" onClick={closeMenu}>
                Koszyk zapisów {count > 0 ? `(${count})` : ''}
              </Link>
              <Link to="/moje-zajecia" className="font-medium px-3 py-2 text-primary min-h-[44px] flex items-center" onClick={closeMenu}>
                Moje zajęcia
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout()
                  closeMenu()
                }}
                className="font-medium px-3 py-2 text-primary text-left min-h-[44px]"
              >
                Wyloguj
              </button>
            </>
          ) : !user ? (
            <>
              <Link to="/zaloguj" className="font-medium px-3 py-2 text-primary min-h-[44px] flex items-center" onClick={closeMenu}>
                Zaloguj się
              </Link>
              <Link
                to="/zaloguj?mode=register"
                className="font-medium px-3 py-2 text-secondary-container font-bold min-h-[44px] flex items-center"
                onClick={closeMenu}
              >
                Zarejestruj się
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleGoogleLogin()
                  closeMenu()
                }}
                className="font-medium px-3 py-2 text-primary text-left min-h-[44px]"
              >
                Zaloguj przez Google
              </button>
            </>
          ) : null}
        </div>
      </nav>
    </>
  )
}
