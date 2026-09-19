'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Ban, CheckCircle2, Minus, Plus, Search, Shield } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp, type DemoUser } from '@/lib/store'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function AdminUsersPage() {
  const { users, adminAdjustCredits, adminSetUserStatus } = useApp()
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState<DemoUser | null>(null)
  const [amount, setAmount] = useState('50')

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  )

  function adjust(delta: number) {
    if (!target) return
    const n = Number(amount)
    if (!n || n <= 0) return
    adminAdjustCredits(target.id, delta * n, delta > 0 ? 'Admin credit grant' : 'Admin credit deduction')
    toast.success(delta > 0 ? `Granted ${n} credits` : `Deducted ${n} credits`)
    setTarget(null)
  }

  return (
    <AdminShell>
      <h1 className="font-technical text-xs uppercase tracking-widest text-primary">Users</h1>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {users.length} registered accounts
      </p>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="border-border bg-card pl-9"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <div className="divide-y divide-border">
          {filtered.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-4 bg-card p-4">
              <div className="min-w-[180px]">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{u.name}</p>
                  {u.role === 'admin' && <Shield className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Joined {formatDate(u.createdAt)}
              </div>
              <div className="font-technical text-sm text-foreground">
                {u.creditBalance.toLocaleString()} credits
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] uppercase tracking-widest',
                  u.status === 'active'
                    ? 'border-primary/40 text-primary'
                    : 'border-destructive/40 text-destructive',
                )}
              >
                {u.status}
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setTarget(u)}>
                  Adjust credits
                </Button>
                {u.role !== 'admin' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={
                      u.status === 'active'
                        ? 'text-destructive hover:bg-destructive/10'
                        : 'text-primary hover:bg-primary/10'
                    }
                    onClick={() => {
                      adminSetUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')
                      toast.success(
                        u.status === 'active' ? 'Account suspended' : 'Account reactivated',
                      )
                    }}
                  >
                    {u.status === 'active' ? (
                      <Ban className="h-3.5 w-3.5" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Adjust credits</DialogTitle>
            <DialogDescription>{target?.name} — {target?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
              Amount
            </label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-border bg-background"
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => adjust(-1)}
            >
              <Minus className="mr-1 h-3.5 w-3.5" />
              Deduct
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => adjust(1)}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Grant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
