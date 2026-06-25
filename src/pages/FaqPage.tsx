import EditableText from '../components/live-edit/EditableText'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { faqService } from '../services/faqService'

export default function FaqPage() {
  const { items: faqItems, loading } = useFirestoreCollection(faqService.subscribe, true)

  if (loading) return <div className="py-20 text-center">Ładowanie...</div>

  return (
    <div className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
      <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary mb-10 text-center">
        Najczęściej zadawane pytania
      </h1>
      <div className="space-y-4">
        {faqItems.map((item) => (
          <details key={item.id} className="bg-white border border-outline-variant rounded-xl p-6 group">
            <summary className="font-bold text-primary cursor-pointer list-none flex justify-between gap-4">
              <EditableText
                value={item.question}
                onSave={(v) => faqService.update(item.id, { question: v })}
                className="font-bold"
              />
            </summary>
            <p className="text-body-md text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/50">
              <EditableText
                multiline
                value={item.answer}
                onSave={(v) => faqService.update(item.id, { answer: v })}
              />
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
