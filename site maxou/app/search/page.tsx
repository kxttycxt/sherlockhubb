'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Database,
  Loader2,
  Search as SearchIcon,
  SearchX,
  Zap,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp, type SearchResultItem } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const { currentUser, databases, performSearch } = useApp()
  const enabledDatabases = useMemo(() => databases.filter((d) => d.status === 'enabled'), [databases])

  const [query, setQuery] = useState('')
  const [databaseId, setDatabaseId] = useState(enabledDatabases[0]?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResultItem[] | null>(null)
  const [resultCount, setResultCount] = useState(0)
  const [lastQuery, setLastQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!currentUser) {
      setError('SIGN_IN_REQUIRED')
      return
    }
    if (!query.trim()) return

    setLoading(true)
    setResults(null)
    setTimeout(() => {
      const outcome = performSearch(query.trim(), databaseId || enabledDatabases[0]?.id)
      setLoading(false)
      if (!outcome.ok) {
        setError(outcome.error ?? 'Something went wrong.')
        return
      }
      setResults(outcome.results ?? [])
      setResultCount(outcome.resultCount ?? 0)
      setLastQuery(query.trim())
    }, 900)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex-1 border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
              Search terminal
            </h1>
            <p className="mt-3 text-balance text-3xl font-semibold text-foreground sm:text-4xl">
              Query the index
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Every search costs <span className="font-medium text-foreground">1 credit</span>.
              {currentUser && (
                <>
                  {' '}
                  You have{' '}
                  <span className="font-medium text-primary">
                    {currentUser.creditBalance.toLocaleString()}
                  </span>{' '}
                  remaining.
                </>
              )}
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-10 rounded-xl border border-border bg-card/80 p-4 shadow-xl shadow-black/30 backdrop-blur sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a name, company, domain, or keyword..."
                  className="h-11 border-border bg-background pl-10 font-technical text-sm"
                />
              </div>
              <Select value={databaseId} onValueChange={(v) => setDatabaseId(v ?? '')}>
                <SelectTrigger className="h-11 w-full border-border bg-background sm:w-56">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  {enabledDatabases.map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      {db.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                disabled={loading || !query.trim()}
                className="h-11 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="mr-1.5 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {enabledDatabases.map((db) => (
                <button
                  key={db.id}
                  type="button"
                  onClick={() => setDatabaseId(db.id)}
                  className={cn(
                    'rounded-full border px-3 py-1 font-technical text-[10px] uppercase tracking-widest transition-colors',
                    databaseId === db.id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                  )}
                >
                  {db.name}
                </button>
              ))}
            </div>
          </form>

          {error === 'SIGN_IN_REQUIRED' && (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center">
              <AlertCircle className="h-6 w-6 text-primary" />
              <p className="text-sm text-foreground">Sign in to run a search</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/login">Sign in</Link>}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                />
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/register">Create account</Link>}
                />
              </div>
            </div>
          )}

          {error === 'INSUFFICIENT_CREDITS' && (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
              <Zap className="h-6 w-6 text-destructive" />
              <p className="text-sm text-foreground">You&apos;re out of credits</p>
              <p className="text-xs text-muted-foreground">
                Buy more credits to continue searching the index.
              </p>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/credits">Buy credits</Link>}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              />
            </div>
          )}

          {error && error !== 'SIGN_IN_REQUIRED' && error !== 'INSUFFICIENT_CREDITS' && (
            <p className="mt-4 text-center text-sm text-destructive">{error}</p>
          )}

          {loading && (
            <div className="mt-10 flex flex-col items-center gap-3 py-10">
              <div className="flex items-center gap-2 font-technical text-xs uppercase tracking-widest text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                Querying index...
              </div>
              <p className="text-xs text-muted-foreground">
                Connecting → Indexing → Searching → Analyzing
              </p>
            </div>
          )}

          {!loading && results && (
            <div className="mt-10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-technical font-medium text-foreground">
                    {resultCount.toLocaleString()}
                  </span>{' '}
                  matches for &quot;{lastQuery}&quot;
                </p>
                <span className="font-technical text-xs text-muted-foreground">
                  1 CREDIT USED
                </span>
              </div>

              {results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card py-12 text-center">
                  <SearchX className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No matches found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-foreground">{r.match}</h3>
                        </div>
                        <span className="font-technical text-xs text-primary">
                          {r.relevance}% MATCH
                        </span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                        {r.database}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3">
                        {r.info.map((line, i) => (
                          <span key={i} className="text-xs text-muted-foreground">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
