import { useState } from 'react'
import { useEditMode } from '../../contexts/EditModeContext'

interface EditableTextProps {
  value: string
  onSave: (value: string) => Promise<void>
  label?: string
  multiline?: boolean
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}

export default function EditableText({
  value,
  onSave,
  label,
  multiline = false,
  className = '',
  as: Tag = 'span',
}: EditableTextProps) {
  const { isEditMode } = useEditMode()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await onSave(draft)
      setMessage('Zapisano zmiany')
      setEditing(false)
      setTimeout(() => setMessage(null), 3000)
    } catch {
      setMessage('Nie udało się zapisać zmian')
    } finally {
      setSaving(false)
    }
  }

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>
  }

  if (editing) {
    return (
      <div className="relative group/edit">
        {label && <span className="text-label-sm text-secondary-container block mb-1">{label}</span>}
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full border border-secondary-container rounded-lg px-3 py-2 text-body-md bg-white"
            rows={4}
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full border border-secondary-container rounded-lg px-3 py-2 text-body-md bg-white"
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-secondary-container text-on-secondary px-3 py-1 rounded text-label-sm font-bold"
          >
            {saving ? 'Zapisuję...' : 'Zapisz'}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(value)
              setEditing(false)
            }}
            className="border border-outline-variant px-3 py-1 rounded text-label-sm"
          >
            Anuluj
          </button>
        </div>
        {message && <p className="text-label-sm text-green-600 mt-1">{message}</p>}
      </div>
    )
  }

  return (
    <span className="inline-flex items-start gap-2 flex-wrap">
      <Tag className={className}>{value}</Tag>
      <button
        type="button"
        onClick={() => {
          setDraft(value)
          setEditing(true)
        }}
        className="text-label-sm bg-secondary-container/20 text-secondary-container px-2 py-0.5 rounded font-bold shrink-0"
      >
        Edytuj
      </button>
    </span>
  )
}
