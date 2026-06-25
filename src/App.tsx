import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PageLoader from './components/PageLoader'
import UserProtectedRoute from './components/UserProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const PrzedmiotyPage = lazy(() => import('./pages/PrzedmiotyPage'))
const CennikPage = lazy(() => import('./pages/CennikPage'))
const KontaktPage = lazy(() => import('./pages/KontaktPage'))
const AktualnosciPage = lazy(() => import('./pages/AktualnosciPage'))
const PostPage = lazy(() => import('./pages/PostPage'))
const OpiniePage = lazy(() => import('./pages/OpiniePage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const ZajeciaPage = lazy(() => import('./pages/ZajeciaPage'))
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'))
const KoszykPage = lazy(() => import('./pages/KoszykPage'))
const MojeZajeciaPage = lazy(() => import('./pages/MojeZajeciaPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

const AdminProtectedRoute = lazy(() => import('./components/admin/AdminProtectedRoute'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'))
const AdminMenuPage = lazy(() => import('./pages/admin/AdminMenuPage'))
const AdminPostsPage = lazy(() => import('./pages/admin/AdminPostsPage'))
const AdminSubjectsPage = lazy(() => import('./pages/admin/AdminSubjectsPage'))
const AdminEducationPage = lazy(() => import('./pages/admin/AdminEducationPage'))
const AdminPricingPage = lazy(() => import('./pages/admin/AdminPricingPage'))
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'))
const AdminFaqPage = lazy(() => import('./pages/admin/AdminFaqPage'))
const AdminAboutPage = lazy(() => import('./pages/admin/AdminAboutPage'))
const AdminContactPage = lazy(() => import('./pages/admin/AdminContactPage'))
const AdminFormPage = lazy(() => import('./pages/admin/AdminFormPage'))
const AdminSeoPage = lazy(() => import('./pages/admin/AdminSeoPage'))
const AdminFooterPage = lazy(() => import('./pages/admin/AdminFooterPage'))
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'))
const AdminEnrollmentsPage = lazy(() => import('./pages/admin/AdminEnrollmentsPage'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'))
const AdminEmailSettingsPage = lazy(() => import('./pages/admin/AdminEmailSettingsPage'))

function Page({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader minHeight="min-h-[50vh]" />}>{children}</Suspense>
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader minHeight="min-h-screen" label="Ładowanie panelu…" />}>
      {children}
    </Suspense>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <Page>
            <AdminLoginPage />
          </Page>
        }
      />
      <Route
        element={
          <AdminShell>
            <AdminProtectedRoute />
          </AdminShell>
        }
      >
        <Route
          path="/admin"
          element={
            <AdminShell>
              <AdminLayout />
            </AdminShell>
          }
        >
          <Route index element={<Page><AdminDashboard /></Page>} />
          <Route path="settings" element={<Page><AdminSettingsPage /></Page>} />
          <Route path="menu" element={<Page><AdminMenuPage /></Page>} />
          <Route path="posts" element={<Page><AdminPostsPage /></Page>} />
          <Route path="subjects" element={<Page><AdminSubjectsPage /></Page>} />
          <Route path="education-levels" element={<Page><AdminEducationPage /></Page>} />
          <Route path="pricing" element={<Page><AdminPricingPage /></Page>} />
          <Route path="courses" element={<Page><AdminCoursesPage /></Page>} />
          <Route path="enrollments" element={<Page><AdminEnrollmentsPage /></Page>} />
          <Route path="messages" element={<Page><AdminMessagesPage /></Page>} />
          <Route path="testimonials" element={<Page><AdminTestimonialsPage /></Page>} />
          <Route path="faq" element={<Page><AdminFaqPage /></Page>} />
          <Route path="about" element={<Page><AdminAboutPage /></Page>} />
          <Route path="contact" element={<Page><AdminContactPage /></Page>} />
          <Route path="form" element={<Page><AdminFormPage /></Page>} />
          <Route path="email" element={<Page><AdminEmailSettingsPage /></Page>} />
          <Route path="seo" element={<Page><AdminSeoPage /></Page>} />
          <Route path="footer" element={<Page><AdminFooterPage /></Page>} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route index element={<Page><HomePage /></Page>} />
        <Route path="przedmioty" element={<Page><PrzedmiotyPage /></Page>} />
        <Route path="cennik" element={<Page><CennikPage /></Page>} />
        <Route path="zajecia" element={<Page><ZajeciaPage /></Page>} />
        <Route path="zajecia/:slug" element={<Page><CourseDetailPage /></Page>} />
        <Route path="aktualnosci" element={<Page><AktualnosciPage /></Page>} />
        <Route path="aktualnosci/:slug" element={<Page><PostPage /></Page>} />
        <Route path="opinie" element={<Page><OpiniePage /></Page>} />
        <Route path="faq" element={<Page><FaqPage /></Page>} />
        <Route path="kontakt" element={<Page><KontaktPage /></Page>} />
        <Route path="koszyk" element={<Page><KoszykPage /></Page>} />
        <Route path="zaloguj" element={<Page><LoginPage /></Page>} />
        <Route element={<UserProtectedRoute />}>
          <Route path="moje-zajecia" element={<Page><MojeZajeciaPage /></Page>} />
        </Route>
      </Route>
    </Routes>
  )
}
