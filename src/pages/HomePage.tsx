import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon, { Button } from '../components/ui'
import EditableText from '../components/live-edit/EditableText'
import { useDeferredOnce } from '../hooks/useDeferredOnce'
import { useSeo } from '../hooks/useSeo'
import { SITE_URL } from '../lib/seo'
import { settingsService } from '../services/settingsService'
import { seoService } from '../services/seoService'
import { postsService } from '../services/postsService'
import { subjectsService } from '../services/subjectsService'
import { DEFAULT_SITE_SETTINGS } from '../data/defaults'
import { IMAGES, SUBJECTS } from '../data/content'
import DataSetupBanner from '../components/DataSetupBanner'
import { CardSkeleton, GridSkeleton, PostCardSkeleton } from '../components/skeletons'
import type { Subject } from '../types'

const PLACEHOLDER_SUBJECTS: Subject[] = SUBJECTS.map((s, order) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  level: s.shortDescription,
  order,
  visible: true,
}))

export default function HomePage() {
  const { data: settingsRaw, settled: settingsSettled } = useDeferredOnce(settingsService.get)
  const { data: seoRaw } = useDeferredOnce(seoService.get)
  const { data: postsRaw, settled: postsSettled } = useDeferredOnce(postsService.getAll)
  const { data: subjectsRaw, settled: subjectsSettled } = useDeferredOnce(subjectsService.getAll)

  const settings = settingsRaw ?? DEFAULT_SITE_SETTINGS
  const seo = seoRaw
  const usingDefaults = settingsSettled && !settingsRaw

  const publishedPosts = useMemo(
    () =>
      (postsRaw ?? [])
        .filter((p) => p.status === 'published')
        .slice(0, 3),
    [postsRaw],
  )

  const subjects = useMemo(() => {
    const items = subjectsRaw?.length ? subjectsRaw : PLACEHOLDER_SUBJECTS
    return items.filter((s) => s.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [subjectsRaw])

  const showPostsSection = settings.sectionVisibility.posts
  const postsReady = postsSettled && publishedPosts.length > 0

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

  return (
    <>
      {usingDefaults && <DataSetupBanner />}
      <section className="py-12 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col items-start space-y-6 md:space-y-8 min-h-[320px] sm:min-h-[360px]">
            <p className="text-label-md text-on-secondary-container font-bold uppercase tracking-wider min-h-[20px]">
              <EditableText
                value={settings.heroSubtitle}
                onSave={(v) => settingsService.update({ heroSubtitle: v })}
                className="text-label-md"
              />
            </p>
            <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary tracking-tight min-h-[2.5em]">
              <EditableText
                as="span"
                value={settings.heroTitle}
                onSave={(v) => settingsService.update({ heroTitle: v })}
                className="text-display-lg-mobile md:text-display-lg"
              />
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg min-h-[4.5rem]">
              <EditableText
                as="p"
                multiline
                value={settings.heroDescription}
                onSave={(v) => settingsService.update({ heroDescription: v })}
                className="text-body-lg"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto min-h-[48px]">
              {settings.heroButtons.map((btn) => (
                <Button
                  key={btn.label}
                  href={btn.href.startsWith('tel:') ? btn.href : btn.href}
                  variant={btn.label === 'Zapisz się' ? 'primary' : 'secondary'}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block w-full rounded-2xl overflow-hidden shadow-sm bg-academic-navy-deep aspect-[800/550] max-h-[550px]">
            <img
              src={IMAGES.heroRemote}
              alt="Nowoczesna sala lekcyjna w Centrum Korepetycji Chabówka"
              width={800}
              height={550}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes="(min-width: 1024px) 600px, 0px"
              className="object-cover w-full h-full absolute inset-0 opacity-90"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget
                if (!img.dataset.triedLocal) {
                  img.dataset.triedLocal = '1'
                  img.src = IMAGES.heroJpg
                }
              }}
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
            {!subjectsSettled ? (
              <GridSkeleton count={6}>
                <CardSkeleton />
              </GridSkeleton>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.slice(0, 6).map((s) => (
                  <div key={s.id} className="bg-white border border-outline-variant/30 rounded-xl p-6 card-hover min-h-[140px]">
                    <h3 className="font-bold text-primary mb-2">{s.name}</h3>
                    <p className="text-body-md text-on-surface-variant text-sm">{s.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {showPostsSection && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest min-h-[380px]">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-10 gap-4 min-h-[40px]">
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Aktualności</h2>
              <Link to="/aktualnosci" className="text-primary font-medium text-label-md shrink-0">Wszystkie aktualności</Link>
            </div>
            {!postsSettled ? (
              <GridSkeleton count={3} columns="grid-cols-1 md:grid-cols-3">
                <PostCardSkeleton />
              </GridSkeleton>
            ) : postsReady ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {publishedPosts.map((post) => (
                  <Link key={post.id} to={`/aktualnosci/${post.slug}`} className="bg-surface-bright border rounded-xl p-6 card-hover block min-h-[180px]">
                    <p className="text-label-sm text-on-surface-variant mb-2">{new Date(post.publishedAt).toLocaleDateString('pl')}</p>
                    <h3 className="font-bold text-primary mb-2">{post.title}</h3>
                    <p className="text-body-md text-on-surface-variant text-sm line-clamp-3">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {settings.aboutVisible && settings.sectionVisibility.about && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright min-h-[280px]">
          <div className="max-w-container-max mx-auto max-w-3xl">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary mb-6 min-h-[2rem]">
              <EditableText value={settings.aboutTitle} onSave={(v) => settingsService.update({ aboutTitle: v })} />
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6 min-h-[4rem]">
              <EditableText multiline value={settings.aboutContent} onSave={(v) => settingsService.update({ aboutContent: v })} />
            </p>
            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {settings.aboutLocations.map((loc) => (
                <span key={loc} className="bg-surface-container-low px-3 py-1 rounded-full text-sm text-primary">{loc}</span>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
