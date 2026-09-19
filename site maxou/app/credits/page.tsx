'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, CreditCard, Loader2, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp, type CreditPackage } from '@/lib/store'
import { cn } from '@/lib/utils'
import { formatEur } from '@/lib/format'
import { toast } from 'sonner'

export default function CreditsPage() {
  const { currentUser, settings, purchaseCredits, buyCustomCredits } = useApp()
  const [selectedPkg, setSelectedPkg] = useState<CreditPackage | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [processing, setProcessing] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutMode, setCheckoutMode] = useState<'package' | 'custom'>('package')

  function openPackageCheckout(pkg: CreditPackage) {
    setSelectedPkg(pkg)
    setCheckoutMode('package')
    setCheckoutOpen(true)
  }

  function openCustomCheckout() {
    const amt = Number(customAmount)
    if (!amt || amt <= 0) return
    setCheckoutMode('custom')
    setCheckoutOpen(true)
  }

  function confirmPurchase() {
    setProcessing(true)
    setTimeout(() => {
      if (checkoutMode === 'package' && selectedPkg) {
        purchaseCredits(selectedPkg)
        toast.success(`${selectedPkg.credits.toLocaleString()} credits added`)
      } else {
        const amt = Number(customAmount)
        buyCustomCredits(amt)
        toast.success('Credits added to your account')
      }
      setProcessing(false)
      setCheckoutOpen(false)
      setSelectedPkg(null)
      setCustomAmount('')
    }, 1200)
  }

  const customCredits =
    customAmount && Number(customAmount) > 0
      ? Math.round(Number(customAmount) / settings.pricePerCreditEur)
      : 0

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <Zap className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to buy credits.</p>
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="text-center">
            <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
              Credit center
            </h1>
            <p className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              Buy credits
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Current balance:{' '}
              <span className="font-medium text-primary">
                {currentUser.creditBalance.toLocaleString()} credits
              </span>{' '}
              &middot; {formatEur(settings.pricePerCreditEur)} per credit
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {settings.packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => openPackageCheckout(pkg)}
                className={cn(
                  'group relative flex flex-col items-center rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10',
                  pkg.highlight ? 'border-primary/50' : 'border-border hover:border-primary/40',
                )}
              >
                {pkg.highlight && (
                  <span className="absolute -top-2.5 rounded-full bg-primary px-2.5 py-0.5 font-technical text-[10px] uppercase tracking-widest text-primary-foreground">
                    Popular
                  </span>
                )}
                <Zap className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-semibold text-foreground">
                  {pkg.credits.toLocaleString()}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">credits</p>
                <p className="mt-4 font-technical text-lg text-foreground">
                  {formatEur(pkg.priceEur)}
                </p>
                <span className="mt-4 w-full rounded-md border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
                  Select
                </span>
              </button>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-md rounded-xl border border-border bg-card p-6">
            <p className="text-sm font-medium text-foreground">Custom amount</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter any amount in EUR to convert to credits.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
                <Input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="25"
                  className="border-border bg-background pl-7"
                />
              </div>
              <Button
                onClick={openCustomCheckout}
                disabled={!customAmount || Number(customAmount) <= 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Buy
              </Button>
            </div>
            {customCredits > 0 && (
              <p className="mt-2 font-technical text-xs text-primary">
                = {customCredits.toLocaleString()} credits
              </p>
            )}
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-sm font-medium text-foreground">1 credit = 1 search</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Credits never expire</p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Instant delivery</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={checkoutOpen} onOpenChange={(o) => !processing && setCheckoutOpen(o)}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Confirm purchase</DialogTitle>
            <DialogDescription>Demo checkout — no real payment is processed.</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits</span>
              <span className="font-technical text-sm text-foreground">
                {(checkoutMode === 'package'
                  ? selectedPkg?.credits ?? 0
                  : customCredits
                ).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-technical text-base font-medium text-foreground">
                {formatEur(
                  checkoutMode === 'package' ? selectedPkg?.priceEur ?? 0 : Number(customAmount),
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            •••• •••• •••• 4242 (demo card)
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              onClick={confirmPurchase}
              disabled={processing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="mr-1.5 h-4 w-4" />
                  Confirm payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
