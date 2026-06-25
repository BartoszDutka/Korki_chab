import { useFirestoreCollection } from '../../hooks/useFirestore'
import { educationLevelsService } from '../../services/educationLevelsService'
import GenericCollectionAdmin, { OrderField, VisibleToggle } from '../../components/admin/GenericCollectionAdmin'
import { Field, inputClass } from '../../components/admin/AdminUi'
import type { EducationLevel } from '../../types'

export default function AdminEducationPage() {
  const { allItems } = useFirestoreCollection(educationLevelsService.subscribe)

  return (
    <GenericCollectionAdmin<EducationLevel>
      title="Poziomy nauczania"
      items={allItems}
      columns={[
        { key: 'name', label: 'Nazwa' },
        { key: 'order', label: 'Kolejność' },
      ]}
      defaultItem={{ name: '', description: '', order: allItems.length, visible: true }}
      onAdd={educationLevelsService.add}
      onUpdate={educationLevelsService.update}
      onDelete={educationLevelsService.delete}
      formFields={(draft, setDraft) => (
        <>
          <Field label="Nazwa">
            <input className={inputClass} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Opis">
            <textarea className={inputClass} rows={3} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <OrderField value={draft.order ?? 0} onChange={(v) => setDraft({ ...draft, order: v })} />
          <VisibleToggle value={draft.visible ?? true} onChange={(v) => setDraft({ ...draft, visible: v })} />
        </>
      )}
    />
  )
}
