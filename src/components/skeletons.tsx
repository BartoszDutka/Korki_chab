import type { ReactNode } from 'react'

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-container-low ${className}`} aria-hidden="true" />
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white border border-outline-variant/30 rounded-xl p-6 min-h-[140px] ${className}`}>
      <SkeletonBlock className="h-5 w-2/3 mb-3" />
      <SkeletonBlock className="h-4 w-full mb-2" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  )
}

export function PricingCardSkeleton() {
  return (
    <div className="bg-surface-bright border rounded-xl p-8 min-h-[320px]">
      <SkeletonBlock className="h-6 w-1/2 mb-2" />
      <SkeletonBlock className="h-4 w-1/3 mb-6" />
      <SkeletonBlock className="h-10 w-2/3 mb-6" />
      <SkeletonBlock className="h-4 w-full mb-2" />
      <SkeletonBlock className="h-4 w-4/5 mb-8" />
      <SkeletonBlock className="h-5 w-28" />
    </div>
  )
}

export function PostCardSkeleton() {
  return (
    <div className="bg-surface-bright border rounded-xl p-6 min-h-[180px]">
      <SkeletonBlock className="h-3 w-24 mb-3" />
      <SkeletonBlock className="h-5 w-3/4 mb-3" />
      <SkeletonBlock className="h-4 w-full mb-2" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  )
}

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 min-h-[180px]">
      <SkeletonBlock className="h-4 w-24 mb-3" />
      <SkeletonBlock className="h-4 w-full mb-2" />
      <SkeletonBlock className="h-4 w-full mb-2" />
      <SkeletonBlock className="h-4 w-5/6 mb-6" />
      <SkeletonBlock className="h-5 w-32" />
    </div>
  )
}

export function FaqItemSkeleton() {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 min-h-[72px]">
      <SkeletonBlock className="h-5 w-4/5" />
    </div>
  )
}

export function ArticleRowSkeleton() {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 md:p-8 min-h-[160px]">
      <SkeletonBlock className="h-3 w-32 mb-3" />
      <SkeletonBlock className="h-6 w-2/3 mb-4" />
      <SkeletonBlock className="h-4 w-full mb-2" />
      <SkeletonBlock className="h-4 w-4/5" />
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-surface-bright border border-outline-variant rounded-2xl p-6 min-h-[420px] flex flex-col gap-4">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-7 w-full" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <div className="space-y-2 mt-auto">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
        <SkeletonBlock className="h-4 w-3/5" />
      </div>
      <SkeletonBlock className="h-12 w-full rounded-lg mt-2" />
      <SkeletonBlock className="h-10 w-full rounded-lg" />
    </div>
  )
}

export function GridSkeleton({
  count = 3,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  children,
}: {
  count?: number
  columns?: string
  children: ReactNode
}) {
  return (
    <div className={`grid ${columns} gap-4 md:gap-6`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  )
}
