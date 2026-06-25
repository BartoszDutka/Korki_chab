import { useState } from 'react'
import { useFirestoreCollection } from '../../hooks/useFirestore'
import { enrollmentsService } from '../../services/enrollmentsService'
import { messagesService } from '../../services/messagesService'
import { syncCourseSeats } from '../../services/courseSeatsService'
import { formatCoursePrice } from '../../lib/courseUtils'
import { AdminPageHeader, Field, inputClass } from '../../components/admin/AdminUi'
import type { Enrollment, EnrollmentStatus } from '../../types'
import { ENROLLMENT_STATUS_LABELS } from '../../types'

function formatBirthDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pl-PL')
}

function enrollmentSourceLabel(enrollment: Enrollment) {
  if (enrollment.isGuest) return 'Zapis bez konta (gość)'
  return 'Zalogowany użytkownik'
}

function EnrollmentDetailModal({
  enrollment,
  note,
  onNoteChange,
  onStatusChange,
  onClose,
}: {
  enrollment: Enrollment
  note: string
  onNoteChange: (value: string) => void
  onStatusChange: (status: EnrollmentStatus) => void
  onClose: () => void
}) {
  const totalPrice = enrollment.selectedCourses.reduce((sum, c) => sum + c.price, 0)
  const currency = enrollment.selectedCourses[0]?.currency ?? 'PLN'
  const birthDate = formatBirthDate(enrollment.participantData.birthDate)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 space-y-5">
          <div className="flex flex-wrap justify-between gap-3 items-start">
            <div>
              <h2 className="font-bold text-primary text-headline-sm">Zgłoszenie</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {new Date(enrollment.createdAt).toLocaleString('pl-PL')} · {enrollmentSourceLabel(enrollment)}
              </p>
            </div>
            <span className="text-label-sm font-bold px-3 py-1 rounded-full bg-primary-container shrink-0">
              {ENROLLMENT_STATUS_LABELS[enrollment.status]}
            </span>
          </div>

          <section className="bg-surface-container-low rounded-xl p-4 space-y-3">
            <h3 className="text-label-md font-bold text-primary">Kontakt</h3>
            <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-on-surface-variant">Rodzic / opiekun</dt>
                <dd className="font-medium text-primary">
                  {enrollment.contactData.parentFirstName} {enrollment.contactData.parentLastName}
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">E-mail</dt>
                <dd>
                  <a
                    href={`mailto:${enrollment.contactData.email}`}
                    className="font-medium text-secondary-container hover:underline"
                  >
                    {enrollment.contactData.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Telefon</dt>
                <dd>
                  <a
                    href={`tel:${enrollment.contactData.phone.replace(/\s/g, '')}`}
                    className="font-medium text-secondary-container hover:underline"
                  >
                    {enrollment.contactData.phone}
                  </a>
                </dd>
              </div>
              {!enrollment.isGuest && enrollment.userEmail && enrollment.userEmail !== enrollment.contactData.email && (
                <div>
                  <dt className="text-on-surface-variant">E-mail konta</dt>
                  <dd className="font-medium">{enrollment.userEmail}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="bg-surface-container-low rounded-xl p-4 space-y-3">
            <h3 className="text-label-md font-bold text-primary">Uczestnik</h3>
            <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-on-surface-variant">Imię i nazwisko</dt>
                <dd className="font-medium text-primary">
                  {enrollment.participantData.firstName} {enrollment.participantData.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Klasa</dt>
                <dd className="font-medium">{enrollment.participantData.studentClass}</dd>
              </div>
              {birthDate && (
                <div>
                  <dt className="text-on-surface-variant">Data urodzenia</dt>
                  <dd className="font-medium">{birthDate}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="bg-surface-container-low rounded-xl p-4 space-y-3">
            <h3 className="text-label-md font-bold text-primary">
              Wybrane zajęcia ({enrollment.selectedCourses.length})
            </h3>
            <ul className="space-y-3">
              {enrollment.selectedCourses.map((c) => (
                <li key={c.courseId} className="bg-white rounded-lg border p-3 text-sm">
                  <p className="font-bold text-primary">{c.title}</p>
                  <p className="text-on-surface-variant mt-1">
                    {c.dayOfWeek && c.startTime && c.endTime
                      ? `${c.dayOfWeek}, ${c.startTime}–${c.endTime}`
                      : 'Harmonogram: brak danych'}
                  </p>
                  {c.startDate && (
                    <p className="text-on-surface-variant">
                      Start: {new Date(c.startDate).toLocaleDateString('pl-PL')}
                    </p>
                  )}
                  <p className="font-medium text-primary mt-1">
                    {formatCoursePrice(c.price, c.currency)}
                  </p>
                </li>
              ))}
            </ul>
            {enrollment.selectedCourses.length > 1 && (
              <p className="text-sm font-bold text-primary border-t pt-3">
                Suma: {formatCoursePrice(totalPrice, currency)}
              </p>
            )}
          </section>

          {enrollment.contactData.message?.trim() && (
            <section className="bg-surface-container-low rounded-xl p-4 space-y-2">
              <h3 className="text-label-md font-bold text-primary">Wiadomość od rodzica</h3>
              <p className="text-sm whitespace-pre-wrap">{enrollment.contactData.message}</p>
            </section>
          )}

          <section className="text-label-sm text-on-surface-variant space-y-1">
            <p>
              Regulamin: {enrollment.agreements.termsAccepted ? 'zaakceptowany' : 'brak'} · RODO:{' '}
              {enrollment.agreements.rodoAccepted ? 'zaakceptowane' : 'brak'}
            </p>
            {enrollment.adminNote && (
              <p>
                Poprzednia notatka: <span className="text-primary">{enrollment.adminNote}</span>
              </p>
            )}
          </section>

          <Field label="Notatka admina">
            <textarea className={inputClass} rows={3} value={note} onChange={(e) => onNoteChange(e.target.value)} />
          </Field>

          <div>
            <p className="text-label-md font-medium text-primary mb-2">Zmień status</p>
            <div className="flex flex-wrap gap-2">
              {(['sent', 'in_contact', 'confirmed', 'rejected', 'cancelled'] as EnrollmentStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    enrollment.status === s
                      ? 'bg-secondary-container text-on-secondary'
                      : 'bg-surface-container-low hover:bg-primary-container'
                  }`}
                >
                  {ENROLLMENT_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t">
            <a
              href={`mailto:${enrollment.contactData.email}`}
              className="text-sm font-medium text-secondary-container hover:underline"
            >
              Wyślij e-mail
            </a>
            <a
              href={`tel:${enrollment.contactData.phone.replace(/\s/g, '')}`}
              className="text-sm font-medium text-secondary-container hover:underline"
            >
              Zadzwoń
            </a>
            <button type="button" onClick={onClose} className="text-sm text-primary font-medium ml-auto">
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminEnrollmentsPage() {
  const { allItems: enrollments } = useFirestoreCollection(enrollmentsService.subscribe)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const filtered = statusFilter
    ? enrollments.filter((e) => e.status === statusFilter)
    : enrollments

  const selectedEnrollment = enrollments.find((e) => e.id === selected)

  const updateStatus = async (id: string, status: EnrollmentStatus) => {
    await enrollmentsService.updateStatus(id, status, note || undefined)
    const enrollment = enrollments.find((e) => e.id === id)
    if (enrollment) {
      for (const c of enrollment.selectedCourses) {
        await syncCourseSeats(c.courseId)
      }
    }
    const related = await messagesService.getAll()
    const msg = related.find((m) => m.relatedEnrollmentId === id)
    if (msg) {
      const msgStatus =
        status === 'confirmed' ? 'confirmed' : status === 'rejected' ? 'rejected' : status === 'in_contact' ? 'in_contact' : 'read'
      await messagesService.updateStatus(msg.id, msgStatus as 'confirmed', note || undefined)
    }
    setSelected(null)
    setNote('')
  }

  return (
    <div>
      <AdminPageHeader title="Zgłoszenia" description="Zarządzaj zapisami na zajęcia" />

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Wszystkie statusy</option>
          {Object.entries(ENROLLMENT_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((e) => (
          <div key={e.id} className="bg-white border rounded-xl p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-bold text-primary">{e.userName}</p>
                <p className="text-sm text-on-surface-variant">
                  {e.userEmail} · {e.contactData.phone} · {new Date(e.createdAt).toLocaleString('pl-PL')}
                  {e.isGuest && ' · gość'}
                </p>
                <ul className="text-sm mt-2">
                  {e.selectedCourses.map((c) => (
                    <li key={c.courseId}>• {c.title}</li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <span className="text-label-sm font-bold px-3 py-1 rounded-full bg-primary-container">
                  {ENROLLMENT_STATUS_LABELS[e.status]}
                </span>
                <button type="button" onClick={() => { setSelected(e.id); setNote(e.adminNote ?? '') }} className="block mt-2 text-primary text-sm font-medium">
                  Szczegóły / status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEnrollment && (
        <EnrollmentDetailModal
          enrollment={selectedEnrollment}
          note={note}
          onNoteChange={setNote}
          onStatusChange={(status) => updateStatus(selectedEnrollment.id, status)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
