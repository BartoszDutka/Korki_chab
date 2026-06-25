import OptimizedImage from './OptimizedImage'

type ImageWithAspectRatioProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  webpSrc?: string
  fallbackSrc?: string
}

export default function ImageWithAspectRatio({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  webpSrc,
  fallbackSrc,
}: ImageWithAspectRatioProps) {
  const ratio = `${width}/${height}`

  return (
    <div className="relative overflow-hidden w-full" style={{ aspectRatio: ratio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        priority={priority}
        sizes={sizes}
        webpSrc={webpSrc}
        fallbackSrc={fallbackSrc}
        aspectRatio={ratio}
      />
    </div>
  )
}
