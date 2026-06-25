import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { formatCoursePrice } from '../lib/courseUtils'
import EnrollmentForm from '../components/courses/EnrollmentForm'
import type { SelectedCourse } from '../types'

export default function KoszykPage() {
  const { items, removeCourse, clear, totalPrice, count } = useCart()
  const { user, profile } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)

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

  const selectedCourses: SelectedCourse[] = items.map((i) => ({
    courseId: i.courseId,
    title: i.title,
    price: i.price,
    currency: i.currency,
    startDate: i.date,
    startTime: i.time.split('–')[0],
    endTime: i.time.split('–')[1],
  }))

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
            {items.map((item) => (
              <li key={item.courseId} className="bg-white border rounded-xl p-4 flex flex-wrap justify-between gap-3 items-center">
                <div>
                  <p className="font-bold text-primary">{item.title}</p>
                  <p className="text-sm text-on-surface-variant">{item.date} · {item.time}</p>
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
                className="bg-secondary-container text-on-secondary font-bold px-6 py-3 rounded-lg"
              >
                Przejdź do zgłoszenia
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="font-bold text-primary text-headline-sm mb-4">Formularz zgłoszenia</h2>
              <EnrollmentForm
                courses={selectedCourses}
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
