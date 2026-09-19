'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Database,
  Flag,
  LayoutDashboard,
  Settings,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/moderation', label: 'Moderation', icon: Flag },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/databases', label: 'Databases', icon: Database },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { ready, currentUser, isAdmin } = useApp()
  const pathname = usePathname()

  if (!ready) return null

  if (!currentUser || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            {currentUser ? 'You do not have access to the admin panel.' : 'Admin sign-in required.'}
          </p>
          <Button
            nativeButton={false}
            render={
              <Link href={currentUser ? '/' : '/login'}>
                {currentUser ? 'Back home' : 'Sign in'}
              </Link>
            }
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
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row">
          <aside className="lg:w-56 lg:shrink-0">
            <div className="flex items-center gap-2 px-1 pb-4">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-technical text-xs uppercase tracking-widest text-primary">
                Admin
              </span>
            </div>
            <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
              {NAV.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-card hover:text-foreground',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
