import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import IconComponent from './icons'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold text-label-md rounded-lg transition-all active:scale-95 duration-150 min-h-[44px] min-w-[44px]'

  const variants = {
    primary:
      'bg-secondary-container hover:bg-warm-orange-hover text-primary px-6 py-3 md:px-8 md:py-4 font-bold shadow-sm',
    secondary:
      'border-2 border-primary text-primary hover:bg-surface-container-low px-6 py-3 md:px-8 md:py-4 font-bold',
    ghost: 'border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 font-bold',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    const isInternal = href.startsWith('/') && !href.startsWith('//')
    if (!isInternal) {
      return (
        <a href={href} className={classes} aria-label={ariaLabel}>
          {children}
        </a>
      )
    }
    return (
      <Link to={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  )
}

export const Icon = IconComponent
export default IconComponent
