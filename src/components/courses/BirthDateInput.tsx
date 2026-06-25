import { useEffect, useState } from 'react'

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

export type BirthDateParts = { day: string; month: string; year: string }

export function parseIsoDate(value: string): BirthDateParts {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { day: '', month: '', year: '' }
  }
  const [year, month, day] = value.split('-')
  return { day, month, year }
}

export function buildIsoDate(day: string, month: string, year: string): string {
  if (!day || !month || !year) return ''
  return `${year}-${month}-${day}`
}

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1995 + 1 }, (_, i) => currentYear - i)
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))

const selectClass =
  'w-full min-w-0 border border-outline-variant rounded-lg px-3 py-3 text-body-md bg-surface-bright focus:ring-2 focus:ring-secondary-container focus:outline-none appearance-auto cursor-pointer'

export default function BirthDateInput({
  value,
  onChange,
}: {
  value: string
  onChange: (isoDate: string) => void
}) {
  const [parts, setParts] = useState<BirthDateParts>(() => parseIsoDate(value))

  useEffect(() => {
    setParts(parseIsoDate(value))
  }, [value])

  const setPart = (part: keyof BirthDateParts, partValue: string) => {
    const next = { ...parts, [part]: partValue }
    setParts(next)
    onChange(buildIsoDate(next.day, next.month, next.year))
  }

  return (
    <div className="grid grid-cols-3 gap-2 mt-1">
      <select
        className={selectClass}
        value={parts.day}
        onChange={(e) => setPart('day', e.target.value)}
        aria-label="Dzień urodzenia"
      >
        <option value="">Dzień</option>
        {DAYS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        className={selectClass}
        value={parts.month}
        onChange={(e) => setPart('month', e.target.value)}
        aria-label="Miesiąc urodzenia"
      >
        <option value="">Miesiąc</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        className={selectClass}
        value={parts.year}
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
