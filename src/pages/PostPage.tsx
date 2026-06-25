import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { postsService } from '../services/postsService'
import { useSeo } from '../hooks/useSeo'
import PageLoader from '../components/PageLoader'
import OptimizedImage from '../components/OptimizedImage'

export default function PostPage() {
  const { slug } = useParams()
  const { allItems: posts, loading } = useFirestoreCollection(postsService.subscribe)

  const post = posts.find((p) => p.slug === slug && p.status === 'published')

  useSeo({
    title: post?.metaTitle || post?.title,
    description: post?.metaDescription || post?.excerpt,
    path: post ? `/aktualnosci/${post.slug}` : '/aktualnosci',
    type: 'article',
    image: post?.imageUrl || undefined,
  })

  if (loading) return <PageLoader label="Ładowanie aktualności…" />
  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-headline-lg font-bold text-primary mb-4">Nie znaleziono aktualności</h1>
        <Link to="/aktualnosci" className="text-primary font-bold">Wróć do listy</Link>
      </div>
    )
  }

  return (
    <article className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
      <Link to="/aktualnosci" className="text-primary text-sm font-medium mb-6 inline-block">← Aktualności</Link>
      <p className="text-label-sm text-on-surface-variant mb-4">
        {new Date(post.publishedAt).toLocaleDateString('pl')} · {post.author}
      </p>
      <h1 className="text-display-lg-mobile md:text-headline-lg font-extrabold text-primary mb-6">{post.title}</h1>
      {post.imageUrl && (
        <OptimizedImage
          src={post.imageUrl}
          alt={post.title}
          className="w-full rounded-xl mb-8 object-cover max-h-96 aspect-video"
          width={800}
          height={450}
        />
      )}
      <div className="prose text-body-lg text-on-surface-variant space-y-4">
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  )
}
