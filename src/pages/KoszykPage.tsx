import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { coursesService } from '../services/coursesService'
import { formatCoursePrice, isCourseBookable, normalizeCourseSeats, normalizeCoursesSeats } from '../lib/courseUtils'
import EnrollmentForm from '../components/courses/EnrollmentForm'
import type { SelectedCourse } from '../types'

export default function KoszykPage() {
  const { items, removeCourse, clear, totalPrice, count } = useCart()
  const { user, profile } = useAuth()
  const { allItems: rawCourses } = useFirestoreCollection(coursesService.subscribe)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)

  const coursesById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof normalizeCourseSeats>>()
    for (const course of normalizeCoursesSeats(rawCourses)) {
      map.set(course.id, course)
    }
    return map
  }, [rawCourses])

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        item,
        course: coursesById.get(item.courseId),
        bookable: coursesById.get(item.courseId) ? isCourseBookable(coursesById.get(item.courseId)!) : false,
      })),
    [items, coursesById],
  )

  const hasUnbookableItems = cartItems.some((entry) => !entry.bookable)
  const bookableSelectedCourses: SelectedCourse[] = cartItems
    .filter((entry) => entry.bookable && entry.course)
    .map((entry) => ({
      courseId: entry.item.courseId,
      title: entry.item.title,
      price: entry.item.price,
      currency: entry.item.currency,
      startDate: entry.item.date,
      startTime: entry.item.time.split('–')[0],
      endTime: entry.item.time.split('–')[1],
    }))

  if (!user) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center space-y-4">
        <h1 className="text-headline-lg font-bold text-primary">Koszyk zapisów</h1>
        <p className="text-body-md text-on-surface-variant">
          Zaloguj się przez Google, aby dodać zajęcia do koszyka zapisów.
        </p>
        <Link to="/zaloguj" className="inline-block bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg">
          Zaloguj się
        </Link>
      </div>
    )
  }

  const currency = items[0]?.currency ?? 'PLN'

  if (success) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center space-y-4">
        <h1 className="text-headline-lg font-bold text-primary">Dziękujemy!</h1>
        <p className="text-body-md text-on-surface-variant">
          Twoje zgłoszenie zostało wysłane. Skontaktujemy się w celu potwierdzenia miejsca.
        </p>
        <Link to="/moje-zajecia" className="inline-block bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg">
          Moje zajęcia
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-8">
      <h1 className="text-headline-lg font-bold text-primary">Koszyk zapisów</h1>

      {count === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-body-md text-on-surface-variant">Koszyk jest pusty.</p>
          <Link to="/zajecia" className="inline-block bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg">
            Przejdź do dostępnych zajęć
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map(({ item, bookable }) => (
              <li
                key={item.courseId}
                className={`bg-white border rounded-xl p-4 flex flex-wrap justify-between gap-3 items-center ${
                  !bookable ? 'border-red-200 bg-red-50/40' : ''
                }`}
              >
                <div>
                  <p className="font-bold text-primary">{item.title}</p>
                  <p className="text-sm text-on-surface-variant">{item.date} · {item.time}</p>
                  {!bookable && (
                    <p className="text-sm font-medium text-red-700 mt-1">Brak wolnych miejsc — usuń z koszyka, aby kontynuować.</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary">{formatCoursePrice(item.price, item.currency)}</span>
                  <button type="button" onClick={() => removeCourse(item.courseId)} className="text-red-600 text-sm font-medium">
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-surface-container-low rounded-xl p-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-label-sm text-on-surface-variant">Wybrane zajęcia: {count}</p>
              <p className="text-headline-md font-bold text-primary">
                Suma orientacyjna: {formatCoursePrice(totalPrice, currency)}
              </p>
            </div>
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                disabled={hasUnbookableItems || bookableSelectedCourses.length === 0}
                className="bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Przejdź do zgłoszenia
              </button>
            )}
          </div>

          {hasUnbookableItems && !showForm && (
            <p className="text-body-sm text-red-700">
              Co najmniej jedne zajęcia w koszyku nie mają wolnych miejsc. Usuń je, aby wysłać zgłoszenie.
            </p>
          )}

          {showForm && bookableSelectedCourses.length > 0 && (
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="font-bold text-primary text-headline-sm mb-4">Formularz zgłoszenia</h2>
              <EnrollmentForm
                key={user.uid}
                courses={bookableSelectedCourses}
                userId={user.uid}
                isGuest={false}
                userEmail={profile?.email ?? user.email ?? ''}
                userName={profile?.displayName ?? ''}
                messageType="cartEnrollment"
                onSuccess={async () => {
                  await clear()
                  setSuccess(true)
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
