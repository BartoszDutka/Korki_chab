import { useState, type FormEvent } from 'react'
import EditableText from '../components/live-edit/EditableText'
import Icon from '../components/ui'
import { useFirestoreDoc } from '../hooks/useFirestore'
import { contactService } from '../services/contactService'
import { formSettingsService } from '../services/formSettingsService'
import { subjectsService } from '../services/subjectsService'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { DEFAULT_CONTACT } from '../data/defaults'
import { IMAGES } from '../data/content'
import { useSeo } from '../hooks/useSeo'
import OptimizedImage from '../components/OptimizedImage'
import { inputClass } from '../components/admin/AdminUi'
import type { FormFieldConfig } from '../types'

const FULL_WIDTH_FIELDS = new Set(['message', 'schedule'])

function isFullWidthField(field: FormFieldConfig): boolean {
  return field.type === 'textarea' || FULL_WIDTH_FIELDS.has(field.name)
}

export default function KontaktPage() {
  const { data: contactRaw, loading } = useFirestoreDoc(contactService.subscribe)
  const contact = contactRaw ?? DEFAULT_CONTACT
  const { data: formSettings } = useFirestoreDoc(formSettingsService.subscribe)
  const { items: subjects } = useFirestoreCollection(subjectsService.subscribe, true)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')

  useSeo({
    title: 'Kontakt',
    description: 'Skontaktuj się z Centrum Korepetycji Chabówka — adres, telefon, e-mail i formularz kontaktowy.',
    path: '/kontakt',
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setTimeout(() => {
      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 4000)
    }, 1200)
  }

  if (loading && !contactRaw) {
    return (
      <div className="min-h-[70vh] py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="h-10 w-64 mx-auto bg-surface-container-low rounded-lg animate-pulse" />
            <div className="h-6 w-full max-w-2xl mx-auto bg-surface-container-low rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const visibleFields = formSettings?.fields.filter((f) => f.visible) ?? []

  return (
    <>
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low text-center">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary mb-4">
            Skontaktuj się z nami
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            <EditableText
              multiline
              value={contact.contactText}
              onSave={(v) => contactService.update({ contactText: v })}
            />
          </p>
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <ContactCard icon="location_on" label="Adres" value={contact.address} field="address" />
            <ContactCard
              icon="call"
              label="Telefon"
              value={contact.phone}
              field="phone"
              subtext={contact.contactHours}
            />
            <ContactCard icon="mail" label="E-mail" value={contact.email} field="email" />

            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 md:p-6 space-y-3">
              <p className="text-body-md text-on-surface-variant leading-relaxed">{contact.onlineInfo}</p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{contact.stationaryInfo}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm">
              <h2 className="text-headline-md font-bold text-primary mb-2">Napisz wiadomość</h2>
              <p className="text-body-md text-on-surface-variant mb-6 md:mb-8">
                Wypełnij formularz — odezwiemy się w ciągu 24 godzin.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {visibleFields.map((field) => (
                    <div
                      key={field.id}
                      className={`space-y-1.5 ${isFullWidthField(field) ? 'sm:col-span-2' : ''}`}
                    >
                      <label className="block font-medium text-label-md text-primary" htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-secondary-container"> *</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          placeholder={field.placeholder}
                          rows={5}
                          className={`${inputClass} min-h-[120px] resize-y`}
                        />
                      ) : field.type === 'select' ? (
                        <select id={field.name} name={field.name} required={field.required} className={inputClass}>
                          <option value="">Wybierz…</option>
                          {(field.options ?? subjects.map((s) => s.name)).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          className={inputClass}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 md:mt-8 pt-6 border-t border-outline-variant space-y-4">
                  {formSettings && (
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">{formSettings.rodoText}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-warm-orange-hover text-on-secondary font-bold px-8 py-3.5 rounded-lg min-h-[48px] transition-colors disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Wysyłanie…' : status === 'success' ? 'Wysłano!' : 'Wyślij wiadomość'}
                    <Icon name="send" />
                  </button>
                  {status === 'success' && formSettings && (
                    <p className="text-green-700 text-body-sm font-medium" role="status">
                      {formSettings.successMessage}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h2 className="text-headline-md font-bold text-primary mb-4 md:mb-6">Nasza lokalizacja</h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-outline-variant shadow-sm bg-surface-container-low">
            <OptimizedImage
              src={IMAGES.mapLocal}
              alt="Mapa dojazdu do Centrum Korepetycji Chabówka"
              className="w-full h-full object-cover"
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 1200px"
              aspectRatio="16/9"
              fallbackSrc={IMAGES.mapDesktop}
            />
          </div>
          {contact.googleMapsUrl && (
            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-secondary-container font-bold text-sm mt-4 inline-flex items-center gap-1 min-h-[44px] hover:underline"
            >
              Otwórz w Mapach
              <Icon name="arrow_forward" className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>
    </>
  )
}

function ContactCard({
  icon,
  label,
  value,
  field,
  subtext,
}: {
  icon: string
  label: string
  value: string
  field: 'phone' | 'email' | 'address' | 'location'
  subtext?: string
}) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 md:p-6 flex gap-4 items-start shadow-sm">
      <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full text-primary">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{label}</h3>
        <p className="text-body-md text-primary font-medium break-words">
          <EditableText value={value} onSave={(v) => contactService.update({ [field]: v })} />
        </p>
        {subtext && <p className="text-body-sm text-on-surface-variant mt-1">{subtext}</p>}
        {field === 'phone' && (
          <a
            href={`tel:${value.replace(/\s/g, '')}`}
            className="text-secondary-container text-body-sm font-bold mt-2 inline-flex items-center min-h-[44px] hover:underline"
          >
            Zadzwoń
          </a>
        )}
        {field === 'email' && (
          <a
            href={`mailto:${value}`}
            className="text-secondary-container text-body-sm font-bold mt-2 inline-flex items-center min-h-[44px] hover:underline"
          >
            Wyślij e-mail
          </a>
        )}
      </div>
    </div>
  )
}
