const STATS = [
  { label: 'DATABASES', value: '128' },
  { label: 'RECORDS INDEXED', value: '842M+' },
  { label: 'SEARCHES PERFORMED', value: '4.2M' },
  { label: 'SYSTEM STATUS', value: 'ONLINE', isStatus: true },
]

export function StatsSection() {
  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-4 sm:px-6 lg:px-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1.5 bg-background px-4 py-8 sm:py-10"
          >
            {stat.isStatus ? (
              <div className="flex items-center gap-2 font-technical text-xl font-semibold text-primary sm:text-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {stat.value}
              </div>
            ) : (
              <div className="font-technical text-2xl font-semibold text-foreground sm:text-3xl">
                {stat.value}
              </div>
            )}
            <div className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
