import type { SVGProps } from 'react'

type IconName =
  | 'menu'
  | 'close'
  | 'send'
  | 'arrow_forward'
  | 'call'
  | 'location_on'
  | 'mail'
  | 'calculate'
  | 'language'
  | 'menu_book'
  | 'function'
  | 'science'
  | 'biotech'
  | 'person_play'
  | 'local_library'
  | 'laptop_chromebook'
  | 'star'

const paths: Record<IconName, string> = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6L6 18',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  arrow_forward: 'M5 12h14M13 6l6 6-6 6',
  call: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  location_on: 'M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11zM12 11a2 2 0 100-4 2 2 0 000 4z',
  mail: 'M4 4h16v16H4zM22 6l-10 7L2 6',
  calculate: 'M4 4h16v16H4zM8 8h2v2H8zM14 8h2v2h-2zM8 14h2v2H8zM14 14h2v2h-2z',
  language: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  menu_book: 'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  function: 'M9 7c0-1.1.9-2 2-2h6v2h-2v12h2v2h-6c-1.1 0-2-.9-2-2V7z',
  science: 'M9 3v6l-5 9a2 2 0 001.74 3h16.52A2 2 0 0020 18l-5-9V3',
  biotech: 'M7 2v4M17 2v4M7 14h10M12 6v8',
  person_play: 'M12 12a4 4 0 100-8 4 4 0 000 8zM6 20v-1a6 6 0 0112 0v1',
  local_library: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 4v15.5M20 4v15.5',
  laptop_chromebook: 'M4 6h16v10H4zM2 18h20',
  star: 'M12 2l2.9 6.9L20 10.5l-5 4.8L15.5 22 12 18.5 8.5 22l.5-6.7-5-4.8 5.1-1.6L12 2z',
}

interface IconProps {
  name: string
  className?: string
  label?: string
}

function SvgIcon({ d, className, label }: { d: string; className?: string; label?: string }) {
  const props: SVGProps<SVGSVGElement> = {
    className: `inline-block shrink-0 ${className ?? ''}`,
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': label ? undefined : true,
    role: label ? 'img' : undefined,
    'aria-label': label,
  }
  return (
    <svg {...props}>
      <path d={d} />
    </svg>
  )
}

export default function Icon({ name, className = '', label }: IconProps) {
  const d = paths[name as IconName]
  if (!d) {
    return <SvgIcon d={paths.menu_book} className={className} label={label ?? name} />
  }
  return <SvgIcon d={d} className={className} label={label} />
}
