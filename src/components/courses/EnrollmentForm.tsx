import { useEffect, useState } from 'react'
import type { Course, ParticipantProfile, SelectedCourse } from '../../types'
import { submitEnrollment } from '../../services/enrollmentFlowService'
import { courseToSelectedCourse } from '../../lib/courseUtils'
import { usersService } from '../../services/usersService'
import { useAuth } from '../../contexts/AuthContext'
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

function applyParticipantProfile(form: EnrollmentFormData, profile: ParticipantProfile): EnrollmentFormData {
  return {
    ...form,
    participantFirstName: profile.firstName,
    participantLastName: profile.lastName,
    participantBirthDate: profile.birthDate ?? '',
    studentClass: profile.studentClass,
  }
}

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
  const { profile } = useAuth()
  const [form, setForm] = useState<EnrollmentFormData>(() => emptyEnrollmentForm(userEmail, userName))
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [saveParticipantForFuture, setSaveParticipantForFuture] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const savedProfiles =
    userId && profile?.uid === userId ? (profile.participantProfiles ?? []) : []

  useEffect(() => {
    setForm((f) => ({
      ...f,
      email: f.email || userEmail,
      parentFirstName: f.parentFirstName || userName.split(' ')[0] || '',
      parentLastName: f.parentLastName || userName.split(' ').slice(1).join(' ') || '',
    }))
  }, [userEmail, userName])

  const set = (key: keyof EnrollmentFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId)
    if (!profileId) {
      setForm((f) => ({
        ...f,
        participantFirstName: '',
        participantLastName: '',
        participantBirthDate: '',
        studentClass: '',
      }))
      return
    }
    const picked = savedProfiles.find((p) => p.id === profileId)
    if (picked) {
      setForm((f) => applyParticipantProfile(f, picked))
    }
  }

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

      if (userId && saveParticipantForFuture) {
        try {
          await usersService.saveParticipantProfile(userId, {
            firstName: form.participantFirstName,
            lastName: form.participantLastName,
            birthDate: form.participantBirthDate || undefined,
            studentClass: form.studentClass,
          })
        } catch (profileErr) {
          if (import.meta.env.DEV) {
            console.warn('Nie udało się zapisać profilu uczestnika:', profileErr)
          }
        }
      }

      onSuccess()
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'course-full') {
        setError('Brak wolnych miejsc na wybrane zajęcia. Odśwież stronę i spróbuj ponownie.')
      } else if (code === 'permission-denied') {
        setError('Brak uprawnień do zapisu. Zaloguj się ponownie lub skontaktuj się z nami telefonicznie.')
      } else {
        setError('Nie udało się wysłać zgłoszenia. Spróbuj ponownie.')
      }
      console.error('Enrollment submit failed:', err)
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

      {savedProfiles.length > 0 && (
        <div>
          <label className="block">
            <span className="text-label-sm font-medium">Zapisany uczestnik</span>
            <select
              className={inputClass}
              value={selectedProfileId}
              onChange={(e) => handleProfileSelect(e.target.value)}
            >
              <option value="">Wpisz dane ręcznie</option>
              {savedProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Wybierz profil uczestnika z konta lub wpisz dane ręcznie poniżej.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-label-sm font-medium">Imię uczestnika *</span>
          <input className={inputClass} required value={form.participantFirstName} onChange={(e) => set('participantFirstName', e.target.value)} />
        </label>
        <label className="block">
          <span className="text-label-sm font-medium">Nazwisko uczestnika *</span>
          <input className={inputClass} required value={form.participantLastName} onChange={(e) => set('participantLastName', e.target.value)} />
        </label>
        <div className="block sm:col-span-2">
          <span className="text-label-sm font-medium">Data urodzenia (opcjonalnie)</span>
          <BirthDateInput
            value={form.participantBirthDate}
            onChange={(v) => set('participantBirthDate', v)}
          />
        </div>
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

      {userId && !isGuest && (
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={saveParticipantForFuture}
            onChange={(e) => setSaveParticipantForFuture(e.target.checked)}
            className="mt-1"
          />
          <span className="text-body-sm">
            Zapamiętaj dane uczestnika w moim koncie na przyszłe zapisy
          </span>
        </label>
      )}

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
