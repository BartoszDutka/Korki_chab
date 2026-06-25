import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore'
import { pricingService } from '../services/pricingService'
import { settingsService } from '../services/settingsService'
import Icon from '../components/ui'
import { Button } from '../components/ui'
import EditableText from '../components/live-edit/EditableText'
import { GridSkeleton, PricingCardSkeleton } from '../components/skeletons'
import { Link } from 'react-router-dom'

export default function CennikPage() {
  const { items: pricing, loading } = useFirestoreCollection(pricingService.subscribe, true)
  const { data: settings } = useFirestoreDoc(settingsService.subscribe)

  return (
    <>
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low text-center">
        <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary">Cennik</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4">
          Przejrzyste ceny. Pierwsza konsultacja bezpłatna.
        </p>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop min-h-[480px]">
        <div className="max-w-container-max mx-auto">
          {loading ? (
            <GridSkeleton count={3} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <PricingCardSkeleton />
            </GridSkeleton>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricing.map((plan) => (
              <div key={plan.id} className="bg-surface-bright border rounded-xl p-8 card-hover min-h-[320px]">
                <h2 className="text-headline-md font-semibold text-primary mb-1">{plan.name}</h2>
                <p className="text-label-sm text-on-surface-variant mb-4">{plan.duration}</p>
                <p className="text-display-lg-mobile font-extrabold text-primary mb-4">
                  <EditableText
                    value={plan.price}
                    onSave={(v) => pricingService.update(plan.id, { price: v })}
                    label="Cena"
                  />
                </p>
                <p className="text-body-md text-on-surface-variant mb-6">{plan.description}</p>
                <Link to="/kontakt" className="text-primary font-bold text-label-md flex items-center gap-1">
                  Zapisz się <Icon name="arrow_forward" className="text-sm" />
                </Link>
              </div>
              ))}
            </div>
          )}
        </div>
        {settings?.pricingFooterText && (
          <p className="text-center text-body-md text-on-surface-variant mt-10 max-w-2xl mx-auto min-h-[3rem]">
            <EditableText
              multiline
              value={settings.pricingFooterText}
              onSave={(v) => settingsService.update({ pricingFooterText: v })}
            />
          </p>
        )}
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-academic-navy-deep">
        <div className="max-w-container-max mx-auto text-center">
          <Button href="/kontakt">Umów konsultację</Button>
        </div>
      </section>
    </>
  )
}
