import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon, { Button } from '../components/ui'
import EditableText from '../components/live-edit/EditableText'
import OptimizedImage from '../components/OptimizedImage'
import PageLoader from '../components/PageLoader'
import { useFirestoreDocOnce, useFirestoreCollectionOnce } from '../hooks/useFirestore'
import { useSeo } from '../hooks/useSeo'
import { SITE_URL } from '../lib/seo'
import { settingsService } from '../services/settingsService'
import { seoService } from '../services/seoService'
import { postsService } from '../services/postsService'
import { subjectsService } from '../services/subjectsService'
import { DEFAULT_SITE_SETTINGS } from '../data/defaults'
import { IMAGES } from '../data/content'
import DataSetupBanner from '../components/DataSetupBanner'

export default function HomePage() {
  const { data: settingsRaw, loading: settingsLoading } = useFirestoreDocOnce(settingsService.get)
  const { data: seoRaw } = useFirestoreDocOnce(seoService.get)
  const { allItems: posts } = useFirestoreCollectionOnce(postsService.getAll)
  const { items: subjects } = useFirestoreCollectionOnce(subjectsService.getAll, true)

  const settings = settingsRaw ?? DEFAULT_SITE_SETTINGS
  const seo = seoRaw
  const usingDefaults = !settingsLoading && !settingsRaw

  const publishedPosts = posts
    .filter((p) => p.status === 'published')
    .slice(0, 3)

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

  if (settingsLoading && !settingsRaw) {
    return <PageLoader label="Ładowanie strony…" />
  }

  return (
    <>
      {usingDefaults && <DataSetupBanner />}
      <section className="py-12 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col items-start space-y-6 md:space-y-8">
            <p className="text-label-md text-on-secondary-container font-bold uppercase tracking-wider">
              <EditableText
                value={settings.heroSubtitle}
                onSave={(v) => settingsService.update({ heroSubtitle: v })}
                className="text-label-md"
              />
            </p>
            <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary tracking-tight">
              <EditableText
                as="span"
                value={settings.heroTitle}
                onSave={(v) => settingsService.update({ heroTitle: v })}
                className="text-display-lg-mobile md:text-display-lg"
              />
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              <EditableText
                as="p"
                multiline
                value={settings.heroDescription}
                onSave={(v) => settingsService.update({ heroDescription: v })}
                className="text-body-lg"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
          <div className="relative h-[300px] sm:h-[400px] lg:h-[550px] w-full rounded-2xl overflow-hidden shadow-sm bg-academic-navy-deep">
            <OptimizedImage
              className="object-cover w-full h-full absolute inset-0 opacity-90"
              alt="Sala lekcyjna w Centrum Korepetycji Chabówka — korepetycje w Podhalu"
              src={IMAGES.hero}
              priority
              width={800}
              height={550}
            />
          </div>
        </div>
      </section>

      {settings.sectionVisibility.subjects && subjects.length > 0 && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-10 gap-4">
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Przedmioty</h2>
              <Link to="/przedmioty" className="text-primary font-medium text-label-md flex items-center gap-2">
                Zobacz wszystkie <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.slice(0, 6).map((s) => (
                <div key={s.id} className="bg-white border border-outline-variant/30 rounded-xl p-6 card-hover">
                  <h3 className="font-bold text-primary mb-2">{s.name}</h3>
                  <p className="text-body-md text-on-surface-variant text-sm">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings.sectionVisibility.posts && publishedPosts.length > 0 && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-10 gap-4">
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Aktualności</h2>
              <Link to="/aktualnosci" className="text-primary font-medium text-label-md">Wszystkie aktualności</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedPosts.map((post) => (
                <Link key={post.id} to={`/aktualnosci/${post.slug}`} className="bg-surface-bright border rounded-xl p-6 card-hover block">
                  <p className="text-label-sm text-on-surface-variant mb-2">{new Date(post.publishedAt).toLocaleDateString('pl')}</p>
                  <h3 className="font-bold text-primary mb-2">{post.title}</h3>
                  <p className="text-body-md text-on-surface-variant text-sm">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings.aboutVisible && settings.sectionVisibility.about && (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-bright">
          <div className="max-w-container-max mx-auto max-w-3xl">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary mb-6">
              <EditableText value={settings.aboutTitle} onSave={(v) => settingsService.update({ aboutTitle: v })} />
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6">
              <EditableText multiline value={settings.aboutContent} onSave={(v) => settingsService.update({ aboutContent: v })} />
            </p>
            <div className="flex flex-wrap gap-2">
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
