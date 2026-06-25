import { useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../icons'
import type { Course } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useModalAccessibility } from '../../hooks/useModalAccessibility'
import {
  formatCoursePrice,
  availabilityLabel,
  isCourseBookable,
  courseToSelectedCourse,
} from '../../lib/courseUtils'

const EnrollmentForm = lazy(() => import('./EnrollmentForm'))

type ModalView = 'details' | 'guest-form' | 'success'

export default function CourseModal({
  course,
  onClose,
}: {
  course: Course
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { user, isAdmin, signInWithGoogle } = useAuth()
  const { addCourse, hasCourse } = useCart()
  const [view, setView] = useState<ModalView>('details')
  const [cartMsg, setCartMsg] = useState('')
  const [loginMsg, setLoginMsg] = useState('')

  useModalAccessibility(true, onClose, dialogRef)

  const loggedIn = !!user && !isAdmin

  const bookable = isCourseBookable(course)
  const avail = availabilityLabel(course)
  const ongoing =
    course.status === 'active' || course.status === 'full'
      ? new Date(course.endDate) >= new Date()
      : false

  const handleAddToCart = async () => {
    if (!loggedIn) {
      setLoginMsg('Zaloguj się lub zarejestruj, aby dodać zajęcia do koszyka zapisów.')
      return
    }
    if (!course.allowCartEnrollment) {
      setCartMsg('Dla tych zajęć dostępny jest zapis bez konta.')
      return
    }
    const ok = await addCourse(course)
    if (ok) setCartMsg(hasCourse(course.id) ? 'Zajęcia są już w koszyku.' : 'Dodano do koszyka zapisów.')
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
      setLoginMsg('')
    } catch {
      setLoginMsg('Logowanie nie powiodło się.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="relative bg-surface-bright w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
      >
        <div className="sticky top-0 bg-surface-bright border-b border-outline-variant px-4 py-3 flex justify-between items-center z-10">
          <h2 id="course-modal-title" className="font-bold text-primary text-headline-sm pr-8 line-clamp-2">
            {course.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container-low min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Zamknij okno szczegółów zajęć"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {view === 'success' && (
            <div className="text-center py-8 space-y-4">
              <p className="text-headline-md font-bold text-primary">Dziękujemy!</p>
              <p className="text-body-md text-on-surface-variant">
                Twoje zgłoszenie zostało wysłane. Skontaktujemy się w celu potwierdzenia miejsca.
              </p>
              <button type="button" onClick={onClose} className="bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg min-h-[44px]">
                Zamknij
              </button>
            </div>
          )}

          {view === 'guest-form' && (
            <div>
              <h3 className="font-bold text-primary mb-4">Zapis bez konta</h3>
              <Suspense fallback={<p className="text-sm text-on-surface-variant">Ładowanie formularza…</p>}>
                <EnrollmentForm
                  courses={[courseToSelectedCourse(course)]}
                  userId={null}
                  isGuest={true}
                  userEmail=""
                  userName=""
                  messageType="enrollment"
                  onSuccess={() => setView('success')}
                  onCancel={() => setView('details')}
                />
              </Suspense>
            </div>
          )}

          {view === 'details' && (
            <>
              <p className="text-body-sm">
                <Link to={`/zajecia/${course.slug}`} className="text-secondary-container font-medium underline" onClick={onClose}>
                  Otwórz pełną stronę zajęć
                </Link>
              </p>

              {avail && (
                <div
                  className={`rounded-xl px-4 py-3 font-bold text-center ${
                    course.seatsAvailable === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {avail}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-md">
                <Detail label="Przedmiot" value={course.subject} />
                <Detail label="Poziom" value={course.level} />
                <Detail label="Miejsce" value={course.location} />
                <Detail label="Dzień" value={course.dayOfWeek} />
                <Detail label="Godziny" value={`${course.startTime} – ${course.endTime}`} />
                <Detail label="Data rozpoczęcia" value={new Date(course.startDate).toLocaleDateString('pl-PL')} />
                <Detail label="Data zakończenia" value={new Date(course.endDate).toLocaleDateString('pl-PL')} />
                <Detail label="Liczba spotkań" value={String(course.lessonsCount)} />
                <Detail label="Cena" value={formatCoursePrice(course.price, course.currency)} />
                <Detail label="Limit miejsc" value={String(course.seatsLimit)} />
                <Detail label="Zajęte miejsca" value={String(course.seatsTaken)} />
                <Detail label="Wolne miejsca" value={String(course.seatsAvailable)} />
                <Detail label="Status" value={ongoing ? 'Zajęcia trwają' : 'Zakończone'} />
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">Opis</h3>
                <p className="text-body-md text-on-surface-variant whitespace-pre-wrap">{course.fullDescription}</p>
              </div>

              {course.termsUrl && (
                <p className="text-body-sm">
                  <a href={course.termsUrl} target="_blank" rel="noopener noreferrer" className="text-secondary-container font-medium underline">
                    Regulamin zajęć
                  </a>
                </p>
              )}

              <div className="space-y-3 pt-4 border-t border-outline-variant">
                {bookable && course.allowCartEnrollment && (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!bookable}
                    className="w-full bg-secondary-container text-on-secondary font-bold py-3 rounded-lg hover:bg-warm-orange-hover disabled:opacity-50 min-h-[44px]"
                  >
                    Dodaj do koszyka zapisów
                  </button>
                )}
                {cartMsg && <p className="text-body-sm text-primary text-center">{cartMsg}</p>}
                {loginMsg && !loggedIn && (
                  <p className="text-body-sm text-amber-800 bg-amber-50 rounded-lg p-3 text-center">{loginMsg}</p>
                )}

                {!loggedIn && bookable && course.allowGuestEnrollment && (
                  <button
                    type="button"
                    onClick={() => setView('guest-form')}
                    className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary-container/20 min-h-[44px]"
                  >
                    Zapisz się bez konta
                  </button>
                )}

                {!loggedIn && (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full border border-outline-variant font-bold py-3 rounded-lg hover:bg-surface-container-low flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      Zaloguj się / Zarejestruj
                    </button>
                    <p className="text-label-sm text-on-surface-variant text-center">
                      Logowanie przez Google lub e-mail i hasło.
                    </p>
                  </>
                )}

                {loggedIn && (
                  <Link
                    to="/koszyk"
                    className="block text-center text-secondary-container font-medium text-body-sm underline min-h-[44px]"
                    onClick={onClose}
                  >
                    Przejdź do koszyka zapisów
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-low rounded-lg px-3 py-2">
      <p className="text-label-sm text-on-surface-variant">{label}</p>
      <p className="font-medium text-primary">{value}</p>
    </div>
  )
}
