'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Eye, FileText, Flag, Search, Upload } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function CommunityPage() {
  const { documents } = useApp()
  const approved = useMemo(() => documents.filter((d) => d.status === 'approved'), [documents])
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(approved.map((d) => d.category)))],
    [approved],
  )

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = approved.filter((d) => {
    const matchesQuery =
      !query.trim() ||
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    const matchesCategory = category === 'All' || d.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
                Community
              </h1>
              <p className="mt-2 text-3xl font-semibold text-foreground">Shared research</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {approved.length.toLocaleString()} published documents
              </p>
            </div>
            <Button
              nativeButton={false}
              render={
                <Link href="/community/publish">
                  <Upload className="mr-1.5 h-4 w-4" />
                  Publish document
                </Link>
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents and tags..."
                className="border-border bg-card pl-10"
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v ?? categories[0])}>
              <SelectTrigger className="w-full border-border bg-card sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc) => (
              <Link
                key={doc.id}
                href={`/community/${doc.id}`}
                className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-border text-xs text-muted-foreground">
                    {doc.fileType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{doc.fileSize}</span>
                </div>
                <h3 className="mt-3 font-medium text-foreground transition-colors group-hover:text-primary">
                  {doc.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {doc.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doc.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{doc.authorName}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {doc.views.toLocaleString()}
                    </span>
                    <span>{formatDate(doc.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-2 text-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No documents match your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
