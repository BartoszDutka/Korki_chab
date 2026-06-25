import { useMemo, useState } from 'react'
import { useFirestoreCollection } from '../../hooks/useFirestore'
import { coursesService } from '../../services/coursesService'
import { enrollmentsService } from '../../services/enrollmentsService'
import { enrichCoursesWithSeats } from '../../lib/courseUtils'
import { slugify } from '../../lib/slugify'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass, ColorPickerField } from '../../components/admin/AdminUi'
import type { Course, CourseStatus } from '../../types'
import { COURSE_STATUS_LABELS } from '../../types'

const emptyCourse = (): Omit<Course, 'id'> => ({
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  subject: '',
  level: '',
  location: 'Chabówka',
  dayOfWeek: 'Poniedziałek',
  startTime: '16:00',
  endTime: '17:30',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  lessonsCount: 10,
  price: 0,
  currency: 'PLN',
  seatsLimit: 8,
  seatsTaken: 0,
  seatsAvailable: 8,
  status: 'active',
  allowGuestEnrollment: true,
  allowCartEnrollment: true,
  termsUrl: '',
  colorTag: '',
  order: 0,
  visible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export default function AdminCoursesPage() {
  const { allItems: rawCourses } = useFirestoreCollection(coursesService.subscribeAll)
  const { allItems: enrollments } = useFirestoreCollection(enrollmentsService.subscribe)
  const courses = useMemo(() => enrichCoursesWithSeats(rawCourses, enrollments), [rawCourses, enrollments])
  const [editing, setEditing] = useState<Partial<Course> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [filterCourseId, setFilterCourseId] = useState('')
  const { saving, message, run } = useAdminSave()

  const courseEnrollments = filterCourseId
    ? enrollments.filter((e) => e.selectedCourses.some((c) => c.courseId === filterCourseId))
    : []

  const openNew = () => {
    setEditing(emptyCourse())
    setIsNew(true)
  }

  const save = () => {
    if (!editing) return
    run(async () => {
      const data = {
        ...editing,
        slug: editing.slug || slugify(editing.title ?? ''),
        updatedAt: new Date().toISOString(),
      } as Course
      if (isNew) {
        data.createdAt = new Date().toISOString()
        await coursesService.add(data as Omit<Course, 'id'>)
      } else if (editing.id) {
        await coursesService.update(editing.id, data)
      }
      setEditing(null)
    })
  }

  const remove = (id: string) => {
    if (!confirm('Usunąć zajęcia?')) return
    run(() => coursesService.delete(id))
  }

  return (
    <div>
      <AdminPageHeader title="Zajęcia" description="Zarządzaj ofertą zajęć i limitami miejsc" />
      <button type="button" onClick={openNew} className="mb-6 bg-secondary-container text-on-secondary px-4 py-2 rounded-lg font-bold text-sm">
        Dodaj zajęcia
      </button>
      {message && <p className="mb-4 text-sm text-primary">{message}</p>}

      <div className="space-y-3 mb-8">
        {courses.map((c) => (
          <div key={c.id} className="bg-white border rounded-xl p-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-bold text-primary">{c.title}</p>
              <p className="text-sm text-on-surface-variant">
                {c.dayOfWeek} {c.startTime} · {formatCoursePrice(c.price, c.currency)} · miejsca: {c.seatsTaken}/{c.seatsLimit} (wolne: {c.seatsAvailable}) · {COURSE_STATUS_LABELS[c.status]}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button type="button" onClick={() => { setEditing(c); setIsNew(false) }} className="text-primary text-sm font-medium">Edytuj</button>
              <button type="button" onClick={() => setFilterCourseId(c.id)} className="text-primary text-sm font-medium">Zgłoszenia</button>
              <button type="button" onClick={() => remove(c.id)} className="text-red-600 text-sm font-medium">Usuń</button>
            </div>
          </div>
        ))}
      </div>

      {filterCourseId && (
        <div className="bg-surface-container-low rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-primary">Zgłoszenia do zajęć</h2>
            <button type="button" onClick={() => setFilterCourseId('')} className="text-sm text-primary">Zamknij</button>
          </div>
          {courseEnrollments.length === 0 ? (
            <p className="text-on-surface-variant text-sm">Brak zgłoszeń.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {courseEnrollments.map((e) => (
                <li key={e.id} className="bg-white rounded-lg p-3 border">
                  {e.userName} · {e.status} · {new Date(e.createdAt).toLocaleDateString('pl-PL')}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {editing && (
        <div className="bg-white border rounded-xl p-6 space-y-4 max-w-3xl">
          <Field label="Nazwa zajęć">
            <input
              className={inputClass}
              value={editing.title ?? ''}
              onChange={(e) => {
                const title = e.target.value
                const next: Partial<Course> = { ...editing, title }
                if (isNew || !editing.slug?.trim()) {
                  next.slug = slugify(title)
                }
                setEditing(next)
              }}
            />
          </Field>
          <Field label="Slug (adres URL)">
            <input className={inputClass} value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            <p className="text-label-sm text-on-surface-variant mt-1">
              Krótki identyfikator w linku, np. <span className="font-mono">fizyka-matura</span> → strona{' '}
              <span className="font-mono">/zajecia/fizyka-matura</span>. Jeśli zostawisz puste, wygeneruje się z nazwy.
            </p>
          </Field>
          <Field label="Opis krótki">
            <textarea className={inputClass} rows={2} value={editing.shortDescription ?? ''} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} />
          </Field>
          <Field label="Opis pełny">
            <textarea className={inputClass} rows={4} value={editing.fullDescription ?? ''} onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Przedmiot">
              <input className={inputClass} value={editing.subject ?? ''} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
            </Field>
            <Field label="Poziom">
              <input className={inputClass} value={editing.level ?? ''} onChange={(e) => setEditing({ ...editing, level: e.target.value })} />
            </Field>
            <Field label="Miejsce">
              <input className={inputClass} value={editing.location ?? ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
            </Field>
            <Field label="Dzień tygodnia">
              <input className={inputClass} value={editing.dayOfWeek ?? ''} onChange={(e) => setEditing({ ...editing, dayOfWeek: e.target.value })} />
            </Field>
            <Field label="Godzina start">
              <input className={inputClass} value={editing.startTime ?? ''} onChange={(e) => setEditing({ ...editing, startTime: e.target.value })} />
            </Field>
            <Field label="Godzina koniec">
              <input className={inputClass} value={editing.endTime ?? ''} onChange={(e) => setEditing({ ...editing, endTime: e.target.value })} />
            </Field>
            <Field label="Data start">
              <input type="date" className={inputClass} value={editing.startDate?.slice(0, 10) ?? ''} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} />
            </Field>
            <Field label="Data koniec">
              <input type="date" className={inputClass} value={editing.endDate?.slice(0, 10) ?? ''} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
            </Field>
            <Field label="Liczba spotkań">
              <input type="number" className={inputClass} value={editing.lessonsCount ?? 0} onChange={(e) => setEditing({ ...editing, lessonsCount: Number(e.target.value) })} />
            </Field>
            <Field label="Cena">
              <input type="number" className={inputClass} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
            </Field>
            <Field label="Waluta">
              <input className={inputClass} value={editing.currency ?? 'PLN'} onChange={(e) => setEditing({ ...editing, currency: e.target.value })} />
            </Field>
            <Field label="Limit miejsc">
              <input type="number" className={inputClass} value={editing.seatsLimit ?? 0} onChange={(e) => setEditing({ ...editing, seatsLimit: Number(e.target.value) })} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={editing.status ?? 'active'} onChange={(e) => setEditing({ ...editing, status: e.target.value as CourseStatus })}>
                {Object.entries(COURSE_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </Field>
            <Field label="Kolejność na liście">
              <input type="number" className={inputClass} value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
              <p className="text-label-sm text-on-surface-variant mt-1">Mniejsza liczba = wyżej na stronie Zajęcia (0 jest na górze).</p>
            </Field>
          </div>
          <Field label="Link regulaminu">
            <input className={inputClass} value={editing.termsUrl ?? ''} onChange={(e) => setEditing({ ...editing, termsUrl: e.target.value })} />
          </Field>
          <Field label="Kolor karty (opcjonalnie)">
            <ColorPickerField
              value={editing.colorTag ?? ''}
              onChange={(colorTag) => setEditing({ ...editing, colorTag })}
            />
            <p className="text-label-sm text-on-surface-variant mt-1">Kolorowa linia u góry karty zajęć na stronie publicznej.</p>
          </Field>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
            Widoczne na stronie
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editing.allowGuestEnrollment ?? true} onChange={(e) => setEditing({ ...editing, allowGuestEnrollment: e.target.checked })} />
            Zapis bez konta
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editing.allowCartEnrollment ?? true} onChange={(e) => setEditing({ ...editing, allowCartEnrollment: e.target.checked })} />
            Koszyk zapisów
          </label>
          <div className="flex gap-3">
            <SaveButton onClick={save} saving={saving} />
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg">Anuluj</button>
          </div>
        </div>
      )}
    </div>
  )
}

function formatCoursePrice(price: number, currency: string) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(price)
}
