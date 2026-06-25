import { useState, type ReactNode } from 'react'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from './AdminUi'

interface Column<T> {
  key: keyof T
  label: string
}

interface GenericCollectionAdminProps<T extends { id: string }> {
  title: string
  description?: string
  items: T[]
  columns: Column<T>[]
  defaultItem: Omit<T, 'id'>
  onAdd: (item: Omit<T, 'id'>) => Promise<string>
  onUpdate: (id: string, data: Partial<T>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  formFields: (draft: Partial<T>, setDraft: (d: Partial<T>) => void) => ReactNode
}

export default function GenericCollectionAdmin<T extends { id: string }>({
  title,
  description,
  items,
  columns,
  defaultItem,
  onAdd,
  onUpdate,
  onDelete,
  formFields,
}: GenericCollectionAdminProps<T>) {
  const [editing, setEditing] = useState<Partial<T> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const { saving, message, run } = useAdminSave()

  const openNew = () => {
    setEditing({ ...defaultItem } as Partial<T>)
    setIsNew(true)
  }

  const openEdit = (item: T) => {
    setEditing({ ...item })
    setIsNew(false)
  }

  const handleSave = () => {
    if (!editing) return
    run(async () => {
      if (isNew) {
        await onAdd(editing as Omit<T, 'id'>)
      } else if (editing.id) {
        const { id, ...rest } = editing as T
        await onUpdate(id, rest as Partial<T>)
      }
      setEditing(null)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Na pewno usunąć ten element?')) return
    run(() => onDelete(id))
  }

  return (
    <div>
      <AdminPageHeader title={title} description={description} />
      <button
        type="button"
        onClick={openNew}
        className="mb-6 bg-secondary-container text-on-secondary px-4 py-2 rounded-lg font-bold text-sm"
      >
        Dodaj nowy
      </button>
      {message && <p className="mb-4 text-sm font-medium text-primary">{message}</p>}

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className="px-4 py-3 font-semibold text-primary">{c.label}</th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-outline-variant/50">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3 text-on-surface-variant">
                    {String(item[c.key] ?? '')}
                  </td>
                ))}
                <td className="px-4 py-3 space-x-2">
                  <button type="button" onClick={() => openEdit(item)} className="text-primary font-medium">
                    Edytuj
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="text-red-600 font-medium">
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="mt-8 bg-white border border-outline-variant rounded-xl p-6 space-y-4 max-w-2xl">
          <h2 className="font-bold text-primary">{isNew ? 'Nowy element' : 'Edycja'}</h2>
          {formFields(editing, setEditing)}
          <div className="flex gap-3 pt-2">
            <SaveButton onClick={handleSave} saving={saving} />
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg">
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function VisibleToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <Field label="Widoczny">
      <select
        value={value ? 'yes' : 'no'}
        onChange={(e) => onChange(e.target.value === 'yes')}
        className={inputClass}
      >
        <option value="yes">Widoczny</option>
        <option value="no">Ukryty</option>
      </select>
    </Field>
  )
}

export function OrderField({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <Field label="Kolejność">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClass}
      />
    </Field>
  )
}
