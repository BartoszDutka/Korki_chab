export const IMAGES = {
  /** Lokalne (po npm run optimize:images) */
  heroWebp: '/hero-800.webp',
  heroWebpSrcSet: '/hero-480.webp 480w, /hero-800.webp 800w, /hero-1200.webp 1200w',
  heroJpg: '/hero.jpg',
  /** Zewnętrzne zapasowe — bez sufiksu =w800-rw (psuje URL Google) */
  heroRemote:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDJjwIqDmAGDJxF3UkJNKnzrdbRfYEIDjVW8nFpgrtmW2GJfHIumc1lHZI_kWVa_Ap5i7siDy4b9Qkua_-jWBSHKXzuLKl9h_VqjfjMIIMzdsg1iPE3zgmaO_PblQuxUyCfnEjOxHkMjnlDiwcbhhGN0As8hnUCMExDkoKxvN4lbSyuVXjC-C-zXzrprKR6QKIwvTHSYjYwujxroOkYgoY7d7QNz5MO0_qBnDKKOWMlbY5LZeNv_FTMBh3wdB_h7O--1mCwFIzFXoA',
  mapLocal: '/map.jpg',
  team: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhiQfpaQVSRL9DJPYiXr9LKiRKTrxUWq1_tW7S6bVroOfPwzWm4dniVFxM2aS0YE1rbodzw3-RZqzB5iNQSqHgqC7VJzVFIso083Rodh1SW5DEtryinAAuhdcWlQE2Ua72_f0vvJ37WCOEgC1a82yiEO6bSejMhevd9SDXebEtZKhWxl_Z17W7Xki6Ho9ji1ZNnV9uWwCH6mRCNYf9aQmxLiHsdZkqjzlelTwguZA0TuAvtGZzoMjOGP9Nq3hbvk2uvShye7g68rY',
  mapDesktop:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA3p7qKuv_878s5pNZRlMegV0ZoIKGbye-ut-1MMFIdSul4eUPIp-eNhDJUHZvlPpsMpRz2cd0lRGGs90bzQnWG_9x30DgJEB-iTWnYCDN-yW8PEj7MgNB80gyN4oPgw7KDqZqczt4J2Nsi4v4K3mWUk_hVOiXpH9miXW1PRyn5O7mhPq5kjBqxxR3KGEGLm3L6wu1lzx9-N3ebUB8AZOJaizuCUFTqYUdFixmZtVX3867bNUx073TWFoxr92JQjO4VPW8teZhEIPM',
  mapMobile:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_OYxqrgk5yr0gHkDVX9Ua0s1_J1sZCS10fLtSlMxJ8e6WrKiNwIkkxnja4dshXAAJo9V9byf2yL5GbX1HLWkoVxP3se-Aj1ZIiuHhSkPqNpR1YxNFzhi0ZvAUBzIZcTnmxV0B4g1RZU3YhBAQrQ04P_UlliCtDi2N0lDvpMcp1UNarrlkaGNsIwC9Lm0OPKvMQcGqxzZGLEdFUZDA0qFNbAyR11uzi41c7QXNPFa4xa7m9qjOOwJWSquS4w6T07mxOZdIztxxVk',
} as const

export const CONTACT = {
  address: 'Chabówka',
  phone: '+48 123 456 789',
  email: 'kontakt@centrumchabowka.pl',
  hours: 'Pn–Pt: 10:00 – 18:00',
} as const

export interface Subject {
  id: string
  name: string
  icon: string
  description: string
  shortDescription: string
  popular?: boolean
}

export const SUBJECTS: Subject[] = [
  {
    id: 'matematyka',
    name: 'Matematyka',
    icon: 'calculate',
    description: 'Pomoc na poziomie szkoły podstawowej i średniej. Przygotowanie do sprawdzianów i egzaminu ósmoklasisty.',
    shortDescription: 'Szkoła podstawowa, liceum, matura.',
    popular: true,
  },
  {
    id: 'angielski',
    name: 'Język angielski',
    icon: 'language',
    description: 'Konwersacje, gramatyka oraz przygotowanie do certyfikatów językowych i matury.',
    shortDescription: 'Konwersacje, gramatyka, certyfikaty.',
  },
  {
    id: 'polski',
    name: 'Język polski',
    icon: 'menu_book',
    description: 'Analiza lektur, pisanie wypracowań i przygotowanie do egzaminów końcowych.',
    shortDescription: 'Pisanie wypracowań, analiza lektur.',
  },
  {
    id: 'fizyka',
    name: 'Fizyka',
    icon: 'function',
    description: 'Zrozumienie zjawisk fizycznych i pomoc w rozwiązywaniu zadań obliczeniowych.',
    shortDescription: 'Zrozum otaczający Cię świat. Matura rozszerzona.',
  },
  {
    id: 'chemia',
    name: 'Chemia',
    icon: 'science',
    description: 'Reakcje chemiczne, stechiometria i przygotowanie do sprawdzianów z chemii.',
    shortDescription: 'Zrozum reakcje i przygotuj się do egzaminów.',
  },
  {
    id: 'biologia',
    name: 'Biologia',
    icon: 'biotech',
    description: 'Systematyka, biologia komórki i przygotowanie do egzaminu maturalnego.',
    shortDescription: 'Przygotowanie na studia medyczne i przyrodnicze.',
  },
]

export const PRICING = [
  {
    id: 'individual',
    label: 'Indywidualne',
    title: 'Korepetycje 1:1',
    price: '80 zł',
    period: '/ 60 min',
    features: ['Pełna personalizacja', 'Elastyczny grafik', 'Materiały w cenie'],
    highlighted: false,
    badge: undefined,
  },
  {
    id: 'group',
    label: 'Grupowe',
    title: 'Zajęcia w grupie',
    price: '50 zł',
    period: '/ 60 min',
    features: ['Grupy do 4 osób', 'Przygotowanie do egzaminów', 'Regularne testy'],
    highlighted: true,
    badge: 'Popularne',
  },
  {
    id: 'exam',
    label: 'Kursy',
    title: 'Egzaminacyjne',
    price: '600 zł',
    period: '/ miesiąc',
    features: ['8-klasista / Matura', 'Arkusze z poprzednich lat', 'Egzaminy próbne'],
    highlighted: false,
    badge: undefined,
  },
] as const

export const FEATURES = [
  {
    icon: 'person_play',
    title: 'Indywidualne podejście',
    description:
      'Dostosowujemy tempo i metody nauczania do potrzeb każdego ucznia, zapewniając maksymalną efektywność zajęć.',
  },
  {
    icon: 'local_library',
    title: 'Lokalni nauczyciele',
    description:
      'Współpracujemy z doświadczonymi pedagogami z regionu, którzy znają lokalne środowisko edukacyjne i wymagania szkół.',
  },
  {
    icon: 'laptop_chromebook',
    title: 'Nowoczesne sale',
    description:
      'Nasze sale są w pełni wyposażone w nowoczesne pomoce dydaktyczne, tworząc idealne warunki do skupienia i nauki.',
  },
] as const
