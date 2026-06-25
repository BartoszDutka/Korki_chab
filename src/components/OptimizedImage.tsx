import { useState, useMemo } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  /** Lokalny srcSet WebP — używaj tylko gdy pliki istnieją w public/ */
  webpSrc?: string
  fallbackSrc?: string
  aspectRatio?: string
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  webpSrc,
  fallbackSrc,
  aspectRatio,
}: OptimizedImageProps) {
  const sources = useMemo(() => {
    const list = [src]
    if (fallbackSrc && fallbackSrc !== src) list.push(fallbackSrc)
    return list
  }, [src, fallbackSrc])

  const [sourceIndex, setSourceIndex] = useState(0)
  const resolvedSrc = sources[sourceIndex] ?? src
  const useLocalWebp = Boolean(webpSrc) && sourceIndex === 0 && resolvedSrc.startsWith('/')
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority: 'high' | 'low' = priority ? 'high' : 'low'
  const isExternal = resolvedSrc.startsWith('http')
  const imgStyle = aspectRatio ? { aspectRatio } : undefined

  const imgProps = {
    src: resolvedSrc,
    alt,
    width,
    height,
    loading: loading as 'eager' | 'lazy',
    decoding: 'async' as const,
    fetchPriority,
    sizes,
    className,
    style: imgStyle,
    referrerPolicy: isExternal ? ('no-referrer' as const) : undefined,
    onError: () => {
      setSourceIndex((i) => (i < sources.length - 1 ? i + 1 : i))
    },
  }

  if (useLocalWebp && webpSrc) {
    return (
      <picture>
        <source type="image/webp" srcSet={webpSrc} sizes={sizes} />
        <img {...imgProps} />
      </picture>
    )
  }

  return <img {...imgProps} />
}
