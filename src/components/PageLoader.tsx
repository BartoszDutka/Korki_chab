export default function PageLoader({
  label = 'Ładowanie treści…',
  minHeight = 'min-h-[50vh]',
}: {
  label?: string
  minHeight?: string
}) {
  return (
    <div
      className={`py-20 ${minHeight} flex flex-col items-center justify-center gap-4`}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-10 h-10 border-4 border-outline-variant border-t-secondary-container rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-body-md text-on-surface-variant">{label}</p>
    </div>
  )
}
