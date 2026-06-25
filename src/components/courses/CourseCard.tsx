import type { Course } from '../../types'
import { Link } from 'react-router-dom'
import {
  formatCoursePrice,
  availabilityLabel,
  isCourseBookable,
} from '../../lib/courseUtils'
import { COURSE_STATUS_LABELS } from '../../types'

export default function CourseCard({
  course,
  onOpen,
}: {
  course: Course
  onOpen: (course: Course) => void
}) {
  const avail = availabilityLabel(course)
  const bookable = isCourseBookable(course)

  return (
    <article
      className="bg-surface-bright border border-outline-variant rounded-2xl p-6 card-hover flex flex-col gap-4"
      style={course.colorTag ? { borderTopColor: course.colorTag, borderTopWidth: 4 } : undefined}
    >
      <div className="flex flex-wrap gap-2 items-start justify-between">
        <div>
          <p className="text-label-sm text-secondary-container font-medium">{course.subject}</p>
          <h2 className="text-headline-md font-semibold text-primary mt-1">{course.title}</h2>
        </div>
        {avail && (
          <span
            className={`text-label-sm font-bold px-3 py-1 rounded-full ${
              course.seatsAvailable === 0
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {avail}
          </span>
        )}
      </div>

      <p className="text-body-md text-on-surface-variant line-clamp-2">{course.shortDescription}</p>

      <ul className="text-body-sm text-on-surface-variant space-y-1">
        <li>{course.dayOfWeek} · {course.startTime}–{course.endTime}</li>
        <li>{course.location} · {course.level}</li>
        <li>{course.lessonsCount} spotkań · od {new Date(course.startDate).toLocaleDateString('pl-PL')}</li>
        <li>
          Wolne miejsca: <strong className="text-primary">{course.seatsAvailable}</strong> / {course.seatsLimit}
        </li>
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant">
        <p className="text-headline-sm font-bold text-primary">
          {formatCoursePrice(course.price, course.currency)}
        </p>
        <span className="text-label-sm text-on-surface-variant">
          {COURSE_STATUS_LABELS[course.status]}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(course)}
        className="w-full bg-secondary-container text-on-secondary font-bold py-3 rounded-lg hover:bg-warm-orange-hover transition-colors min-h-[44px]"
      >
        {bookable ? 'Szczegóły i zapisy' : 'Szczegóły'}
      </button>
      <Link
        to={`/zajecia/${course.slug}`}
        className="text-center text-sm text-secondary-container font-medium underline min-h-[44px] flex items-center justify-center"
      >
        Pełna strona zajęć
      </Link>
    </article>
  )
}
