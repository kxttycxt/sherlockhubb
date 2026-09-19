'use client'

import Link from 'next/link'
import { History, Search, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'

export default function HistoryPage() {
  const { currentUser, mySearches } = useApp()

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <History className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to view your search history.</p>
          <Button
            nativeButton={false}
            render={<Link href="/login">Sign in</Link>}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </main>
        <Footer />
      </div>
    )
  }

  const searches = mySearches()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
                Search history
              </h1>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {searches.length} {searches.length === 1 ? 'search' : 'searches'}
              </p>
            </div>
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/search">New search</Link>}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>

          <div className="mt-8 space-y-3">
            {searches.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card py-16 text-center">
                <Search className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No searches yet.</p>
              </div>
            )}
            {searches.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{s.query}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {s.database} &middot; {formatDate(s.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="font-technical text-sm text-foreground">
                      {s.resultsFound.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">results</p>
                  </div>
                  <div className="flex items-center gap-1 font-technical text-xs text-primary">
                    <Zap className="h-3 w-3" />-{s.creditsUsed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
