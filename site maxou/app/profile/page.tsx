'use client'

import Link from 'next/link'
import { LogOut, Shield, User, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'

export default function ProfilePage() {
  const { currentUser, signOut } = useApp()
  const router = useRouter()

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <User className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to view your profile.</p>
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

  const initials = currentUser.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleSignOut() {
    signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <h1 className="font-technical text-xs uppercase tracking-widest text-primary">
            Account
          </h1>

          <div className="mt-6 flex items-center gap-4 rounded-lg border border-border bg-card p-6">
            <Avatar className="h-14 w-14 border border-border">
              <AvatarFallback className="bg-primary/10 font-technical text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-foreground">{currentUser.name}</p>
                {currentUser.role === 'admin' && (
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Member since {formatDate(currentUser.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 font-technical text-lg text-primary">
                <Zap className="h-4 w-4" />
                {currentUser.creditBalance.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">credits</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-foreground">Account details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={currentUser.name} disabled className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={currentUser.email} disabled className="bg-background" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              This is a demo account — profile editing is not enabled in this preview.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/transactions">View transactions</Link>}
            />
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/history">View search history</Link>}
            />
            {currentUser.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/admin">Admin panel</Link>}
              />
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
