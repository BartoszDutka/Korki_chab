import { useEffect, useState } from 'react'
import { useFirestoreCollection, useFirestoreDoc } from '../../hooks/useFirestore'
import { pricingService } from '../../services/pricingService'
import { settingsService } from '../../services/settingsService'
import GenericCollectionAdmin, { OrderField, VisibleToggle } from '../../components/admin/GenericCollectionAdmin'
import { AdminPageHeader, SaveButton, useAdminSave, Field, inputClass } from '../../components/admin/AdminUi'
import type { PricingItem } from '../../types'

export default function AdminPricingPage() {
  const { allItems } = useFirestoreCollection(pricingService.subscribe)
  const { data: settings } = useFirestoreDoc(settingsService.subscribe)
  const [footerText, setFooterText] = useState('')
  const { saving, message, run } = useAdminSave()

  useEffect(() => {
    if (settings) setFooterText(settings.pricingFooterText)
  }, [settings])

  const saveFooter = () =>
    run(async () => {
      await settingsService.update({ pricingFooterText: footerText })
    })

  return (
    <div className="space-y-10">
      <GenericCollectionAdmin<PricingItem>
        title="Cennik"
        items={allItems}
        columns={[
          { key: 'name', label: 'Usługa' },
          { key: 'duration', label: 'Czas' },
          { key: 'price', label: 'Cena' },
        ]}
        defaultItem={{ name: '', duration: '60 min', price: '', description: '', order: allItems.length, visible: true }}
        onAdd={pricingService.add}
        onUpdate={pricingService.update}
        onDelete={pricingService.delete}
        formFields={(draft, setDraft) => (
          <>
            <Field label="Nazwa usługi">
              <input className={inputClass} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Czas trwania">
              <input className={inputClass} value={draft.duration ?? ''} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} />
            </Field>
            <Field label="Cena">
              <input className={inputClass} value={draft.price ?? ''} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
            </Field>
            <Field label="Opis">
              <textarea className={inputClass} rows={2} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <OrderField value={draft.order ?? 0} onChange={(v) => setDraft({ ...draft, order: v })} />
            <VisibleToggle value={draft.visible ?? true} onChange={(v) => setDraft({ ...draft, visible: v })} />
          </>
        )}
      />

      <div>
        <AdminPageHeader title="Tekst pod cennikiem" />
        {message && <p className="mb-4 text-sm text-primary">{message}</p>}
        <textarea className={inputClass} rows={3} value={footerText} onChange={(e) => setFooterText(e.target.value)} />
        <div className="mt-4">
          <SaveButton onClick={saveFooter} saving={saving} />
        </div>
      </div>
    </div>
  )
}
