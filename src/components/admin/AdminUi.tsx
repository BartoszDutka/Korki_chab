import { useState, type ReactNode } from 'react'

export function AdminPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-headline-lg font-bold text-primary">{title}</h1>
      {description && <p className="text-body-md text-on-surface-variant mt-2">{description}</p>}
    </div>
  )
}

export function SaveButton({
  onClick,
  saving,
  label = 'Zapisz zmiany',
}: {
  onClick: () => void
  saving: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="bg-secondary-container hover:bg-warm-orange-hover text-on-secondary font-bold px-6 py-3 rounded-lg disabled:opacity-60"
    >
      {saving ? 'Zapisuję...' : label}
    </button>
  )
}

export function useAdminSave() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const run = async (fn: () => Promise<void>) => {
    setSaving(true)
    setMessage(null)
    try {
      await fn()
      setMessage('Zapisano zmiany')
    } catch {
      setMessage('Nie udało się zapisać zmian')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  return { saving, message, run }
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-label-md font-medium text-primary">{label}</label>
      {children}
    </div>
  )
}

export const inputClass =
  'w-full border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:ring-2 focus:ring-secondary-container focus:outline-none'

const DEFAULT_PICKER_COLOR = '#E85D04'

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

export function ColorPickerField({
  value,
  onChange,
  placeholder = DEFAULT_PICKER_COLOR,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const pickerValue = isHexColor(value) ? value : placeholder

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="color"
        value={pickerValue}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-12 shrink-0 rounded-lg border border-outline-variant cursor-pointer bg-white p-1"
        aria-label="Wybierz kolor"
      />
      <span className="text-body-md text-on-surface-variant tabular-nums">
        {isHexColor(value) ? value : 'Bez koloru'}
      </span>
      {isHexColor(value) && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-label-md font-medium text-primary hover:underline"
        >
          Usuń kolor
        </button>
      )}
    </div>
  )
}
