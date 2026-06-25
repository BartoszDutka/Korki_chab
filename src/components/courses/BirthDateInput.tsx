const MONTHS = [
  { value: '01', label: 'Styczeń' },
  { value: '02', label: 'Luty' },
  { value: '03', label: 'Marzec' },
  { value: '04', label: 'Kwiecień' },
  { value: '05', label: 'Maj' },
  { value: '06', label: 'Czerwiec' },
  { value: '07', label: 'Lipiec' },
  { value: '08', label: 'Sierpień' },
  { value: '09', label: 'Wrzesień' },
  { value: '10', label: 'Październik' },
  { value: '11', label: 'Listopad' },
  { value: '12', label: 'Grudzień' },
]

function parseIsoDate(value: string): { day: string; month: string; year: string } {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { day: '', month: '', year: '' }
  }
  const [year, month, day] = value.split('-')
  return { day, month, year }
}

function buildIsoDate(day: string, month: string, year: string): string {
  if (!day || !month || !year) return ''
  return `${year}-${month}-${day}`
}

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1995 + 1 }, (_, i) => currentYear - i)
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

export default function BirthDateInput({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (isoDate: string) => void
  className?: string
}) {
  const { day, month, year } = parseIsoDate(value)

  const setPart = (part: 'day' | 'month' | 'year', partValue: string) => {
    const next = { day, month, year, [part]: partValue }
    onChange(buildIsoDate(next.day, next.month, next.year))
  }

  return (
    <div className={`grid grid-cols-3 gap-2 ${className ?? ''}`}>
      <select
        className={className}
        value={day}
        onChange={(e) => setPart('day', e.target.value)}
        aria-label="Dzień urodzenia"
      >
        <option value="">Dzień</option>
        {DAYS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        className={className}
        value={month}
        onChange={(e) => setPart('month', e.target.value)}
        aria-label="Miesiąc urodzenia"
      >
        <option value="">Miesiąc</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        className={className}
        value={year}
        onChange={(e) => setPart('year', e.target.value)}
        aria-label="Rok urodzenia"
      >
        <option value="">Rok</option>
        {YEARS.map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
    </div>
  )
}
