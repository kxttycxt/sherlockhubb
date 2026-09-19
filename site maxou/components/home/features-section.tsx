import { Database, Lock, Radar, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Database,
    title: 'STRUCTURED DATABASES',
    description:
      'Search across corporate registries, domain intelligence, public records, and academic indexes.',
  },
  {
    icon: Lock,
    title: 'AUTHORIZED ACCESS ONLY',
    description:
      'Only legally obtained, compliance-reviewed data is indexed. Nothing leaked, nothing stolen.',
  },
  {
    icon: Radar,
    title: 'REAL-TIME PROCESSING',
    description: 'A live connect → index → search → analyze pipeline for every query you run.',
  },
  {
    icon: Sparkles,
    title: 'COMMUNITY RESEARCH',
    description: 'Discover documents and datasets published by the community, reviewed before going live.',
  },
]

export function FeaturesSection() {
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-technical text-xs uppercase tracking-widest text-primary">
              Platform capabilities
            </h2>
            <p className="mt-3 text-balance text-3xl font-semibold text-foreground sm:text-4xl">
              Built for precision, not noise
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              SHERLOCKHUB is not a dataset marketplace. You never buy a database — you buy
              credits, and every credit unlocks one authorized search across our indexed
              infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-technical text-xs font-semibold uppercase tracking-widest text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
