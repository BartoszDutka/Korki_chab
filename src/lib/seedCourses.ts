import { collection, addDoc, getDocs, doc, updateDoc, type Firestore } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import type { Course } from '../types'

const now = () => new Date().toISOString()

export const SAMPLE_COURSES: Omit<Course, 'id'>[] = [
  {
    title: 'Matematyka — przygotowanie do egzaminu ósmoklasisty',
    slug: 'matematyka-egzamin-osmoklasisty',
    shortDescription: 'Systematyczne przygotowanie do egzaminu ósmoklasisty z matematyki.',
    fullDescription:
      'Zajęcia skupiają się na zadaniach otwartych i zamkniętych, analizie błędów i strategiach rozwiązywania. Małe grupy do 8 osób, indywidualne wsparcie i regularne arkusze próbne.\n\n' +
      'Omawiamy typowe schematy zadań, uczymy pracy z czasem i budujemy pewność przed egzaminem.',
    subject: 'Matematyka',
    level: 'Szkoła podstawowa',
    location: 'Chabówka',
    dayOfWeek: 'Wtorek',
    startTime: '16:00',
    endTime: '17:30',
    startDate: '2026-09-01',
    endDate: '2026-04-30',
    lessonsCount: 24,
    price: 120,
    currency: 'PLN',
    seatsLimit: 8,
    seatsTaken: 0,
    seatsAvailable: 8,
    status: 'active',
    allowGuestEnrollment: true,
    allowCartEnrollment: true,
    order: 0,
    visible: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    title: 'Język angielski — korepetycje dla szkoły podstawowej',
    slug: 'angielski-szkola-podstawowa',
    shortDescription: 'Gramatyka, czytanie ze zrozumieniem i konwersacje dla uczniów SP.',
    fullDescription:
      'Pracujemy z podręcznikami szkolnych, uzupełniamy zaległości i budujemy pewność w mówieniu. Elastyczny grafik, małe grupy.\n\n' +
      'Zajęcia łączą ćwiczenia pisemne z konwersacjami — uczniowie uczą się swobodnie korzystać z języka w codziennych sytuacjach.',
    subject: 'Język angielski',
    level: 'Szkoła podstawowa',
    location: 'Chabówka',
    dayOfWeek: 'Środa',
    startTime: '17:00',
    endTime: '18:00',
    startDate: '2026-09-01',
    endDate: '2026-05-31',
    lessonsCount: 30,
    price: 90,
    currency: 'PLN',
    seatsLimit: 6,
    seatsTaken: 0,
    seatsAvailable: 6,
    status: 'active',
    allowGuestEnrollment: true,
    allowCartEnrollment: true,
    order: 1,
    visible: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    title: 'Matematyka — matura podstawowa',
    slug: 'matematyka-matura-podstawowa',
    shortDescription: 'Przygotowanie do matury podstawowej z matematyki.',
    fullDescription:
      'Zadania maturalne z poprzednich lat, arkusze próbne, omówienie typowych schematów. Dla uczniów liceum i technikum.\n\n' +
      'Systematycznie przechodzimy przez wszystkie obszary wymagane na maturze i uczymy strategii punktowania na zadaniach otwartych.',
    subject: 'Matematyka',
    level: 'Szkoła średnia',
    location: 'Chabówka',
    dayOfWeek: 'Czwartek',
    startTime: '18:00',
    endTime: '19:30',
    startDate: '2026-09-15',
    endDate: '2026-05-15',
    lessonsCount: 28,
    price: 140,
    currency: 'PLN',
    seatsLimit: 10,
    seatsTaken: 0,
    seatsAvailable: 10,
    status: 'active',
    allowGuestEnrollment: true,
    allowCartEnrollment: true,
    order: 2,
    visible: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    title: 'Język polski — pomoc w bieżącej nauce',
    slug: 'polski-biezaca-nauka',
    shortDescription: 'Wsparcie w lekturach, wypracowaniach i przygotowaniu do sprawdzianów.',
    fullDescription:
      'Analiza tekstów, pisemne formy wypowiedzi, przygotowanie do egzaminu ósmoklasisty i matury. Indywidualne podejście w małej grupie.\n\n' +
      'Pomagamy w interpretacji lektur, budowaniu argumentacji i poprawnej strukturze wypracowań.',
    subject: 'Język polski',
    level: 'Wszystkie poziomy',
    location: 'Chabówka',
    dayOfWeek: 'Piątek',
    startTime: '16:30',
    endTime: '17:30',
    startDate: '2026-09-01',
    endDate: '2026-05-31',
    lessonsCount: 26,
    price: 100,
    currency: 'PLN',
    seatsLimit: 8,
    seatsTaken: 0,
    seatsAvailable: 8,
    status: 'active',
    allowGuestEnrollment: true,
    allowCartEnrollment: true,
    order: 3,
    visible: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    title: 'Chemia — przygotowanie do matury',
    slug: 'chemia-matura',
    shortDescription: 'Zadania maturalne, wzory i obliczenia — poziom podstawowy i rozszerzony.',
    fullDescription:
      'Kurs dla uczniów liceum i technikum przygotowujących się do matury z chemii. Omawiamy zadania teoretyczne i obliczeniowe, schematy reakcji i typowe błędy.\n\n' +
      'Pracujemy na arkuszach z poprzednich lat i uczymy efektywnej strategii rozwiązywania zadań maturalnych.',
    subject: 'Chemia',
    level: 'Szkoła średnia',
    location: 'Chabówka',
    dayOfWeek: 'Poniedziałek',
    startTime: '17:30',
    endTime: '19:00',
    startDate: '2026-09-01',
    endDate: '2026-05-20',
    lessonsCount: 26,
    price: 130,
    currency: 'PLN',
    seatsLimit: 8,
    seatsTaken: 0,
    seatsAvailable: 8,
    status: 'active',
    allowGuestEnrollment: true,
    allowCartEnrollment: true,
    order: 4,
    visible: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    title: 'Matematyka — wzmacnianie dla klasy 7',
    slug: 'matematyka-klasa-7',
    shortDescription: 'Mała grupa 4-osobowa — bieżący materiał szkolny i sprawdziany.',
    fullDescription:
      'Zajęcia dla uczniów klasy 7, którzy chcą poprawić wyniki i zrozumieć trudne tematy z matematyki. Grupa max 4 osoby.\n\n' +
      'Skupiamy się na zadaniach tekstowych, geometrii i algebrze — zgodnie z bieżącym programem szkoły.',
    subject: 'Matematyka',
    level: 'Szkoła podstawowa',
    location: 'Chabówka',
    dayOfWeek: 'Wtorek',
    startTime: '15:00',
    endTime: '16:00',
    startDate: '2026-09-01',
    endDate: '2026-05-31',
    lessonsCount: 30,
    price: 85,
    currency: 'PLN',
    seatsLimit: 4,
    seatsTaken: 0,
    seatsAvailable: 4,
    status: 'active',
    allowGuestEnrollment: true,
    allowCartEnrollment: true,
    order: 5,
    visible: true,
    createdAt: now(),
    updatedAt: now(),
  },
]

export async function seedCoursesData(firestore?: Firestore): Promise<number> {
  const db = firestore ?? (await getDb())
  const snap = await getDocs(collection(db, 'courses'))
  const existing = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course))
  const bySlug = new Map(existing.map((c) => [c.slug, c]))

  let changed = 0

  for (const sample of SAMPLE_COURSES) {
    const found = bySlug.get(sample.slug)
    if (found) {
      const needsPublish =
        !found.visible ||
        found.status === 'hidden' ||
        found.status === 'finished'
      if (needsPublish) {
        await updateDoc(doc(db, 'courses', found.id), {
          visible: true,
          status: 'active',
          updatedAt: now(),
        })
        changed += 1
      }
      continue
    }
    await addDoc(collection(db, 'courses'), sample)
    changed += 1
  }

  return changed
}
