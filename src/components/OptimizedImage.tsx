import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  /** Lokalna ścieżka WebP (np. /hero.webp) */
  webpSrc?: string
  fallbackSrc?: string
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
}: OptimizedImageProps) {
  const [failed, setFailed] = useState(false)
  const resolvedSrc = failed && fallbackSrc ? fallbackSrc : src
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : 'low'

  if (webpSrc && !failed) {
    return (
      <picture>
        <source type="image/webp" srcSet={webpSrc} sizes={sizes} />
        <img
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          sizes={sizes}
          className={className}
          onError={() => {
            if (fallbackSrc) setFailed(true)
          }}
        />
      </picture>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (fallbackSrc && !failed) setFailed(true)
      }}
    />
  )
}
