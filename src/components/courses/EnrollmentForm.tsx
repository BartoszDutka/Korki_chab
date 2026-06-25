import { useState } from 'react'
import type { Course, SelectedCourse } from '../../types'
import { submitEnrollment } from '../../services/enrollmentFlowService'
import { courseToSelectedCourse } from '../../lib/courseUtils'
import { inputClass } from '../admin/AdminUi'
import BirthDateInput from './BirthDateInput'

export interface EnrollmentFormData {
  participantFirstName: string
  participantLastName: string
  participantBirthDate: string
  studentClass: string
  parentFirstName: string
  parentLastName: string
  email: string
  phone: string
  message: string
  termsAccepted: boolean
  rodoAccepted: boolean
}

export const emptyEnrollmentForm = (email = '', name = ''): EnrollmentFormData => ({
  participantFirstName: '',
  participantLastName: '',
  participantBirthDate: '',
  studentClass: '',
  parentFirstName: name.split(' ')[0] ?? '',
  parentLastName: name.split(' ').slice(1).join(' ') ?? '',
  email,
  phone: '',
  message: '',
  termsAccepted: false,
  rodoAccepted: false,
})

export default function EnrollmentForm({
  courses,
  userId,
  isGuest,
  userEmail,
  userName,
  messageType,
  onSuccess,
  onCancel,
}: {
  courses: SelectedCourse[]
  userId: string | null
  isGuest: boolean
  userEmail: string
  userName: string
  messageType: 'enrollment' | 'cartEnrollment'
  onSuccess: () => void
  onCancel?: () => void
}) {
  const [form, setForm] = useState<EnrollmentFormData>(emptyEnrollmentForm(userEmail, userName))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof EnrollmentFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.termsAccepted || !form.rodoAccepted) {
      setError('Wymagana jest zgoda na regulamin i RODO.')
      return
    }
    setSubmitting(true)
    try {
      await submitEnrollment({
        userId,
        isGuest,
        userEmail: form.email,
        userName: `${form.parentFirstName} ${form.parentLastName}`.trim(),
        selectedCourses: courses,
        participantData: {
          firstName: form.participantFirstName,
          lastName: form.participantLastName,
          birthDate: form.participantBirthDate || undefined,
          studentClass: form.studentClass,
        },
        contactData: {
          parentFirstName: form.parentFirstName,
          parentLastName: form.parentLastName,
          phone: form.phone,
          email: form.email,
          message: form.message,
        },
        agreements: {
          termsAccepted: form.termsAccepted,
          rodoAccepted: form.rodoAccepted,
        },
        messageType,
      })
      onSuccess()
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'permission-denied') {
        setError('Brak uprawnień do zapisu. Zaloguj się ponownie lub skontaktuj się z nami telefonicznie.')
      } else {
        setError('Nie udało się wysłać zgłoszenia. Spróbuj ponownie.')
      }
      if (import.meta.env.DEV) {
        console.error('Enrollment submit failed:', err)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-surface-container-low rounded-xl p-4">
        <p className="text-label-sm font-medium text-on-surface-variant mb-2">Wybrane zajęcia</p>
        <ul className="text-body-md text-primary space-y-1">
          {courses.map((c) => (
            <li key={c.courseId}>• {c.title}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-label-sm font-medium">Imię uczestnika *</span>
          <input className={inputClass} required value={form.participantFirstName} onChange={(e) => set('participantFirstName', e.target.value)} />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">Nazwisko uczestnika *</span>
          <input className={inputClass} required value={form.participantLastName} onChange={(e) => set('participantLastName', e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-label-sm font-medium">Data urodzenia (opcjonalnie)</span>
          <BirthDateInput
            className={inputClass}
            value={form.participantBirthDate}
            onChange={(v) => set('participantBirthDate', v)}
          />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">Klasa ucznia *</span>
          <input className={inputClass} required value={form.studentClass} onChange={(e) => set('studentClass', e.target.value)} />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">Imię rodzica/opiekuna *</span>
          <input className={inputClass} required value={form.parentFirstName} onChange={(e) => set('parentFirstName', e.target.value)} />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">Nazwisko rodzica/opiekuna *</span>
          <input className={inputClass} required value={form.parentLastName} onChange={(e) => set('parentLastName', e.target.value)} />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">E-mail *</span>
          <input type="email" className={inputClass} required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">Telefon *</span>
          <input type="tel" className={inputClass} required value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </label>
      </div>

      <label className="block">
        <span className="text-label-sm font-medium">Wiadomość dodatkowa</span>
        <textarea className={inputClass} rows={3} value={form.message} onChange={(e) => set('message', e.target.value)} />
      </label>

      <label className="flex items-start gap-2">
        <input type="checkbox" checked={form.termsAccepted} onChange={(e) => set('termsAccepted', e.target.checked)} className="mt-1" />
        <span className="text-body-sm">Akceptuję regulamin zajęć *</span>
      </label>
      <label className="flex items-start gap-2">
        <input type="checkbox" checked={form.rodoAccepted} onChange={(e) => set('rodoAccepted', e.target.checked)} className="mt-1" />
        <span className="text-body-sm">Wyrażam zgodę na przetwarzanie danych (RODO) *</span>
      </label>

      {error && <p className="text-body-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg disabled:opacity-60"
        >
          {submitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="border border-outline-variant px-6 py-3 rounded-lg font-medium">
            Anuluj
          </button>
        )}
      </div>
    </form>
  )
}

export function courseToSelected(courses: Course[]): SelectedCourse[] {
  return courses.map(courseToSelectedCourse)
}
