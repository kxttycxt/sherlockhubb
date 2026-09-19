import Link from 'next/link'
import type { ReactNode } from 'react'
import { SherlockLogo } from '@/components/sherlock-logo'
import { BackgroundFx } from '@/components/background-fx'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <BackgroundFx />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <SherlockLogo />
        </Link>
        <div className="rounded-xl border border-border bg-card/90 p-7 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  )
}
