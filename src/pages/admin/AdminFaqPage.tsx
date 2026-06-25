import { useFirestoreCollection } from '../../hooks/useFirestore'
import { faqService } from '../../services/faqService'
import GenericCollectionAdmin, { OrderField, VisibleToggle } from '../../components/admin/GenericCollectionAdmin'
import { Field, inputClass } from '../../components/admin/AdminUi'
import type { FAQItem } from '../../types'

export default function AdminFaqPage() {
  const { allItems } = useFirestoreCollection(faqService.subscribe)

  return (
    <GenericCollectionAdmin<FAQItem>
      title="FAQ"
      items={allItems}
      columns={[
        { key: 'question', label: 'Pytanie' },
        { key: 'category', label: 'Kategoria' },
      ]}
      defaultItem={{ question: '', answer: '', category: 'Ogólne', order: allItems.length, visible: true }}
      onAdd={faqService.add}
      onUpdate={faqService.update}
      onDelete={faqService.delete}
      formFields={(draft, setDraft) => (
        <>
          <Field label="Pytanie">
            <input className={inputClass} value={draft.question ?? ''} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          </Field>
          <Field label="Odpowiedź">
            <textarea className={inputClass} rows={4} value={draft.answer ?? ''} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
          </Field>
          <Field label="Kategoria">
            <input className={inputClass} value={draft.category ?? ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          </Field>
          <OrderField value={draft.order ?? 0} onChange={(v) => setDraft({ ...draft, order: v })} />
          <VisibleToggle value={draft.visible ?? true} onChange={(v) => setDraft({ ...draft, visible: v })} />
        </>
      )}
    />
  )
}
