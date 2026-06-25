import { collection, addDoc, getDocs, doc, updateDoc, type Firestore } from 'firebase/firestore'
import { db as defaultDb } from '../lib/firebase'
import type { Post } from '../types'

const now = () => new Date().toISOString()

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const SAMPLE_POSTS: Omit<Post, 'id'>[] = [
  {
    title: 'Ruszyły zapisy na korepetycje w Chabówce',
    slug: 'ruszyly-zapisy',
    excerpt: 'Zapraszamy uczniów szkoły podstawowej i średniej na korepetycje w naszym centrum.',
    content:
      'Od września ruszają zapisy na korepetycje w Chabówce. Oferujemy zajęcia indywidualne, w parach i małych grupach do 4 osób.\n\n' +
      'Przed rozpoczęciem kursu możesz umówić się na bezpłatną konsultację — omówimy poziom ucznia, cele i preferowany grafik. Zajęcia odbywają się w naszej placówce w Chabówce, w pobliżu Rabki-Zdrój i Nowego Targu.\n\n' +
      'Zapisz się przez formularz kontaktowy lub zadzwoń — odpowiemy w ciągu 24 godzin.',
    publishedAt: daysAgo(2),
    author: 'Centrum Chabówka',
    status: 'published',
    imageUrl: '',
    metaTitle: 'Zapisy na korepetycje Chabówka',
    metaDescription: 'Ruszyły zapisy na korepetycje w Chabówce — indywidualne, pary i małe grupy.',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    title: 'Przygotowanie do egzaminu ósmoklasisty — kursy wiosenne',
    slug: 'egzamin-osmoklasisty',
    excerpt: 'Intensywne kursy z matematyki, polskiego i angielskiego dla ósmoklasistów.',
    content:
      'Egzamin ósmoklasisty wymaga systematycznej pracy. W naszym centrum prowadzimy kursy przygotowawcze z matematyki, języka polskiego i angielskiego.\n\n' +
      'Pracujemy na arkuszach z poprzednich lat, analizujemy typowe błędy i uczymy strategii rozwiązywania zadań. Małe grupy pozwalają na indywidualne wsparcie każdego ucznia.\n\n' +
      'Harmonogram kursów i szczegóły zapisów znajdziesz w sekcji Zajęcia lub u nas w recepcji.',
    publishedAt: daysAgo(8),
    author: 'Centrum Chabówka',
    status: 'published',
    imageUrl: '',
    metaTitle: 'Przygotowanie do egzaminu ósmoklasisty | Chabówka',
    metaDescription: 'Kursy egzaminacyjne dla ósmoklasistów — matematyka, polski, angielski.',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },
  {
    title: 'Jak zaplanować naukę przed maturą?',
    slug: 'plan-nauki-matura',
    excerpt: 'Praktyczne wskazówki dla maturzystów — plan powtórek i arkusze próbne.',
    content:
      'Matura wymaga planu. Podziel materiał na etapy, regularnie rozwiązuj arkusze i nie odkładaj trudnych tematów na ostatni moment.\n\n' +
      'Nasi tutorzy pomogą Ci stworzyć indywidualny plan powtórek, dobierając tempo i zakres do Twoich celów — poziom podstawowy lub rozszerzony.\n\n' +
      'W centrum prowadzimy zajęcia z matematyki, polskiego, angielskiego, chemii i biologii. Zapytaj o kurs maturalny lub pojedyncze korepetycje.',
    publishedAt: daysAgo(14),
    author: 'Centrum Chabówka',
    status: 'published',
    imageUrl: '',
    metaTitle: 'Plan nauki przed maturą | Korepetycje Chabówka',
    metaDescription: 'Wskazówki dla maturzystów i kursy przygotowawcze w Chabówce.',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
  },
  {
    title: 'Nowe zajęcia grupowe — matematyka dla klasy 7',
    slug: 'matematyka-klasa-7-grupa',
    excerpt: 'Mała grupa 4-osobowa, wtorki 16:00 — wzmacnianie bieżącego materiału.',
    content:
      'Uruchomiliśmy nową grupę matematyki dla uczniów klasy 7. Zajęcia odbywają się we wtorki w godzinach 16:00–17:30.\n\n' +
      'Skupiamy się na bieżącym materiale szkolnego, przygotowaniu do sprawdzianów i budowaniu pewności w zadaniach tekstowych. Grupa jest mała — max 4 osoby.\n\n' +
      'Miejsca ograniczone. Zapisz się przez stronę w sekcji Zajęcia lub zadzwoń do nas.',
    publishedAt: daysAgo(21),
    author: 'Centrum Chabówka',
    status: 'published',
    imageUrl: '',
    metaTitle: 'Matematyka klasa 7 — grupa | Chabówka',
    metaDescription: 'Nowa grupa matematyki dla klasy 7 w Centrum Korepetycji Chabówka.',
    createdAt: daysAgo(21),
    updatedAt: daysAgo(21),
  },
  {
    title: 'Bezpłatna konsultacja przed rozpoczęciem kursu',
    slug: 'bezplatna-konsultacja',
    excerpt: 'Poznaj naszą metodę pracy i ustal plan nauki bez żadnych kosztów.',
    content:
      'Zanim zaczniesz regularne korepetycje, zapraszamy na bezpłatną konsultację. Podczas spotkania omówimy poziom ucznia, cele (poprawa ocen, egzamin, matura) i preferowaną formę zajęć.\n\n' +
      'Konsultacja trwa około 30 minut i nie wiąże się z obowiązkiem zapisu. To dobry sposób, aby poznać tutorów i atmosferę w naszej placówce.\n\n' +
      'Umów się telefonicznie lub przez formularz kontaktowy na stronie.',
    publishedAt: daysAgo(30),
    author: 'Centrum Chabówka',
    status: 'published',
    imageUrl: '',
    metaTitle: 'Bezpłatna konsultacja | Korepetycje Chabówka',
    metaDescription: 'Bezpłatna konsultacja przed rozpoczęciem korepetycji w Chabówce.',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
]

export async function seedPostsData(firestore: Firestore = defaultDb): Promise<number> {
  const snap = await getDocs(collection(firestore, 'posts'))
  const existing = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post))
  const bySlug = new Map(existing.map((p) => [p.slug, p]))

  let changed = 0

  for (const sample of SAMPLE_POSTS) {
    const found = bySlug.get(sample.slug)
    if (found) {
      if (found.status !== 'published') {
        await updateDoc(doc(firestore, 'posts', found.id), {
          status: 'published',
          updatedAt: now(),
        })
        changed += 1
      }
      continue
    }
    await addDoc(collection(firestore, 'posts'), sample)
    changed += 1
  }

  return changed
}
