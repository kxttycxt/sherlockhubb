import { ArrowDown, CreditCard, FileSearch, ShieldCheck, UserPlus } from 'lucide-react'

const STEPS = [
  {
    icon: UserPlus,
    title: 'CREATE ACCOUNT',
    description: 'Register with email and password to access the platform.',
  },
  {
    icon: CreditCard,
    title: 'BUY CREDITS',
    description: '1 credit = €0.20. Purchase from as little as €5.',
  },
  {
    icon: FileSearch,
    title: 'SEARCH',
    description: 'Query structured databases through the search terminal.',
  },
  {
    icon: ShieldCheck,
    title: 'GET RESULTS',
    description: 'Spend 1 credit per search and view authorized results instantly.',
  },
]

export function JourneySection() {
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-technical text-xs uppercase tracking-widest text-primary">
            How it works
          </h2>
          <p className="mt-3 text-balance text-3xl font-semibold text-foreground sm:text-4xl">
            From account to answer in four steps
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="group relative flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="font-technical text-xs text-muted-foreground">
                  STEP 0{i + 1}
                </div>
                <h3 className="font-technical text-sm font-semibold uppercase tracking-widest text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowDown className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 rotate-[-90deg] text-border sm:right-auto sm:left-1/2 sm:top-auto sm:-bottom-3 sm:block lg:right-[-14px] lg:top-1/2 lg:left-auto lg:-bottom-auto lg:rotate-0 lg:translate-y-[-50%]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
