import type { Course } from '../../types'

export interface CourseFiltersState {
  dayOfWeek: string
  subject: string
  level: string
  availability: string
  sort: 'date' | 'price' | 'title'
}

export const defaultCourseFilters: CourseFiltersState = {
  dayOfWeek: '',
  subject: '',
  level: '',
  availability: '',
  sort: 'date',
}

export default function CourseFilters({
  filters,
  onChange,
  subjects,
  levels,
  days,
}: {
  filters: CourseFiltersState
  onChange: (f: CourseFiltersState) => void
  subjects: string[]
  levels: string[]
  days: string[]
}) {
  const set = (key: keyof CourseFiltersState, value: string) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="bg-surface-container-low rounded-2xl p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <label className="block">
        <span className="text-label-sm font-medium text-on-surface-variant">Dzień</span>
        <select
          className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-white"
          value={filters.dayOfWeek}
          onChange={(e) => set('dayOfWeek', e.target.value)}
        >
          <option value="">Wszystkie</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-label-sm font-medium text-on-surface-variant">Przedmiot</span>
        <select
          className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-white"
          value={filters.subject}
          onChange={(e) => set('subject', e.target.value)}
        >
          <option value="">Wszystkie</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-label-sm font-medium text-on-surface-variant">Poziom</span>
        <select
          className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-white"
          value={filters.level}
          onChange={(e) => set('level', e.target.value)}
        >
          <option value="">Wszystkie</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-label-sm font-medium text-on-surface-variant">Dostępność</span>
        <select
          className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-white"
          value={filters.availability}
          onChange={(e) => set('availability', e.target.value)}
        >
          <option value="">Wszystkie</option>
          <option value="available">Dostępne</option>
          <option value="last">Ostatnie miejsca</option>
          <option value="full">Brak miejsc</option>
        </select>
      </label>
      <label className="block">
        <span className="text-label-sm font-medium text-on-surface-variant">Sortowanie</span>
        <select
          className="mt-1 w-full border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-white"
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value as CourseFiltersState['sort'])}
        >
          <option value="date">Termin</option>
          <option value="price">Cena</option>
          <option value="title">Nazwa</option>
        </select>
      </label>
    </div>
  )
}

export function filterCourses(courses: Course[], filters: CourseFiltersState): Course[] {
  let result = courses.filter((c) => c.visible && c.status !== 'hidden')

  if (filters.dayOfWeek) result = result.filter((c) => c.dayOfWeek === filters.dayOfWeek)
  if (filters.subject) result = result.filter((c) => c.subject === filters.subject)
  if (filters.level) result = result.filter((c) => c.level === filters.level)
  if (filters.availability === 'available') result = result.filter((c) => c.seatsAvailable > 2)
  if (filters.availability === 'last') result = result.filter((c) => c.seatsAvailable > 0 && c.seatsAvailable <= 2)
  if (filters.availability === 'full') result = result.filter((c) => c.seatsAvailable === 0)

  if (filters.sort === 'date') {
    result.sort((a, b) => a.startDate.localeCompare(b.startDate))
  } else if (filters.sort === 'price') {
    result.sort((a, b) => a.price - b.price)
  } else {
    result.sort((a, b) => a.title.localeCompare(b.title))
  }

  return result
}
