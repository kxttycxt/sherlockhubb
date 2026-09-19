'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Database, Plus, Power, Trash2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AdminDatabasesPage() {
  const { databases, adminAddDatabase, adminRemoveDatabase, adminToggleDatabase } = useApp()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [recordCount, setRecordCount] = useState('1000000')
  const [fields, setFields] = useState('')

  function handleCreate() {
    if (!name.trim() || !description.trim()) {
      toast.error('Name and description are required')
      return
    }
    adminAddDatabase({
      name: name.toUpperCase(),
      description,
      recordCount: Number(recordCount) || 0,
      status: 'enabled',
      fields: fields.split(',').map((f) => f.trim()).filter(Boolean),
    })
    toast.success('Database added')
    setOpen(false)
    setName('')
    setDescription('')
    setRecordCount('1000000')
    setFields('')
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
            Databases
          </h1>
          <p className="mt-2 text-2xl font-semibold text-foreground">Search indexes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-1.5 h-4 w-4" />
                Add database
              </Button>
            }
          />
          <DialogContent className="border-border bg-card">
            <DialogHeader>
              <DialogTitle>Add search database</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
                  Name
                </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="border-border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-border bg-background"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
                    Record count
                  </label>
                  <Input
                    type="number"
                    value={recordCount}
                    onChange={(e) => setRecordCount(e.target.value)}
                    className="border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
                    Fields (comma separated)
                  </label>
                  <Input
                    value={fields}
                    onChange={(e) => setFields(e.target.value)}
                    placeholder="Name, Date, Status"
                    className="border-border bg-background"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {databases.map((db) => (
          <div key={db.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <p className="font-technical text-sm font-medium text-foreground">{db.name}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] uppercase tracking-widest',
                  db.status === 'enabled'
                    ? 'border-primary/40 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground',
                )}
              >
                {db.status}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{db.description}</p>
            <p className="mt-3 font-technical text-xs text-muted-foreground">
              {db.recordCount.toLocaleString()} records
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  adminToggleDatabase(db.id)
                  toast.success(db.status === 'enabled' ? 'Database disabled' : 'Database enabled')
                }}
              >
                <Power className="mr-1.5 h-3.5 w-3.5" />
                {db.status === 'enabled' ? 'Disable' : 'Enable'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => {
                  adminRemoveDatabase(db.id)
                  toast.success('Database removed')
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}
