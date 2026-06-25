import { useFirestoreCollection } from '../../hooks/useFirestore'
import { menuService } from '../../services/menuService'
import GenericCollectionAdmin, { OrderField, VisibleToggle } from '../../components/admin/GenericCollectionAdmin'
import { Field, inputClass } from '../../components/admin/AdminUi'
import type { MenuItem } from '../../types'

export default function AdminMenuPage() {
  const { allItems } = useFirestoreCollection(menuService.subscribe)

  return (
    <GenericCollectionAdmin<MenuItem>
      title="Menu"
      description="Pozycje nawigacji strony publicznej"
      items={allItems}
      columns={[
        { key: 'label', label: 'Nazwa' },
        { key: 'href', label: 'Link' },
        { key: 'order', label: 'Kolejność' },
        { key: 'visible', label: 'Widoczny' },
      ]}
      defaultItem={{ label: '', href: '/', order: allItems.length, visible: true }}
      onAdd={menuService.add}
      onUpdate={menuService.update}
      onDelete={menuService.delete}
      formFields={(draft, setDraft) => (
        <>
          <Field label="Nazwa">
            <input className={inputClass} value={draft.label ?? ''} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </Field>
          <Field label="Link (ścieżka)">
            <input className={inputClass} value={draft.href ?? ''} onChange={(e) => setDraft({ ...draft, href: e.target.value })} />
          </Field>
          <OrderField value={draft.order ?? 0} onChange={(v) => setDraft({ ...draft, order: v })} />
          <VisibleToggle value={draft.visible ?? true} onChange={(v) => setDraft({ ...draft, visible: v })} />
        </>
      )}
    />
  )
}
