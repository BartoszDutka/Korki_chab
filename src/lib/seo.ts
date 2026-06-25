export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://korki-c0e8c.web.app'

export const SITE_NAME = 'Korepetycje Chabówka'

export const DEFAULT_SEO = {
  title: 'Korepetycje Chabówka — Centrum Korepetycji w Podhalu',
  description:
    'Profesjonalne korepetycje w Chabówce, Rabka-Zdrój i okolicach. Matematyka, angielski, polski, chemia, fizyka, matura i egzamin ósmoklasisty.',
  keywords:
    'korepetycje Chabówka, korepetycje Rabka-Zdrój, matematyka Chabówka, korepetycje Nowy Targ, centrum korepetycji Podhale',
}

export const STATIC_ROUTES = [
  '/',
  '/zajecia',
  '/przedmioty',
  '/cennik',
  '/aktualnosci',
  '/opinie',
  '/faq',
  '/kontakt',
  '/zaloguj',
] as const
