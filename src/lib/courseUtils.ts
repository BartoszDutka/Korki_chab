import type { Course, CourseStatus, Enrollment, SelectedCourse } from '../types'

export function countConfirmedSeatsForCourse(enrollments: Enrollment[], courseId: string): number {
  return enrollments.filter(
    (e) =>
      e.status === 'confirmed' &&
      e.selectedCourses.some((c) => c.courseId === courseId),
  ).length
}

export function computeSeatsAvailable(seatsLimit: number, confirmedCount: number): number {
  return Math.max(0, seatsLimit - confirmedCount)
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
    const confirmed = countConfirmedSeatsForCourse(enrollments, course.id)
    return enrichCourseWithSeats(course, confirmed)
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
  return course.visible && course.seatsAvailable > 0 && course.status !== 'finished' && course.status !== 'hidden'
}

export function availabilityLabel(course: Course): string | null {
  if (course.seatsAvailable === 0) return 'Brak miejsc'
  if (course.seatsAvailable <= 2) return 'Ostatnie miejsca'
  return null
}
