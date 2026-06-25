import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { coursesService } from '../services/coursesService'
import { computeSeatsAvailable, formatCoursePrice, availabilityLabel, isCourseBookable, courseToSelectedCourse } from '../lib/courseUtils'
import { useSeo } from '../hooks/useSeo'
import PageLoader from '../components/PageLoader'
import EnrollmentForm from '../components/courses/EnrollmentForm'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function CourseDetailPage() {
  const { slug } = useParams()
  const { user, isAdmin, signInWithGoogle } = useAuth()
  const { addCourse } = useCart()
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [cartMsg, setCartMsg] = useState('')

  const { allItems: rawCourses, loading } = useFirestoreCollection(coursesService.subscribe)

  const course = useMemo(() => {
    const found = rawCourses.find((c) => c.slug === slug && c.visible)
    if (!found) return undefined
    const seatsAvailable = computeSeatsAvailable(found.seatsLimit, found.seatsTaken)
    return {
      ...found,
      seatsAvailable,
      status:
        found.status !== 'hidden' && found.status !== 'finished' && seatsAvailable === 0
          ? 'full'
          : found.status,
    }
  }, [rawCourses, slug])

  useSeo(
    course
      ? {
          title: course.title,
          description: `${course.shortDescription} — korepetycje Chabówka, ${course.subject}, ${course.level}.`,
          path: `/zajecia/${course.slug}`,
        }
      : { title: 'Zajęcia', path: '/zajecia' },
  )

  if (loading) return <PageLoader label="Ładowanie zajęć…" />

  if (!course) {
    return (
      <div className="py-20 text-center px-4">
        <h1 className="text-headline-lg font-bold text-primary mb-4">Nie znaleziono zajęć</h1>
        <Link to="/zajecia" className="text-secondary-container font-bold underline">
          Wróć do listy zajęć
        </Link>
      </div>
    )
  }

  const avail = availabilityLabel(course)
  const bookable = isCourseBookable(course)
  const loggedIn = !!user && !isAdmin

  const handleAddToCart = async () => {
    if (!loggedIn) {
      setCartMsg('Zaloguj się, aby dodać zajęcia do koszyka zapisów.')
      return
    }
    const ok = await addCourse(course)
    setCartMsg(ok ? 'Dodano do koszyka zapisów.' : 'Nie można dodać tych zajęć.')
  }

  return (
    <article className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
      <Link to="/zajecia" className="text-primary text-sm font-medium mb-6 inline-block">
        ← Wszystkie zajęcia
      </Link>

      {avail && (
        <p
          className={`mb-6 rounded-xl px-4 py-3 font-bold text-center ${
            course.seatsAvailable === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
          }`}
        >
          {avail}
        </p>
      )}

      <h1 className="text-display-lg-mobile md:text-headline-lg font-extrabold text-primary mb-4">
        {course.title}
      </h1>
      <p className="text-body-lg text-on-surface-variant mb-8">{course.fullDescription}</p>

      <section aria-labelledby="course-details-heading" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <h2 id="course-details-heading" className="sr-only">Szczegóły zajęć</h2>
        <Detail label="Przedmiot" value={course.subject} />
        <Detail label="Poziom" value={course.level} />
        <Detail label="Miejsce" value={course.location} />
        <Detail label="Termin" value={`${course.dayOfWeek}, ${course.startTime}–${course.endTime}`} />
        <Detail label="Cena" value={formatCoursePrice(course.price, course.currency)} />
        <Detail label="Wolne miejsca" value={`${course.seatsAvailable} / ${course.seatsLimit}`} />
      </section>

      {showGuestForm ? (
        <section aria-labelledby="enroll-heading" className="border rounded-2xl p-6">
          <h2 id="enroll-heading" className="font-bold text-primary mb-4">Zapis bez konta</h2>
          <EnrollmentForm
            courses={[courseToSelectedCourse(course)]}
            userId={null}
            isGuest={true}
            userEmail=""
            userName=""
            messageType="enrollment"
            onSuccess={() => setShowGuestForm(false)}
            onCancel={() => setShowGuestForm(false)}
          />
        </section>
      ) : (
        <section className="flex flex-col gap-3" aria-label="Akcje zapisu">
          {bookable && course.allowCartEnrollment && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-secondary-container text-on-secondary font-bold py-3 px-6 rounded-lg min-h-[44px]"
            >
              Dodaj do koszyka zapisów
            </button>
          )}
          {cartMsg && <p className="text-body-sm text-primary">{cartMsg}</p>}
          {loggedIn && (
            <Link
              to="/koszyk"
              className="text-secondary-container font-medium text-body-sm underline min-h-[44px] inline-flex items-center"
            >
              Przejdź do koszyka zapisów
            </Link>
          )}
          {!loggedIn && bookable && course.allowGuestEnrollment && (
            <button
              type="button"
              onClick={() => setShowGuestForm(true)}
              className="w-full sm:w-auto border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg min-h-[44px]"
            >
              Zapisz się bez konta
            </button>
          )}
          {!loggedIn && (
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full sm:w-auto border border-outline-variant font-bold py-3 px-6 rounded-lg min-h-[44px]"
            >
              Zaloguj się / Zarejestruj (Google)
            </button>
          )}
        </section>
      )}
    </article>
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
