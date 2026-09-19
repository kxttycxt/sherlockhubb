'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Download, Eye, FileText, Flag, User } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { currentUser, documents, incrementViews, reportDocument } = useApp()

  const doc = documents.find((d) => d.id === params.id)
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState('')
  const viewedRef = useRef(false)

  useEffect(() => {
    if (doc && !viewedRef.current) {
      viewedRef.current = true
      incrementViews(doc.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id])

  if (!doc || doc.status === 'removed') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Document not found.</p>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/community">Back to community</Link>}
          />
        </main>
        <Footer />
      </div>
    )
  }

  function submitReport() {
    if (!currentUser) {
      router.push('/login')
      return
    }
    reportDocument(doc!.id, reason.trim() || 'No reason provided')
    setReportOpen(false)
    setReason('')
    toast.success('Report submitted to moderators')
  }

  function handleDownload() {
    toast.success('Download started (demo)')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to community
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {doc.fileType}
                </Badge>
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {doc.category}
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
                {doc.title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {doc.authorName}
                </span>
                <span>{formatDate(doc.date)}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {doc.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-foreground/90">{doc.description}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {doc.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-2.5 py-1 text-xs uppercase tracking-widest text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{doc.title}</p>
              <p className="text-xs text-muted-foreground">
                {doc.fileType} &middot; {doc.fileSize}
              </p>
            </div>
            <Button onClick={handleDownload} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => setReportOpen(true)}>
              <Flag className="mr-1.5 h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Report document</DialogTitle>
            <DialogDescription>
              Let moderators know why this document should be reviewed.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue..."
            rows={4}
            className="bg-background"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReport} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function useEffective(id: string | undefined) {
  const [ref] = useState<{ current: boolean }>({ current: false })
  return ref
}
