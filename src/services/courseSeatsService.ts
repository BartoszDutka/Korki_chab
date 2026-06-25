import type { Enrollment } from '../types'
import { countConfirmedSeatsForCourse, computeSeatsAvailable } from '../lib/courseUtils'
import { coursesService } from './coursesService'
import { getCollection } from './firestoreUtils'

export async function syncCourseSeats(courseId: string): Promise<void> {
  const enrollments = await getCollection<Enrollment>('enrollments')
  const confirmed = countConfirmedSeatsForCourse(enrollments, courseId)
  const course = (await coursesService.getAll()).find((c) => c.id === courseId)
  if (!course) return
  const seatsAvailable = computeSeatsAvailable(course.seatsLimit, confirmed)
  await coursesService.update(courseId, {
    seatsTaken: confirmed,
    seatsAvailable,
    updatedAt: new Date().toISOString(),
  })
}

export async function syncAllCourseSeats(): Promise<void> {
  const courses = await coursesService.getAll()
  for (const course of courses) {
    await syncCourseSeats(course.id)
  }
}
