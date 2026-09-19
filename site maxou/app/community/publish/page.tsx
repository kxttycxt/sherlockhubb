'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/lib/store'

const CATEGORIES = [
  'Business',
  'Finance',
  'Science',
  'Technology',
  'Artificial Intelligence',
  'Government',
  'Health',
  'Other',
]

const FILE_TYPES = ['CSV', 'XLSX', 'JSON', 'PDF', 'TXT']

export default function PublishPage() {
  const { currentUser, publishDocument } = useApp()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [fileType, setFileType] = useState(FILE_TYPES[0])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to publish a document.</p>
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

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      publishDocument({
        title: title.trim(),
        description: description.trim(),
        category,
        tags,
        fileType,
        fileSize: `${(Math.random() * 8 + 0.5).toFixed(1)} MB`,
      })
      setSubmitting(false)
      toast.success('Document submitted for review')
      router.push('/dashboard')
    }, 700)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
            Publish
          </h1>
          <p className="mt-2 text-2xl font-semibold text-foreground">Share a document</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Submissions are reviewed by moderators before appearing in the community.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-lg border border-border bg-card p-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Global Shipping Delay Dataset 2024"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this document contains and where the data came from..."
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v ?? CATEGORIES[0])}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>File type</Label>
                <Select value={fileType} onValueChange={(v) => setFileType(v ?? FILE_TYPES[0])}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_TYPES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (up to 6)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Press Enter to add"
                  className="bg-background"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {t}
                      <button type="button" onClick={() => removeTag(t)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-background py-8 text-center">
              <div>
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-xs text-muted-foreground">
                  File upload is simulated in this demo
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit for review'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
