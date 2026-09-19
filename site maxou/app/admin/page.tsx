'use client'

import Link from 'next/link'
import { Database, FileText, Flag, Search, Users, Zap } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { useApp } from '@/lib/store'

export default function AdminOverviewPage() {
  const { users, documents, reports, searches, transactions, databases } = useApp()

  const pending = documents.filter((d) => d.status === 'pending').length
  const openReports = reports.filter((r) => r.status === 'open').length
  const revenue = transactions
    .filter((t) => t.type === 'purchase')
    .reduce((acc, t) => acc + t.amountEur, 0)

  const stats = [
    { label: 'Total users', value: users.length, icon: Users, href: '/admin/users' },
    { label: 'Pending documents', value: pending, icon: FileText, href: '/admin/moderation' },
    { label: 'Open reports', value: openReports, icon: Flag, href: '/admin/moderation' },
    { label: 'Active databases', value: databases.filter((d) => d.status === 'enabled').length, icon: Database, href: '/admin/databases' },
    { label: 'Total searches', value: searches.length, icon: Search, href: '/admin' },
    { label: 'Revenue', value: `€${revenue.toLocaleString()}`, icon: Zap, href: '/admin' },
  ]

  return (
    <AdminShell>
      <h1 className="font-technical text-xs uppercase tracking-widest text-primary">Overview</h1>
      <p className="mt-2 text-2xl font-semibold text-foreground">Platform metrics</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <s.icon className="h-4 w-4 text-primary" />
            <p className="mt-3 font-technical text-xl font-medium text-foreground">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-medium text-foreground">Recent searches</h2>
        <div className="mt-4 space-y-3">
          {searches.slice(0, 6).map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{s.query}</span>
              <span className="text-xs text-muted-foreground">{s.database}</span>
            </div>
          ))}
          {searches.length === 0 && (
            <p className="text-sm text-muted-foreground">No searches recorded yet.</p>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
