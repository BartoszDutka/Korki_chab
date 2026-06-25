import Icon, { Button } from './ui'
import { CONTACT } from '../data/content'

export default function CtaBanner() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-academic-navy-deep relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="max-w-container-max mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 bg-surface-container-lowest/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10">
        <div className="text-center md:text-left">
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-surface-container-lowest mb-4">
            Gotowy na pierwsze zajęcia?
          </h2>
          <p className="text-body-lg text-surface-container-high/80 max-w-xl">
            Skontaktuj się z nami telefonicznie, odwiedź nas w placówce lub zostaw wiadomość. Znajdziemy
            idealnego korepetytora dla Ciebie.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row gap-4">
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center justify-center gap-3 bg-secondary-container hover:bg-warm-orange-hover text-on-secondary px-8 md:px-10 py-4 md:py-5 rounded-xl font-medium text-label-md font-bold shadow-lg transition-[transform,opacity,background-color,box-shadow] active:scale-95"
          >
            <Icon name="call" />
            Zadzwoń teraz
          </a>
          <Button variant="ghost" href="/kontakt">Formularz kontaktowy</Button>
        </div>
      </div>
    </section>
  )
}
