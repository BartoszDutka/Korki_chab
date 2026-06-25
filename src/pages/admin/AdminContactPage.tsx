import { useEffect, useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { contactService } from '../../services/contactService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { ContactSettings } from '../../types'

export default function AdminContactPage() {
  const { data } = useFirestoreDoc(contactService.subscribe)
  const [form, setForm] = useState<ContactSettings | null>(null)
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  if (!form) return <p>Ładowanie...</p>

  const save = () => run(() => contactService.update(form))

  return (
    <div>
      <AdminPageHeader title="Kontakt" />
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        {(['phone', 'email', 'address', 'location', 'googleMapsUrl', 'contactText', 'contactHours', 'onlineInfo', 'stationaryInfo'] as const).map((key) => (
          <Field key={key} label={key}>
            <input
              className={inputClass}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </Field>
        ))}
        <SaveButton onClick={save} saving={saving} />
      </div>
    </div>
  )
}
