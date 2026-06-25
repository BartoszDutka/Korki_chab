import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
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
  const [failed, setFailed] = useState(false)
  const resolvedSrc = failed && fallbackSrc ? fallbackSrc : src
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
      if (fallbackSrc && !failed) setFailed(true)
    },
  }

  if (webpSrc && !failed) {
    return (
      <picture>
        <source type="image/webp" srcSet={webpSrc} sizes={sizes} />
        <img {...imgProps} />
      </picture>
    )
  }

  return <img {...imgProps} />
}
