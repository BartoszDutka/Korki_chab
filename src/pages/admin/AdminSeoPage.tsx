import { useEffect, useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { seoService } from '../../services/seoService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { SeoSettings } from '../../types'

export default function AdminSeoPage() {
  const { data } = useFirestoreDoc(seoService.subscribe)
  const [form, setForm] = useState<SeoSettings | null>(null)
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (!form) return <p>Ładowanie...</p>

  const save = () => run(() => seoService.update(form))

  return (
    <div>
      <AdminPageHeader title="SEO" />
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        <Field label="Domyślny meta title">
          <input className={inputClass} value={form.defaultMetaTitle} onChange={(e) => setForm({ ...form, defaultMetaTitle: e.target.value })} />
        </Field>
        <Field label="Domyślny meta description">
          <textarea className={inputClass} rows={3} value={form.defaultMetaDescription} onChange={(e) => setForm({ ...form, defaultMetaDescription: e.target.value })} />
        </Field>
        <Field label="Meta title — strona główna">
          <input className={inputClass} value={form.homeMetaTitle} onChange={(e) => setForm({ ...form, homeMetaTitle: e.target.value })} />
        </Field>
        <Field label="Meta description — strona główna">
          <textarea className={inputClass} rows={3} value={form.homeMetaDescription} onChange={(e) => setForm({ ...form, homeMetaDescription: e.target.value })} />
        </Field>
        <Field label="Lokalne frazy SEO (jedna na linię)">
          <textarea
            className={inputClass}
            rows={5}
            value={form.localSeoPhrases.join('\n')}
            onChange={(e) => setForm({ ...form, localSeoPhrases: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
          />
        </Field>
        <SaveButton onClick={save} saving={saving} />
      </div>
    </div>
  )
}
