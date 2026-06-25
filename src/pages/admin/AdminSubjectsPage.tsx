import { useFirestoreCollection } from '../../hooks/useFirestore'
import { subjectsService } from '../../services/subjectsService'
import GenericCollectionAdmin, { OrderField, VisibleToggle } from '../../components/admin/GenericCollectionAdmin'
import { Field, inputClass } from '../../components/admin/AdminUi'
import type { Subject } from '../../types'

export default function AdminSubjectsPage() {
  const { allItems } = useFirestoreCollection(subjectsService.subscribe)

  return (
    <GenericCollectionAdmin<Subject>
      title="Przedmioty"
      items={allItems}
      columns={[
        { key: 'name', label: 'Nazwa' },
        { key: 'level', label: 'Poziom' },
        { key: 'order', label: 'Kolejność' },
      ]}
      defaultItem={{ name: '', description: '', level: '', order: allItems.length, visible: true }}
      onAdd={subjectsService.add}
      onUpdate={subjectsService.update}
      onDelete={subjectsService.delete}
      formFields={(draft, setDraft) => (
        <>
          <Field label="Nazwa">
            <input className={inputClass} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Opis">
            <textarea className={inputClass} rows={3} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Poziom">
            <input className={inputClass} value={draft.level ?? ''} onChange={(e) => setDraft({ ...draft, level: e.target.value })} />
          </Field>
          <OrderField value={draft.order ?? 0} onChange={(v) => setDraft({ ...draft, order: v })} />
          <VisibleToggle value={draft.visible ?? true} onChange={(v) => setDraft({ ...draft, visible: v })} />
        </>
      )}
    />
  )
}
