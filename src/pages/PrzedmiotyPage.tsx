import { Button } from '../components/ui'
import { useSeo } from '../hooks/useSeo'
import { useFirestoreCollection } from '../hooks/useFirestore'
import { subjectsService } from '../services/subjectsService'
import { educationLevelsService } from '../services/educationLevelsService'
import { CardSkeleton, GridSkeleton } from '../components/skeletons'

export default function PrzedmiotyPage() {
  const { items: subjects, loading: subjectsLoading } = useFirestoreCollection(subjectsService.subscribe, true)
  const { items: levels, loading: levelsLoading } = useFirestoreCollection(educationLevelsService.subscribe, true)

  useSeo({
    title: 'Przedmioty',
    description:
      'Korepetycje w Chabówce — matematyka, polski, angielski, chemia, fizyka, biologia. Szkoła podstawowa, liceum i matura.',
    path: '/przedmioty',
  })

  return (
    <>
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low text-center">
        <h1 className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary">Nasza Oferta</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4">
          Profesjonalne wsparcie edukacyjne w Chabówce i okolicach.
        </p>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop min-h-[480px]">
        <div className="max-w-container-max mx-auto">
          {subjectsLoading ? (
            <GridSkeleton count={6}>
              <CardSkeleton className="min-h-[180px] p-8 text-center" />
            </GridSkeleton>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((s) => (
                <div key={s.id} className="bg-surface-bright border rounded-2xl p-8 card-hover text-center min-h-[180px]">
                  <h2 className="text-headline-md font-semibold text-primary mb-2">{s.name}</h2>
                  <p className="text-body-md text-on-surface-variant mb-2">{s.description}</p>
                  <p className="text-label-sm text-secondary-container">{s.level}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low min-h-[280px]">
        <div className="max-w-container-max mx-auto">
          <h2 className="text-headline-lg font-bold text-primary mb-8 text-center">Poziomy nauczania</h2>
          {levelsLoading ? (
            <GridSkeleton count={3}>
              <CardSkeleton />
            </GridSkeleton>
          ) : levels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map((l) => (
                <div key={l.id} className="bg-white border rounded-xl p-6 min-h-[120px]">
                  <h3 className="font-bold text-primary mb-2">{l.name}</h3>
                  <p className="text-body-md text-on-surface-variant">{l.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-academic-navy-deep">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 min-h-[120px]">
          <div>
            <h2 className="text-headline-lg font-bold text-white mb-2">Zacznij naukę już dziś</h2>
            <p className="text-body-md text-white/80">Umów bezpłatną konsultację.</p>
          </div>
          <Button href="/kontakt">Zapisz się na zajęcia</Button>
        </div>
      </section>
    </>
  )
}
