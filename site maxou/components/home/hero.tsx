import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackgroundFx } from '@/components/background-fx'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <BackgroundFx />
      <div className="relative mx-auto max-w-5xl px-4 py-28 text-center sm:px-6 lg:py-36">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-technical text-xs uppercase tracking-widest text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          PRIVATE DATA SEARCH PLATFORM
        </div>

        <h1 className="text-glow text-balance font-sans text-5xl font-bold uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          SHERLOCKHUB
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance font-sans text-2xl font-semibold uppercase tracking-tight text-foreground sm:text-3xl">
          Search the data. <span className="text-primary">Find what matters.</span>
        </p>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
          One powerful interface for searching structured data and discovering information.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={
              <Link href="/search">
                START SEARCHING
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
            className="border-glow group h-12 bg-primary px-7 text-primary-foreground hover:bg-primary/90"
          />
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/credits">
                <Zap className="mr-1 h-4 w-4" />
                BUY CREDITS
              </Link>
            }
            className="h-12 border-border px-7 hover:border-primary/50 hover:text-primary"
          />
        </div>
      </div>
    </section>
  )
}
