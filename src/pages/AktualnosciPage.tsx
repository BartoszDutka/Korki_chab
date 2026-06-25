import { Link } from 'react-router-dom'
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore'
import { postsService } from '../services/postsService'
import { useSeo } from '../hooks/useSeo'
import { seoService } from '../services/seoService'
import PageLoader from '../components/PageLoader'

export default function AktualnosciPage() {
  const { allItems: posts, loading } = useFirestoreCollection(postsService.subscribe)
  const { data: seo } = useFirestoreDoc(seoService.subscribe)

  const published = posts.filter((p) => p.status === 'published')

  useSeo({
    title: seo?.postsMetaTitle ?? 'Aktualności',
    description:
      seo?.postsMetaDescription ??
      'Aktualności Centrum Korepetycji Chabówka — informacje o zajęciach, egzaminach i wydarzeniach w Chabówce.',
    path: '/aktualnosci',
  })

  if (loading) return <PageLoader label="Ładowanie aktualności…" />

  return (
    <div className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary mb-10">Aktualności</h1>
      <div className="space-y-6">
        {published.map((post) => (
          <article key={post.id} className="bg-white border border-outline-variant rounded-xl p-6 md:p-8 card-hover">
            <p className="text-label-sm text-on-surface-variant mb-2">
              {new Date(post.publishedAt).toLocaleDateString('pl')} · {post.author}
            </p>
            <h2 className="text-headline-md font-bold text-primary mb-3">
              <Link to={`/aktualnosci/${post.slug}`} className="hover:text-secondary-container">
                {post.title}
              </Link>
            </h2>
            <p className="text-body-md text-on-surface-variant">{post.excerpt}</p>
            <Link to={`/aktualnosci/${post.slug}`} className="text-primary font-bold text-sm mt-4 inline-block min-h-[44px] inline-flex items-center">
              Czytaj więcej →
            </Link>
          </article>
        ))}
        {published.length === 0 && (
          <p className="text-on-surface-variant">Brak opublikowanych aktualności.</p>
        )}
      </div>
    </div>
  )
}
