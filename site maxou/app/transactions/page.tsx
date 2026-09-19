'use client'

import Link from 'next/link'
import { Receipt, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'
import { formatDateTime, formatEur } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function TransactionsPage() {
  const { currentUser, myTransactions } = useApp()

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to view your transactions.</p>
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

  const transactions = myTransactions()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
                Transaction history
              </h1>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/credits">Buy credits</Link>}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-border">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 bg-card py-16 text-center">
                <Receipt className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No transactions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-wrap items-center justify-between gap-3 bg-card p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{t.description}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] uppercase tracking-widest',
                            t.status === 'completed' &&
                              'border-primary/40 text-primary',
                            t.status === 'pending' && 'border-amber-500/40 text-amber-400',
                            t.status === 'failed' && 'border-destructive/40 text-destructive',
                          )}
                        >
                          {t.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(t.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      {t.amountEur > 0 && (
                        <span className="font-technical text-sm text-foreground">
                          {formatEur(t.amountEur)}
                        </span>
                      )}
                      <span
                        className={cn(
                          'flex items-center gap-1 font-technical text-sm',
                          t.credits >= 0 ? 'text-primary' : 'text-muted-foreground',
                        )}
                      >
                        <Zap className="h-3 w-3" />
                        {t.credits >= 0 ? '+' : ''}
                        {t.credits}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
