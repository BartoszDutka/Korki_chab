import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Icon from './ui'
import { useDeferredOnce } from '../hooks/useDeferredOnce'
import { DEFAULT_MENU, DEFAULT_SITE_SETTINGS } from '../data/defaults'

const LOGO_SRC = '/LogoChab.png'
const LOGO_WIDTH = 1254
const LOGO_HEIGHT = 1254

const FOOTER_ONLY_HREFS = ['/opinie', '/faq', '/kontakt']

function SiteLogo({ className = 'h-10 lg:h-12 w-10 lg:w-12' }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Korepetycje w Chabówce — logo"
      className={`shrink-0 object-contain ${className}`}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
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
    ? 'font-medium text-label-sm px-2 py-1.5 rounded-lg transition-colors text-primary hover:text-secondary-container hover:bg-surface-container-low whitespace-nowrap'
    : 'font-medium text-label-md px-3 py-2 rounded-lg transition-colors text-primary hover:text-secondary-container hover:bg-surface-container-low'

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
  const { user, isAdmin, logout, signInWithGoogle, authChecked } = useAuth()
  const { count } = useCart()
  const fetchSettings = useCallback(
    () => import('../services/settingsService').then((m) => m.settingsService.get()),
    [],
  )
  const fetchMenu = useCallback(
    () => import('../services/menuService').then((m) => m.menuService.getAll()),
    [],
  )
  const { data: settingsDeferred } = useDeferredOnce(fetchSettings, { delayMs: 2000 })
  const { data: menuDeferred } = useDeferredOnce(fetchMenu, { delayMs: 2000 })
  const menuItems = useMemo(() => {
    const items = menuDeferred ?? []
    const sorted =
      items.length === 0
        ? DEFAULT_MENU
        : [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const filtered = sorted.filter(
      (item) => item.visible !== false && !FOOTER_ONLY_HREFS.includes(item.href),
    )
    const hrefs = new Set(filtered.map((item) => item.href))
    const merged = [...filtered]
    for (const fallback of DEFAULT_MENU) {
      if (!hrefs.has(fallback.href) && !FOOTER_ONLY_HREFS.includes(fallback.href)) {
        merged.push(fallback)
      }
    }
    return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [menuDeferred])
  const navItems = menuItems

  const siteName = settingsDeferred?.siteName ?? DEFAULT_SITE_SETTINGS.siteName
  const closeMenu = () => setMenuOpen(false)
  const showGuestAuth = !authChecked || (!user && !isAdmin)
  const showUserAuth = authChecked && user && !isAdmin

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <header className="bg-surface-container-lowest sticky top-0 w-full z-50 border-b border-outline-variant shadow-sm overflow-hidden h-16 lg:h-20">
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

          <nav className="hidden lg:flex flex-1 justify-center items-center min-w-0 gap-0.5 xl:gap-1 overflow-hidden min-h-[44px]">
            {navItems.map((item) => (
              <NavItem key={item.id ?? item.href} href={item.href} label={item.label} compact />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto min-h-[44px] min-w-[44px] lg:min-w-[280px] justify-end">
            {showUserAuth ? (
              <>
                <Link
                  to="/koszyk"
                  className="hidden lg:inline-flex items-center gap-1 font-medium text-label-sm xl:text-label-md px-2 xl:px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low whitespace-nowrap min-h-[44px]"
                >
                  Koszyk
                  <span
                    className={`bg-secondary-container text-on-secondary text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
                      count > 0 ? '' : 'invisible'
                    }`}
                    aria-hidden={count === 0}
                  >
                    {count > 0 ? count : 0}
                  </span>
                </Link>
                <Link
                  to="/moje-zajecia"
                  className="hidden xl:inline-flex font-medium text-label-md px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low whitespace-nowrap min-h-[44px] items-center"
                >
                  Moje zajęcia
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="hidden xl:inline-flex font-medium text-label-md px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low whitespace-nowrap min-h-[44px] items-center"
                >
                  Wyloguj
                </button>
              </>
            ) : showGuestAuth ? (
              <>
                <Link
                  to="/zaloguj"
                  className="hidden lg:inline-flex font-medium text-label-sm xl:text-label-md px-2 xl:px-3 py-2 rounded-lg text-primary hover:bg-surface-container-low min-h-[44px] items-center whitespace-nowrap"
                >
                  Zaloguj się
                </Link>
                <Link
                  to="/zaloguj?mode=register"
                  className="hidden lg:inline-flex bg-secondary-container text-on-secondary font-medium text-label-sm xl:text-label-md px-3 xl:px-4 py-2 rounded-lg hover:bg-warm-orange-hover transition-[background-color,transform] font-bold shadow-sm min-h-[44px] items-center whitespace-nowrap"
                >
                  Zarejestruj się
                </Link>
              </>
            ) : null}

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
        {...(!menuOpen ? { inert: true } : {})}
      >
        <div className="flex justify-between items-center gap-3 p-4 border-b border-outline-variant">
          <Link to="/" className="flex items-center gap-2 min-w-0" onClick={closeMenu} aria-label={siteName}>
            <SiteLogo className="h-8 w-8" />
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
            <NavItem key={item.id ?? item.href} href={item.href} label={item.label} onNavigate={closeMenu} />
          ))}
          <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-1">
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
                className="font-medium px-3 py-2 bg-secondary-container text-on-secondary font-bold rounded-lg min-h-[44px] flex items-center justify-center"
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
        </div>
      </nav>
    </>
  )
}
