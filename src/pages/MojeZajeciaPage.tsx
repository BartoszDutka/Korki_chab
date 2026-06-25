import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { enrollmentsService } from '../services/enrollmentsService'
import { useSeo } from '../hooks/useSeo'
import PageLoader from '../components/PageLoader'
import type { Enrollment } from '../types'
import { ENROLLMENT_STATUS_LABELS } from '../types'

type Tab = 'all' | 'confirmed' | 'contact'

export default function MojeZajeciaPage() {
  const { user, profile } = useAuth()
  const [tab, setTab] = useState<Tab>('all')
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useSeo({
    title: 'Moje zajęcia',
    description: 'Panel ucznia — status zgłoszeń na zajęcia w Centrum Korepetycji Chabówka.',
    path: '/moje-zajecia',
  })

  useEffect(() => {
    if (!user) {
      setEnrollments([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsub = enrollmentsService.subscribeByUser(user.uid, (items) => {
      setEnrollments(items)
      setLoading(false)
    })
    return unsub
  }, [user])

  const filtered =
    tab === 'confirmed'
      ? enrollments.filter((e) => e.status === 'confirmed')
      : tab === 'contact'
        ? enrollments.filter((e) => e.status === 'in_contact' || e.status === 'sent')
        : enrollments

  const confirmedCount = enrollments.filter((e) => e.status === 'confirmed').length
  const contactCount = enrollments.filter((e) => e.status === 'in_contact' || e.status === 'sent').length

  return (
    <>
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-display-lg-mobile md:text-headline-lg font-extrabold text-primary">Moje zajęcia</h1>
          <p className="text-body-lg text-on-surface-variant mt-3 max-w-2xl">
            {profile
              ? `Cześć, ${profile.displayName || profile.email}! Tutaj sprawdzisz status swoich zgłoszeń i potwierdzone zajęcia.`
              : 'Tutaj sprawdzisz status swoich zgłoszeń i potwierdzone zajęcia.'}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/zajecia"
              className="inline-flex items-center justify-center bg-secondary-container text-on-secondary font-bold px-5 py-2.5 rounded-lg hover:bg-warm-orange-hover transition-colors text-sm"
            >
              Przeglądaj zajęcia
            </Link>
            <Link
              to="/koszyk"
              className="inline-flex items-center justify-center border-2 border-primary text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-surface-container-low transition-colors text-sm"
            >
              Koszyk zapisów
            </Link>
          </div>
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-8">
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'all' as Tab, label: 'Wszystkie zgłoszenia', count: enrollments.length },
              { id: 'confirmed' as Tab, label: 'Potwierdzone', count: confirmedCount },
              { id: 'contact' as Tab, label: 'W trakcie kontaktu', count: contactCount },
            ]).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                  tab === item.id
                    ? 'bg-secondary-container text-on-secondary font-bold'
                    : 'bg-surface-container-low text-primary hover:bg-surface-container'
                }`}
              >
                {item.label}
                {item.count > 0 && (
                  <span className="ml-1.5 text-xs opacity-90">({item.count})</span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <PageLoader label="Ładowanie zgłoszeń…" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 md:py-16 space-y-4 bg-white border border-outline-variant rounded-2xl px-6">
              <p className="text-headline-md font-bold text-primary">
                {tab === 'all' ? 'Brak zgłoszeń' : 'Brak zgłoszeń w tej kategorii'}
              </p>
              <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                {tab === 'all'
                  ? 'Nie masz jeszcze żadnych zgłoszeń. Wybierz zajęcia, dodaj je do koszyka i wyślij formularz zapisu.'
                  : 'Zmień filtr lub przejdź do dostępnych zajęć, aby złożyć nowe zgłoszenie.'}
              </p>
              <Link
                to="/zajecia"
                className="inline-block bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg min-h-[44px]"
              >
                Dostępne zajęcia
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((e) => (
                <li key={e.id} className="bg-white border border-outline-variant rounded-xl p-6 md:p-8 space-y-4 card-hover">
                  <div className="flex flex-wrap justify-between gap-3 items-start">
                    <div>
                      <p className="font-bold text-primary text-headline-md">
                        Zgłoszenie z {new Date(e.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                      <p className="text-label-sm text-on-surface-variant mt-1">
                        {e.selectedCourses.length} {e.selectedCourses.length === 1 ? 'zajęcie' : 'zajęcia'}
                      </p>
                    </div>
                    <span className="text-label-sm font-bold px-3 py-1.5 rounded-full bg-primary-container text-on-primary shrink-0">
                      {ENROLLMENT_STATUS_LABELS[e.status]}
                    </span>
                  </div>
                  <ul className="space-y-1 text-body-md text-primary">
                    {e.selectedCourses.map((c) => (
                      <li key={c.courseId} className="flex items-start gap-2">
                        <span className="text-secondary-container font-bold">•</span>
                        <span>{c.title}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-outline-variant grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm text-on-surface-variant">
                    <p>
                      <span className="font-medium text-primary">Uczestnik:</span>{' '}
                      {e.participantData.firstName} {e.participantData.lastName}, klasa {e.participantData.studentClass}
                    </p>
                    <p>
                      <span className="font-medium text-primary">Kontakt:</span>{' '}
                      {e.contactData.email} · {e.contactData.phone}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
