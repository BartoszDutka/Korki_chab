import ConditionalEditable from '../components/ConditionalEditable'
import Icon from '../components/ui'
import { useFirestoreCollectionOnce } from '../hooks/useFirestore'
import { testimonialsService } from '../services/testimonialsService'
import { GridSkeleton, TestimonialCardSkeleton } from '../components/skeletons'

export default function OpiniePage() {
  const { items: testimonials, loading } = useFirestoreCollectionOnce(testimonialsService.getAll, true)

  return (
    <div className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[60vh]">
      <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary mb-10 text-center">
        Opinie uczniów i rodziców
      </h1>
      {loading ? (
        <GridSkeleton count={6} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <TestimonialCardSkeleton />
        </GridSkeleton>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-outline-variant rounded-xl p-6 card-hover min-h-[180px]">
              <div className="flex gap-1 mb-3 min-h-[20px]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Icon key={i} name="star" className="text-secondary-container text-sm" />
                ))}
              </div>
              <p className="text-body-md text-on-surface-variant mb-4">
                <ConditionalEditable
                  multiline
                  value={t.content}
                  onSave={(v) => testimonialsService.update(t.id, { content: v })}
                />
              </p>
              <p className="font-bold text-primary">{t.name}</p>
              <p className="text-sm text-on-surface-variant">{t.context}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
