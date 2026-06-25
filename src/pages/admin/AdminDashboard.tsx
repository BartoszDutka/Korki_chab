import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFirestoreDoc, useFirestoreCollection } from '../../hooks/useFirestore'
import { settingsService } from '../../services/settingsService'
import { postsService } from '../../services/postsService'
import { subjectsService } from '../../services/subjectsService'
import { testimonialsService } from '../../services/testimonialsService'
import { enrollmentsService } from '../../services/enrollmentsService'
import { messagesService } from '../../services/messagesService'
import { coursesService } from '../../services/coursesService'
import { seedInitialData } from '../../lib/seedData'
import { seedCoursesData } from '../../lib/seedCourses'
import { seedPostsData } from '../../lib/seedPosts'

export default function AdminDashboard() {
  const { data: settings } = useFirestoreDoc(settingsService.subscribe)
  const { allItems: posts } = useFirestoreCollection(postsService.subscribeAll)
  const { allItems: subjects } = useFirestoreCollection(subjectsService.subscribe)
  const { allItems: testimonials } = useFirestoreCollection(testimonialsService.subscribe)
  const { allItems: enrollments } = useFirestoreCollection(enrollmentsService.subscribe)
  const { allItems: messages } = useFirestoreCollection(messagesService.subscribe)
  const { allItems: courses } = useFirestoreCollection(coursesService.subscribeAll)
  const [seedMsg, setSeedMsg] = useState('')
  const [seeding, setSeeding] = useState(false)

  const published = posts.filter((p) => p.status === 'published').length
  const drafts = posts.filter((p) => p.status === 'draft').length
  const newMessages = messagesService.countNew(messages)
  const pendingEnrollments = enrollments.filter((e) => e.status === 'sent' || e.status === 'in_contact').length
  const recentMessages = messages.slice(0, 5)

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const created = await seedInitialData()
      setSeedMsg(created ? 'Dane przykładowe zostały utworzone.' : 'Baza już zawiera dane — seed pominięty.')
    } catch {
      setSeedMsg('Błąd seedowania. Sprawdź reguły Firestore i połączenie.')
    } finally {
      setSeeding(false)
    }
  }

  const handleSeedCourses = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const count = await seedCoursesData()
      setSeedMsg(count > 0 ? `Dodano lub opublikowano ${count} zajęć.` : 'Wszystkie przykładowe zajęcia są już w bazie.')
    } catch {
      setSeedMsg('Błąd tworzenia zajęć.')
    } finally {
      setSeeding(false)
    }
  }

  const handleSeedPosts = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const count = await seedPostsData()
      setSeedMsg(count > 0 ? `Dodano lub opublikowano ${count} aktualności.` : 'Wszystkie przykładowe aktualności są już w bazie.')
    } catch {
      setSeedMsg('Błąd tworzenia aktualności.')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-lg font-bold text-primary">Dashboard</h1>
        <p className="text-body-md text-on-surface-variant">
          {settings?.siteName ?? 'Centrum Chabówka'} — zarządzanie treścią
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Nowe wiadomości" value={newMessages} />
        <StatCard label="Zgłoszenia do kontaktu" value={pendingEnrollments} />
        <StatCard label="Zajęcia" value={courses.length} />
        <StatCard label="Opublikowane aktualności" value={published} />
      </div>

      {recentMessages.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-bold text-primary mb-4">Ostatnie wiadomości</h2>
          <ul className="space-y-2 text-sm">
            {recentMessages.map((m) => (
              <li key={m.id} className="flex justify-between gap-2">
                <span>{m.subject} — {m.userName}</span>
                <span className="text-on-surface-variant">{new Date(m.createdAt).toLocaleDateString('pl-PL')}</span>
              </li>
            ))}
          </ul>
          <Link to="/admin/messages" className="inline-block mt-4 text-secondary-container font-medium text-sm">
            Przejdź do skrzynki →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/messages" className="bg-secondary-container text-on-secondary px-4 py-2 rounded-lg font-bold text-sm">
          Skrzynka ({newMessages})
        </Link>
        <Link to="/admin/enrollments" className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-bold text-sm">
          Zgłoszenia ({pendingEnrollments})
        </Link>
        <Link to="/admin/courses" className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-bold text-sm">
          Zarządzaj zajęciami
        </Link>
        <Link to="/admin/posts" className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-bold text-sm">
          Dodaj aktualność
        </Link>
        <Link to="/" className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-bold text-sm">
          Edytuj stronę na żywo
        </Link>
        <button
          type="button"
          onClick={handleSeedPosts}
          disabled={seeding}
          className="border border-outline-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-low"
        >
          {seeding ? 'Tworzenie...' : 'Utwórz przykładowe aktualności'}
        </button>
        <button
          type="button"
          onClick={handleSeedCourses}
          disabled={seeding}
          className="border border-outline-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-low"
        >
          {seeding ? 'Tworzenie...' : 'Utwórz przykładowe zajęcia'}
        </button>
        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="border border-outline-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-low"
        >
          Utwórz dane przykładowe
        </button>
      </div>
      {seedMsg && <p className="text-body-md text-primary">{seedMsg}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-on-surface-variant">
        <p>Szkice aktualności: {drafts}</p>
        <p>Przedmioty: {subjects.length}</p>
        <p>Opinie: {testimonials.length}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6">
      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">{label}</p>
      <p className="text-display-lg-mobile font-extrabold text-primary">{value}</p>
    </div>
  )
}
