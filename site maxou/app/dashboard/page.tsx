'use client'

import Link from 'next/link'
import {
  FileText,
  History,
  LayoutDashboard,
  Search,
  Upload,
  Zap,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'

export default function DashboardPage() {
  const { currentUser, mySearches, myDocuments, myTransactions } = useApp()

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to view your dashboard.</p>
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
  const documents = myDocuments()
  const transactions = myTransactions()
  const totalSpentEur = transactions
    .filter((t) => t.type === 'purchase')
    .reduce((acc, t) => acc + t.amountEur, 0)

  const stats = [
    { label: 'Credit balance', value: currentUser.creditBalance.toLocaleString(), icon: Zap },
    { label: 'Searches run', value: searches.length.toLocaleString(), icon: Search },
    { label: 'Documents published', value: documents.length.toLocaleString(), icon: FileText },
    { label: 'Total spent', value: `€${totalSpentEur.toLocaleString()}`, icon: Upload },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
                Dashboard
              </h1>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                Welcome back, {currentUser.name.split(' ')[0]}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href="/community/publish">Publish</Link>}
              />
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/search">New search</Link>}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-4 sm:p-5">
                <s.icon className="h-4 w-4 text-primary" />
                <p className="mt-3 font-technical text-xl font-medium text-foreground sm:text-2xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <History className="h-4 w-4 text-primary" />
                  Recent searches
                </h2>
                <Link href="/history" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {searches.length === 0 && (
                  <p className="text-sm text-muted-foreground">No searches yet.</p>
                )}
                {searches.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="text-foreground">{s.query}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(s.date)}</p>
                    </div>
                    <span className="shrink-0 font-technical text-xs text-muted-foreground">
                      {s.resultsFound.toLocaleString()} results
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Your documents
                </h2>
                <Link href="/community" className="text-xs text-primary hover:underline">
                  Browse community
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {documents.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t published anything yet.
                  </p>
                )}
                {documents.slice(0, 5).map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="text-foreground">{d.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">{d.status}</p>
                    </div>
                    <span className="shrink-0 font-technical text-xs text-muted-foreground">
                      {d.views.toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
