import { useMemo, useState } from 'react'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { coursesService } from '../services/coursesService'
import { computeSeatsAvailable } from '../lib/courseUtils'
import CourseCard from '../components/courses/CourseCard'
import CourseModal from '../components/courses/CourseModal'
import CourseFilters, { defaultCourseFilters, filterCourses } from '../components/courses/CourseFilters'
import type { Course } from '../types'
import { useSeo } from '../hooks/useSeo'
import PageLoader from '../components/PageLoader'

function withComputedSeats(courses: Course[]): Course[] {
  return courses.map((c) => ({
    ...c,
    seatsAvailable: computeSeatsAvailable(c.seatsLimit, c.seatsTaken),
    status:
      c.status !== 'hidden' && c.status !== 'finished' && computeSeatsAvailable(c.seatsLimit, c.seatsTaken) === 0
        ? 'full'
        : c.status === 'full' && computeSeatsAvailable(c.seatsLimit, c.seatsTaken) > 0
          ? 'active'
          : c.status,
  }))
}

export default function ZajeciaPage() {
  const { allItems: rawCourses, loading: coursesLoading } = useFirestoreCollection(coursesService.subscribe)
  const [filters, setFilters] = useState(defaultCourseFilters)
  const [selected, setSelected] = useState<Course | null>(null)

  const courses = useMemo(() => withComputedSeats(rawCourses), [rawCourses])

  const filtered = useMemo(() => filterCourses(courses, filters), [courses, filters])

  const subjects = [...new Set(courses.map((c) => c.subject))].sort()
  const levels = [...new Set(courses.map((c) => c.level))].sort()
  const days = [...new Set(courses.map((c) => c.dayOfWeek))].sort()

  useSeo({
    title: 'Dostępne zajęcia',
    description:
      'Zajęcia i kursy w Chabówce — matematyka, angielski, polski. Zapisz się online lub przez koszyk zapisów po logowaniu Google.',
    path: '/zajecia',
  })

  return (
    <>
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low text-center">
        <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary">Dostępne zajęcia</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4">
          Wybierz zajęcia, sprawdź szczegóły i zapisz się online — bez konta lub przez koszyk zapisów po logowaniu Google.
        </p>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-8">
          <CourseFilters
            filters={filters}
            onChange={setFilters}
            subjects={subjects}
            levels={levels}
            days={days}
          />

          {coursesLoading ? (
            <PageLoader label="Ładowanie zajęć…" />
          ) : rawCourses.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-body-md text-on-surface-variant">
                Obecnie brak opublikowanych zajęć w bazie.
              </p>
              <p className="text-body-sm text-on-surface-variant">
                Administrator może dodać zajęcia w panelu lub uruchomić seed przykładowych danych.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-on-surface-variant">
              Brak zajęć spełniających kryteria. Sprawdź filtry lub wróć później.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} onOpen={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
