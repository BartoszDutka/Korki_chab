import { doc, getDoc, setDoc, collection, addDoc, type Firestore } from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import { SINGLE_DOC_ID } from '../types'
import { SAMPLE_POSTS } from './seedPosts'
import type {
  SiteSettings,
  MenuItem,
  Subject,
  EducationLevel,
  PricingItem,
  Testimonial,
  FAQItem,
  ContactSettings,
  FormSettings,
  FooterSettings,
  SeoSettings,
} from '../types'

const now = () => new Date().toISOString()

export async function isDatabaseEmpty(firestore?: Firestore): Promise<boolean> {
  const db = firestore ?? (await getDb())
  const snap = await getDoc(doc(db, 'siteSettings', SINGLE_DOC_ID))
  return !snap.exists()
}

export async function seedInitialData(firestore?: Firestore): Promise<boolean> {
  const db = firestore ?? (await getDb())
  if (!(await isDatabaseEmpty(db))) {
    return false
  }

  const siteSettings: SiteSettings = {
    siteName: 'Korepetycje Chabówka',
    heroTitle: 'Skuteczne korepetycje w Chabówce',
    heroSubtitle: 'Centrum Korepetycji Chabówka',
    heroDescription:
      'Pomagamy uczniom szkoły podstawowej i średniej nadrabiać zaległości, poprawiać oceny i przygotowywać się do egzaminów.',
    heroButtons: [
      { label: 'Zapisz się', href: '/kontakt' },
      { label: 'Zadzwoń', href: 'tel:+48123456789' },
      { label: 'Zobacz aktualności', href: '/aktualnosci' },
    ],
    contactPhone: '+48 123 456 789',
    contactEmail: 'kontakt@centrumchabowka.pl',
    sectionVisibility: {
      hero: true,
      subjects: true,
      educationLevels: true,
      pricing: true,
      posts: true,
      testimonials: true,
      faq: true,
      about: true,
      contact: true,
    },
    aboutTitle: 'O nas — korepetycje w sercu Podhala',
    aboutContent:
      'Jesteśmy lokalnym centrum korepetycji w Chabówce. Wspieramy uczniów na każdym etapie edukacji — od szkoły podstawowej po maturę. Stawiamy na indywidualne podejście, małe grupy i przyjazną atmosferę nauki.',
    aboutLocations: [
      'Chabówka',
      'Rabka-Zdrój',
      'Raba Wyżna',
      'Skawa',
      'Rokiciny Podhalańskie',
      'Nowy Targ i okolice',
    ],
    aboutHighlights: [
      { title: 'Certyfikowani tutorzy', description: 'Pasjonaci z wieloletnim doświadczeniem.' },
      { title: 'Małe grupy', description: 'Zajęcia w grupach do 4 osób.' },
      { title: 'Elastyczny grafik', description: 'Dostosowujemy terminy do planu ucznia.' },
    ],
    aboutVisible: true,
    pricingFooterText:
      'Dokładna cena zależy od poziomu ucznia, przedmiotu i formy zajęć.',
  }

  await setDoc(doc(db, 'siteSettings', SINGLE_DOC_ID), siteSettings)

  const menuItems: Omit<MenuItem, 'id'>[] = [
    { label: 'Start', href: '/', order: 0, visible: true },
    { label: 'Zajęcia', href: '/zajecia', order: 1, visible: true },
    { label: 'Przedmioty', href: '/przedmioty', order: 2, visible: true },
    { label: 'Cennik', href: '/cennik', order: 3, visible: true },
    { label: 'Aktualności', href: '/aktualnosci', order: 4, visible: true },
  ]

  for (const item of menuItems) {
    await addDoc(collection(db, 'menuItems'), item)
  }

  const subjects: Omit<Subject, 'id'>[] = [
    { name: 'Matematyka', description: 'Szkoła podstawowa, liceum, matura.', level: 'Wszystkie poziomy', order: 0, visible: true },
    { name: 'Język polski', description: 'Analiza lektur, wypracowania, egzamin ósmoklasisty.', level: 'Wszystkie poziomy', order: 1, visible: true },
    { name: 'Język angielski', description: 'Konwersacje, gramatyka, certyfikaty.', level: 'Wszystkie poziomy', order: 2, visible: true },
    { name: 'Chemia', description: 'Przygotowanie do sprawdzianów i matury.', level: 'Szkoła średnia', order: 3, visible: true },
    { name: 'Fizyka', description: 'Zadania obliczeniowe i zrozumienie zjawisk.', level: 'Szkoła średnia', order: 4, visible: true },
    { name: 'Biologia', description: 'Egzamin ósmoklasisty i matura.', level: 'Wszystkie poziomy', order: 5, visible: true },
    { name: 'Geografia', description: 'Mapy, testy i przygotowanie do egzaminów.', level: 'Szkoła podstawowa i średnia', order: 6, visible: true },
    { name: 'Informatyka', description: 'Programowanie i przygotowanie do egzaminów.', level: 'Szkoła średnia', order: 7, visible: true },
  ]

  for (const s of subjects) {
    await addDoc(collection(db, 'subjects'), s)
  }

  const levels: Omit<EducationLevel, 'id'>[] = [
    { name: 'Szkoła podstawowa', description: 'Wsparcie w bieżącym materiale i egzaminie ósmoklasisty.', order: 0, visible: true },
    { name: 'Liceum', description: 'Przygotowanie do matury i poprawa ocen.', order: 1, visible: true },
    { name: 'Technikum', description: 'Przedmioty ścisłe i zawodowe.', order: 2, visible: true },
    { name: 'Egzamin ósmoklasisty', description: 'Intensywne kursy i powtórki.', order: 3, visible: true },
    { name: 'Matura', description: 'Poziom podstawowy i rozszerzony.', order: 4, visible: true },
  ]

  for (const l of levels) {
    await addDoc(collection(db, 'educationLevels'), l)
  }

  const pricing: Omit<PricingItem, 'id'>[] = [
    { name: 'Korepetycje indywidualne', duration: '60 min', price: 'Do uzupełnienia', description: 'Pełna personalizacja zajęć.', order: 0, visible: true },
    { name: 'Zajęcia w parach', duration: '60 min', price: 'Do uzupełnienia', description: 'Nauka w duecie z podobnym poziomem.', order: 1, visible: true },
    { name: 'Mała grupa 3–4 osoby', duration: '60 min', price: 'Do uzupełnienia', description: 'Efektywna nauka w małej grupie.', order: 2, visible: true },
    { name: 'Kurs egzaminacyjny', duration: 'Pakiet', price: 'Do uzupełnienia', description: 'Ósmoklasista lub matura — program do ustalenia.', order: 3, visible: true },
  ]

  for (const p of pricing) {
    await addDoc(collection(db, 'pricingItems'), p)
  }

  for (const post of SAMPLE_POSTS) {
    await addDoc(collection(db, 'posts'), post)
  }

  const testimonials: Omit<Testimonial, 'id'>[] = [
    {
      name: 'Anna K.',
      content: 'Syn poprawił oceny z matematyki z 3 na 5 w jednym semestrze. Polecam!',
      rating: 5,
      context: 'Matematyka, klasa 7',
      order: 0,
      visible: true,
      createdAt: now(),
    },
    {
      name: 'Tomasz W.',
      content: 'Profesjonalne podejście i elastyczne godziny. Córka przygotowała się do matury z angielskiego.',
      rating: 5,
      context: 'Język angielski, matura',
      order: 1,
      visible: true,
      createdAt: now(),
    },
    {
      name: 'Magdalena P.',
      content: 'Małe grupy i spokojna atmosfera — córka w końcu polubiła chemię.',
      rating: 5,
      context: 'Chemia, liceum',
      order: 2,
      visible: true,
      createdAt: now(),
    },
  ]

  for (const t of testimonials) {
    await addDoc(collection(db, 'testimonials'), t)
  }

  const faqItems: Omit<FAQItem, 'id'>[] = [
    { question: 'Czy zajęcia są indywidualne?', answer: 'Oferujemy zajęcia indywidualne, w parach i w małych grupach do 4 osób.', category: 'Ogólne', order: 0, visible: true },
    { question: 'Czy można uczyć się w parach lub małych grupach?', answer: 'Tak, mamy zajęcia w parach i małych grupach 3–4 osobowych.', category: 'Ogólne', order: 1, visible: true },
    { question: 'Czy przygotowujecie do egzaminu ósmoklasisty?', answer: 'Tak, prowadzimy kursy przygotowawcze z matematyki, polskiego i angielskiego.', category: 'Egzaminy', order: 2, visible: true },
    { question: 'Czy przygotowujecie do matury?', answer: 'Tak, przygotowujemy do poziomu podstawowego i rozszerzonego.', category: 'Egzaminy', order: 3, visible: true },
    { question: 'Jakie przedmioty są dostępne?', answer: 'Matematyka, polski, angielski, chemia, fizyka, biologia, geografia i informatyka.', category: 'Ogólne', order: 4, visible: true },
    { question: 'Czy są zajęcia online?', answer: 'Na życzenie możliwe są zajęcia online — szczegóły ustalamy indywidualnie.', category: 'Organizacja', order: 5, visible: true },
    { question: 'Ile trwają zajęcia?', answer: 'Standardowo 60 minut. Możliwe są też sesje 90 minut.', category: 'Organizacja', order: 6, visible: true },
    { question: 'Jak wygląda płatność?', answer: 'Płatność miesięczna z góry lub za pojedyncze zajęcia — ustalamy indywidualnie.', category: 'Organizacja', order: 7, visible: true },
    { question: 'Jak można odwołać zajęcia?', answer: 'Odwołanie z 24h wyprzedzeniem — bez kosztów. Szczegóły w regulaminie.', category: 'Organizacja', order: 8, visible: true },
    { question: 'Czy można zapisać się na zajęcia próbne?', answer: 'Tak, oferujemy bezpłatną konsultację i możliwość jednej lekcji próbnej.', category: 'Ogólne', order: 9, visible: true },
  ]

  for (const f of faqItems) {
    await addDoc(collection(db, 'faqItems'), f)
  }

  const contactSettings: ContactSettings = {
    phone: '+48 123 456 789',
    email: 'kontakt@centrumchabowka.pl',
    address: 'Chabówka',
    location: 'Chabówka',
    googleMapsUrl: 'https://maps.google.com',
    contactText: 'Chętnie odpowiemy na Twoje pytania dotyczące zajęć i zapisów.',
    contactHours: 'Pn–Pt: 10:00 – 18:00',
    onlineInfo: 'Zajęcia online dostępne na życzenie.',
    stationaryInfo: 'Zajęcia stacjonarne w naszej placówce w Chabówce.',
  }

  await setDoc(doc(db, 'contactSettings', SINGLE_DOC_ID), contactSettings)

  const formSettings: FormSettings = {
    fields: [
      { id: 'name', name: 'name', label: 'Imię i nazwisko', type: 'text', placeholder: 'Jan Kowalski', required: true, visible: true },
      { id: 'phone', name: 'phone', label: 'Telefon', type: 'tel', placeholder: '+48 ___ ___ ___', required: true, visible: true },
      { id: 'email', name: 'email', label: 'E-mail', type: 'email', placeholder: 'twoj@email.pl', required: true, visible: true },
      { id: 'grade', name: 'grade', label: 'Klasa ucznia', type: 'text', placeholder: 'np. 8 SP', required: false, visible: true },
      { id: 'subject', name: 'subject', label: 'Wybrany przedmiot', type: 'select', placeholder: '', required: false, visible: true, options: ['Matematyka', 'Język polski', 'Język angielski', 'Inny'] },
      { id: 'goal', name: 'goal', label: 'Cel zajęć', type: 'text', placeholder: 'np. matura, poprawa ocen', required: false, visible: true },
      { id: 'format', name: 'format', label: 'Preferowana forma', type: 'select', placeholder: '', required: false, visible: true, options: ['Indywidualne', 'Para', 'Grupa', 'Online'] },
      { id: 'schedule', name: 'schedule', label: 'Preferowane dni i godziny', type: 'text', placeholder: 'np. wtorki 17:00', required: false, visible: true },
      { id: 'message', name: 'message', label: 'Wiadomość dodatkowa', type: 'textarea', placeholder: 'Jak możemy pomóc?', required: false, visible: true },
    ],
    rodoText: 'Wyrażam zgodę na przetwarzanie danych osobowych w celu kontaktu zwrotnego.',
    successMessage: 'Dziękujemy! Wiadomość została wysłana. Odezwiemy się w ciągu 24 godzin.',
    targetEmail: 'kontakt@centrumchabowka.pl',
  }

  await setDoc(doc(db, 'formSettings', SINGLE_DOC_ID), formSettings)

  const footerSettings: FooterSettings = {
    footerTitle: 'Centrum Chabówka',
    footerDescription: 'Twoje lokalne centrum wsparcia edukacyjnego w Chabówce i okolicach.',
    links: [
      { label: 'Przedmioty', href: '/przedmioty' },
      { label: 'Cennik', href: '/cennik' },
      { label: 'Aktualności', href: '/aktualnosci' },
      { label: 'Opinie', href: '/opinie' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    phone: '+48 123 456 789',
    email: 'kontakt@centrumchabowka.pl',
    location: 'Chabówka',
    seoPhrases: ['korepetycje Chabówka', 'korepetycje Rabka', 'matura Chabówka', 'egzamin ósmoklasisty'],
    copyright: '© 2026 Centrum Korepetycji Chabówka. Wszelkie prawa zastrzeżone.',
  }

  await setDoc(doc(db, 'footerSettings', SINGLE_DOC_ID), footerSettings)

  const seoSettings: SeoSettings = {
    defaultMetaTitle: 'Korepetycje Chabówka | Matematyka, angielski, matura',
    defaultMetaDescription:
      'Korepetycje w Chabówce dla uczniów szkoły podstawowej i średniej. Matematyka, język polski, angielski, przygotowanie do egzaminu ósmoklasisty i matury.',
    homeMetaTitle: 'Korepetycje Chabówka | Matematyka, angielski, matura, egzamin ósmoklasisty',
    homeMetaDescription:
      'Korepetycje w Chabówce dla uczniów szkoły podstawowej i średniej. Matematyka, język polski, angielski, przygotowanie do egzaminu ósmoklasisty i matury.',
    postsMetaTitle: 'Aktualności | Korepetycje Chabówka',
    postsMetaDescription: 'Aktualności i informacje z Centrum Korepetycji Chabówka.',
    localSeoPhrases: [
      'korepetycje Chabówka',
      'korepetycje Rabka-Zdrój',
      'korepetycje Raba Wyżna',
      'matura Chabówka',
      'egzamin ósmoklasisty Podhale',
    ],
  }

  await setDoc(doc(db, 'seoSettings', SINGLE_DOC_ID), seoSettings)

  return true
}

export async function seedInitialDataIfEmpty(): Promise<boolean> {
  return seedInitialData()
}
