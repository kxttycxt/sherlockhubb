'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Eye, Flag, Trash2, X } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function ModerationPage() {
  const {
    documents,
    reports,
    adminApproveDocument,
    adminRejectDocument,
    adminRemoveDocument,
    adminResolveReport,
  } = useApp()

  const [tab, setTab] = useState<'pending' | 'reports' | 'all'>('pending')

  const pending = documents.filter((d) => d.status === 'pending')
  const openReports = reports.filter((r) => r.status === 'open')

  function docFor(id: string) {
    return documents.find((d) => d.id === id)
  }

  return (
    <AdminShell>
      <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
        Moderation
      </h1>
      <p className="mt-2 text-2xl font-semibold text-foreground">Review queue</p>

      <div className="mt-6 flex gap-1.5 border-b border-border">
        {(
          [
            { id: 'pending', label: `Pending (${pending.length})` },
            { id: 'reports', label: `Reports (${openReports.length})` },
            { id: 'all', label: 'All documents' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 py-2 text-sm transition-colors',
              tab === t.id
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="mt-6 space-y-3">
          {pending.length === 0 && (
            <p className="text-sm text-muted-foreground">No documents awaiting review.</p>
          )}
          {pending.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{doc.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {doc.authorName} &middot; {formatDate(doc.date)} &middot; {doc.category}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      adminApproveDocument(doc.id)
                      toast.success('Document approved')
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      adminRejectDocument(doc.id)
                      toast.success('Document rejected')
                    }}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div className="mt-6 space-y-3">
          {openReports.length === 0 && (
            <p className="text-sm text-muted-foreground">No open reports.</p>
          )}
          {openReports.map((r) => {
            const doc = docFor(r.documentId)
            return (
              <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-3.5 w-3.5 text-destructive" />
                      <p className="font-medium text-foreground">{doc?.title ?? 'Deleted document'}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Reason: {r.reason}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.date)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {doc && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/40 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          adminRemoveDocument(doc.id)
                          adminResolveReport(r.id)
                          toast.success('Document removed')
                        }}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Remove doc
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => {
                        adminResolveReport(r.id)
                        toast.success('Report resolved')
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'all' && (
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 bg-card p-4">
                <div>
                  <p className="font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.authorName} &middot; {formatDate(doc.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] uppercase tracking-widest',
                      doc.status === 'approved' && 'border-primary/40 text-primary',
                      doc.status === 'pending' && 'border-amber-500/40 text-amber-400',
                      (doc.status === 'rejected' || doc.status === 'removed') &&
                        'border-destructive/40 text-destructive',
                    )}
                  >
                    {doc.status}
                  </Badge>
                  {doc.status !== 'removed' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        adminRemoveDocument(doc.id)
                        toast.success('Document removed')
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  )
}
