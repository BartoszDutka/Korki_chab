import { Link } from 'react-router-dom'

export default function DataSetupBanner() {
  return (
    <div className="bg-secondary-fixed text-on-secondary-fixed-variant text-center py-2 px-4 text-sm font-medium">
      Baza Firestore jest pusta — wyświetlamy treści domyślne.{' '}
      <Link to="/admin" className="underline font-bold">
        Zaloguj się do panelu
      </Link>{' '}
      i kliknij „Utwórz dane przykładowe”.
    </div>
  )
}
