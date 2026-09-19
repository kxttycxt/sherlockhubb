'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Save, Star, Trash2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp, type CreditPackage } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
  const { settings, adminUpdateSettings } = useApp()
  const [pricePerCredit, setPricePerCredit] = useState(String(settings.pricePerCreditEur))
  const [packages, setPackages] = useState<CreditPackage[]>(settings.packages)

  function updatePackage(id: string, patch: Partial<CreditPackage>) {
    setPackages((p) => p.map((pkg) => (pkg.id === id ? { ...pkg, ...patch } : pkg)))
  }

  function removePackage(id: string) {
    setPackages((p) => p.filter((pkg) => pkg.id !== id))
  }

  function addPackage() {
    setPackages((p) => [
      ...p,
      { id: `pkg_${Date.now()}`, priceEur: 10, credits: 50 },
    ])
  }

  function save() {
    const price = Number(pricePerCredit)
    if (!price || price <= 0) {
      toast.error('Enter a valid price per credit')
      return
    }
    adminUpdateSettings({ pricePerCreditEur: price, packages })
    toast.success('Settings saved')
  }

  return (
    <AdminShell>
      <h1 className="font-technical text-xs uppercase tracking-widest text-primary">Settings</h1>
      <p className="mt-2 text-2xl font-semibold text-foreground">Pricing &amp; packages</p>

      <div className="mt-6 max-w-sm rounded-lg border border-border bg-card p-5">
        <label className="font-technical text-xs uppercase tracking-widest text-muted-foreground">
          Custom top-up price (EUR per credit)
        </label>
        <Input
          type="number"
          step="0.01"
          value={pricePerCredit}
          onChange={(e) => setPricePerCredit(e.target.value)}
          className="mt-2 border-border bg-background"
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Credit packages</h2>
        <Button size="sm" variant="outline" onClick={addPackage}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add package
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={cn(
              'flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4',
              pkg.highlight ? 'border-primary/40' : 'border-border',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-technical text-xs text-muted-foreground">Price €</span>
              <Input
                type="number"
                value={pkg.priceEur}
                onChange={(e) => updatePackage(pkg.id, { priceEur: Number(e.target.value) })}
                className="w-24 border-border bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-technical text-xs text-muted-foreground">Credits</span>
              <Input
                type="number"
                value={pkg.credits}
                onChange={(e) => updatePackage(pkg.id, { credits: Number(e.target.value) })}
                className="w-24 border-border bg-background"
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className={pkg.highlight ? 'text-primary' : 'text-muted-foreground'}
              onClick={() => updatePackage(pkg.id, { highlight: !pkg.highlight })}
            >
              <Star className={cn('h-3.5 w-3.5', pkg.highlight && 'fill-primary')} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-destructive hover:bg-destructive/10"
              onClick={() => removePackage(pkg.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={save} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
        <Save className="mr-1.5 h-4 w-4" />
        Save settings
      </Button>
    </AdminShell>
  )
}
