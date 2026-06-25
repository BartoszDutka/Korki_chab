import { Link } from 'react-router-dom'
import { useCallback } from 'react'
import { useDeferredOnce } from '../hooks/useDeferredOnce'
import { DEFAULT_FOOTER } from '../data/defaults'

const NAV_LINK_MIN_H = 'min-h-[11.5rem]'

export default function Footer() {
  const fetchFooter = useCallback(
    () => import('../services/footerService').then((m) => m.footerService.get()),
    [],
  )
  const { data: footerRaw } = useDeferredOnce(fetchFooter, { delayMs: 2500 })
  const footer = footerRaw ?? DEFAULT_FOOTER

  return (
    <footer className="bg-academic-navy-deep w-full py-12 md:py-section-gap min-h-[420px] md:min-h-[360px] [contain:layout]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-6 min-h-[200px]">
          <div className="text-headline-md text-surface-container-lowest font-extrabold leading-8 min-h-[2rem]">
            {footer.footerTitle}
          </div>
          <p className="text-body-md text-surface-container-high opacity-80 max-w-xs leading-6 min-h-[4.5rem] line-clamp-3">
            {footer.footerDescription}
          </p>
          <p className="text-body-md text-surface-container-high opacity-70 text-sm break-words leading-6 min-h-[1.5rem]">
            {footer.phone} · {footer.email} · {footer.location}
          </p>
        </div>

        <div className={`flex flex-col space-y-3 md:space-y-4 min-h-[200px] ${NAV_LINK_MIN_H}`}>
          <h2 className="text-body-lg font-bold text-surface-container-lowest mb-1 md:mb-2 leading-7 min-h-[1.75rem]">
            Nawigacja
          </h2>
          <nav className={`flex flex-col space-y-2 md:space-y-3 ${NAV_LINK_MIN_H}`}>
            {footer.links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-surface-container-high hover:text-secondary-fixed transition-colors hover:underline leading-6 min-h-[1.5rem] block"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col space-y-3 md:space-y-4 min-h-[200px]">
          <h2 className="text-body-lg font-bold text-surface-container-lowest mb-1 md:mb-2 leading-7 min-h-[1.75rem]">
            SEO lokalne
          </h2>
          <p className="text-body-md text-surface-container-high opacity-80 text-sm leading-6 min-h-[4.5rem] line-clamp-3">
            {footer.seoPhrases.join(' · ')}
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 pt-8 md:pt-12 mt-4 md:mt-12 border-t border-surface-container-high/20 text-center min-h-[3.5rem]">
          <p className="text-surface-container-high/60 text-sm leading-6">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
