import type { Course, CourseStatus, Enrollment, EnrollmentStatus, SelectedCourse } from '../types'

const RESERVED_ENROLLMENT_STATUSES: EnrollmentStatus[] = ['sent', 'in_contact', 'confirmed']

export function countReservedSeatsForCourse(enrollments: Enrollment[], courseId: string): number {
  return enrollments.filter(
    (e) =>
      RESERVED_ENROLLMENT_STATUSES.includes(e.status) &&
      e.selectedCourses.some((c) => c.courseId === courseId),
  ).length
}

/** @deprecated Użyj countReservedSeatsForCourse — liczy też zgłoszenia wysłane i w kontakcie. */
export function countConfirmedSeatsForCourse(enrollments: Enrollment[], courseId: string): number {
  return countReservedSeatsForCourse(enrollments, courseId)
}

export function computeSeatsAvailable(seatsLimit: number, confirmedCount: number): number {
  return Math.max(0, seatsLimit - confirmedCount)
}

/** Ujednolica liczniki miejsc z dokumentu Firestore (bierze niższą wartość wolnych miejsc). */
export function normalizeCourseSeats(course: Course): Course {
  const seatsLimit = Number(course.seatsLimit ?? 0)
  const seatsTaken = Number(course.seatsTaken ?? 0)
  const fromTaken = computeSeatsAvailable(seatsLimit, seatsTaken)
  const storedAvailable = Number(course.seatsAvailable ?? fromTaken)
  const seatsAvailable = Math.min(fromTaken, storedAvailable)
  let status: CourseStatus = course.status
  if (status !== 'hidden' && status !== 'finished') {
    status = seatsAvailable <= 0 ? 'full' : 'active'
  }
  return { ...course, seatsLimit, seatsTaken, seatsAvailable, status }
}

export function normalizeCoursesSeats(courses: Course[]): Course[] {
  return courses.map(normalizeCourseSeats)
}

export function enrichCourseWithSeats(course: Course, confirmedCount: number): Course {
  const seatsAvailable = computeSeatsAvailable(course.seatsLimit, confirmedCount)
  const seatsTaken = confirmedCount
  let status: CourseStatus = course.status
  if (course.status !== 'hidden' && course.status !== 'finished') {
    status = seatsAvailable === 0 ? 'full' : 'active'
  }
  return { ...course, seatsTaken, seatsAvailable, status }
}

export function enrichCoursesWithSeats(courses: Course[], enrollments: Enrollment[]): Course[] {
  return courses.map((course) => {
    const reserved = countReservedSeatsForCourse(enrollments, course.id)
    return enrichCourseWithSeats(course, reserved)
  })
}

export function courseToSelectedCourse(course: Course): SelectedCourse {
  return {
    courseId: course.id,
    title: course.title,
    price: course.price,
    currency: course.currency,
    dayOfWeek: course.dayOfWeek,
    startTime: course.startTime,
    endTime: course.endTime,
    startDate: course.startDate,
  }
}

export function formatCoursePrice(price: number, currency: string): string {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(price)
}

export function isCourseBookable(course: Course): boolean {
  const c = normalizeCourseSeats(course)
  return c.visible && c.seatsAvailable > 0 && c.status === 'active'
}

export function availabilityLabel(course: Course): string | null {
  const c = normalizeCourseSeats(course)
  if (c.seatsAvailable <= 0) return 'Brak miejsc'
  if (c.seatsAvailable <= 2) return 'Ostatnie miejsca'
  return null
}
