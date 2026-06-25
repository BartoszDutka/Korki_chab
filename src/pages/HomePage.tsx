import { useMemo, useCallback, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import Icon, { Button } from '../components/ui'
import ConditionalEditable from '../components/ConditionalEditable'
import ImageWithAspectRatio from '../components/ImageWithAspectRatio'
import CourseCard from '../components/courses/CourseCard'
import PageLoader from '../components/PageLoader'
import { useDeferredOnce } from '../hooks/useDeferredOnce'
import { useSeo } from '../hooks/useSeo'
import { SITE_URL } from '../lib/seo'
import { normalizeCoursesSeats } from '../lib/courseUtils'
import { DEFAULT_SITE_SETTINGS } from '../data/defaults'
import { IMAGES, SUBJECTS } from '../data/content'
import DataSetupBanner from '../components/DataSetupBanner'
import { SAMPLE_POSTS } from '../lib/seedPosts'
import { SAMPLE_COURSES } from '../lib/seedCourses'
import type { Course, Post, Subject } from '../types'

const CourseModal = lazy(() => import('../components/courses/CourseModal'))

const FALLBACK_POSTS: Post[] = SAMPLE_POSTS.map((post, index) => ({
  ...post,
  id: `fallback-post-${index}`,
}))

const FALLBACK_COURSES: Course[] = SAMPLE_COURSES.map((course, index) => ({
  ...course,
  id: `fallback-course-${index}`,
}))

const PLACEHOLDER_SUBJECTS: Subject[] = SUBJECTS.map((s, order) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  level: s.shortDescription,
  order,
  visible: true,
}))

export default function HomePage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const fetchSettings = useCallback(
    () => import('../services/settingsService').then((m) => m.settingsService.get()),
    [],
  )
  const fetchSeo = useCallback(
    () => import('../services/seoService').then((m) => m.seoService.get()),
    [],
  )
  const fetchPosts = useCallback(
    () => import('../services/postsService').then((m) => m.postsService.getPublished()),
    [],
  )
  const fetchSubjects = useCallback(
    () => import('../services/subjectsService').then((m) => m.subjectsService.getAll()),
    [],
  )
  const fetchCourses = useCallback(
    () => import('../services/coursesService').then((m) => m.coursesService.getPublished()),
    [],
  )

  const { data: settingsRaw, settled: settingsSettled } = useDeferredOnce(fetchSettings, { delayMs: 1500 })
  const { data: seoRaw } = useDeferredOnce(fetchSeo, { delayMs: 3500 })
  const { data: postsRaw } = useDeferredOnce(fetchPosts, { delayMs: 800 })
  const { data: subjectsRaw } = useDeferredOnce(fetchSubjects, { delayMs: 2500 })
  const { data: coursesRaw } = useDeferredOnce(fetchCourses, { delayMs: 1000 })

  const settings = settingsRaw ?? DEFAULT_SITE_SETTINGS
  const seo = seoRaw
  const usingDefaults = settingsSettled && !settingsRaw

  const publishedPosts = useMemo(() => {
    const fromFirestore = postsRaw ?? []
    const source = fromFirestore.length > 0 ? fromFirestore : FALLBACK_POSTS
    return source.slice(0, 3)
  }, [postsRaw])

  const featuredCourses = useMemo(() => {
    const fromFirestore = coursesRaw?.length ? normalizeCoursesSeats(coursesRaw) : []
    const source = fromFirestore.length > 0 ? fromFirestore : normalizeCoursesSeats(FALLBACK_COURSES)
    return source.slice(0, 3)
  }, [coursesRaw])

  const selectedCourse = selectedCourseId
    ? featuredCourses.find((c) => c.id === selectedCourseId) ??
      normalizeCoursesSeats(coursesRaw ?? []).find((c) => c.id === selectedCourseId) ??
      null
    : null

  const subjects = useMemo(() => {
    const items = subjectsRaw?.length ? subjectsRaw : PLACEHOLDER_SUBJECTS
    return items.filter((s) => s.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [subjectsRaw])

  const showPostsSection = settings.sectionVisibility.posts
  const showAboutSection =
    (settingsSettled ? settings.aboutVisible : DEFAULT_SITE_SETTINGS.aboutVisible) &&
    settings.sectionVisibility.about

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Centrum Korepetycji Chabówka',
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chabówka',
        addressRegion: 'Podhale',
        addressCountry: 'PL',
      },
      areaServed: ['Chabówka', 'Rabka-Zdrój', 'Nowy Targ', 'Skawa'],
      description:
        'Korepetycje w Chabówce — matematyka, angielski, polski, matura i egzamin ósmoklasisty.',
    }),
    [],
  )

  useSeo({
    title: seo?.homeMetaTitle,
    description:
      seo?.homeMetaDescription ??
      'Profesjonalne korepetycje w Chabówce i Rabka-Zdrój. Matematyka, angielski, polski — małe grupy i indywidualne podejście.',
    path: '/',
    jsonLd,
  })

  const updateSettings = useCallback(async (patch: Record<string, unknown>) => {
    const { settingsService } = await import('../services/settingsService')
    await settingsService.update(patch)
  }, [])

  return (
    <>
      {usingDefaults && <DataSetupBanner />}
      <section className="py-12 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col items-start space-y-6 md:space-y-8 min-h-[320px] sm:min-h-[360px]">
            <p className="text-label-md text-on-secondary-container font-bold uppercase tracking-wider min-h-[20px]">
              <ConditionalEditable
                value={settings.heroSubtitle}
                onSave={(v) => updateSettings({ heroSubtitle: v })}
                className="text-label-md"
              />
            </p>
            <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary tracking-tight min-h-[2.5em]">
              <ConditionalEditable
                as="span"
                value={settings.heroTitle}
                onSave={(v) => updateSettings({ heroTitle: v })}
                className="text-display-lg-mobile md:text-display-lg"
              />
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg min-h-[4.5rem]">
              <ConditionalEditable
                as="p"
                multiline
                value={settings.heroDescription}
                onSave={(v) => updateSettings({ heroDescription: v })}
                className="text-body-lg"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto min-h-[48px]">
              {settings.heroButtons.map((btn) => {
                const href = btn.label === 'Zapisz się' ? '/zajecia' : btn.href
                return (
                <Button
                  key={btn.label}
                  href={href}
                  variant={btn.label === 'Zapisz się' ? 'primary' : 'secondary'}
                >
                  {btn.label}
                </Button>
                )
              })}
            </div>
          </div>
          <div className="hidden lg:block w-full max-h-[550px] rounded-2xl overflow-hidden shadow-sm bg-academic-navy-deep">
            <ImageWithAspectRatio
              src={IMAGES.heroJpg}
              alt="Nowoczesna sala lekcyjna w Centrum Korepetycji Chabówka"
              width={800}
              height={550}
              priority
              sizes="(min-width: 1024px) 600px, 0px"
              webpSrc={IMAGES.heroWebpSrcSet}
              fallbackSrc={IMAGES.heroRemote}
              className="opacity-90"
            />
          </div>
        </div>
      </section>

      {settings.sectionVisibility.subjects && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright min-h-[420px]">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-10 gap-4 min-h-[40px]">
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Przedmioty</h2>
              <Link to="/przedmioty" className="text-primary font-medium text-label-md flex items-center gap-2 shrink-0">
                Zobacz wszystkie <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
              {subjects.slice(0, 6).map((s) => (
                <div key={s.id} className="bg-white border border-outline-variant/30 rounded-xl p-6 card-hover min-h-[140px]">
                  <h3 className="font-bold text-primary mb-2 leading-7 min-h-[1.75rem]">{s.name}</h3>
                  <p className="text-body-md text-on-surface-variant text-sm leading-6 line-clamp-3 min-h-[4.5rem]">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest min-h-[520px]">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-10 gap-4 min-h-[40px]">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Oferta zajęć</h2>
            <Link to="/zajecia" className="text-primary font-medium text-label-md flex items-center gap-2 shrink-0">
              Wszystkie zajęcia <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch min-h-[380px]">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onOpen={(c) => setSelectedCourseId(c.id)} />
            ))}
          </div>
        </div>
      </section>

      {showPostsSection && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright min-h-[380px]">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-10 gap-4 min-h-[40px]">
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Aktualności</h2>
              <Link to="/aktualnosci" className="text-primary font-medium text-label-md shrink-0">Wszystkie aktualności</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[180px]">
              {publishedPosts.map((post) => (
                <Link key={post.id} to={`/aktualnosci/${post.slug}`} className="bg-surface-bright border rounded-xl p-6 card-hover block min-h-[180px]">
                  <p className="text-label-sm text-on-surface-variant mb-2">{new Date(post.publishedAt).toLocaleDateString('pl')}</p>
                  <h3 className="font-bold text-primary mb-2">{post.title}</h3>
                  <p className="text-body-md text-on-surface-variant text-sm line-clamp-3">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showAboutSection && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright min-h-[280px]">
          <div className="max-w-container-max mx-auto max-w-3xl">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary mb-6 min-h-[2rem]">
              <ConditionalEditable value={settings.aboutTitle} onSave={(v) => updateSettings({ aboutTitle: v })} />
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6 min-h-[4rem]">
              <ConditionalEditable multiline value={settings.aboutContent} onSave={(v) => updateSettings({ aboutContent: v })} />
            </p>
            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {settings.aboutLocations.map((loc) => (
                <span key={loc} className="bg-surface-container-low px-3 py-1 rounded-full text-sm text-primary">{loc}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedCourse && (
        <Suspense fallback={<PageLoader label="Ładowanie…" minHeight="min-h-0" />}>
          <CourseModal course={selectedCourse} onClose={() => setSelectedCourseId(null)} />
        </Suspense>
      )}
    </>
  )
}
