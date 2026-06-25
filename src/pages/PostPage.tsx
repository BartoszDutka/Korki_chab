import { Link, useParams } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { postsService } from '../services/postsService'
import { useSeo } from '../hooks/useSeo'
import OptimizedImage from '../components/OptimizedImage'
import { SkeletonBlock } from '../components/skeletons'

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

  if (loading) {
    return (
      <article className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto min-h-[60vh]">
        <SkeletonBlock className="h-4 w-32 mb-6" />
        <SkeletonBlock className="h-4 w-40 mb-4" />
        <SkeletonBlock className="h-10 w-full mb-6" />
        <SkeletonBlock className="w-full aspect-video rounded-xl mb-8" />
        <SkeletonBlock className="h-4 w-full mb-3" />
        <SkeletonBlock className="h-4 w-full mb-3" />
        <SkeletonBlock className="h-4 w-5/6" />
      </article>
    )
  }

  if (!post) {
    return (
      <div className="py-20 text-center min-h-[40vh]">
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
        <div className="w-full aspect-video rounded-xl mb-8 overflow-hidden max-h-96">
          <OptimizedImage
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            width={800}
            height={450}
            aspectRatio="16/9"
          />
        </div>
      )}
      <div className="prose text-body-lg text-on-surface-variant space-y-4">
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  )
}
