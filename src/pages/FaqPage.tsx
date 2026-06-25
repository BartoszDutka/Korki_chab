import ConditionalEditable from '../components/ConditionalEditable'
import { useFirestoreCollectionOnce } from '../hooks/useFirestore'
import { faqService } from '../services/faqService'
import { FaqItemSkeleton, GridSkeleton } from '../components/skeletons'

export default function FaqPage() {
  const { items: faqItems, loading } = useFirestoreCollectionOnce(faqService.getAll, true)

  return (
    <div className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto min-h-[60vh]">
      <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary mb-10 text-center">
        Najczęściej zadawane pytania
      </h1>
      {loading ? (
        <div className="space-y-4">
          <GridSkeleton count={5} columns="grid-cols-1">
            <FaqItemSkeleton />
          </GridSkeleton>
        </div>
      ) : (
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.id} className="bg-white border border-outline-variant rounded-xl p-6 group min-h-[72px]">
              <summary className="font-bold text-primary cursor-pointer list-none flex justify-between gap-4">
                <ConditionalEditable
                  value={item.question}
                  onSave={(v) => faqService.update(item.id, { question: v })}
                  className="font-bold"
                />
              </summary>
              <p className="text-body-md text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/50">
                <ConditionalEditable
                  multiline
                  value={item.answer}
                  onSave={(v) => faqService.update(item.id, { answer: v })}
                />
              </p>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
