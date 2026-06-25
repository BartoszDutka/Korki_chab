import { useEffect, useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { footerService } from '../../services/footerService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { FooterSettings } from '../../types'

export default function AdminFooterPage() {
  const { data } = useFirestoreDoc(footerService.subscribe)
  const [form, setForm] = useState<FooterSettings | null>(null)
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (!form) return <p>Ładowanie...</p>

  const save = () => run(() => footerService.update(form))

  return (
    <div>
      <AdminPageHeader title="Stopka" />
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        <Field label="Tytuł">
          <input className={inputClass} value={form.footerTitle} onChange={(e) => setForm({ ...form, footerTitle: e.target.value })} />
        </Field>
        <Field label="Opis">
          <textarea className={inputClass} rows={3} value={form.footerDescription} onChange={(e) => setForm({ ...form, footerDescription: e.target.value })} />
        </Field>
        <Field label="Telefon">
          <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="E-mail">
          <input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Lokalizacja">
          <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </Field>
        <Field label="Copyright">
          <input className={inputClass} value={form.copyright} onChange={(e) => setForm({ ...form, copyright: e.target.value })} />
        </Field>
        <SaveButton onClick={save} saving={saving} />
      </div>
    </div>
  )
}
