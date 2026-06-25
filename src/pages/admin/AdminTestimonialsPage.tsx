import { useFirestoreCollection } from '../../hooks/useFirestore'
import { testimonialsService } from '../../services/testimonialsService'
import GenericCollectionAdmin, { OrderField, VisibleToggle } from '../../components/admin/GenericCollectionAdmin'
import { Field, inputClass } from '../../components/admin/AdminUi'
import type { Testimonial } from '../../types'

export default function AdminTestimonialsPage() {
  const { allItems } = useFirestoreCollection(testimonialsService.subscribe)

  return (
    <GenericCollectionAdmin<Testimonial>
      title="Opinie"
      items={allItems}
      columns={[
        { key: 'name', label: 'Podpis' },
        { key: 'rating', label: 'Ocena' },
        { key: 'context', label: 'Kontekst' },
      ]}
      defaultItem={{
        name: '',
        content: '',
        rating: 5,
        context: '',
        order: allItems.length,
        visible: true,
        createdAt: new Date().toISOString(),
      }}
      onAdd={testimonialsService.add}
      onUpdate={testimonialsService.update}
      onDelete={testimonialsService.delete}
      formFields={(draft, setDraft) => (
        <>
          <Field label="Imię / podpis">
            <input className={inputClass} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Treść opinii">
            <textarea className={inputClass} rows={4} value={draft.content ?? ''} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          </Field>
          <Field label="Ocena (1-5)">
            <input type="number" min={1} max={5} className={inputClass} value={draft.rating ?? 5} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })} />
          </Field>
          <Field label="Kontekst (np. przedmiot)">
            <input className={inputClass} value={draft.context ?? ''} onChange={(e) => setDraft({ ...draft, context: e.target.value })} />
          </Field>
          <OrderField value={draft.order ?? 0} onChange={(v) => setDraft({ ...draft, order: v })} />
          <VisibleToggle value={draft.visible ?? true} onChange={(v) => setDraft({ ...draft, visible: v })} />
        </>
      )}
    />
  )
}
