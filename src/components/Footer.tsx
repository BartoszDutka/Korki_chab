import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import { useDeferredOnce } from '../hooks/useDeferredOnce'
import { DEFAULT_FOOTER } from '../data/defaults'

export default function Footer() {
  const fetchFooter = useCallback(
    () => import('../services/footerService').then((m) => m.footerService.get()),
    [],
  )
  const { data: footerRaw } = useDeferredOnce(fetchFooter)
  const footer = footerRaw ?? DEFAULT_FOOTER

  return (
    <footer className="bg-academic-navy-deep w-full py-12 md:py-section-gap min-h-[320px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <div className="text-headline-md text-surface-container-lowest font-extrabold">
            {footer.footerTitle}
          </div>
          <p className="text-body-md text-surface-container-high opacity-80 max-w-xs">
            {footer.footerDescription}
          </p>
          <p className="text-body-md text-surface-container-high opacity-70 text-sm break-words">
            {footer.phone} · {footer.email} · {footer.location}
          </p>
        </div>

        <div className="flex flex-col space-y-3 md:space-y-4">
          <h2 className="text-body-lg font-bold text-surface-container-lowest mb-1 md:mb-2">Nawigacja</h2>
          <nav className="flex flex-col space-y-2 md:space-y-3">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-surface-container-high hover:text-secondary-fixed transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col space-y-3 md:space-y-4">
          <h2 className="text-body-lg font-bold text-surface-container-lowest mb-1 md:mb-2">SEO lokalne</h2>
          <p className="text-body-md text-surface-container-high opacity-80 text-sm">
            {footer.seoPhrases.join(' · ')}
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 pt-8 md:pt-12 mt-4 md:mt-12 border-t border-surface-container-high/20 text-center">
          <p className="text-surface-container-high/60 text-sm">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
