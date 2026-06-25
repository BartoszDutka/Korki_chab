import type {
  SiteSettings,
  FooterSettings,
  MenuItem,
  ContactSettings,
  SeoSettings,
} from '../types'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
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
    'Jesteśmy lokalnym centrum korepetycji w Chabówce. Wspieramy uczniów na każdym etapie edukacji.',
  aboutLocations: ['Chabówka', 'Rabka-Zdrój', 'Raba Wyżna', 'Nowy Targ i okolice'],
  aboutHighlights: [
    { title: 'Certyfikowani tutorzy', description: 'Pasjonaci z wieloletnim doświadczeniem.' },
    { title: 'Małe grupy', description: 'Zajęcia w grupach do 4 osób.' },
  ],
  aboutVisible: true,
  pricingFooterText: 'Dokładna cena zależy od poziomu ucznia, przedmiotu i formy zajęć.',
}

export const DEFAULT_FOOTER: FooterSettings = {
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
  seoPhrases: ['korepetycje Chabówka', 'matura Chabówka'],
  copyright: '© 2026 Centrum Korepetycji Chabówka. Wszelkie prawa zastrzeżone.',
}

export const DEFAULT_MENU: MenuItem[] = [
  { id: 'default-start', label: 'Start', href: '/', order: 0, visible: true },
  { id: 'default-zajecia', label: 'Zajęcia', href: '/zajecia', order: 1, visible: true },
  { id: 'default-przedmioty', label: 'Przedmioty', href: '/przedmioty', order: 2, visible: true },
  { id: 'default-cennik', label: 'Cennik', href: '/cennik', order: 3, visible: true },
  { id: 'default-aktualnosci', label: 'Aktualności', href: '/aktualnosci', order: 4, visible: true },
]

export const DEFAULT_CONTACT: ContactSettings = {
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

export const DEFAULT_SEO: SeoSettings = {
  defaultMetaTitle: 'Korepetycje Chabówka',
  defaultMetaDescription: 'Korepetycje w Chabówce dla uczniów szkoły podstawowej i średniej.',
  homeMetaTitle: 'Korepetycje Chabówka | Matematyka, angielski, matura',
  homeMetaDescription:
    'Korepetycje w Chabówce. Matematyka, polski, angielski, egzamin ósmoklasisty i matura.',
  postsMetaTitle: 'Aktualności | Korepetycje Chabówka',
  postsMetaDescription: 'Aktualności z Centrum Korepetycji Chabówka.',
  localSeoPhrases: ['korepetycje Chabówka', 'matura Chabówka'],
}
