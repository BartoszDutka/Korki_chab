import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import EditModeBar from './live-edit/EditModeBar'
import SkipLink from './SkipLink'

export default function Layout() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden">
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="min-w-0">
        <Outlet />
      </main>
      <Footer />
      <EditModeBar />
    </div>
  )
}
