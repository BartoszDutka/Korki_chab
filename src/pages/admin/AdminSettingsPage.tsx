import { useEffect, useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { settingsService } from '../../services/settingsService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { SiteSettings } from '../../types'

export default function AdminSettingsPage() {
  const { data } = useFirestoreDoc(settingsService.subscribe)
  const [form, setForm] = useState<SiteSettings | null>(null)
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (!form) return <p>Ładowanie...</p>

  const save = () =>
    run(async () => {
      await settingsService.update(form)
    })

  return (
    <div>
      <AdminPageHeader title="Ustawienia strony" description="Hero i treści startowe" />
      {message && <p className="mb-4 text-sm font-medium text-primary">{message}</p>}
      <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-4 max-w-2xl">
        <Field label="Nazwa strony">
          <input className={inputClass} value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </Field>
        <Field label="Główny nagłówek">
          <input className={inputClass} value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
        </Field>
        <Field label="Podtytuł">
          <input className={inputClass} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
        </Field>
        <Field label="Opis">
          <textarea className={inputClass} rows={4} value={form.heroDescription} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })} />
        </Field>
        <Field label="Telefon">
          <input className={inputClass} value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        </Field>
        <Field label="E-mail">
          <input className={inputClass} value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        </Field>
        <SaveButton onClick={save} saving={saving} />
      </div>
    </div>
  )
}
