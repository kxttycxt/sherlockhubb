import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="font-technical text-xs uppercase tracking-widest text-primary">
          Ready when you are
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold text-foreground sm:text-4xl">
          Every search costs exactly 1 credit
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          €5 unlocks 25 searches. No subscriptions, no hidden fees — just credits and clear
          answers.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={
              <Link href="/register">
                CREATE ACCOUNT
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            }
            className="border-glow h-12 bg-primary px-7 text-primary-foreground hover:bg-primary/90"
          />
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/credits">View credit packages</Link>}
            className="h-12 border-border px-7"
          />
        </div>
      </div>
    </section>
  )
}
