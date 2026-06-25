import type { CourseStatus } from '../types'
import type { Enrollment } from '../types'
import { countReservedSeatsForCourse, computeSeatsAvailable } from '../lib/courseUtils'
import { coursesService } from './coursesService'
import { getCollection } from './firestoreUtils'
import { getDb } from '../lib/firebase'

function courseStatusAfterReservation(seatsAvailable: number, current: CourseStatus): CourseStatus {
  if (current === 'hidden' || current === 'finished') return current
  return seatsAvailable === 0 ? 'full' : 'active'
}

export async function reserveCourseSeat(courseId: string): Promise<void> {
  const [{ doc, runTransaction }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const ref = doc(db, 'courses', courseId)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('course-not-found')
    const course = snap.data()
    const seatsLimit = Number(course.seatsLimit ?? 0)
    const seatsTaken = Number(course.seatsTaken ?? 0)
    const seatsAvailable = Number(
      course.seatsAvailable ?? computeSeatsAvailable(seatsLimit, seatsTaken),
    )
    if (seatsAvailable <= 0) throw new Error('course-full')
    const nextTaken = seatsTaken + 1
    const nextAvailable = seatsAvailable - 1
    tx.update(ref, {
      seatsTaken: nextTaken,
      seatsAvailable: nextAvailable,
      status: courseStatusAfterReservation(nextAvailable, course.status as CourseStatus),
      updatedAt: new Date().toISOString(),
    })
  })
}

export async function releaseCourseSeat(courseId: string): Promise<void> {
  const [{ doc, runTransaction }, db] = await Promise.all([import('firebase/firestore'), getDb()])
  const ref = doc(db, 'courses', courseId)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) return
    const course = snap.data()
    const seatsLimit = Number(course.seatsLimit ?? 0)
    const seatsTaken = Number(course.seatsTaken ?? 0)
    const seatsAvailable = Number(
      course.seatsAvailable ?? computeSeatsAvailable(seatsLimit, seatsTaken),
    )
    if (seatsTaken <= 0) return
    const nextTaken = seatsTaken - 1
    const nextAvailable = seatsAvailable + 1
    tx.update(ref, {
      seatsTaken: nextTaken,
      seatsAvailable: nextAvailable,
      status: courseStatusAfterReservation(nextAvailable, course.status as CourseStatus),
      updatedAt: new Date().toISOString(),
    })
  })
}

export async function reserveCourseSeats(courseIds: string[]): Promise<void> {
  const unique = [...new Set(courseIds)]
  for (const courseId of unique) {
    await reserveCourseSeat(courseId)
  }
}

export async function releaseCourseSeats(courseIds: string[]): Promise<void> {
  const unique = [...new Set(courseIds)]
  for (const courseId of unique) {
    await releaseCourseSeat(courseId)
  }
}

export async function syncCourseSeats(courseId: string): Promise<void> {
  const enrollments = await getCollection<Enrollment>('enrollments')
  const reserved = countReservedSeatsForCourse(enrollments, courseId)
  const course = (await coursesService.getAll()).find((c) => c.id === courseId)
  if (!course) return
  const seatsAvailable = computeSeatsAvailable(course.seatsLimit, reserved)
  const status = courseStatusAfterReservation(seatsAvailable, course.status)
  await coursesService.update(courseId, {
    seatsTaken: reserved,
    seatsAvailable,
    status,
    updatedAt: new Date().toISOString(),
  })
}

export async function syncAllCourseSeats(): Promise<void> {
  const courses = await coursesService.getAll()
  for (const course of courses) {
    await syncCourseSeats(course.id)
  }
}
