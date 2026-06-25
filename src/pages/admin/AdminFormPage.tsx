import { useEffect, useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { formSettingsService } from '../../services/formSettingsService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { FormSettings } from '../../types'

export default function AdminFormPage() {
  const { data } = useFirestoreDoc(formSettingsService.subscribe)
  const [form, setForm] = useState<FormSettings | null>(null)
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (!form) return <p>Ładowanie...</p>

  const save = () => run(() => formSettingsService.update(form))

  return (
    <div>
      <AdminPageHeader title="Formularz zapisowy" />
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        <Field label="Tekst zgody RODO">
          <textarea className={inputClass} rows={3} value={form.rodoText} onChange={(e) => setForm({ ...form, rodoText: e.target.value })} />
        </Field>
        <Field label="Komunikat po wysłaniu">
          <textarea className={inputClass} rows={2} value={form.successMessage} onChange={(e) => setForm({ ...form, successMessage: e.target.value })} />
        </Field>
        <Field label="E-mail docelowy">
          <input className={inputClass} value={form.targetEmail} onChange={(e) => setForm({ ...form, targetEmail: e.target.value })} />
        </Field>
        <p className="text-sm text-on-surface-variant">
          Pola formularza: {form.fields.filter((f) => f.visible).map((f) => f.label).join(', ')}
        </p>
        <SaveButton onClick={save} saving={saving} />
      </div>
    </div>
  )
}
