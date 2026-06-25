import { useState } from 'react'
import { useFirestoreDoc } from '../../hooks/useFirestore'
import { emailSettingsService, DEFAULT_EMAIL_SETTINGS } from '../../services/emailSettingsService'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { EmailSettings } from '../../types'

export default function AdminEmailSettingsPage() {
  const { data } = useFirestoreDoc(emailSettingsService.subscribe)
  const [form, setForm] = useState<EmailSettings | null>(null)
  const { saving, message, run } = useAdminSave()

  const settings = form ?? data ?? DEFAULT_EMAIL_SETTINGS

  const set = <K extends keyof EmailSettings>(key: K, value: EmailSettings[K]) => {
    setForm({ ...settings, [key]: value })
  }

  const save = () => {
    run(async () => {
      await emailSettingsService.update(settings)
      setForm(null)
    })
  }

  return (
    <div>
      <AdminPageHeader title="Ustawienia e-mail" description="Powiadomienia o zgłoszeniach (wysyłka przez backend — stub w aplikacji)" />
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}

      <div className="bg-white border rounded-xl p-6 space-y-4 max-w-2xl">
        <Field label="E-mail administratora">
          <input className={inputClass} value={settings.adminEmail} onChange={(e) => set('adminEmail', e.target.value)} />
        </Field>
        <Field label="Nazwa nadawcy">
          <input className={inputClass} value={settings.senderName} onChange={(e) => set('senderName', e.target.value)} />
        </Field>
        <Field label="Temat e-maila do admina">
          <input className={inputClass} value={settings.adminEmailSubject} onChange={(e) => set('adminEmailSubject', e.target.value)} />
        </Field>
        <Field label="Temat e-maila do użytkownika">
          <input className={inputClass} value={settings.userEmailSubject} onChange={(e) => set('userEmailSubject', e.target.value)} />
        </Field>
        <Field label="Treść potwierdzenia dla użytkownika">
          <textarea className={inputClass} rows={4} value={settings.userConfirmationMessage} onChange={(e) => set('userConfirmationMessage', e.target.value)} />
        </Field>
        <Field label="Stopka e-mail">
          <textarea className={inputClass} rows={2} value={settings.emailFooter} onChange={(e) => set('emailFooter', e.target.value)} />
        </Field>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.adminNotificationEnabled} onChange={(e) => set('adminNotificationEnabled', e.target.checked)} />
          Wysyłaj powiadomienie do admina
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.userConfirmationEnabled} onChange={(e) => set('userConfirmationEnabled', e.target.checked)} />
          Wysyłaj potwierdzenie do użytkownika
        </label>
        <SaveButton onClick={save} saving={saving} />
        <p className="text-xs text-on-surface-variant">
          Pełna wysyłka e-mail wymaga Firebase Cloud Functions + Resend/SendGrid. Obecnie wiadomości są zapisywane w skrzynce panelu admina.
        </p>
      </div>
    </div>
  )
}
