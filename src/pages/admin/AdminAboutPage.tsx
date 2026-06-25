import { useEffect, useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { settingsService } from '../../services/settingsService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'

export default function AdminAboutPage() {
  const { data } = useFirestoreDoc(settingsService.subscribe)
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutContent, setAboutContent] = useState('')
  const [locations, setLocations] = useState('')
  const [visible, setVisible] = useState(true)
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (data) {
      setAboutTitle(data.aboutTitle)
      setAboutContent(data.aboutContent)
      setLocations(data.aboutLocations.join('\n'))
      setVisible(data.aboutVisible)
    }
  }, [data])

  const save = () =>
    run(async () => {
      await settingsService.update({
        aboutTitle,
        aboutContent,
        aboutLocations: locations.split('\n').map((l) => l.trim()).filter(Boolean),
        aboutVisible: visible,
      })
    })

  return (
    <div>
      <AdminPageHeader title="O nas" description="Sekcja o centrum na stronie głównej" />
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}
      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        <Field label="Nagłówek">
          <input className={inputClass} value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
        </Field>
        <Field label="Treść">
          <textarea className={inputClass} rows={6} value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} />
        </Field>
        <Field label="Miejscowości (jedna na linię)">
          <textarea className={inputClass} rows={6} value={locations} onChange={(e) => setLocations(e.target.value)} />
        </Field>
        <Field label="Widoczna sekcja">
          <select className={inputClass} value={visible ? 'yes' : 'no'} onChange={(e) => setVisible(e.target.value === 'yes')}>
            <option value="yes">Widoczna</option>
            <option value="no">Ukryta</option>
          </select>
        </Field>
        <SaveButton onClick={save} saving={saving} />
      </div>
    </div>
  )
}
